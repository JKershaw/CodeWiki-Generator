---
title: MCP JSON-RPC testing framework
category: component
sourceFile: test-mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# MCP JSON-RPC Testing Framework

## Purpose and Overview

The MCP JSON-RPC testing framework provides comprehensive validation of MCP (Model Context Protocol) server implementations through automated protocol compliance testing. This testing harness spawns MCP server processes and validates proper JSON-RPC message exchange patterns, ensuring servers correctly implement the MCP specification for Claude Code Integration.

## Key Functionality

The framework implements a complete test suite that validates:

- **Protocol Initialization**: Tests the MCP handshake process and capability negotiation
- **Tool Discovery**: Validates server's ability to enumerate available tools via `tools/list`
- **Tool Execution**: Tests specific tool functionality including wiki querying and documentation requests
- **Resource Management**: Verifies resource enumeration and access patterns
- **Metrics Collection**: Validates server metrics reporting capabilities
- **Request-Response Correlation**: Ensures proper JSON-RPC message correlation with timeout handling

The `MCPTester` class orchestrates test execution by spawning the target server process and managing bidirectional communication through stdin/stdout. Each test method validates specific MCP protocol features using promise-based request handling with configurable timeouts.

## Relationships

- **Depends on**: `mcp-server.js` as the primary system under test
- **Validates**: MCP protocol compliance for Claude Code Integration
- **Tests**: Wiki querying tools, documentation request submission, and resource management
- **Integrates with**: JSON-RPC transport layer for message exchange

## Usage Example

```javascript
const MCPTester = require('./test-mcp-server.js');

// Initialize and run comprehensive MCP protocol tests
const tester = new MCPTester();
await tester.test();

// Test individual protocol components
await tester.testInitialize();
await tester.testToolsList();
await tester.testQueryWiki();
```

## Testing

This is the testing framework itself for validating MCP server implementations. It provides automated validation of protocol compliance, tool functionality, and resource management features. The framework uses asynchronous request-response patterns with proper timeout handling to ensure robust testing of bidirectional MCP communication.