---
title: Wiki-to-AI Query Bridge
category: component
sourceFile: mcp-server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki-to-AI Query Bridge

## Purpose and Overview

The Wiki-to-AI Query Bridge enables AI development tools like Claude Code to query the generated codebase documentation through the Model Context Protocol (MCP). It serves as a JSON-RPC 2.0 server that translates natural language development queries into structured wiki searches and formats results for AI consumption.

## Key Functionality

The bridge provides several core capabilities:

- **Intelligent Wiki Querying**: Uses WikiResearcher to search documentation based on natural language queries and task types
- **AI-Optimized Response Formatting**: Structures search results into markdown format optimized for AI tools
- **Documentation Gap Tracking**: Captures requests for missing documentation and prioritizes them for future wiki updates
- **MCP Protocol Compliance**: Implements standardized JSON-RPC interface for seamless integration with AI development environments

The server routes incoming tool calls to appropriate wiki operations, leveraging the existing WikiManager for page access and resource listing while extending the wiki system with external API capabilities.

## Relationships

The Wiki-to-AI Query Bridge integrates with several system components:

- **WikiResearcher**: Provides intelligent context gathering and semantic search capabilities
- **WikiManager**: Handles page access, resource listing, and content management
- **Claude Code IDE**: Connects through MCP protocol for real-time documentation queries
- **Documentation Gap Tracking**: Feeds back into the wiki generation process for continuous improvement

## Usage Example

```javascript
const MCPServer = require('./mcp-server');

// Initialize MCP server
const server = new MCPServer();

// Query wiki through MCP tool call
const toolCall = {
  name: 'queryWiki',
  arguments: {
    query: 'How does authentication work in this codebase?',
    taskType: 'implementation'
  }
};

const response = await server.handleToolCall(toolCall);
// Returns formatted wiki results for AI consumption

// Request missing documentation
const docRequest = {
  name: 'requestDocumentation',
  arguments: {
    topic: 'API rate limiting implementation',
    priority: 'high'
  }
};

await server.handleToolCall(docRequest);
```

## Testing

No automated test coverage is currently available for this component. Testing should focus on MCP protocol compliance, wiki query accuracy, and proper response formatting for AI tools.