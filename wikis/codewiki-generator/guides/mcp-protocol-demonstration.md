---
title: MCP protocol demonstration
category: guide
sourceFile: demo-mcp-query.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# MCP Protocol Demonstration

## Purpose and Overview

This is a demonstration script that shows how to interact with MCP (Model Context Protocol) servers using the JSON-RPC protocol. It serves as both a testing tool and an educational example of MCP client-server communication patterns.

## Key Functionality

The demo script implements a programmatic MCP client that:

- **Spawns MCP server processes** - Launches the target MCP server as a child process
- **Handles protocol initialization** - Sends required initialization requests following MCP protocol flow
- **Executes queries** - Demonstrates different use cases by sending tool invocation requests
- **Formats responses** - Displays server responses in a readable format for demonstration purposes
- **Manages process lifecycle** - Properly starts and terminates the MCP server process

The core functionality is built around two main functions:
- `queryMCPServer()` - Manages the complete client-server interaction lifecycle
- `main()` - Orchestrates demo scenarios showing various query patterns

## Relationships

- **Depends on**: `mcp-server.js` as the target MCP server implementation
- **Demonstrates**: The `query_wiki` tool functionality and JSON-RPC communication patterns
- **Serves as**: A reference implementation for building MCP clients and testing MCP servers

## Usage Example

```javascript
// Run the demo script directly
node demo-mcp-query.js

// The script demonstrates various query patterns:
// - Basic wiki queries
// - Different search parameters
// - Response handling and formatting
```

The demo executes predefined queries against the MCP wiki server, showing the complete request-response cycle including:
- Server process initialization
- MCP protocol handshake
- Tool invocation with the `query_wiki` functionality
- Response processing and display

## Testing

No automated tests found. This script serves as a manual testing and demonstration tool for MCP protocol implementation.