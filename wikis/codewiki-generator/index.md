---
related: [concepts/context-enriched-documentation-generation.md, concepts/production-ready-server-configuration.md, concepts/real-time-status-monitoring.md, concepts/step-wise-processing-control.md, concepts/test-aware-documentation-generation.md]
updated: 2025-11-23
---

<h1>CodeWiki-Generator Documentation</h1>
<p>CodeWiki-Generator is an intelligent documentation system that automatically generates comprehensive, context-enriched documentation from codebases. It combines automated code analysis with test coverage insights and provides a real-time web dashboard for managing and monitoring the documentation generation process.</p>
<h2>Quick Navigation</h2>
<ul>
<li><strong>New to the project?</strong> Start with <a href="guides/getting-started.md">Getting Started</a></li>
<li><strong>Understanding the vision?</strong> Read <a href="meta/philosophy.md">Core Philosophy &amp; Vision</a></li>
<li><strong>Looking for setup details?</strong> Check <a href="guides/configuration.md">Configuration Guide</a></li>
<li><strong>Understanding the system?</strong> Review <a href="concepts/architecture.md">Architecture Overview</a></li>
<li><strong>Technical requirements?</strong> See <a href="meta/specification.md">Technical Specification</a></li>
</ul>
<h2>Meta (Philosophy &amp; Vision)</h2>
<p>High-level context explaining the "why" behind the project:</p>
<ul>
<li><a href="meta/philosophy.md">Core Philosophy &amp; Vision</a> - The fundamental ideas and philosophy driving this project: <em>"Code tells you what. Documentation tells you why. History tells you how."</em></li>
<li><a href="meta/specification.md">Technical Specification</a> - Comprehensive technical requirements, architecture, and development phases including the MCP server roadmap</li>
</ul>
<h2>History (Project Evolution)</h2>
<p>Historical context showing how the project evolved:</p>
<ul>
<li><a href="history/progress-report.md">Project History and Achievement Analysis</a> - Comprehensive progress report documenting all achievements, current status (87-90% quality rating), and what has been completed across Phases 1-5</li>
</ul>
<h2>Concepts</h2>
<p>Core architectural patterns and design principles behind the documentation system:</p>
<ul>
<li><a href="concepts/architecture.md">Architecture Overview</a> - High-level system design and component relationships</li>
<li><a href="concepts/context-enriched-documentation-generation.md">[Context-enriched Documentation Generation](../concepts/context-enriched-documentation-generation.md)</a> - Intelligent documentation that understands code relationships and context</li>
<li><a href="concepts/production-ready-server-configuration.md">[Production-ready Server Configuration](../concepts/production-ready-server-configuration.md)</a> - Scalable and robust server setup for production environments</li>
<li><a href="concepts/real-time-status-monitoring.md">[Real-time Status Monitoring](../concepts/real-time-status-monitoring.md)</a> - Live tracking and monitoring of documentation generation processes</li>
<li><a href="concepts/step-wise-processing-control.md">[Step-wise Processing Control](../concepts/step-wise-processing-control.md)</a> - Granular control over documentation generation pipeline stages</li>
<li><a href="concepts/test-aware-documentation-generation.md">[Test-aware Documentation Generation](../concepts/test-aware-documentation-generation.md)</a> - Documentation generation that incorporates testing insights</li>
<li><a href="concepts/test-coverage-documentation-system.md">[Test Coverage Documentation System](../concepts/test-coverage-documentation-system.md)</a> - Comprehensive documentation of code test coverage</li>
<li><a href="concepts/test-coverage-integration.md">[Test Coverage Integration](../concepts/test-coverage-integration.md)</a> - Integration patterns for incorporating test metrics</li>
<li><a href="concepts/test-driven-documentation-enrichment.md">[Test-driven Documentation Enrichment](../concepts/test-driven-documentation-enrichment.md)</a> - Using test data to enhance documentation quality</li>
<li><a href="concepts/web-dashboard-architecture.md">[Web Dashboard Architecture](../concepts/web-dashboard-architecture.md)</a> - Design principles for the web-based management interface</li>
</ul>
<h2>Components</h2>
<p>Individual system components and their implementation details:</p>
<ul>
<li><a href="components/dashboard-control-interface.md">[Dashboard Control Interface](../components/dashboard-control-interface.md)</a> - User interface components for dashboard control</li>
<li><a href="components/dashboard-controller.md">[DashboardController](../components/dashboard-controller.md)</a> - Main controller handling dashboard logic and routing</li>
<li><a href="components/express-web-interface-for-documentation-management.md">[Express Web Interface for Documentation Management](../components/express-web-interface-for-documentation-management.md)</a> - Express.js-based web interface for managing documentation workflows</li>
<li><a href="components/source-file-metadata-tracking.md">[Source File Metadata Tracking](../components/source-file-metadata-tracking.md)</a> - System for tracking and managing source file metadata</li>
<li><a href="components/test-coverage-analyzer-class.md">[TestCoverageAnalyzer Class](../components/test-coverage-analyzer-class.md)</a> - Core class responsible for analyzing test coverage data</li>
<li><a href="components/web-dashboard-control-interface.md">[Web Dashboard Control Interface](../components/web-dashboard-control-interface.md)</a> - Web-based interface for controlling dashboard functionality</li>
<li><a href="components/wiki-integration.md">[Wiki Integration](../components/wiki-integration.md)</a> - Components for integrating with wiki systems</li>
</ul>
<h2>Guides</h2>
<p>Practical guides for using and developing with the system:</p>
<ul>
<li><a href="guides/getting-started.md">Getting Started</a> - Quick start guide for new users and developers</li>
<li><a href="guides/configuration.md">Configuration Guide</a> - Detailed configuration options and setup instructions</li>
<li><a href="guides/development-workflow.md">Development Workflow</a> - Best practices and workflows for contributing to the project</li>
<li><a href="guides/testing-approach.md">Testing Approach</a> - Testing strategies and methodologies used in the project</li>
</ul>
<h2>Navigation Tips</h2>
<ul>
<li><strong>Start with WHY</strong>: Read <a href="meta/philosophy.md">Philosophy</a> to understand the vision</li>
<li><strong>Then WHAT</strong>: Browse <strong>Concepts</strong> for theoretical foundations and <strong>Components</strong> for implementation</li>
<li><strong>Then HOW</strong>: Follow <strong>Guides</strong> for hands-on instructions</li>
<li><strong>See progress</strong>: Check <a href="history/progress-report.md">Project History</a> for what's been achieved</li>
<li><strong>Technical details</strong>: Review <a href="meta/specification.md">Technical Specification</a> for requirements and roadmap</li>
</ul>
<h2>Using the /context Command</h2>
<p>This wiki is designed to be searchable via the <code>/context</code> slash command in Claude Code:</p>
<pre><code class="language-bash"># Example: Get context for implementing a new feature
/context implement MCP server for Claude Code integration

# Example: Understand the project philosophy
/context what is the core philosophy of this project?

# Example: Debug an issue
/context fix failing tests in the processor
</code></pre>
<p>The context command searches across all layers (meta, code, history, quality) to provide comprehensive information for your task.</p>
