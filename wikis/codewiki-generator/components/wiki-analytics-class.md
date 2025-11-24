---
title: WikiAnalytics class
category: component
sourceFile: lib/wiki-analytics.js
related: [components/link-graph-analysis.md]
created: 2025-11-24
updated: 2025-11-24
---

<h1>WikiAnalytics Class</h1>
<h2>Purpose and Overview</h2>
<p>The WikiAnalytics class provides comprehensive statistical analysis and health metrics for wiki documentation systems. It analyzes wiki content to generate insights about page connectivity, content quality, orphaned pages, dead links, and overall documentation health patterns.</p>
<h2>Key Functionality</h2>
<p>The WikiAnalytics class offers several core analytical capabilities:</p>
<ul>
<li><strong>Comprehensive Wiki Analysis</strong>: Generates complete analytics data including statistics and individual page metrics through the <code>analyzeWiki()</code> method</li>
<li><strong>[Link Graph Analysis](../components/link-graph-analysis.md)</strong>: Identifies orphaned pages (pages with no incoming links) and dead links (links pointing to non-existent pages)</li>
<li><strong>Content Statistics</strong>: Calculates aggregate metrics including category counts, tag usage, link relationships, and content distribution</li>
<li><strong>Page-Level Metrics</strong>: Provides detailed metrics for individual pages including word count, internal/external links, and heading structure</li>
<li><strong>Temporal Analysis</strong>: Tracks update frequency patterns by month to understand documentation maintenance cycles</li>
<li><strong>Link Processing</strong>: Parses and normalizes both markdown and HTML links for accurate relationship mapping</li>
</ul>
<p>The system uses sophisticated link analysis to build connectivity maps between wiki pages, enabling identification of documentation gaps and structural issues.</p>
<h2>Relationships</h2>
<ul>
<li><strong>Depends on WikiManager</strong>: Utilizes WikiManager for accessing and retrieving page data from the wiki system</li>
<li><strong>Extends Wiki System</strong>: Adds analytical layer on top of existing wiki infrastructure without modifying core functionality  </li>
<li><strong>Supports Dashboard Enhancement</strong>: Provides structured data that can be consumed by dashboard interfaces for visualization and monitoring</li>
</ul>
<h2>Usage Example</h2>
<pre><code class="language-javascript">const WikiAnalytics = require(&#39;./lib/wiki-analytics&#39;);

// Initialize analytics engine
const analytics = new WikiAnalytics(wikiManager);

// Generate comprehensive analytics report
const report = await analytics.analyzeWiki(projectPath);

// Access aggregate statistics
const stats = analytics.getStatistics(pages);
console.log(`Orphaned pages: ${stats.orphanedPages.length}`);
console.log(`Dead links: ${stats.deadLinks.length}`);

// Get detailed metrics for specific pages
const pageMetrics = analytics.getPageMetrics(pages);
</code></pre>
<h2>Testing</h2>
<p>No automated tests found for this component. Testing coverage should be implemented to ensure reliable analytics data generation and link analysis accuracy.</p>
