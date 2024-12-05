import {encryptAndEncode, decodeAndDecrypt} from './encrypt';

const Router = require('./router')
const YNAB = {
  oauthUrl: 'https://app.youneedabudget.com/oauth/token'
}
const CLIENT_SECRET = "[CLIENT_SECRET]";

addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/oauth') || url.pathname.startsWith('/privacy')) {
    if (request.method === 'OPTIONS') {
      event.respondWith(handleOptions(request));
    } else if (request.method === 'POST' || request.method === 'GET') {
      event.respondWith(handleRequest(request))
    } else {
      event.respondWith(
        new Response(null, {
          status: 405,
          statusText: 'Method not allowed'
        })
      )
    }
  } else {
    event.respondWith(
      new Response(null, {
        status: 404,
        statusText: 'Endpoint not found'
      })
    )
  }
});

function handleOptions(request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, POST, OPTIONS'
      },
    })
  }
}

async function oauth(request) {
  const { headers } = request;
  const contentType = headers.get('Content-Type') || '';
  const init = {
    headers: {
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      'Content-Type': 'application/json'
    },
  };
  let response = new Response(null, init);

  if (contentType.includes('form')) {
    try {
      const reqBody = await request.text();
      const reqFormData = new URLSearchParams(reqBody);
      // client_id and redirect_uri are taken from request from extension
      reqFormData.append('client_secret', CLIENT_SECRET);
      if (reqFormData.get('grant_type') === 'refresh_token') {
        const refreshToken = reqFormData.get('refresh_token');
        reqFormData.set('refresh_token', decodeAndDecrypt(refreshToken));
      }
      const url = new URL(YNAB.oauthUrl);
  
      await fetch(url, {
        method: 'POST',
        body: reqFormData
      })
      .then(res => res.json())
      .then(data => {
        const resBody = {
          expiresAt: Date.now() + (data.expires_in * 1000),
          accessToken: data.access_token,
          refreshToken: encryptAndEncode(data.refresh_token)
        }
        response = new Response(JSON.stringify(resBody), init);
      })
      .catch(error => console.error('error ', error))
      return response;
    } catch (error) {
      console.error(error);
      return new Response(null, {
        headers: {
          status: 400,
          statusText: 'Invalid Request'
        }
      });
    }
  } else {
    return new Response(null, {
      headers: {
        status: 400,
        statusText: 'Invalid Request'
      }
    });
  }
}

async function privacy() {
  const init = {
    headers: {
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      'Content-Type': 'application/json'
    },
  };
  const body = {
    url: 'https://sproutforynab.com/privacy',
    lastUpdated: PRIVACY_DATE
  }
  return new Response(JSON.stringify(body), init);
}

async function handleRequest(request) {
  const r = new Router();
  r.post('.*/oauth', request => oauth(request));
  r.get('.*/privacy', () => privacy());
  const res = await r.route(request);
  return res;
}
