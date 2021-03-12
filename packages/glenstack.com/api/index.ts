import { FABRuntime } from "@fab/core";
import { registerEmail } from "./registerEmail";

const index = ({ Router }: FABRuntime) => {
  Router.on("/api/registerEmail", registerEmail);
};

export default index;
