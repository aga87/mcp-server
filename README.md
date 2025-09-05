# Simple MCP server



## Testing the MCP server locally using Claude Client



1. Download Claud Desktop


2. Locate the config file


From Claud App -> Developer -> Edit config 

The path is probably:

```shell
code "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```


3. Prepare the config file

```shell
# check the absolute path to the server
❯ pwd
```

 **Option A – Use the built JS file**

If you run npm run build and want Claude to call the compiled JS:

```json
{
  "mcpServers": {
    "demo-server": {
      "command": "node",
      "args": ["<ABSOLUTE-PATH>/dist/server.js"],
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
      "command": "node",
      "args": ["<ABSOLUTE-PATH>/node_modules/tsx/dist/cli.js", "<ABSOLUTE-PATH>/src/server.ts"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```



#### Test

1. Save the config.json.

2. Quit and restart **Claude Desktop**.

3. Testing tools: Start a new chat and try:
	- Use the add tool with a=2 and b=3
	- Claud should discover the add tool. 

4. Testing resources: In the chat, try  
	- "Use the **greeting resource** from **demo-server** with name aga."
	- This is currently not working. FIXME
