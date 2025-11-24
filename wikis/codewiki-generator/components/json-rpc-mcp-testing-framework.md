---
title: JSON-RPC MCP testing framework
category: component
sourceFile: test-mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# JSON-RPC MCP Testing Framework

## Purpose and Overview

The JSON-RPC MCP testing framework provides automated testing capabilities for MCP (Model Context Protocol) server implementations through comprehensive JSON-RPC protocol validation. This testing framework spawns MCP servers and executes a suite of protocol compliance tests to ensure proper functionality of tools, resources, and communication patterns.

## Key Functionality

The framework centers around the `MCPTester` class which orchestrates test execution by:

- **Server Management**: Spawns and manages MCP server processes for testing
- **Protocol Testing**: Validates JSON-RPC communication patterns including initialization handshakes, request/response correlation, and timeout handling
- **Feature Validation**: Tests core MCP capabilities including tool discovery (`testToolsList`), resource enumeration (`testResourcesList`), wiki querying (`testQueryWiki`), documentation requests (`testRequestDocumentation`), and metrics collection (`testMetrics`)
- **Asynchronous Communication**: Manages bidirectional JSON-RPC communication with promise-based response handling through `sendRequest` and `handleResponse` methods

The test suite covers the complete MCP protocol lifecycle from server initialization through tool execution and resource access.

## Relationships

- **Depends on**: `mcp-server.js` as the primary system under test
- **Validates**: JSON-RPC protocol compliance according to MCP specification requirements
- **Tests**: Wiki integration functionality and documentation request recording mechanisms
- **Integrates with**: Standard Node.js testing patterns for process management and asynchronous protocol testing

## Usage Example

```javascript
const MCPTester = require('./test-mcp-server');

// Create and run the test suite
const tester = new MCPTester();
await tester.test();

// Individual test execution
await tester.testInitialize();
await tester.testToolsList();
await tester.testQueryWiki();
```

## Testing

This component serves as a testing framework itself, providing comprehensive validation of MCP server implementations. It does not have additional automated tests but functions as the primary testing mechanism for MCP protocol compliance and server functionality validation.