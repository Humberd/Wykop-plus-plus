FROM node:10.15.0-slim as builder

RUN apt-get update && apt-get install zip -y

WORKDIR /app
COPY . .
RUN npm ci && npm run build-prod && cd build; zip -r ../build.zip *


FROM cibuilds/chrome-extension

WORKDIR /app

COPY --from=builder /app/build.zip .

# https://circleci.com/blog/continuously-deploy-a-chrome-extension/

ARG APP_ID
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG AUTH_CODE

RUN ACCESS_TOKEN=$(curl "https://accounts.google.com/o/oauth2/token" -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${AUTH_CODE}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r .access_token) \
    && curl -H "Authorization: Bearer $ACCESS_TOKEN" -H "x-goog-api-version: 2" -X PUT -T build.zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${APP_ID}" \
    && curl -H "Authorization: Bearer $ACCESS_TOKEN" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${APP_ID}/publish"
