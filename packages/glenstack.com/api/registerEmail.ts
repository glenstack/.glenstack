import { FabRequestResponderWithParams } from "@fab/core";

export const registerEmail: FabRequestResponderWithParams = async ({
  settings,
  request,
}) => {
  try {
    const { emailAddress, referralURL } = await request.json();

    const response = await fetch(
      "https://getwaitlist.com/api/v1/waitlists/submit",
      {
        method: "POST",
        body: JSON.stringify({
          email: emailAddress,
          api_key: WAITLIST_API_KEY,
          referral_link: referralURL,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const {
        current_priority: currentPlace,
        referral_link: referralLink,
      } = await response.json();

      return new Response(
        JSON.stringify({
          currentPlace,
          referralLink,
          referralBumpSize: settings.WAITLIST_REFERRAL_BUMP_SIZE,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // TODO: Throw descriptive error
      throw Error();
    }
  } catch (error) {
    // TODO: Log error
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};
