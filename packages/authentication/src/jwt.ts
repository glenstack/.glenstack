import { KJUR } from "jsrsasign";
import { External } from "./external";
import { User } from "./user";

const sign = ({
  sub,
  aud = ["https://glenstack.com/"],
  exp,
  data = {},
}: {
  sub?: string;
  aud?: string[];
  exp: string;
  data?: Record<string, string | undefined>;
}) => {
  const now = KJUR.jws.IntDate.getNow();

  const header = { alg: "RS512", typ: "JWT" };
  const payload = {
    iss: "https://auth.glenstack.com/",
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

export interface RegisterJWT {
  iss: "https://auth.glenstack.com/";
  aud: ["https://auth.glenstack.com/", "https://glenstack.com/register"];
  exp: number;
  nbf: number;
  iat: number;
  "https://glenstack.com/#external": string;
  "https://glenstack.com/#externalID": string;
  "https://glenstack.com/#userHints"?: string;
}

export const verifyRegisterJWT = (jwt: string): RegisterJWT | undefined => {
  const isValid = KJUR.jws.JWS.verifyJWT(jwt, RS512_PUBLIC_PEM, {
    alg: ["RS512"],
    iss: ["https://auth.glenstack.com/"],
    aud: ["https://auth.glenstack.com/", "https://glenstack.com/register"],
  });
  if (isValid) {
    return KJUR.jws.JWS.parse(jwt).payloadObj as RegisterJWT;
  }
};

export const createRegisterJWT = ({
  externalID,
  external,
  userHints,
}: {
  externalID?: string;
  external?: External;
  userHints?: Partial<Omit<User, "id">>;
}): ReturnType<typeof sign> =>
  sign({
    aud: ["https://auth.glenstack.com/", "https://glenstack.com/register"],
    exp: "now + 1hour",
    data: {
      external: external?.id,
      externalID,
      userHints: JSON.stringify(userHints),
    },
  });
