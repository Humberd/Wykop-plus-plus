#!/usr/bin/env bash

echo "${CLIENT_ID}"
echo "${CLIENT_SECRET}"
echo "${AUTH_CODE}"
echo "${ACCESS_TOKEN}"

ACCESS_TOKEN=$(curl "https://accounts.google.com/o/oauth2/token" -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${AUTH_CODE}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r .access_token)
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -X PUT -T ${BUILD_BUILDID}.zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${APP_ID}" \
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${APP_ID}/publish"
