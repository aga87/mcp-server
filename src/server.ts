import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initializeApp, ServiceAccount } from "firebase-admin/app";
import { credential } from "firebase-admin";
import * as serviceAccount from "../mcp-server-ecommerce-firebase-adminsdk-service-account.json";
import { registerTool } from "./lib";
import {
  additionTool,
  getBooksTool,
  getCartCountTool,
  getCartItemsTool,
} from "./tools";

initializeApp({
  credential: credential.cert(serviceAccount as ServiceAccount),
});

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

registerTool(server, additionTool);

// BOOKSTORE EXPLORATION TOOLS

registerTool(server, getBooksTool);

// CART MANAGEMENT TOOLS

registerTool(server, getCartItemsTool);

registerTool(server, getCartCountTool);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();

(async () => {
  try {
    await server.connect(transport);
    /**
     * ⚠️ IMPORTANT: Do not use console.log in an MCP server.
     * MCP communicates with Claude (or any MCP client) over STDIO using JSON-RPC.
     * Anything written to STDOUT (like console.log) will corrupt the protocol stream
     * and cause Claude to ignore tools or fail to start.
     * Always log diagnostic information to STDERR instead, e.g. console.error().
     */
    console.error("[mcp] server started (stdio)");
  } catch (err) {
    console.error("[mcp] failed to start", err);
    process.exit(1);
  }
})();
