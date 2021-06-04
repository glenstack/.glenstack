import { ClientError, External, ExternalError } from ".";

class Twitter extends External {
  constructor() {
    super({ id: "5007af97-d0a7-4d9a-a0c5-6ea8c280ae5d", name: "Twitter" });
  }

  async redirect() {
    const response = await fetch(
      "https://api.twitter.com/oauth/request_token",
      {
        method: "POST",
        body: JSON.stringify({
          oauth_callback: "https://auth.glenstack.com/login/twitter/callback",
        }),
      }
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://twitter.com`,
      },
    });
  }
}

export const twitter = new Twitter();
