
# Simple MCP Server for an Online Bookstore with Custom AI Agent - POC


## 👁️ Overview 

This project is a proof-of-concept implementation of a Model Context Protocol (MCP) server and a custom AI-powered bookstore agent.
It demonstrates how an LLM can call structured tools exposed by an MCP server (e.g., search books) and how a separate agent process can communicate with that server to provide conversational responses.

The repo contains:

- **An MCP server**
  -  Built using `@modelcontextprotocol/sdk`
  -  Exposes a sample of bookstore-related tools (e.g., fetching books)
  -  Includes a seeding script to populate mock bookstore data

- **A custom bookstore AI Agent**
  - Connects to the MCP server as a client via a dedicated MCP client service:
    - Uses `@modelcontextprotocol/sdk` with an STDIO-based process transport to talk to the MCP server.
    - Discovers available MCP tools at runtime and invokes them dynamically
  -  Uses OpenAI to answer user queries
  -  Decides when to call MCP tools to fetch inventory data
  -  Can respond normally or stream responses token-by-token

- **A lightweight Express API** provides endpoints for:
  -  non-streaming LLM answers
  -  streaming LLM answers (chunked over HTTP)
  -  Demonstrates how a backend service can expose the agent to external clients



## 🛠️ Tech Stack

-	Model Context Protocol (MCP) – structured tool calling using `@modelcontextprotocol/sdk`
-	OpenAI API – LLM responses + streaming output
-	Express 5 – simple HTTP layer
-	TypeScript – typed agent + server
-	Zod – schema validation
-	Firebase Firestore - for bookstore database



## GitHub Branches

- `main` – Production branch. This branch represents the stable and production-ready version of the code. It is used for deployments to the live environment.

- `dev` – Development branch. This is the default branch for ongoing development work. It is where new features and bug fixes are implemented and tested before being merged into the main branch. It is used for deployments to the staging environment.


## Development

### Scripts

- `npm run dev:server` – Run the MCP server in development mode with hot-reloading
- `npm run dev:agent` – Run the Bookstore Agent in development mode with hot-reloading
- `npm run build` – Compile the TypeScript code to JavaScript
- `npm run start:server` – Start the MCP server in production mode
- `npm run start:agent` – Start the Bookstore Agent in production mode
- `npm run seed:bookstore` – Seed the Firestore database with mock bookstore data
### 


### Testing the MCP server locally using Claude Client



1. Download Claud Desktop


2. Locate the config file


From Claud App -> Settings > Developer -> Edit config 

The path is probably:

```shell
code "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```


3. Prepare the config file

```shell
# check the absolute path to the server
❯ pwd
```

Ensure Claude will run the correct version of Node:

```shell
which node
# should output smt like
> /Users/mistergreen/.nvm/versions/node/v22.17.0/bin/node
```

Use this path as `command` in the server config below (instead of using simply `node`)

 **Option A – Use the built JS file**

If you run npm run build and want Claude to call the compiled JS:

```json
{
  "mcpServers": {
    "demo-server": {
      "command": "/Users/mistergreen/.nvm/versions/node/v22.17.0/bin/node",
      "args": ["<ABSOLUTE-PATH>/dist/mcp-server/index.js"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```


**Option B – Run TypeScript directly (good for dev)**

If you don’t want to build every time, Claude can launch your server through tsx:

```json
{
  "mcpServers": {
    "demo-server": {
      "command": "/Users/mistergreen/.nvm/versions/node/v22.17.0/bin/node",
      "args": ["<ABSOLUTE-PATH>/node_modules/tsx/dist/cli.js", "<ABSOLUTE-PATH>/src/mcp-server/index.ts"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```



4. Test

-  Save the config.json.

- Quit and restart **Claude Desktop**.

-  Testing tools: Start a new chat and try:
	- Use the add tool with a=2 and b=3
	- Claud should discover the add tool. 


5. Debug

- From Claud App -> Settings > Developer -> Logs


### Testing the agent API 

1. Start the MCP server

```shell
npm run dev:server
```

2. Start the agent API

```shell
npm run dev:agent
```

3. Send requests to the agent API

E.g. using curl:

```shell
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Can you recommend me a sci-fi book?"}'
```
