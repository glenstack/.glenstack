import { z, ZodError } from "zod";
import { parse as cookieParse, serialize as cookieSerialize } from "cookie";
import { verifyRegisterJWT } from "./jwt";
import { flash, redirectWithFlash } from "./utils";
import { User } from "./user";
import { gitHub } from "./external/gitHub";
import { login } from "./login";

const registerBodySchema = z.object({
  name: z.string().min(1, { message: "Invalid name." }),
  email: z.string().email({ message: "Invalid email address." }),
});

export const register = async (request: Request): Promise<Response> => {
  try {
    const cookie = cookieParse(request.headers.get("cookie") || "");
    const jwt = verifyRegisterJWT(cookie.glenstack_signup);
    if (jwt === undefined) {
      const headers = new Headers(
        flash([
          {
            message: "Could not verify your user account. Please try again.",
            category: "error",
          },
        ])
      );
      headers.append(
        "Set-Cookie",
        cookieSerialize("glenstack_signup", "", {
          secure: true,
          expires: new Date(0),
          sameSite: "strict",
          domain: "glenstack.com",
          path: "/",
        })
      );
      return new Response("https://glenstack.com/login", {
        headers,
      });
    }

    const external = [gitHub].find(
      (external) => external.id === jwt["https://glenstack.com/#external"]
    );
    const data = Object.fromEntries(
      new URLSearchParams(await request.text()).entries()
    );
    const userData = registerBodySchema.parse(data);

    const user = await User.create({
      ...userData,
      externals: external
        ? {
            [external.id]: jwt["https://glenstack.com/#externalID"],
          }
        : undefined,
    });

    if (external)
      await external.linkUser({
        externalID: jwt["https://glenstack.com/#externalID"],
        user,
      });

    return await user.login();
  } catch (error) {
    let errorMessages = ["Unable to complete registration. Please try again."];
    if (error instanceof ZodError) {
      errorMessages = error.errors.map(
        (error) => `${error.path}: ${error.message}`
      );
    }

    return redirectWithFlash(
      "https://glenstack.com/register",
      errorMessages.map((message) => ({
        message,
        category: "error",
      }))
    );
  }
};
