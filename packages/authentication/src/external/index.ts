import { serialize as cookieSerialize } from "cookie";
import type Toucan from "toucan-js";
import { createSignUpJWT } from "../jwt";
import { signIn } from "../signIn";
import { User } from "../user";
import {
  redirectWithFlash,
  uuidStringToBuffer,
  uuidBufferToString,
} from "../utils";
import { gitHub } from "./gitHub";

export class ClientError extends Error {
  constructor(external: External) {
    super(
      `Could not complete the authentication flow with ${external.name}. Please try again.`
    );
    this.name = "ClientError";
  }
}

export class ExternalError extends Error {
  constructor(external: External) {
    super(
      `Could not connect to ${external.name}. The Glenstack team has been alerted.`
    );
    this.name = "ExternalError";
  }
}

export abstract class External {
  id: string;
  name: string;

  constructor({ id, name }: { id: string; name: string }) {
    this.id = id;
    this.name = name;
  }

  abstract redirect(): Response;
  protected abstract _callback(
    request: Request,
    sentry: Toucan
  ): Promise<{
    externalID: string;
    user?: User;
    userHints?: Partial<Omit<User, "id">>;
  }>;

  async callback(request: Request, sentry: Toucan) {
    try {
      const { externalID, user, userHints } = await this._callback(
        request,
        sentry
      );
      if (user) {
        return signIn(user);
      } else {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/login/signup",
            "Set-Cookie": cookieSerialize(
              "glenstack_signup",
              createSignUpJWT({ externalID, external: this, userHints }),
              { secure: true, maxAge: 60 * 60, path: "/login" }
            ),
          },
        });
      }
    } catch (error) {
      if (error instanceof ClientError) {
        return redirectWithFlash("/login", [
          {
            message: error.message,
            category: "error",
          },
        ]);
      } else {
        sentry.captureException(error);
        return redirectWithFlash("/login", [
          {
            message:
              error instanceof ExternalError
                ? error.message
                : "An unexpected error has occurred. The Glenstack team has been alerted. Please try again.",
            category: "error",
          },
        ]);
      }
    }
  }

  generateKey({ externalID }: { externalID: string }) {
    return `External:${this.id}:${externalID}`;
  }

  async findUser({ externalID }: { externalID: string }) {
    const idBuffer = await AUTHENTICATION_DATASTORE.get(
      this.generateKey({ externalID }),
      "arrayBuffer"
    );

    if (idBuffer !== null) {
      const id = uuidBufferToString(idBuffer);
      return await User.load({ id });
    }
  }

  async linkUser({ externalID, user }: { externalID: string; user: User }) {
    await AUTHENTICATION_DATASTORE.put(
      this.generateKey({ externalID }),
      uuidStringToBuffer(user.id),
      {
        metadata: {
          createdAt: new Date(),
        },
      }
    );
  }
}

export const externals = [gitHub];
