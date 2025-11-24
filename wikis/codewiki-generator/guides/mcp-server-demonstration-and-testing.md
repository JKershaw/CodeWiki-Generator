---
title: MCP server demonstration and testing
category: guide
sourceFile: demo-mcp-query.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# MCP Server Demonstration and Testing

## Purpose and Overview

This component provides a demonstration and testing framework for MCP (Model Context Protocol) server functionality. It spawns MCP server processes and sends JSON-RPC queries to validate server responses and showcase capabilities.

## Key Functionality

The demo system implements the following core features:

- **Process Management**: Spawns MCP server instances as child processes for isolated testing
- **JSON-RPC Communication**: Sends properly formatted MCP protocol messages including initialization and method calls
- **Response Handling**: Captures and processes server responses to demonstrate functionality
- **Tools Testing**: Specifically tests the `tools/call` method for wiki querying capabilities
- **Demo Orchestration**: Runs multiple demonstration queries to showcase different server features

The `queryMCPServer` function handles the complete lifecycle of server communication, from process spawning through JSON-RPC message exchange. The `main` function orchestrates various demo scenarios to comprehensively test server capabilities.

## Relationships

This component serves as a client-side testing interface with the following dependencies:

- **mcp-server.js**: Requires the actual MCP server implementation to spawn and test
- **Node.js child_process**: Uses process spawning to communicate with the server in isolation
- **JSON-RPC Protocol**: Implements the MCP communication standard for message formatting and exchange

The component acts as a validation layer between the MCP server implementation and end-users, ensuring proper protocol compliance and functionality.

## Usage Example

```javascript
// Run the MCP server demonstration
const { queryMCPServer, main } = require('./demo-mcp-query.js');

// Execute demonstration queries
main();

// Or query the server directly
const response = await queryMCPServer({
  method: "tools/call",
  params: {
    name: "query_wiki",
    arguments: { query: "example search" }
  }
});
```

## Testing

No automated tests found. Testing is performed through the demonstration queries executed by the `main` function, which validates MCP server responses and protocol compliance through live interaction scenarios.