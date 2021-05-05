import { KJUR } from "jsrsasign";
import { External } from "./external";
import { User } from "./user";

const sign = ({
  sub,
  aud = "https://glenstack.com/",
  exp,
  data = {},
}: {
  sub?: string;
  aud?: string;
  exp: string;
  data?: Record<string, string>;
}) => {
  const now = KJUR.jws.IntDate.getNow();

  const header = { alg: "RS512", typ: "JWT" };
  const payload = {
    iss: "https://glenstack.com/",
    sub,
    aud,
    exp: KJUR.jws.IntDate.get(exp),
    nbf: now,
    iat: now,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        `https://glenstack.com/#${key}`,
        value,
      ])
    ),
  };

  return KJUR.jws.JWS.sign("RS512", header, payload, RS512_PRIVATE_PEM);
};

export interface SignUpJWT {
  iss: "https://glenstack.com/";
  aud: "https://glenstack.com/login/signup";
  exp: number;
  nbf: number;
  iat: number;
  data: {
    "https://glenstack.com/#external": string;
    "https://glenstack.com/#externalID": string;
    "https://glenstack.com/#userHints"?: string;
  };
}

export const verifySignUpJWT = (jwt: string): SignUpJWT | undefined => {
  const isValid = KJUR.jws.JWS.verifyJWT(jwt, RS512_PUBLIC_PEM, {
    alg: ["RS512"],
    iss: ["https://glenstack.com/"],
    aud: ["https://glenstack.com/login/signup"],
  });
  if (isValid) {
    return KJUR.jws.JWS.parse(jwt).payloadObj as SignUpJWT;
  }
};

export const createSignUpJWT = ({
  externalID,
  external,
  userHints,
}: {
  externalID: string;
  external: External;
  userHints?: Partial<Omit<User, "id">>;
}) =>
  sign({
    aud: "https://glenstack.com/login/signup",
    exp: "now + 1hour",
    data: {
      external: external.id,
      externalID,
      userHints: JSON.stringify(userHints),
    },
  });
