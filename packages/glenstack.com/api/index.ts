import { FABRuntime } from "@fab/core";
import { registerEmail } from "./registerEmail";
import { waitlistIncomingWebhook } from "./waitlistIncomingWebhook";

const index = ({ Router }: FABRuntime) => {
  Router.on("/api/registerEmail", registerEmail);
  Router.on("/api/waitlistIncomingWebhook", waitlistIncomingWebhook);
};

export default index;
