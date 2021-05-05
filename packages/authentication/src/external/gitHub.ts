import type Toucan from "toucan-js";
import { ClientError, External, ExternalError } from ".";
import { User } from "../user";

class GitHub extends External {
  constructor() {
    super({ id: "0c02a840-37f0-4b07-a846-482a0ab619a7", name: "GitHub" });
  }

  redirect() {
    // TODO: Should provide and validate with a `state` parameter to prevent CSRF
    return new Response(null, {
      status: 301,
      headers: {
        Location: `https://github.com/login/oauth/authorize?scope=user:email&client_id=${GITHUB_CLIENT_ID}`,
      },
    });
  }

  async _callback(request: Request, sentry: Toucan) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    if (code === null) {
      // User has manually navigated to the callback URL without adding an authorization code
      throw new ClientError(this);
    }

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": `Glenstack/${VERSION}`,
        },
        body: JSON.stringify({
          code,
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
        }),
      }
    );

    const { access_token: accessToken, scope } = await response.json();
    if (scope !== "user:email" || accessToken === undefined) {
      // User has messed with the granted scopes that we requested from GitHub by manipulating the URL
      throw new ClientError(this);
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": `Glenstack/${VERSION}`,
      },
    });

    const { id: externalID, name, email } = await userResponse.json();
    if (externalID === undefined) {
      throw new ExternalError(this);
    }

    let user = await this.findUser({ externalID: externalID.toString() });
    if (user) return { externalID, user };

    return { externalID, userHints: { name, email } };
  }
}

export const gitHub = new GitHub();
