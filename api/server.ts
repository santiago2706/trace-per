import { Readable } from "node:stream";
// @ts-ignore
import server from "../dist/server/server.js";

export default async function handler(req: any, res: any) {
  try {
    const host = req.headers.host || "localhost";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const url = new URL(req.url ?? "", `${protocol}://${host}`);

    const body = ["GET", "HEAD"].includes(req.method || "GET") 
      ? undefined 
      : (req.body ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : Readable.toWeb(req));

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else {
          headers.set(key, value as string);
        }
      }
    }

    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    } as any);


    // TanStack Start server handler
    const response = await (server as any).fetch(request, {}, {});

    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => res.setHeader(key, value));

    if (response.body == null) {
      res.end();
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Server error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal Server Error");
  }
}
