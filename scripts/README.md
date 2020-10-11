# Chrome

1. Access in the browser the link below

```
https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=${CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

2.The displayed code is `AUTHORIZATION_CODE`, which you need to sent in the following request:

```
curl "https://accounts.google.com/o/oauth2/token" -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${AUTHORIZATION_CODE}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

3. From the received json field `refresh_token` is `REFRESH_TOKEN` from Azure Pipelines library variable.


# Firefox

Url for keys:

```
https://addons.mozilla.org/en-US/developers/addon/api/key/
```
