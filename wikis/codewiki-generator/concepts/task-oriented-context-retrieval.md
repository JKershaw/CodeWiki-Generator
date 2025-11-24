---
title: Task-oriented context retrieval
category: concept
sourceFile: mcp-server.js
related: [concepts/documentation-gap-tracking.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>Task-oriented Context Retrieval</h1>
<h2>Purpose and Overview</h2>
<p>Task-oriented context retrieval provides intelligent documentation gathering based on specific development task types (feature, bug, architectural, onboarding) to optimize AI assistance. It implements the Model Context Protocol (MCP) to enable Claude Code to query the documentation wiki through a standardized JSON-RPC interface over stdio.</p>
<h2>Key Functionality</h2>
<p>The system centers around the <code>MCPServer</code> class which handles JSON-RPC 2.0 communication with Claude Code. Key capabilities include:</p>
<ul>
<li><strong>Intelligent Context Gathering</strong>: The <code>queryWiki</code> function searches for relevant documentation using WikiResearcher based on task descriptions and types</li>
<li><strong>[Documentation Gap Tracking](../concepts/documentation-gap-tracking.md)</strong>: The <code>requestDocumentation</code> function captures missing documentation requests with priority levels for future improvements</li>
<li><strong>Structured Response Formatting</strong>: The <code>formatWikiResponse</code> function converts search results into markdown format optimized for AI consumption</li>
<li><strong>Tool Call Routing</strong>: The <code>handleToolCall</code> function manages MCP protocol requests while tracking metrics and query history</li>
</ul>
<p>The server operates by receiving task descriptions from Claude Code, analyzing the task type, and retrieving the most relevant documentation context from the wiki system.</p>
<h2>Relationships</h2>
<ul>
<li><strong>Integrates with WikiResearcher</strong> for intelligent context gathering and search functionality</li>
<li><strong>Extends the wiki system</strong> by providing an AI-queryable interface layer</li>
<li><strong>Provides feedback mechanism</strong> to improve documentation coverage through gap tracking</li>
<li><strong>Serves as bridge</strong> between Claude Code and the internal documentation system</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">const MCPServer = require(&#39;./mcp-server&#39;);

// Initialize MCP server
const server = new MCPServer();

// Server handles JSON-RPC calls automatically via stdio
// Claude Code can call tools like:
// - queryWiki(taskDescription, taskType)
// - requestDocumentation(topic, priority)
// - formatWikiResponse(searchResults)

// Example tool call handling
server.handleToolCall(&#39;queryWiki&#39;, {
  taskDescription: &#39;implementing user authentication&#39;,
  taskType: &#39;feature&#39;
});
</code></pre>
<h2>Testing</h2>
<p>No automated tests found for this component.</p>
