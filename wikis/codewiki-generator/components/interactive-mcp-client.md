---
title: Interactive MCP client
category: component
sourceFile: demo-mcp-query.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Interactive MCP Client

## Purpose and Overview

The Interactive MCP client provides a programmatic demonstration of how to communicate with MCP (Model Context Protocol) servers using JSON-RPC protocol. This demo script shows the complete client-server interaction flow, from spawning server processes to sending queries and processing responses.

## Key Functionality

The client implements the following core capabilities:

- **Server Process Management**: Spawns MCP server processes as child processes for communication
- **Protocol Communication**: Handles JSON-RPC message formatting and exchange with MCP servers
- **Request Lifecycle**: Manages the full request flow including initialization, tool queries, and response processing
- **Response Formatting**: Processes and displays server responses in a readable format
- **Demo Scenarios**: Executes predefined queries to demonstrate different MCP wiki system use cases

The `queryMCPServer` function handles the complete interaction cycle, while the `main` function orchestrates multiple demo queries to showcase various functionality.

## Relationships

- **Depends on**: `mcp-server.js` as the target MCP server implementation
- **Demonstrates**: The `query_wiki` tool functionality and JSON-RPC communication patterns
- **Serves as**: A reference implementation for building MCP clients and testing server functionality

## Usage Example

```javascript
// Basic usage pattern for querying an MCP server
async function queryServer() {
  // The demo client spawns the server process
  const serverPath = './mcp-server.js';
  
  // Send initialization and query requests
  await queryMCPServer(serverPath, 'sample query');
  
  // Multiple demo queries can be executed
  await main(); // Runs predefined demo scenarios
}
```

## Testing

No automated tests are currently available for this demo client. The component serves as a manual testing and demonstration tool for MCP protocol interactions.