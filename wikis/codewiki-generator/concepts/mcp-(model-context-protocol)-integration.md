---
title: MCP (Model Context Protocol) integration
category: concept
sourceFile: mcp-server.js
related: [concepts/task-oriented-context-retrieval.md, concepts/documentation-gap-tracking.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>MCP (Model Context Protocol) integration</h1>
<h2>Purpose and Overview</h2>
<p>The MCP server provides a standardized JSON-RPC 2.0 interface over stdio that enables Claude Code to query the generated documentation wiki. This integration creates a bridge between AI development tools and the codebase documentation, allowing for intelligent context retrieval during coding tasks.</p>
<h2>Key Functionality</h2>
<p>The MCP server implements several core capabilities:</p>
<ul>
<li><strong>[Task-oriented context retrieval](../concepts/task-oriented-context-retrieval.md)</strong> - Intelligently gathers relevant documentation based on task types (feature, bug, architectural, onboarding) to provide optimized AI assistance</li>
<li><strong>Wiki querying</strong> - Searches the documentation wiki using WikiResearcher to find relevant context based on task descriptions</li>
<li><strong>[Documentation gap tracking](../concepts/documentation-gap-tracking.md)</strong> - Records requests for missing documentation with priority levels, creating a feedback loop to improve wiki coverage over time</li>
<li><strong>JSON-RPC communication</strong> - Handles protocol communication with Claude Code through standardized tool calls and responses</li>
</ul>
<p>The server routes tool calls through <code>handleToolCall</code>, which maintains metrics and query history while directing requests to appropriate handlers like <code>queryWiki</code> and <code>requestDocumentation</code>.</p>
<h2>Relationships</h2>
<p>The MCP server acts as an integration layer that:</p>
<ul>
<li><strong>Integrates with WikiResearcher</strong> for intelligent context gathering and search functionality</li>
<li><strong>Extends the wiki system</strong> by providing an AI-queryable interface on top of existing documentation</li>
<li><strong>Provides feedback mechanism</strong> to improve documentation coverage by tracking what information AI tools need but cannot find</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">const MCPServer = require(&#39;./mcp-server.js&#39;);

// Initialize MCP server
const server = new MCPServer();

// Example tool call handling (internal server operation)
const toolCall = {
  name: &#39;queryWiki&#39;,
  arguments: {
    query: &#39;authentication middleware&#39;,
    taskType: &#39;feature&#39;
  }
};

const response = server.handleToolCall(toolCall);
const formattedResult = server.formatWikiResponse(response);
</code></pre>
<h2>Testing</h2>
<p>No automated tests found for this component.</p>
