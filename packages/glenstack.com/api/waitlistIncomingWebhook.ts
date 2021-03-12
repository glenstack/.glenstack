import { FabRequestResponderWithParams } from "@fab/core";

export const waitlistIncomingWebhook: FabRequestResponderWithParams = async ({
  settings,
  request,
}) => {
  try {
    return new Response();
  } catch (error) {
    // TODO: Log error
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};
