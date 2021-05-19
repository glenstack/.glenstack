import Toucan from "toucan-js";
import { z, ZodError } from "zod";

const waitlistBodySchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const redirect = (location: string) =>
  new Response(null, {
    status: 302,
    headers: { Location: location },
  });

export const waitlist = async (
  request: Request,
  sentry: Toucan
): Promise<Response> => {
  try {
    const data = Object.fromEntries(
      new URLSearchParams(await request.text()).entries()
    );
    const validatedData = waitlistBodySchema.parse(data);
    const date = new Date().toISOString();

    await AUTHENTICATION_DATASTORE.put(
      `waitlist:${validatedData.email}`,
      JSON.stringify({ ...validatedData, createdAt: date }),
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
