import { Readable } from "node:stream";
import server from "../dist/server/server.js";

export default async function handler(req: any, res: any) {
  try {
    const host = req.headers.host || "localhost";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const url = new URL(req.url ?? "", `${protocol}://${host}`);

    const body = ["GET", "HEAD"].includes(req.method) ? undefined : Readable.toWeb(req);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body,
    } as any);

    const response = await server.fetch(request, {}, {});

    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));

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