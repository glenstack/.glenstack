import { serialize as cookieSerialize } from "cookie";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";

interface Flash {
  message: string;
  category?: "error" | "warning" | "info";
}

export const flash = (flashContents: Flash[]) => ({
  "Set-Cookie": cookieSerialize(
    "glenstack_flashMessages",
    JSON.stringify(flashContents),
    {
      secure: true,
      path: "/",
    }
  ),
});

export const redirectWithFlash = (location: string, flashContents: Flash[]) =>
  new Response(null, {
    status: 302,
    headers: {
      Location: location,
      ...flash(flashContents),
    },
  });

export const uuidStringToBuffer = (id: string) =>
  new Uint8Array(uuidParse(id)).buffer;

export const uuidBufferToString = (buffer: ArrayBuffer) =>
  uuidStringify(new Uint8Array(buffer));
