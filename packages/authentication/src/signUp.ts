import { z, ZodError } from "zod";
import type Toucan from "toucan-js";
import { parse as cookieParse } from "cookie";
import { verifySignUpJWT } from "./jwt";
import { redirectWithFlash } from "./utils";
import { User } from "./user";
import { externals } from "./external";
import { gitHub } from "./external/gitHub";
import { signIn } from "./signIn";

const signUpBodySchema = z.object({
  name: z.string().min(1, { message: "Invalid name." }),
  email: z.string().email({ message: "Invalid email address." }),
});

export const signUp = async (request: Request, sentry: Toucan) => {
  try {
    const cookie = cookieParse(request.headers.get("cookie") || "");
    const jwt = verifySignUpJWT(cookie.glenstack_signup);
    if (jwt === undefined) {
      return redirectWithFlash("https://glenstack.com/login", [
        {
          message: "Could not verify your user account. Please try again.",
          category: "error",
        },
      ]);
    }
    const external = externals.find(
      (external) => external.id === jwt.data["https://glenstack.com/#external"]
    );
    if (external === undefined) {
      const error = new Error(
        `A user tried to sign up with a valid JWT tied to an unknown external service: ${jwt.data["https://glenstack.com/#external"]}`
      );
      sentry.captureException(error);
      throw error;
    }

    const data = new URLSearchParams(await request.text());
    const userData = signUpBodySchema.parse(data);

    const user = await User.create({
      ...userData,
      externals: {
        [external.id]: jwt.data["https://glenstack.com/#externalID"],
      },
    });

    await gitHub.linkUser({
      externalID: jwt.data["https://glenstack.com/#externalID"],
      user,
    });

    return await signIn(user);
  } catch (error) {
    let errorMessages = ["Unable to complete sign-up. Please try again."];
    if (error instanceof ZodError) {
      errorMessages = error.errors.map((error) => error.message);
    }

    return redirectWithFlash(
      "https://glenstack.com/login",
      errorMessages.map((message) => ({
        message,
        category: "error",
      }))
    );
  }
};
