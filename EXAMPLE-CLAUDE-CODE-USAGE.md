# Example: Using MCP Server with Claude Code

This document shows how Claude Code (or any MCP-compatible AI assistant) would interact with the CodeWiki MCP server.

## Scenario: Developer Wants to Add a New Feature

### Step 1: Developer asks Claude Code for help

**Developer**: "I want to add a new agent that generates API documentation. How should I implement this?"

### Step 2: Claude Code queries the MCP server

Claude Code automatically calls the `query_wiki` tool:

```json
{
  "name": "query_wiki",
  "arguments": {
    "query": "How to implement a new agent for documentation generation",
    "taskType": "feature",
    "maxResults": 5
  }
}
```

### Step 3: MCP server returns relevant context

The server searches the wiki and returns:

```
# Wiki Context for: "How to implement a new agent for documentation generation"

## Summary
Found 5 relevant wiki pages.

## Relevant Documentation

### Architecture Overview
**Path**: `concepts/architecture.md`
**Category**: concept
System architecture showing agent-based design...

### Agent System
**Path**: `components/agents-component.md`
**Category**: component
Details on how agents are structured and integrated...

### Development Workflow
**Path**: `guides/development-workflow.md`
**Category**: guide
Step-by-step guide for adding new features...

## Related Keywords
implement, agent, documentation, generation

## Related Source Files
- lib/agents/code-analysis-agent.js
- lib/agents/documentation-writer-agent.js
- lib/processor.js
```

### Step 4: Claude Code uses context to provide informed answer

**Claude Code**: "Based on the wiki documentation, here's how to implement a new agent:

1. **Create agent class** in `lib/agents/api-documentation-agent.js`
   - Follow the pattern used in `code-analysis-agent.js`
   - Extend the base agent pattern
   - Implement `processFile()` and `generatePrompt()` methods

2. **Register agent** in `lib/processor.js`
   - Add to agent initialization
   - Define when agent should be triggered

3. **Add tests** in `tests/unit/agents/`
   - Use mocks for LLM calls (see existing agent tests)

4. **Update prompts** in `lib/prompts/`
   - Create specialized prompt for API documentation

Let me help you implement this step by step..."

## Scenario: Understanding Existing Code

### Developer asks

**Developer**: "How does the cross-page linking system work?"

### Claude Code queries

```json
{
  "name": "query_wiki",
  "arguments": {
    "query": "cross-page linking system implementation",
    "taskType": "architectural",
    "maxResults": 5
  }
}
```

### MCP server responds

```
# Wiki Context for: "cross-page linking system implementation"

## Relevant Documentation

### Bidirectional wiki linking system
**Path**: `concepts/bidirectional-wiki-linking-system.md`
Explains the concept of automatic link discovery...

### Link Discovery Agent
**Path**: `components/link-discovery-agent.md`
Implementation details of the agent that finds and injects links...
```

### Claude Code explains

**Claude Code**: "The cross-page linking system uses the LinkDiscoveryAgent to:

1. Scan wiki pages for bold mentions (e.g., **Component Name**)
2. Match mentions to actual page titles
3. Inject hyperlinks automatically
4. Track bidirectional relationships

The implementation is in `lib/agents/link-discovery-agent.js`. Here's how it works..."

## Scenario: Finding Missing Documentation

### Developer encounters undocumented area

**Developer**: "I need documentation on error handling patterns in agents"

### Claude Code queries but finds nothing

The query returns 0 results, so Claude Code automatically:

```json
{
  "name": "request_documentation",
  "arguments": {
    "topic": "Error handling patterns in agents",
    "reason": "Developer needs guidance on implementing robust error handling",
    "priority": "medium"
  }
}
```

### MCP server queues the request

The request is saved to `mcp-metrics.json` for the documentation team to review.

**Claude Code**: "I couldn't find specific documentation on error handling patterns in agents. I've submitted a request for this documentation. In the meantime, let me analyze the existing agent implementations to show you the current patterns..."

## Benefits of MCP Integration

1. **Contextual Help**: Claude Code has access to your project-specific documentation
2. **Accurate Guidance**: Responses based on actual architecture, not assumptions
3. **Discovery**: Finds documentation you might not know exists
4. **Feedback Loop**: Identifies documentation gaps through request tracking
5. **Efficient**: No need to manually search through documentation

## Metrics Dashboard

The MCP server tracks usage:

```json
{
  "totalQueries": 47,
  "successfulQueries": 43,
  "failedQueries": 4,
  "missingDocRequests": [
    {
      "topic": "Error handling patterns in agents",
      "priority": "medium",
      "timestamp": "2025-11-23T20:30:00.000Z"
    }
  ],
  "recentQueries": [
    {
      "tool": "query_wiki",
      "query": "How to implement a new agent",
      "success": true,
      "timestamp": "2025-11-23T20:29:45.123Z"
    }
  ]
}
```

This helps you understand:
- What documentation is most useful
- What's missing
- How developers are using AI assistance

## Configuration in Claude Code

Add to your Claude Code configuration:

```json
{
  "mcpServers": {
    "codewiki": {
      "command": "node",
      "args": [
        "/absolute/path/to/CodeWiki-Generator/mcp-server.js",
        "--wiki",
        "/absolute/path/to/your-project/wiki"
      ],
      "cwd": "/absolute/path/to/CodeWiki-Generator"
    }
  }
}
```

Now Claude Code can intelligently assist with your codebase using your generated documentation!
