import { RequestHandler } from "express";
import { bookstoreAgent } from "../startup/services";

export const askStreamController: RequestHandler = async (req, res) => {
  const { query } = req.body;

  if (typeof query !== "string" || query.trim() === "") {
    res.status(400).send("Invalid query - must be a non-empty string");
    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8"); // Identifies the data as UTF-8 plaintext chunks.
  res.setHeader("Cache-Control", "no-cache, no-transform"); // prevents middleboxes (proxies, CDNs etc) from buffering the stream (no-cache) and from modifying chunk boundaries (important to keep the LLM chunks intact) (no-transform).
  res.setHeader("Connection", "keep-alive"); // Reduces the risk of early disconnects from intermediaries
  res.setHeader("X-Content-Type-Options", "nosniff"); // Security best practice. Prevents the browser from trying to treat the stream as something else (e.g., HTML).
  // Express will usually handle Transfer-Encoding: chunked automatically.

  /**
   * Track whether the client has terminated the connection.
   *
   * The 'close' event on the request fires when the underlying TCP connection
   * is closed before the server finishes sending the response. This can happen when:
   *   - the user closes the browser tab,
   *   - the network connection drops,
   *   - the client explicitly cancels the request,
   *   - or an intermediary (proxy/load balancer/firewall) closes the connection.
   *
   * When this occurs, we stop streaming further chunks to avoid:
   *   - writing to a closed socket (which throws errors),
   *   - wasting model tokens and server compute,
   *   - continuing asynchronous work unnecessarily.
   */

  const stream = bookstoreAgent.handleCustomerQueryStream(query);

  res.on("close", () => {
    stream.return?.(undefined).catch(() => {
      // Ignore any error from cancelling the stream
    });
  });

  try {
    for await (const chunk of stream) {
      if (res.writableEnded) {
        break;
      }
      res.write(chunk);
    }
  } catch (err) {
    console.error("Error while streaming response:", err);

    if (!res.headersSent) {
      // If nothing was sent yet, we can return a normal error response
      res.status(500).send("Unexpected server error");
      return;
    }
    // If we already started streaming, just fall through and end the response
  } finally {
    // Ensure the HTTP response is properly closed in all cases
    if (!res.writableEnded) {
      res.end();
    }
  }
};
