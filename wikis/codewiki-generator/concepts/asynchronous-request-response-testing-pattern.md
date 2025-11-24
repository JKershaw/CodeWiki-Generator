---
title: Asynchronous request-response testing pattern
category: concept
sourceFile: test-mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Asynchronous Request-Response Testing Pattern

## Purpose and Overview

This testing pattern implements a comprehensive framework for validating MCP (Model Context Protocol) server implementations through asynchronous JSON-RPC communication. It provides a structured approach to testing bidirectional protocol compliance with proper timeout handling and request correlation management.

## Key Functionality

The pattern centers around the `MCPTester` class which:

- **Process Management**: Spawns and manages the MCP server subprocess for isolated testing
- **Request-Response Coordination**: Handles asynchronous JSON-RPC message exchange with promise-based correlation
- **Timeout Management**: Implements configurable timeouts to prevent hanging tests
- **Protocol Validation**: Executes comprehensive test suites covering initialization, tool discovery, and resource management

Core testing capabilities include:
- MCP protocol initialization handshake validation
- Tool listing and execution testing (wiki querying, documentation requests)
- Resource enumeration and metrics collection verification
- Error handling and edge case validation

The `sendRequest` function manages the asynchronous communication by maintaining a map of pending requests, each associated with a promise that resolves when the corresponding response arrives. The `handleResponse` function processes incoming messages and resolves the appropriate pending promises.

## Relationships

- **Depends on**: `mcp-server.js` as the primary system under test
- **Validates**: MCP protocol compliance for Claude Code Integration
- **Tests**: Wiki querying tools, documentation request functionality, and resource management features
- **Integrates with**: JSON-RPC communication patterns for protocol testing

## Usage Example

```javascript
const MCPTester = require('./test-mcp-server');

// Initialize and run comprehensive test suite
const tester = new MCPTester();
await tester.test();

// Individual test pattern example
const response = await tester.sendRequest({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { protocolVersion: "2024-11-05" }
});
```

## Testing

This component serves as the primary testing framework for MCP server implementations. It provides comprehensive protocol validation through structured test methods (`testInitialize`, `testToolsList`, `testQueryWiki`, etc.) that verify both successful operations and proper error handling scenarios.