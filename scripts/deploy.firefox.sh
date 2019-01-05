#!/usr/bin/env bash

# https://github.com/erikdesjardins/firefox-extension-deploy
# https://addons-server.readthedocs.io/en/latest/topics/api/v3_legacy/addons.html

JWT_ISSUER="${JWT_ISSUER}"
JWT_SECRET="${JWT_SECRET}"
BUILD_BUILDID="${BUILD_BUILDID}"

function generateJWT() {
    jwtIssuer=$1;
    jwtSecret=$2;

    header='{
        "typ": "JWT",
        "alg": "HS256"
    }'


    NEW_UUID=$(openssl rand -base64 20)

    payload='{
        "iss": "'"${jwtIssuer}"'",
        "jti": "'"${NEW_UUID}"'"
    }'

    # Use jq to set the dynamic `iat` and `exp`
    # fields on the header using the current time.
    # `iat` is set to now, and `exp` is now + 1 second.
    payload=$(
        echo "${payload}" | jq --arg time_str "$(date +%s)" \
        '
        ($time_str | tonumber) as $time_num
        | .iat=$time_num
        | .exp=($time_num + 60 * 5)
        '
    )



    base64_encode()
    {
        declare input=${1:-$(</dev/stdin)}
        # Use `tr` to URL encode the output from base64.
        printf '%s' "${input}" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n'
    }

    json() {
        declare input=${1:-$(</dev/stdin)}
        printf '%s' "${input}" | jq -c .
    }

    hmacsha256_sign()
    {
        declare input=${1:-$(</dev/stdin)}
        printf '%s' "${input}" | openssl dgst -binary -sha256 -hmac "${jwtSecret}"
    }

    header_base64=$(echo "${header}" | json | base64_encode)
    payload_base64=$(echo "${payload}" | json | base64_encode)

    header_payload=$(echo "${header_base64}.${payload_base64}")
    signature=$(echo "${header_payload}" | hmacsha256_sign | base64_encode)

    echo "${header_payload}.${signature}"
}

jwt=$(generateJWT "$JWT_ISSUER" "$JWT_SECRET")
authorizationHeader="Authorization: JWT $jwt"

# Upload app
response=$(curl "https://addons.mozilla.org/api/v3/addons/" \
    -g -X POST -F "upload=@${BUILD_BUILDID}.zip" \
    -H "$authorizationHeader")


version=$(echo "$response" | jq -r .version)
guid=$(echo "$response" | jq -r .guid)
uploadId=$(echo "$response" | jq -r .pk)

if [ "$uploadId" == "null" ]; then
    echo "Uploading failed!"
    echo "$response"
    exit 1
fi
