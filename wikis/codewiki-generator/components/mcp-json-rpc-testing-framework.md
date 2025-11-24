---
title: MCP JSON-RPC Testing Framework
category: component
sourceFile: test-mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# MCP JSON-RPC Testing Framework

## Purpose and Overview

The MCP JSON-RPC Testing Framework provides a comprehensive test harness for validating MCP (Model Context Protocol) server implementations. It spawns an MCP server process and systematically tests all server capabilities through JSON-RPC communication with async request/response handling and timeout management.

## Key Functionality

The `MCPTester` class serves as the primary test harness that:

- **Process Management**: Spawns and manages MCP server processes for testing
- **JSON-RPC Communication**: Implements full JSON-RPC protocol for server communication with promise-based response handling
- **Protocol Compliance Testing**: Validates MCP server initialization and protocol adherence
- **Tool Validation**: Tests all exposed tools including wiki querying and documentation requests
- **Resource Testing**: Verifies server resource listing capabilities
- **Metrics Verification**: Confirms usage tracking and metrics collection functionality
- **Timeout Protection**: Ensures tests don't hang on unresponsive servers

The framework uses `sendRequest()` to dispatch JSON-RPC requests and `handleResponse()` to process server responses, with each test method focusing on a specific aspect of MCP server functionality.

## Relationships

- **Tests**: `mcp-server.js` - Primary MCP server implementation under test
- **Validates**: JSON-RPC protocol compliance and MCP specification adherence
- **Verifies**: Wiki querying tools, documentation request handlers, resource listing, and metrics tracking
- **Integrates with**: Claude desktop application workflow for MCP server validation

## Usage Example

```javascript
const MCPTester = require('./test-mcp-server');

// Initialize test harness
const tester = new MCPTester();

// Run comprehensive test suite
async function runTests() {
  await tester.testInitialize();
  await tester.testToolsList();
  await tester.testQueryWiki();
  await tester.testRequestDocumentation();
  await tester.testResourcesList();
  await tester.testMetrics();
}
```

## Testing

This is a testing framework itself - no additional test coverage information available. The framework provides comprehensive validation of MCP server implementations through systematic JSON-RPC protocol testing.