---
title: Overview
category: meta
sourceFile: README.md
created: 2025-11-24
updated: 2025-11-24
related: [meta/philosophy.md]
---

# CodeWiki Generator Overview

An intelligent documentation automation system that analyzes software repositories and generates comprehensive wiki-style documentation using Large Language Model (LLM) agents.

## Core Philosophy

**Code tells you what. Documentation tells you why. History tells you how.**

CodeWiki Generator automatically analyzes your codebase, discovers architectural patterns, and produces structured markdown documentation organized into concepts, components, and guides. The system practices **wiki-driven development**: each feature is validated by running the generator on its own codebase and reading the generated documentation. The quality of the auto-generated wiki serves as proof that the system works.

## Key Capabilities

- **AI-Powered Analysis**: Uses Claude Sonnet 4.5 to analyze code and generate clear, insightful documentation
- **Specialized Agent System**: Dedicated agents for code analysis, documentation writing, architecture overview, and guide generation
- **Cross-Page Linking**: Automatic hyperlink discovery and injection for seamless navigation
- **Category-Based Organization**: Documents organized into concepts/, components/, and guides/
- **Repository Fingerprinting**: Analyzes repository structure to guide documentation generation
- **Resilient LLM Parsing**: Progressive JSON repair for handling unreliable LLM outputs
- **Self-Documenting**: The system successfully documents its own architecture (meta-validation)
- **Comprehensive Testing**: 220+ passing tests with comprehensive coverage
- **MCP Server Integration**: Claude Code and other AI tools access documentation via Model Context Protocol

## Current Status

**Production-Ready Core | 87% Quality | 18 Pages Generated**

The system has successfully documented itself:

- **9 concepts** capturing architectural patterns and design decisions
- **4 components** documenting implementation modules
- **4 guides** providing operational documentation
- **1 auto-generated index** for navigation

### Quality Metrics

- **Overall**: 87% (Grade A)
- **Navigation**: 90% (cross-page linking effectiveness)
- **Completeness**: 85% (all major components documented)
- **Usability**: 88% (immediately actionable Getting Started guide)

See WIKI_COMPARISON_ASSESSMENT.md for detailed quality analysis comparing auto-generated versus manual documentation.

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

- **Processor**: Orchestrates analysis and documentation generation
- **ArchitectureOverviewAgent**: Synthesizes high-level architectural insights
- **CodeAnalysisAgent**: Analyzes code structure and patterns
- **DocumentationWriterAgent**: Generates markdown with code examples
- **GuideGenerationAgent**: Creates operational guides
- **LinkDiscoveryAgent**: Discovers and injects cross-page hyperlinks
- **WikiManager**: See [[wiki-markdown-management-system]] for file operations
- **WikiIndexAgent**: Generates navigation structure

## Quick Start

### Installation

```bash
git clone <repository-url>
cd CodeWiki-Generator
npm install
npm test
```

### Generate Wiki for Your Project

```bash
# Run the wiki generator
node generate-self-wiki.js

# Or use programmatically
const Processor = require('./lib/processor');
const processor = new Processor('./output-wiki');
await processor.processRepository('https://github.com/owner/repo');
```

### Explore Generated Documentation

```bash
ls -la wiki/
# Key pages:
# - wiki/guides/getting-started.md - Setup and usage guide
# - wiki/concepts/architecture.md - System design overview
# - wiki/index.md - Navigation hub
```

## MCP Server Integration

The Model Context Protocol server enables AI assistants like Claude Code to query generated wiki documentation for context while developing.

### Starting the Server

```bash
npm run mcp-server
# Or with custom path
node mcp-server.js --wiki ./wikis/your-project
```

### Available Tools

1. **query_wiki**: Search documentation with intelligent context gathering
   - Example: "How do I implement authentication?"

2. **request_documentation**: Queue documentation for topics not yet covered
   - Tracks priorities and documentation gaps
   - Generates metrics for missing content

### Claude Code Configuration

```json
{
  "mcpServers": {
    "codewiki": {
      "command": "node",
      "args": ["/path/to/CodeWiki-Generator/mcp-server.js"],
      "cwd": "/path/to/CodeWiki-Generator"
    }
  }
}
```

## How It Works

1. **Repository Analysis**: Fingerprints repository structure and patterns
2. **Agent Dispatch**: Routes analysis to specialized LLM agents
3. **Content Generation**: Each agent generates documentation for its domain
4. **Quality Assurance**: Progressive JSON repair and response validation
5. **Assembly**: Organizes content into category-based structure
6. **Linking**: Discovers mentions and injects cross-page hyperlinks
7. **Index Generation**: Creates navigable table of contents

## Documentation Quality

Auto-generated wiki achieves **87% quality** compared to manually-written documentation.

### Strengths

- Explains design rationale and trade-offs (often better than manual documentation)
- Comprehensive cross-page navigation with automatic hyperlinking
- Coherent narrative explaining system architecture
- Immediately useful Getting Started guide

### Current Limitations

- Code examples extracted from tests (implementation pending regeneration)
- Test coverage statistics not yet documented
- Some component relationships could be more detailed

## Prerequisites

- **Node.js** 24.x or higher
- **Anthropic API key** (for production use; not required for tests)
- **Git** (for repository analysis)

### Environment Setup

```bash
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=your_key_here
```

Note: API keys are NOT required for running tests. All tests use mocks to avoid API costs.

## Testing

```bash
# Run full test suite (220+ tests)
npm test

# Watch mode
npm test:watch
```

All tests use mocks — no API costs incurred. Coverage includes unit tests for all agents and core components, plus integration tests for complete workflows.

## Cost Estimation

- Processing ~100 commits: $3-$5 (with Claude Sonnet 4.5)
- Average per commit: $0.03-$0.05
- Self-documentation of this repository: ~$1-$2

## Project Roadmap

**✅ Phase 1-3**: Core infrastructure, AI agent system, processing engine
**✅ Phase 5**: Cross-page linking, code examples, error handling
**✅ Phase 6**: MCP server with Claude Code integration and metrics tracking
**⏸️ Phase 4**: Web dashboard interface (next priority)

### Immediate Next Steps

- Add code examples to component pages (+2.5 quality points)
- Add file path references (+1 quality point)
- Generate fresh wiki to validate improvements
- Test coverage extraction and documentation
- Configuration system for customization
- Enhanced component relationship mapping

## Cost of Operation

This project demonstrates economical documentation generation:

- Low per-commit cost ($0.03-$0.05) makes continuous documentation practical
- Batch processing repositories with 100+ commits typically costs $3-$5
- Total cost scales linearly with repository size and complexity

## Development Notes

**The quality of our self-generated documentation validates the quality of the system itself.** If the auto-generated wiki for CodeWiki Generator itself is unclear or incomplete, we improve the documentation system rather than manually fixing the output.

This approach ensures the tool produces consistently high-quality documentation without manual intervention or cherry-picking.

---

**Self-Validation**: This system has successfully documented its own architecture. The auto-generated wiki in `wiki/` serves as proof of concept and ongoing validation that the system works as described.