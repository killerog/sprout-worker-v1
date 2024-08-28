# Sprout for YNAB Worker V1

This Cloudflare worker communicates between the Sprout for YNAB extension and YNAB's OAuth server to authenticate a user's access token to be stored on the user's extension storage for reauthentication. This worker was built off a Cloudflare Worker Router template.

## Warning
There hasn't been any maintenance or releases for the back-end for a long time during the extension's lifetime and was written with an older version of Wrangler. I cannot guarantee the worker will work as is. It is recommend to port the code to a new Wrangler version.

## Install
```
npm run install
```

## Setup
### Environment Variables
#### `PRIVACY_DATE`
This is the Unix timestamp for the date when the privacy policy was last updated. The extension will check this timestamp on open. If a new date is found, a modal will appear informing users of the privacy policy update.

### Secrets
The following secrets were saved as Secrets in the Cloudflare Workers Environment Variables rather than in the code itself.

#### Client Secret
- On https://app.ynab.com, go to Settings -> Developer Settings and create a new OAuth application. 
  - Do not enable default budget selection
  - Don't worry about adding redirect URI(s) at this point
- Save the app and copy the client secret and replace `[CLIENT_SECRET]` in index.js (`CLIENT_SECRET`) with the client secret

#### Encryption Password
The worker uses sjcl to encrypt and decrypt the refresh token before sending it back to the extension to be saved. A password can be supplied to `ENCRYPTION_PASS` in encrypt.js in order to use the encryption as is

## Running Locally
```
npm run serve
```

## Deploy
```
npm run deploy
```

## License
MIT