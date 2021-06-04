import Toucan from "toucan-js";
import { z, ZodError } from "zod";
import { parseFormBody, redirect } from "./utils";

const waitlistBodySchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export const waitlist = async (
  request: Request,
  sentry: Toucan
): Promise<Response> => {
  try {
    const data = waitlistBodySchema.parse(await parseFormBody(request));
    const date = new Date().toISOString();

    await AUTHENTICATION_DATASTORE.put(
      `waitlist:${data.email}`,
      JSON.stringify({ ...data, createdAt: date }),
      {
        metadata: {
          createdAt: date,
        },
      }
    );

    return redirect("https://glenstack.com/waitlist?success=true");
  } catch (error) {
    let errorMessages = ["Unable to join the waitlist. Please try again."];
    if (error instanceof ZodError) {
      errorMessages = error.errors.map((error) => error.message);
    } else {
      sentry.captureException(error);
    }

    return redirect(
      `https://glenstack.com/waitlist?${new URLSearchParams({
        errors: JSON.stringify(errorMessages),
      }).toString()}`
    );
  }
};
