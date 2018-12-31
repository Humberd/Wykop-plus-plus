#!/usr/bin/env bash

response=$(curl "https://accounts.google.com/o/oauth2/token" -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${AUTH_CODE}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob")
ACCESS_TOKEN=$(echo "$response" | jq -r .access_token)
if [ "$ACCESS_TOKEN" == "null" ]; then
    echo "$response"
    echo "ACCESS_TOKEN is null" >> /dev/stderr
    exit 1
fi

curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -X PUT -T ${BUILD_BUILDID}.zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${APP_ID}" \
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${APP_ID}/publish"
