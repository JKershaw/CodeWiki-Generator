---
title: Auto-save and draft recovery system
category: concept
sourceFile: public/wiki-editor.js
related: [components/wiki-metadata-management.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>Auto-save and draft recovery system</h1>
<h2>Purpose and Overview</h2>
<p>The auto-save and draft recovery system provides data safety for wiki editors by automatically saving content to browser localStorage and enabling recovery of unsaved changes. This prevents data loss when users navigate away, experience browser crashes, or accidentally close the editor.</p>
<h2>Key Functionality</h2>
<p>The system operates through several key mechanisms:</p>
<ul>
<li><strong>Automatic saving</strong>: Periodically saves editor content and metadata to browser localStorage as backup drafts</li>
<li><strong>Draft recovery</strong>: Checks for existing drafts on page load and offers to restore them with age validation</li>
<li><strong>Change detection</strong>: Monitors both content and metadata changes to determine when auto-saving is needed</li>
<li><strong>Storage management</strong>: Handles localStorage operations with proper error handling and cleanup</li>
</ul>
<p>The system integrates seamlessly with the wiki editor, triggering saves based on user activity and providing visual indicators for unsaved changes. Draft recovery includes validation to ensure drafts aren&#39;t stale or corrupted.</p>
<h2>Relationships</h2>
<p>This system connects to several other components:</p>
<ul>
<li><strong>Wiki editor component</strong>: Integrates with the markdown editor to monitor content changes</li>
<li><strong>[Wiki metadata management](../components/wiki-metadata-management.md)</strong>: Tracks changes in page metadata (title, category, tags) for comprehensive backup</li>
<li><strong>Browser localStorage</strong>: Uses native browser storage for persistent draft management</li>
<li><strong>Wiki save API</strong>: Coordinates with server persistence to clear drafts after successful saves</li>
</ul>
<h2>Usage Example</h2>
<p>The auto-save system operates automatically within the wiki editor context:</p>
<pre><code class="language-javascript">// Auto-save is triggered automatically during editing
// Check for existing drafts on editor initialization
loadFromLocalStorage();

// Manual save operation that clears auto-saved drafts
savePage().then(() =&gt; {
  // Draft is automatically cleared from localStorage after successful save
});

// Auto-save occurs based on detected changes
checkForChanges(); // Detects if content or metadata changed
autoSaveToLocalStorage(); // Saves current state as draft
</code></pre>
<h2>Testing</h2>
<p>No automated tests found for this component. Testing would benefit from coverage of draft recovery scenarios, localStorage error handling, and change detection accuracy.</p>
