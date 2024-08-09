# Authenticating with Mastodon
2024-08-09

I've started working on a new home project relating to Mastodon. I had a look
at the documentation for authenticating and authorizing, but it took some
trial and error to get something working.

This is a VueJS project. It will be an unusual Mastodon client (I'll blog
about that later); but, for now, here's how I got the auth stuff working.


## Registering the app

Firstly, I registered the app with Mastodon. Here's how that looks for me using
the fetch API:

```ts
export const registerApp = async (): Promise<ClientApplication | ApiError> => {
  const response = await fetch(
    'https://mastodonapp.uk/api/v1/apps', {
      method: 'POST',
      body: new URLSearchParams({
        'client_name': 'ActivityGo_0_0_1',
        'redirect_uris': redirectTo,
      }),
    }
  );

  if (response.ok) {
    const result = await response.json();
    return { error: false, ...result } as ClientApplication;
  } else {
    return await buildError(response);
  }
};
```

When successful, this returns a `ClientApplication`:
```ts
export interface ClientApplication {
  error: boolean;
  id: string;
  name: string;
  website: string | null;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
  vapid_key: string;
}
```

I'm using the `mastodonapp.uk` instance, because that's where I have my
mastodon account. In the real world, the user will need to be able to
specify their server.

You can see that I added the `error` flag to the result returned by Mastodon.
This just makes it easy to check whether there was an error or not.

The `client_id` and `client_secret` are what we need for future calls.


## Authorizing the user

Next, the user needs to authorize the app for their account using the Mastodon
auth:

```ts
export const authorise = (clientId: string) => {
  window.location.href = `https://mastodonapp.uk/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectTo}&response_type=code`;
};

```

You can see that the URL includes the redirect URI. Mastodon will redirect here
if all is OK, back into my app. During development, I've added an entry to my
`hosts` file so that `rhyssoft.com` resolves to `localhost`. It's HTTPS, too,
so the certificate doesn't match, and I have to go through the routine of allowing
access anyway.


## Handling the redirect URI

Once we have control back, we can pick up the parameters we need that were
added by Mastodon to the return URI. I created a simple view that handles that,
mapped to the redirect URI in the router:

```html
<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuth } from '@/stores/auth'

  const route = useRoute();

  onMounted(() => {
    const code = route.query.code as string;
    useAuth().setAuthorizationCode(code);
  });
</script>
<template>
  <div>
    URI callback...
  </div>
</template>
<style scoped>
</style>
```

You can see that I'm setting the authorization code on an auth store (which
is a Pinia store).


## Fetching a token

Finally, we need to fetch an auth token to use in requests to the Mastodon
server so that they are authenticated as the user:

```ts
export const fetchToken = async (clientId: string, clientSecret: string, authCode: string): Promise<Token | ApiError> => {
  const url = new URL('https://mastodonapp.uk/oauth/token');
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: redirectTo,
      scope: "read",
    }),
  });

  if (response.ok) {
    const result = await response.json();
    return { error: false, ...result } as Token;
  } else {
    return buildError(response);
  }
}
```

As you can see, the request pulls in several pieces of information we've gathered
along the way:
 - `client_id` and `client_secret` from registering the app; and
 - `code` from authorizing the user.

The result of the token fetch looks like this:
```ts
export interface Token {
  error: false;
  access_token: string;
  token_type: string;
  scope: string;
  created_at: number;
}
```
The auth store is updated with this information.


## Using the token

Now we have a token, we can fetch the user's conversations from their Mastodon
account:

```ts
import { useAuth } from '@/stores/auth'

export const listConversations = async () => {
  const authStore = useAuth();

  const url = new URL('https://mastodonapp.uk/api/v1/conversations');
  url.searchParams.append('limit', '40');
  const result = await fetch(
    url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authStore.authorizationCode}` },
    }
  );

  if (result.ok) {
    console.log('OK');
    console.log(await result.text());
  } else {
    console.log('NOT OK');
  }

  const response = await result.text();
  console.log(response);
};
```
This results in a listing of the last 40 conversations in the user's Mastodon
account.
