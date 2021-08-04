import { v4 as uuid } from "uuid";
import { parseRequest } from "./formData";
import { ONE_WEEK } from "./utils";
import { parseFile } from "./parse";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

export const uploadFile = async (request: Request): Promise<Response> => {
  if (request.method.toLowerCase() !== "post")
    return new Response(null, { status: 405 });

  const formData = await parseRequest(request);
  const file = formData?.get("file");
  if (file && file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_FILE_BYTES)
      return new Response(null, { status: 413 });

    const id = uuid();
    await FILES.put(`File:${id}`, arrayBuffer, {
      expirationTtl: ONE_WEEK,
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });

    const parsedFile = await parseFile(file);

    return new Response(JSON.stringify(parsedFile), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(null, { status: 400 });
  }
};
