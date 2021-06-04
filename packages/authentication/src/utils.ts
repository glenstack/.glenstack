import { serialize as cookieSerialize } from "cookie";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";

export const ONE_MINUTE = 60;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;

interface Flash {
  message: string;
  category?: "error" | "warning" | "info";
}

export const flash = (flashContents: Flash[]): { "Set-Cookie": string } => ({
  "Set-Cookie": cookieSerialize(
    "glenstack_flashMessages",
    JSON.stringify(flashContents),
    {
      secure: true,
      sameSite: "strict",
      domain: "glenstack.com",
      path: "/",
    }
  ),
});

export const redirectWithFlash = (
  location: string,
  flashContents: Flash[]
): Response =>
  new Response(null, {
    status: 302,
    headers: {
      Location: location,
      ...flash(flashContents),
    },
  });

export const redirect = (location: string): Response =>
  new Response(null, { status: 302, headers: { Location: location } });

export const parseFormBody = async (
  request: Request
): Promise<Record<string, unknown>> =>
  Object.fromEntries(new URLSearchParams(await request.text()).entries());

export const uuidStringToBuffer = (id: string): ArrayBuffer =>
  new Uint8Array(uuidParse(id)).buffer;

export const uuidBufferToString = (buffer: ArrayBuffer): string =>
  uuidStringify(new Uint8Array(buffer));
