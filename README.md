# Shopify MCP Server

A Model Context Protocol server that provides tools for interacting with Shopify APIs.

## Features

- Get product listings
- Get product details
- Search products
- Get customer information
- Get order information

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Shopify credentials:
```
SHOPIFY_ADMIN_API_KEY=your_api_key
SHOPIFY_ADMIN_API_SECRET=your_api_secret
SHOPIFY_STORE_URL=your_store.myshopify.com
SHOPIFY_API_VERSION=2025-04
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Run the server:
```bash
npm start
```

## Claude Desktop Configuration

To use this MCP server with Claude Desktop, add the following configuration to your Claude Desktop config file located at `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shopify-mcp-server": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/shopify-mcp-server-node/dist/index.js"
      ]
    }
  }
}
```

Replace `/ABSOLUTE/PATH/TO/` with the absolute path to your project directory. For example:

```json
{
  "mcpServers": {
    "shopify-mcp-server": {
      "command": "node",
      "args": [
        "/Users/your_username/projects/shopify-mcp-server-node/dist/index.js"
      ]
    }
  }
}
```

After updating the configuration, restart Claude Desktop. The Shopify tools will then be available through the tool selection interface in Claude. 