import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// https://www.npmjs.com/package/@modelcontextprotocol/sdk#writing-mcp-clients
export class McpClientService {
  private client?: Client;

  /**
   * Discovers available tools at runtime. Returns an array of tool metadata objects, each containing:
   * - name (e.g. "getBooksTool")
   * - description
   * - inputSchema (JSON Schema for args)
   */
  public async listTools() {
    const client = await this.getClient();
    return client.listTools();
  }

  // Generic wrapper to call any MCP tool
  public async callTool<
    TArgs extends Record<string, unknown> = Record<string, unknown>
  >(name: string, args: TArgs) {
    const client = await this.getClient();

    return await client.callTool({
      name,
      arguments: args,
    });
  }

  /**
   * Gracefully close the MCP client connection.
   * This is important for tests so Jest can exit cleanly.
   */
  public async close(): Promise<void> {
    if (!this.client) return;

    await this.client.close();
    this.client = undefined;
  }

  // Returns a connected MCP client (singleton - spawns MCP server only once)
  private async getClient(): Promise<Client> {
    if (this.client) {
      return this.client;
    }

    // Open a communication tunnel using stdin/stdout between your agent ↔ MCP server
    const transport = new StdioClientTransport({
      command: process.execPath, // Same as `node`
      args: ["dist/mcp-server/index.js"], //  MCP server entrypoint
    });

    const client = new Client({
      name: "bookstore-agent",
      version: "1.0.0",
    });

    // Start communicating with that subprocess via STDIO using the MCP protocol
    await client.connect(transport);

    this.client = client;
    return client;
  }
}
