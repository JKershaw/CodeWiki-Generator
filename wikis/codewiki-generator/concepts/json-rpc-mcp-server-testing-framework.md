---
title: JSON-RPC MCP Server Testing Framework
category: concept
sourceFile: test-mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# JSON-RPC MCP Server Testing Framework

## Purpose and Overview

The JSON-RPC MCP Server Testing Framework provides a comprehensive testing harness for validating MCP (Model Context Protocol) server implementations. It spawns MCP server processes, manages JSON-RPC communication over stdio, and executes test suites to verify protocol compliance and tool functionality.

## Key Functionality

The framework centers around the `MCPTester` class which orchestrates the entire testing process:

- **Process Management**: Spawns MCP server processes and manages their lifecycle
- **JSON-RPC Communication**: Handles asynchronous request/response patterns with timeout support
- **Protocol Testing**: Validates MCP initialization handshake and protocol compliance  
- **Tool Validation**: Tests MCP tools like wiki querying and documentation requests
- **Resource Testing**: Verifies resource discovery and access functionality
- **Response Handling**: Processes JSON-RPC responses and resolves pending promises

The testing flow includes initialization testing, tools list discovery, and execution of specific tool functions like `query_wiki` and `request_documentation`.

## Relationships

- Tests the `mcp-server.js` implementation for protocol compliance
- Validates wiki integration tools and their response formats
- Verifies documentation request handling and processing
- Exercises the complete MCP server request/response cycle
- Ensures proper JSON-RPC message formatting and error handling

## Usage Example

```javascript
const MCPTester = require('./test-mcp-server');

// Create tester instance and run full test suite
const tester = new MCPTester();
await tester.test();

// Or test individual components
await tester.testInitialize();
await tester.testToolsList(); 
await tester.testQueryWiki();
await tester.testRequestDocumentation();
```

The framework automatically handles server spawning, JSON-RPC communication setup, test execution, and cleanup. Each test method validates specific MCP functionality and reports results with detailed error information when failures occur.

## Testing

This is the testing framework itself for MCP server implementations. It provides comprehensive validation of MCP protocol compliance, tool functionality, and JSON-RPC communication patterns. No automated tests are currently available for the testing framework itself.