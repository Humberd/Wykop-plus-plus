#!/usr/bin/env bash

CLIENT_ID="${CLIENT_ID}"
CLIENT_SECRET="${CLIENT_SECRET}"
REFRESH_TOKEN="${REFRESH_TOKEN}"
BUILD_BUILDID="${BUILD_BUILDID}"
APP_ID="${APP_ID}"

response=$(curl "https://accounts.google.com/o/oauth2/token" -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${REFRESH_TOKEN}&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob")
ACCESS_TOKEN=$(echo "$response" | jq -r .access_token)
if [ "$ACCESS_TOKEN" == "null" ]; then
    echo "$response"
    echo "ACCESS_TOKEN is null"
    exit 1
fi

STATUSCODE=$(curl --silent --output /dev/stderr --write-out "%{http_code}" -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -X PUT -T ${BUILD_BUILDID}.zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${APP_ID}")

if test $STATUSCODE -ne 200; then
    echo "UPLOAD FAILED WITH STATUS CODE $STATUSCODE"
    exit 1
fi

STATUSCODE=$(curl --silent --output /dev/stderr --write-out "%{http_code}" -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${APP_ID}/publish")

if test $STATUSCODE -ne 200; then
    echo "PUBLISH FAILED WITH STATUS CODE $STATUSCODE"
    exit 1
fi
