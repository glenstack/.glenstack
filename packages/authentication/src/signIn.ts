import { serialize as cookieSerialize } from "cookie";
import { User } from "./user";

export const signIn = async (user: User) => {
  const headers = new Headers();
  headers.set("Location", "/");

  // TODO
  // "Set-Cookie": cookieSerialize("glenstack_accessToken", ),
  headers.append(
    "Set-Cookie",
    cookieSerialize("glenstack_signup", "", { expires: new Date(0) })
  );

  return new Response(null, {
    status: 302,
    headers,
  });
};
