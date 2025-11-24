---
title: Model Context Protocol (MCP) Server
category: concept
sourceFile: mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Model Context Protocol (MCP) Server

## Purpose and Overview

The MCP Server implements the JSON-RPC 2.0 protocol over stdio to provide Claude Code with direct access to wiki query capabilities. It establishes a standardized interface that allows AI agents to search documentation, request missing content, and interact with the codebase wiki in real-time.

## Key Functionality

The server provides two primary tools for AI interaction:

- **query_wiki**: Searches wiki content using the WikiResearcher component and returns formatted results optimized for AI consumption
- **request_documentation**: Records requests for missing documentation and queues them for future creation

The MCPServer class handles JSON-RPC communication by routing incoming requests to appropriate handler methods. Wiki search results are formatted into structured markdown that Claude Code can effectively process and understand.

The system also includes metrics and analytics tracking to monitor query patterns, success rates, and identify documentation gaps for continuous improvement.

## Relationships

The MCP Server integrates with several existing components:

- **WikiResearcher**: Uses this component for intelligent context gathering and search functionality
- **Wiki System**: Extends the existing wiki infrastructure with real-time AI query capabilities  
- **Documentation Pipeline**: Complements the generation pipeline by capturing dynamic access patterns and identifying content needs

## Usage Example

```javascript
const MCPServer = require('./mcp-server');

// Initialize the MCP server
const server = new MCPServer();

// The server communicates via stdio using JSON-RPC 2.0
// Example request handling for wiki queries
server.handleRequest({
  "jsonrpc": "2.0",
  "method": "query_wiki",
  "params": { "query": "authentication middleware" },
  "id": 1
});

// Results are formatted for AI consumption
const formattedResponse = server.formatWikiResponse(searchResults);
```

## Testing

No automated tests are currently available for this component. Testing should focus on JSON-RPC communication, wiki integration, and response formatting accuracy.