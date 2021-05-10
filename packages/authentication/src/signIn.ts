import { serialize as cookieSerialize } from "cookie";
import { User } from "./user";

export const signIn = async (user: User) => {
  const headers = new Headers();
  headers.set("Location", "https://glenstack.com/");

  // TODO
  // "Set-Cookie": cookieSerialize("glenstack_accessToken", ),
  headers.append(
    "Set-Cookie",
    cookieSerialize("glenstack_signup", "", {
      secure: true,
      expires: new Date(0),
      domain: "glenstack.com",
      path: "/",
    })
  );

  return new Response(null, {
    status: 302,
    headers,
  });
};
