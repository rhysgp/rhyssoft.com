# Authenticating with Mastodon and oauth
2024-08-09

The Mastodon documentation for authentication and authorization was confusing,
so here is how I got it to work.

I've started working on a new home project relating to Mastodon. The very first
thing (unsurprisingly!) that I needed to work out was, how do I authorize
my app against Mastodon. Specifically, I will want a Mastodon user to be able to 
use their account with my app, so that the app can read messages in their 
stream and write messages to it too. But initially, I just want to get the flow 
to work.

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

I added the `error` flag to the result returned by Mastodon. This just makes it 
easy to check whether there was an error or not from the calling code.

The `client_id` and `client_secret` properties are what we need for future calls.


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

This sets the authorization code, received from Mastodon via the redirect URI, 
on an auth store, which is a [Pinia store](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://pinia.vuejs.org/&ved=2ahUKEwiwx6HE2eyHAxX8YEEAHbEcD3IQFnoECBkQAQ&usg=AOvVaw1_N-_OqYaVXtPOkjAJI049).


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

The request pulls in several pieces of information we've gathered along the way:
`client_id` and `client_secret` from registering the app; and `code` from 
authorizing the user.

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

You can see progress of this project on github - 
[ActivityGo](https://github.com/rhysgp/ActivityGO)