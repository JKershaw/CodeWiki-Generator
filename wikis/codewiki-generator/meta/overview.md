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

CodeWiki Generator automatically analyzes your codebase, discovers architectural patterns, and produces structured markdown documentation organized into concepts, components, and guides. The system practices wiki-driven development—building features and then validating the documentation system by documenting itself.

## Key Capabilities

- **AI-Powered Analysis**: Uses Claude Sonnet 4.5 to analyze code and generate clear, insightful documentation
- **Specialized Agent System**: Dedicated agents for code analysis, documentation writing, architecture overview, and guide generation
- **Cross-Page Linking**: Automatic hyperlink discovery and injection for seamless navigation
- **Category-Based Organization**: Documents organized into concepts/, components/, and guides/
- **Repository Fingerprinting**: Analyzes repository structure to guide documentation generation
- **Resilient LLM Parsing**: Progressive JSON repair for handling unreliable LLM outputs
- **Self-Documenting**: The system successfully documents its own architecture (meta-validation)
- **Test-Driven Development**: 220+ passing tests with comprehensive coverage
- **MCP Server Integration**: Claude Code and other AI tools via Model Context Protocol

## Production Status

**🎯 Production-Ready Core | 87% Quality | 18 Pages Generated**

The system has successfully validated itself through self-documentation:

- **9 concepts** documenting architectural patterns and design decisions
- **4 components** covering implementation modules
- **4 guides** providing operational documentation
- **1 index** with auto-generated navigation

### Quality Metrics

- **Overall**: 87% (Grade A) — achieves parity with manually-written documentation
- **Navigation**: 90% — comprehensive cross-page linking
- **Completeness**: 85% — all major components documented
- **Usability**: 88% — immediately actionable Getting Started guide

See the original [[WIKI_COMPARISON_ASSESSMENT.md]] for detailed quality analysis comparing auto-generated vs manual documentation.

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

- **[[Processor]]** — Orchestrates analysis and documentation generation
- **[[ArchitectureOverviewAgent]]** — Synthesizes high-level architectural insights
- **[[CodeAnalysisAgent]]** — Analyzes code structure and patterns
- **[[DocumentationWriterAgent]]** — Generates markdown with code examples
- **[[GuideGenerationAgent]]** — Creates operational guides
- **[[LinkDiscoveryAgent]]** — Discovers and injects cross-page hyperlinks
- **[[WikiManager]]** — Handles markdown file operations
- **[[WikiIndexAgent]]** — Generates navigation structure

For comprehensive architecture documentation, see [[concepts/architecture.md]].

## How It Works

1. **Repository Analysis**: Fingerprints repository structure and patterns
2. **Agent Dispatch**: Routes analysis to specialized LLM agents
3. **Content Generation**: Each agent generates documentation for its domain
4. **Quality Assurance**: Progressive JSON repair and response validation
5. **Assembly**: Organizes content into category-based structure
6. **Linking**: Discovers mentions and injects cross-page hyperlinks
7. **Index Generation**: Creates navigable table of contents

## Getting Started

### Installation

```bash
git clone <repository-url>
cd CodeWiki-Generator
npm install
npm test
```

### Explore the Generated Wiki

```bash
ls -la wiki/
# Key pages:
# - wiki/guides/getting-started.md - Setup and usage guide
# - wiki/concepts/architecture.md - System design overview
# - wiki/index.md - Navigation hub
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

See [[guides/getting-started.md]] for detailed setup instructions.

## MCP Server Integration

The MCP (Model Context Protocol) server enables AI assistants like Claude Code to query your generated wiki documentation for context while developing.

### Starting the Server

```bash
npm run mcp-server
# Or with custom wiki path
node mcp-server.js --wiki ./wikis/your-project
```

### Available Tools

**query_wiki**: Search the wiki for relevant documentation
- Provides intelligent context gathering based on task descriptions
- Returns relevant wiki pages with summaries and links
- Example: "How do I implement authentication?"

**request_documentation**: Request missing documentation
- Queues documentation requests for topics not yet covered
- Tracks priorities and reasons for documentation needs
- Generates metrics for documentation gaps

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

## Prerequisites

- **Node.js** 24.x or higher (tested on 22.x with warnings)
- **Anthropic API key** (for production use; not required for tests)
- **Git** (for repository analysis)

### Environment Setup

```bash
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=your_key_here
```

**Note**: API keys are NOT required for running tests. All tests use mocks to avoid API costs.

## Testing

```bash
npm test              # Run full test suite (220+ tests)
npm test:watch       # Watch mode for development
```

All tests use mocks—no API costs incurred.

## Documentation Quality Strengths

- ✅ Explains design rationale and trade-offs (better than typical manual wiki)
- ✅ Cross-page navigation with automatic hyperlinking
- ✅ Coherent narrative explaining system architecture
- ✅ Immediately useful Getting Started guide

### Known Limitations

- ⚠️ Code examples extracted from tests (implemented, awaiting regeneration)
- ⚠️ Test coverage statistics not yet documented
- ⚠️ Some component relationships could be more detailed

## Cost Efficiency

- Processing ~100 commits: $3–$5 (with Claude Sonnet 4.5)
- Average per commit: $0.03–$0.05
- This repository (self-documentation): ~$1–$2

## Development Philosophy

This project practices **wiki-driven development**:

1. Build a feature
2. Run the wiki generator on this codebase
3. Read the generated documentation
4. If unclear, improve the documentation system
5. Proceed to next feature

**The quality of auto-generated documentation validates the quality of the system itself.**

## Roadmap

**✅ Complete**
- Phase 1: Core Infrastructure (WikiManager, StateManager, GitHub Integration)
- Phase 2: AI Agent System (all specialized agents)
- Phase 3: Processing Engine (repository processing, state persistence)
- Phase 5: Integration & Polish (cross-page linking, code examples)
- Phase 6: MCP Server (Claude Code integration, metrics tracking)

**⏸️ Planned**
- Phase 4: Web Dashboard (interactive UI for monitoring and control)

## Next Steps

**Immediate** (< 4 hours)
- Add code examples to component pages
- Add file path references
- Generate fresh wiki to validate improvements

**Medium-Term** (4–8 hours)
- Test coverage extraction and documentation
- Configuration system for customization
- Enhanced component relationship mapping

**Long-Term** (8+ hours)
- Web dashboard interface (Phase 4)
- Incremental update mode (process only new commits)
- Enhanced MCP server features

## License

MIT

---

**Self-Validation**: This README describes a system that has successfully documented its own architecture at 87% quality. The auto-generated wiki serves as proof that the system works as described.