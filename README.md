# Simple MCP server


## Branches

- `main` – Production branch. This branch represents the stable and production-ready version of the code. It is used for deployments to the live environment.

- `dev` – Development branch. This is the default branch for ongoing development work. It is where new features and bug fixes are implemented and tested before being merged into the main branch. It is used for deployments to the staging environment.


## Testing the MCP server locally using Claude Client



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
      "command": "/Users/mistergreen/.nvm/versions/node/v22.17.0/bin/node",
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


#### Debug

From Claud App -> Settings > Developer -> Logs


## Deployment options to consider 

•	Need stable, unlimited connections and simplest ops? → GCE VM
•	Team wants managed autoscaling & rollouts? → GKE Autopilot
•	Want the simplest deploy UI and can tolerate hourly reconnects? → Cloud Run