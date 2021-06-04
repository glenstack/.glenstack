import { serialize as cookieSerialize } from "cookie";
import type Toucan from "toucan-js";
import { z, ZodError } from "zod";
import { User } from "./user";
import { parseFormBody, redirect } from "./utils";

const loginBodySchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export const login = async (
  request: Request,
  sentry: Toucan
): Promise<Response> => {
  try {
    const data = loginBodySchema.parse(await parseFormBody(request));

    const user = await User.find({ email: data.email });
    if (user) {
      // TODO: Magic Email thing
      return redirect(`https://glenstack.com/login?success=true`);
    } else {
      throw redirect("https://glenstack.com/register");
    }
  } catch (error) {
    let errorMessages = ["Unable to complete sign-in. Please try again."];
    if (error instanceof ZodError) {
      errorMessages = error.errors.map(
        (error) => `${error.path}: ${error.message}`
      );
    } else {
      sentry.captureException(error);
    }

    return redirect(
      `https://glenstack.com/login?${new URLSearchParams({
        errors: JSON.stringify(errorMessages),
      }).toString()}`
    );
  }
};
