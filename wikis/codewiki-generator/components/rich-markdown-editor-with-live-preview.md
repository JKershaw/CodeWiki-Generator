---
title: Rich markdown editor with live preview
category: component
sourceFile: public/wiki-editor.js
related: [components/wiki-metadata-management.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>Rich Markdown Editor with Live Preview</h1>
<h2>Purpose and Overview</h2>
<p>The wiki editor provides a complete markdown authoring experience with real-time HTML preview, formatting toolbar, and keyboard shortcuts for creating and editing wiki pages. It includes auto-save functionality and draft recovery to prevent data loss during the editing process.</p>
<h2>Key Functionality</h2>
<p><strong>Markdown Editing &amp; Preview</strong></p>
<ul>
<li>Real-time markdown to HTML conversion using marked.js library</li>
<li>Live preview pane that updates as users type</li>
<li>Split-pane interface showing both raw markdown and rendered output</li>
</ul>
<p><strong>Formatting Tools</strong></p>
<ul>
<li>Interactive toolbar for common markdown formatting (bold, italic, headers, lists)</li>
<li>Keyboard shortcuts for quick text formatting</li>
<li>Smart text insertion that handles selected text and cursor positioning</li>
<li>Line-based formatting for headers and list items</li>
</ul>
<p><strong>Auto-save &amp; Draft Recovery</strong></p>
<ul>
<li>Automatic saving to browser localStorage as users edit</li>
<li>Draft recovery system that restores unsaved work on page reload</li>
<li>Age validation for drafts to prevent stale content restoration</li>
<li>Change detection to track unsaved modifications</li>
</ul>
<p><strong>[Wiki Metadata Management](../components/wiki-metadata-management.md)</strong></p>
<ul>
<li>Structured handling of wiki page properties (title, category, tags)</li>
<li>Metadata validation and change tracking</li>
<li>Integration with wiki organization system</li>
</ul>
<h2>Relationships</h2>
<ul>
<li><strong>Wiki Viewing System</strong>: Integrates with page navigation and viewing components</li>
<li><strong>marked.js Library</strong>: Uses external markdown parser for HTML conversion</li>
<li><strong>Wiki Save API</strong>: Connects to server endpoint for page persistence</li>
<li><strong>Browser localStorage</strong>: Leverages local storage for draft management and auto-save</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">// Initialize editor with existing content
const editor = document.getElementById(&#39;markdown-editor&#39;);
const preview = document.getElementById(&#39;preview-pane&#39;);

// Set up live preview updates
editor.addEventListener(&#39;input&#39;, () =&gt; {
    updatePreview();
    autoSaveToLocalStorage();
});

// Handle toolbar formatting
document.querySelectorAll(&#39;.toolbar-btn&#39;).forEach(btn =&gt; {
    btn.addEventListener(&#39;click&#39;, (e) =&gt; {
        handleToolbarAction(e.target.dataset.action);
    });
});

// Load draft on page init
window.addEventListener(&#39;load&#39;, () =&gt; {
    loadFromLocalStorage();
});
</code></pre>
<h2>Testing</h2>
<p>No automated test coverage is currently available for this component.</p>
