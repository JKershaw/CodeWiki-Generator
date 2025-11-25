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

## Core [Philosophy](../meta/philosophy.md)

**Code tells you what. Documentation tells you why. History tells you how.**

CodeWiki Generator automatically analyzes your codebase, discovers architectural patterns, and produces structured markdown documentation organized into concepts, components, and guides. The system practices **wiki-driven development**: build a feature, run the generator on your own codebase, read the generated documentation, and validate the quality. The quality of the self-generated documentation validates the quality of the system itself.

## Current Status

**🎯 Production-Ready Core | 87% Quality | 18 Pages Generated**

The system has successfully documented itself with:
- **9 concepts** (architectural patterns and design decisions)
- **4 components** (implementation modules)
- **4 guides** (operational documentation)
- **1 index** (auto-generated navigation)

**Quality Metrics** (from self-documentation run):
- Overall: 87% (Grade A)
- Navigation: 90% (cross-page linking)
- Completeness: 85% (all major components documented)
- Usability: 88% (immediately actionable Getting Started guide)

See [WIKI_COMPARISON_ASSESSMENT.md](WIKI_COMPARISON_ASSESSMENT.md) for detailed quality analysis.

## Key Features

### AI-Powered Architecture Synthesis

The system uses Claude Sonnet 4.5 to analyze repositories through a multi-agent dispatch pattern:

```
Repository → Fingerprinting → Agent Dispatch → Documentation Assembly
                                     ↓
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
    [ArchitectureOverviewAgent](../components/architecture-overview-agent.md)  CodeAnalysisAgent  GuideGenerationAgent
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ↓
                           JSON Response Cleaning
                                    ↓
                      Category-Based Content Organization
```

### Specialized Agent System

- **[ArchitectureOverviewAgent](../components/architecture-overview-agent.md)**: Synthesizes high-level architectural insights
- **CodeAnalysisAgent**: Analyzes code structure and patterns
- **DocumentationWriterAgent**: Generates markdown with code examples
- **GuideGenerationAgent**: Creates operational guides
- **LinkDiscoveryAgent**: Discovers and injects cross-page hyperlinks
- **WikiIndexAgent**: Generates navigation structure

### Cross-Page Navigation

Automatic hyperlink discovery and injection for seamless navigation between related concepts, components, and guides. The system understands mention patterns and contextually injects references without requiring manual configuration.

### Category-Based Organization

All documentation is automatically organized into three categories:
- **concepts/**: Architectural patterns, design decisions, and high-level ideas
- **components/**: Implementation modules and technical systems
- **guides/**: Operational documentation and how-to instructions

### Resilient LLM Processing

Progressive JSON repair for handling unreliable LLM outputs, defensive parsing with validation layers, and graceful degradation when data is incomplete or malformed.

## How It Works

### 1. Repository Analysis
Fingerprints repository structure, identifies file significance, and gathers contextual metadata about the project.

### 2. Agent Dispatch
Routes analysis to specialized LLM agents based on repository characteristics. Each agent generates documentation for its domain in parallel.

### 3. Content Generation
Each agent produces structured JSON responses containing categorized documentation entries with titles, body content, and relationship hints.

### 4. Quality Assurance
Progressive JSON repair validates and normalizes responses. Content is checked for completeness and consistency.

### 5. Assembly
Organizes content into category-based structure with proper frontmatter metadata including relationships, tags, and source tracking.

### 6. Cross-Page Linking
LinkDiscoveryAgent performs a second pass to analyze full page content and inject contextual hyperlinks between related pages.

### 7. Index Generation
WikiIndexAgent creates navigable table of contents organized by category with relationship hierarchy.

## Installation and Quick Start

### Basic Setup

```bash
# Clone the repository
git clone <repository-url>
cd CodeWiki-Generator

# Install dependencies
npm install

# Run tests to verify installation
npm test
```

### Generate Wiki for Your Project

```bash
# Generate wiki for a GitHub repository
node generate-self-wiki.js

# Or import and use programmatically
const Processor = require('./lib/processor');
const processor = new Processor('./output-wiki');
await processor.processRepository('https://github.com/owner/repo');
```

For detailed setup instructions, see [[Getting Started Guide|guides/getting-started.md]].

## MCP Server Integration

The Model Context Protocol (MCP) server enables AI assistants like Claude Code to query generated wiki documentation for context while developing.

### Starting the Server

```bash
npm run mcp-server

# Or with custom wiki path
node mcp-server.js --wiki ./wikis/your-project
```

### Available Tools

- **query_wiki**: Search the wiki for relevant documentation and gather intelligent context
- **request_documentation**: Queue documentation requests for topics not yet covered and track priorities

### Using with Claude Code

Configure Claude Code to connect to the MCP server:

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

Once configured, ask questions like:
- "How do I run tests?"
- "What's the architecture of the wiki generator?"
- "Help me implement a new agent"

Claude Code will automatically query the MCP server and provide context-aware answers.

## Architecture Overview

The system follows an **architecture synthesis agent pattern** where specialized LLM agents collaborate to produce comprehensive documentation. See [[Agent-Based Documentation Generation|concepts/agent-based-documentation-generation.md]] for detailed architectural patterns.

### Core Components

- **Processor**: Orchestrates analysis and documentation generation pipeline
- **WikiManager**: Handles markdown file operations and frontmatter management
- **StateManager**: Persists processing state and tracks metadata lifecycle
- **GitHubClient**: Provides repository access and commit history extraction

### Design Patterns

- **Multi-agent dispatch**: Specialized agents handle different documentation domains
- **Resilient JSON parsing**: Progressive repair handles LLM output inconsistencies
- **Category-based organization**: Documents automatically classified by type
- **Cross-page linking**: Contextual hyperlinks without manual configuration
- **Persistent state**: Resume processing, track progress, enable incremental updates

## Testing and Quality

### Test Infrastructure

- **220+ passing tests** with comprehensive coverage
- Unit tests for all agents and core components
- Integration tests for complete workflows
- All tests use mocks—no API costs incurred

```bash
# Run full test suite
npm test

# Watch mode for development
npm test:watch
```

### Documentation Quality Validation

Our auto-generated wiki achieves **87% quality** through:

**Strengths**:
- ✅ Explains design rationale and trade-offs (better than many manual wikis)
- ✅ Cross-page navigation with automatic hyperlinking
- ✅ Coherent narrative explaining system architecture
- ✅ Immediately useful Getting Started guide

**Current Limitations** (being addressed):
- ⚠️ Code examples extracted from tests
- ⚠️ Test coverage statistics not yet documented
- ⚠️ Some component relationships could be more detailed

## Cost Efficiency

- Processing ~100 commits: $3-$5 (with Claude Sonnet 4.5)
- Average per commit: $0.03-$0.05
- This repository (self-documentation): ~$1-$2

Cost tracking is built into the system—each API call is recorded and aggregated for budget-aware processing.

## Roadmap and Development Status

### Completed Phases

- **Phase 1**: Core infrastructure (WikiManager, StateManager, GitHub integration)
- **Phase 2**: AI agent system (all specialized agents implemented)
- **Phase 3**: Processing engine and repository analysis
- **Phase 5**: Integration and cross-page linking
- **Phase 6**: MCP server for Claude Code integration

### In Progress

- **Phase 4**: Web dashboard and interactive UI (planned)

### Next Steps

**Immediate** (< 4 hours):
- Add code examples to component pages
- Add file path references to documentation

**Medium-Term** (4-8 hours):
- Test coverage extraction and documentation
- Configuration system for customization
- Enhanced component relationship mapping

**Long-Term** (8+ hours):
- Web dashboard interface
- Incremental update mode
- Enhanced MCP server features

## Prerequisites

- **Node.js** 24.x or higher (tested on 22.x)
- **Anthropic API key** (for production use; not required for tests)
- **Git** (for repository analysis)

**Note**: API keys are not required for running tests. All tests use mocks to avoid API costs.

## Development [Philosophy](../meta/philosophy.md)

This project practices **wiki-driven development**:

1. Build a feature
2. Run the wiki generator on this codebase
3. Read the generated documentation
4. If unclear, improve the documentation system
5. Proceed to next feature

The self-documenting nature of the system creates a feedback loop where quality improvements to the documentation system are immediately validated by the system's own documentation.

## Key Insights

### Self-Validation Through Dogfooding

The system successfully documents its own architecture at 87% quality. The auto-generated wiki in `wiki/` serves as proof that the system works as described. This dogfooding approach validates system quality in a production-realistic scenario.

### Documentation as Architecture Insight

By analyzing code and synthesizing documentation across multiple specialized agents, the system discovers architectural patterns that may not be immediately obvious. The documentation becomes a tool for understanding and improving the architecture itself.

### Resilience Through Progressive Repair

Rather than failing on malformed LLM output, the system progressively repairs and validates responses. This defensive approach handles the reality of LLM unreliability without requiring perfect outputs.

### Contextual Knowledge Through Linking

Cross-page linking is discovered automatically by analyzing full page content and recognizing mention patterns. This creates an emergent knowledge graph without requiring manual relationship definition.

## Examples

Real examples of system output are available in the `wiki/` directory:

- [[Architecture Concepts|concepts/architecture.md]]
- [[Getting Started Guide|guides/getting-started.md]]
- [[[ArchitectureOverviewAgent](../components/architecture-overview-agent.md) Component|components/architecture-overview-agent.md]]
- [[Navigation Index|index.md]]

## Contributing and Integration

The project is in active development with clear areas for contribution:

- Phase 4 web dashboard implementation
- Test coverage extraction and reporting
- Additional specialized agents
- Documentation quality improvements

For detailed extension patterns, see [[Extension Patterns Guide|guides/extension-patterns.md]].

## See Also

- [[Agent-Based Documentation Generation|concepts/agent-based-documentation-generation.md]]
- [[Category-Based Documentation Organization|concepts/category-based-documentation-organization.md]]
- [[Processor Architecture|components/processor-class.md]]
- [[[Cross-Page Link Discovery System](../components/cross-page-link-discovery-system.md)|components/cross-page-link-discovery-system.md]]
- [[Getting Started|guides/getting-started.md]]