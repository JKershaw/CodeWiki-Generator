---
title: JSON-RPC client-server communication
category: concept
sourceFile: demo-mcp-query.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# JSON-RPC Client-Server Communication

## Purpose and Overview

This component demonstrates JSON-RPC client-server communication for the MCP (Model Context Protocol) implementation. It provides a testing framework that spawns MCP server processes and sends JSON-RPC queries to validate server functionality and showcase protocol capabilities.

## Key Functionality

The component implements two main functions:

- **`queryMCPServer`** - Spawns an MCP server process as a child process and handles JSON-RPC communication by sending formatted queries and capturing responses for validation
- **`main`** - Orchestrates demonstration queries that showcase different MCP server capabilities, including the `tools/call` method for wiki querying functionality

The implementation follows the MCP protocol's JSON-RPC communication pattern with proper initialization, method calls, and response handling. It manages the complete communication lifecycle from server startup through query execution and response processing.

## Relationships

- **Depends on** `mcp-server.js` for the actual MCP server implementation that processes the JSON-RPC requests
- **Uses** Node.js `child_process` spawning to establish communication channels with the server process
- **Implements** the MCP protocol's `tools/call` method specifically for wiki querying functionality
- **Serves as** a testing and demonstration layer for validating MCP server responses and protocol compliance

## Usage Example

```javascript
// Run the demonstration queries
const { queryMCPServer, main } = require('./demo-mcp-query.js');

// Execute the main demo function to test server capabilities
main();

// Or query the server directly with custom parameters
queryMCPServer().then(result => {
    console.log('Server response:', result);
});
```

## Testing

No automated tests are currently available for this component. The demonstration script serves as both a functional test and usage example for the MCP server implementation.