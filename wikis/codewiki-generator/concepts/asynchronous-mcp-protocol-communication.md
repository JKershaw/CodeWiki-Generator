---
title: Asynchronous MCP protocol communication
category: concept
sourceFile: test-mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Asynchronous MCP Protocol Communication

## Purpose and Overview

Asynchronous MCP protocol communication establishes a pattern for bidirectional JSON-RPC communication between MCP clients and servers. This pattern enables request/response correlation with proper timeout handling and promise-based asynchronous operations for testing MCP server implementations.

## Key Functionality

The communication pattern implements several core capabilities:

- **JSON-RPC Protocol Management**: Handles structured request/response messaging with unique ID correlation
- **Asynchronous Request Handling**: Uses promises to manage non-blocking communication with timeout controls
- **Server Process Orchestration**: Spawns and manages MCP server child processes for testing scenarios
- **Protocol Validation**: Tests complete MCP handshake sequences including initialization, tool discovery, and resource enumeration
- **Response Correlation**: Matches incoming responses to pending requests using request IDs

The system manages bidirectional communication by maintaining a pending requests map and processing incoming messages through dedicated response handlers. Each request generates a unique identifier that correlates with the corresponding response or error.

## Relationships

- **Depends on**: `mcp-server.js` as the primary system under test
- **Validates**: JSON-RPC protocol compliance according to MCP specification requirements  
- **Tests**: Wiki integration functionality and documentation request recording mechanisms
- **Integrates with**: Child process spawning for isolated server testing environments

## Usage Example

```javascript
const MCPTester = require('./test-mcp-server');

const tester = new MCPTester();
await tester.test();

// Send JSON-RPC request with promise-based response
const response = await tester.sendRequest({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { capabilities: {} }
});
```

## Testing

The testing framework validates multiple MCP protocol scenarios:

- **Initialization**: Tests server handshake and capability negotiation
- **Tool Discovery**: Validates `tools/list` enumeration functionality
- **Resource Management**: Tests resource listing and discovery mechanisms
- **Metrics Collection**: Validates performance and usage metrics reporting
- **Wiki Integration**: Tests query functionality and documentation request recording

Each test scenario uses the asynchronous communication pattern to verify proper JSON-RPC message handling and MCP protocol compliance.