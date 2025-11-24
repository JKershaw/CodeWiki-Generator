---
title: JSON-RPC MCP protocol implementation
category: component
sourceFile: demo-mcp-query.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# JSON-RPC MCP Protocol Implementation

## Purpose and Overview

This component provides a demonstration framework for testing and validating MCP (Model Context Protocol) server implementations through automated JSON-RPC communication. It serves as both a reference implementation for MCP client-server interaction and a practical testing tool for verifying server capabilities.

## Key Functionality

The implementation centers around two primary functions:

- **`queryMCPServer`** - Spawns an MCP server as a child process, establishes JSON-RPC communication over stdio, sends initialization and query requests, and captures formatted server responses
- **`main`** - Orchestrates demonstration scenarios by executing a series of predefined queries that showcase different MCP server capabilities

The framework handles the complete MCP protocol handshake, including server initialization, capability negotiation, and structured request-response cycles. It processes JSON-RPC messages through Node.js readline interface and formats responses for human-readable output.

## Relationships

- **Depends on** `mcp-server.js` for the actual MCP server implementation being tested
- **Uses** Node.js `child_process` module to spawn and manage server processes
- **Utilizes** Node.js `readline` module for line-based JSON-RPC communication over stdio
- **Implements** the MCP JSON-RPC protocol specification for standardized client-server interaction

## Usage Example

```javascript
// Execute the demonstration framework
node demo-mcp-query.js

// The framework will automatically:
// 1. Spawn the MCP server process
// 2. Send initialization requests
// 3. Execute predefined query scenarios
// 4. Display formatted server responses
```

For programmatic usage within other testing scenarios:

```javascript
const { queryMCPServer } = require('./demo-mcp-query');

// Execute a custom query against the MCP server
const response = await queryMCPServer('custom-query-type', queryParameters);
console.log('Server response:', response);
```

## Testing

No automated tests found. The component serves as a manual testing and demonstration tool for MCP server implementations. Testing is performed through execution of the demonstration scenarios and visual verification of server responses.