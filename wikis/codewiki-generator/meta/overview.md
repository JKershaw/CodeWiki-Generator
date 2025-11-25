---
title: Overview
category: meta
sourceFile: README.md
created: 2025-11-24
updated: 2025-11-25
related: [components/architecture-overview-agent.md, meta/philosophy.md, components/cross-page-link-discovery-system.md]
---

# CodeWiki Generator Overview

An intelligent documentation automation system that analyzes software repositories and generates comprehensive wiki-style documentation using Large Language Model (LLM) agents.

## Core Philosophy

**Code tells you what. Documentation tells you why. History tells you how.**

CodeWiki Generator automatically analyzes your codebase, discovers architectural patterns, and produces structured markdown documentation organized into concepts, components, and guides. The system practices wiki-driven development: build features, generate documentation for the codebase itself, read the generated docs, and use them to validate and improve the system iteratively.

## Key Features

- **AI-Powered Documentation** - Uses Claude Sonnet 4.5 to analyze code and generate clear, insightful documentation
- **Specialized Agent System** - Dedicated agents for code analysis, documentation writing, architecture overview, and guide generation (see [[Agent-Based Documentation Generation]])
- **Cross-Page Linking** - Automatic hyperlink discovery and injection for seamless navigation
- **Category-Based Organization** - Documents organized into concepts, components, and guides (see [[Category-Based Documentation Organization]])
- **Repository Fingerprinting** - Analyzes repository structure to guide documentation generation
- **Resilient LLM Parsing** - Progressive JSON repair for handling unreliable LLM outputs (see [[Resilient JSON Parsing in Agent Processing]])
- **Self-Documenting** - Successfully documents its own architecture (meta-validation)
- **Test-Driven Development** - 220+ passing tests with comprehensive coverage
- **MCP Server** - Integration with Claude Code and other AI tools via Model Context Protocol

## Current Status

**Production-Ready Core | 87% Quality | 18 Pages Generated**

The system has successfully documented itself:
- **9 concepts** documenting architectural patterns and design decisions
- **4 components** describing implementation modules
- **4 guides** providing operational documentation
- **1 auto-generated index** for navigation

### Quality Metrics

From self-documentation analysis:
- **Overall**: 87% (Grade A)
- **Navigation**: 90% - cross-page linking effectiveness
- **Completeness**: 85% - all major components documented
- **Usability**: 88% - immediately actionable Getting Started guide

**Strengths**:
- Explains design rationale and trade-offs better than manual documentation
- Comprehensive cross-page navigation with automatic hyperlinking
- Coherent narrative explaining system architecture
- Immediately useful Getting Started guide

**Areas for Enhancement**:
- Code examples extracted from tests (implemented, pending regeneration)
- Test coverage statistics not yet fully documented
- Some component relationships could be more detailed

## System Architecture

The system follows an **architecture synthesis agent pattern** where specialized LLM agents collaborate:

```
Repository → Fingerprinting → Agent Dispatch → Documentation Assembly
                                     ↓
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
    ArchitectureOverviewAgent  CodeAnalysisAgent  GuideGenerationAgent
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ↓
                           JSON Response Cleaning
                                    ↓
                      Category-Based Content Organization
                                    ↓
                        Wiki Index with Auto-Navigation
                                    ↓
                           Markdown Documentation
```

### Core Components

- **Processor** - Orchestrates analysis and documentation generation
- **ArchitectureOverviewAgent** - Synthesizes high-level architectural insights
- **CodeAnalysisAgent** - Analyzes code structure and patterns
- **DocumentationWriterAgent** - Generates markdown with code examples
- **GuideGenerationAgent** - Creates operational guides
- **LinkDiscoveryAgent** - Discovers and injects cross-page hyperlinks
- **WikiManager** - Handles markdown file operations and frontmatter parsing
- **WikiIndexAgent** - Generates navigation structure

For comprehensive architecture details, see [[Architecture]].

## How It Works

1. **Repository Analysis** - Fingerprints repository structure and architectural patterns
2. **Agent Dispatch** - Routes analysis to specialized LLM agents
3. **Content Generation** - Each agent generates documentation for its domain
4. **Quality Assurance** - Progressive JSON repair and response validation (see [[JSON Repair Validation Verification]])
5. **Assembly** - Organizes content into category-based structure
6. **Linking** - Discovers mentions and injects cross-page hyperlinks (see [[Automatic Link Discovery and Suggestion System]])
7. **Index Generation** - Creates navigable table of contents

## MCP Server Integration

The MCP (Model Context Protocol) server enables AI assistants like Claude Code to query your generated wiki documentation for context while developing.

### Available Tools

1. **query_wiki** - Search the wiki for relevant documentation
   - Provides intelligent context gathering based on task descriptions
   - Returns relevant wiki pages with summaries and links

2. **request_documentation** - Request missing documentation
   - Queues documentation requests for topics not yet covered
   - Tracks priorities and reasons for documentation needs

### Starting the Server

```bash
npm run mcp-server
# Or with custom wiki path
node mcp-server.js --wiki ./wikis/your-project
```

Configure Claude Code to connect for intelligent wiki queries during development.

## Getting Started

### Prerequisites

- Node.js 24.x or higher (tested on 22.x with warnings)
- Anthropic API key (for production use; not required for tests)
- Git (for repository analysis)

### Quick Start

```bash
# Installation
git clone <repository-url>
cd CodeWiki-Generator
npm install
npm test

# View the generated wiki
ls -la wiki/

# Generate wiki for your project
node generate-self-wiki.js

# Or programmatically
const Processor = require('./lib/processor');
const processor = new Processor('./output-wiki');
await processor.processRepository('https://github.com/owner/repo');
```

See [[Getting Started]] for detailed setup instructions.

## Cost Profile

- Processing ~100 commits: $3-$5 (with Claude Sonnet 4.5)
- Average per commit: $0.03-$0.05
- This repository (self-documentation): ~$1-$2

## Development Philosophy

**Wiki-Driven Development Cycle:**

1. Build a feature
2. Run the wiki generator on the codebase
3. Read the generated documentation
4. If unclear, improve the documentation system
5. Proceed to next feature

This approach ensures that the quality of self-generated documentation validates the quality of the system itself. The system's ability to document its own architecture serves as continuous proof of functionality.

## Testing

- Full test suite: 220+ tests, all passing
- Watch mode for development: `npm test:watch`
- All tests use mocks—no API costs incurred
- Comprehensive coverage including unit, integration, and self-validation tests

## Project Roadmap

**✅ Phase 1** - Core Infrastructure (WikiManager, StateManager, GitHub Integration)

**✅ Phase 2** - AI Agent System (all specialized agents implemented)

**✅ Phase 3** - Processing Engine (repository processing, state persistence)

**✅ Phase 5** - Integration & Polish (cross-page linking, code examples, error handling)

**✅ Phase 6** - MCP Server (complete, with Claude Code integration and metrics tracking)

**⏸️ Phase 4** - Web Interface (dashboard, WebSocket updates, live preview) — Next priority

## Next Steps

**Immediate** (< 4 hours):
- Add code examples to component pages
- Add file path references
- Generate fresh wiki to validate improvements

**Medium-Term** (4-8 hours):
- Test coverage extraction and documentation
- Configuration system for customization
- Enhanced component relationship mapping

**Long-Term** (8+ hours):
- Web dashboard interface (Phase 4)
- Incremental update mode (process only new commits)
- Enhanced MCP server features and advanced metrics

## Validation & Evidence

This README describes a system that has successfully documented its own architecture at 87% quality. The auto-generated wiki in the `wiki/` directory serves as proof that the system works as described. See [[WIKI Comparison Assessment]] for detailed quality analysis comparing auto-generated versus manually-written documentation.

See also:
- [[Architecture]] - System design with implementation rationale
- [[Getting Started]] - Quick start and usage guide
- [[Multi-Agent Documentation Generation Architecture]] - Agent collaboration patterns
- [[Category-Based Documentation Organization]] - Content structure approach