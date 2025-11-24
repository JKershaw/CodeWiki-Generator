---
title: File-based comment system
category: concept
sourceFile: lib/comments-manager.js
related: [components/comments-manager-class.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>File-based Comment System</h1>
<h2>Purpose and Overview</h2>
<p>The File-based Comment System provides collaborative commenting functionality for wiki pages without requiring a database. Comments are stored as JSON files within project directories, enabling persistent discussion threads organized by page with features like resolution tracking and comment moderation.</p>
<h2>Key Functionality</h2>
<p>The [CommentsManager class](../components/comments-manager-class.md) handles all comment operations through file-based persistence:</p>
<ul>
<li><strong>Comment Storage</strong>: Stores comments as JSON files in the project directory structure</li>
<li><strong>Page Organization</strong>: Groups comments by pageId for targeted discussions on specific wiki content</li>
<li><strong>CRUD Operations</strong>: Full create, read, update, delete functionality for comment management</li>
<li><strong>Resolution Tracking</strong>: Marks comments as resolved/unresolved for workflow management</li>
<li><strong>Statistics</strong>: Provides analytics on comment counts, resolution rates, and per-page distribution</li>
<li><strong>Unique Identification</strong>: Generates timestamp-based IDs for reliable comment tracking</li>
</ul>
<p>Each comment includes metadata such as author, timestamp, content, and resolution status. The system handles missing files gracefully and ensures proper directory structure creation.</p>
<h2>Relationships</h2>
<ul>
<li>Integrates seamlessly with existing wiki project structure by storing comments alongside wiki content</li>
<li>Supports dashboard enhancement features for collaborative editing workflows</li>
<li>Provides foundation for team-based wiki editing and review processes</li>
<li>Works within the broader wiki system without external dependencies</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">const CommentsManager = require(&#39;./lib/comments-manager&#39;);

// Initialize with wiki base directory
const commentsManager = new CommentsManager(&#39;./wikis&#39;);
const pageId = &#39;concepts/architecture.md&#39;;
const project = &#39;test-project&#39;;

// Add a new comment
await commentsManager.addComment(project, pageId, &#39;Alice&#39;, &#39;Great explanation of the architecture!&#39;);

// Retrieve comments for a page
const comments = await commentsManager.getComments(project, pageId);

// Resolve a comment thread
await commentsManager.resolveComment(project, &#39;comment_1&#39;, true);

// Get project statistics
const stats = await commentsManager.getStatistics(project);
</code></pre>
<h2>Testing</h2>
<p><strong>Test Coverage</strong>: tests/unit/comments-manager.test.js</p>
<ul>
<li>12 test cases across 7 test suites</li>
<li>Comprehensive coverage including: CommentsManager initialization, getComments, addComment, updateComment, deleteComment, resolveComment, and getStatistics functionality</li>
<li>Tests validate file-based persistence, error handling, and comment metadata management</li>
</ul>
