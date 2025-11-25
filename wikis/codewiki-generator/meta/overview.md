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

CodeWiki Generator automatically analyzes your codebase, discovers architectural patterns, and produces structured markdown documentation organized into concepts, components, and guides. The system practices wiki-driven development—if the self-generated documentation is unclear, the system itself is improved, not the documentation.

## Key Capabilities

- **AI-Powered Analysis**: Uses Claude Sonnet 4.5 to analyze code and generate insightful documentation
- **Specialized Agent System**: Dedicated agents for code analysis, documentation writing, architecture synthesis, and guide generation
- **Automatic Cross-Linking**: Discovers mentions and injects hyperlinks for seamless navigation
- **Structured Organization**: Documents organized by category (concepts/, components/, guides/)
- **Repository Fingerprinting**: Analyzes structure and patterns to guide documentation generation
- **Resilient Processing**: Progressive JSON repair handles unreliable LLM outputs
- **Self-Validating**: Successfully documents its own architecture at 87% quality (meta-validation)
- **Production-Ready**: 220+ passing tests with comprehensive coverage

## Production Status

**🎯 Production-Ready Core | 87% Quality | 18 Pages Generated**

The system has proven itself through self-documentation:
- **9 concepts** capturing architectural patterns and design decisions
- **4 components** documenting implementation modules
- **4 guides** providing operational documentation
- **1 index** enabling navigation

### Quality Metrics (Self-Documentation)

- **Overall**: 87% (Grade A)
- **Navigation**: 90% (cross-page linking effectiveness)
- **Completeness**: 85% (coverage of major components)
- **Usability**: 88% (immediately actionable guidance)

See [WIKI_COMPARISON_ASSESSMENT.md](WIKI_COMPARISON_ASSESSMENT.md) for detailed quality analysis versus manually-written documentation.

## How It Works

The system follows an **architecture synthesis agent pattern**:

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

**Processing Pipeline**:

1. **Repository Analysis**: Fingerprints structure and identifies key patterns
2. **Agent Dispatch**: Routes analysis to specialized LLM agents
3. **Content Generation**: Each agent generates documentation for its domain
4. **Quality Assurance**: Validates and repairs responses
5. **Assembly**: Organizes content by category
6. **Linking**: Discovers mentions and injects cross-page hyperlinks
7. **Index Generation**: Creates navigable table of contents

## Core Components

**Orchestration**:
- [[Processor]] - Orchestrates the entire analysis and documentation pipeline

**Documentation Agents**:
- [[ArchitectureOverviewAgent]] - Synthesizes high-level architectural insights
- [[CodeAnalysisAgent]] - Analyzes code structure and patterns
- [[DocumentationWriterAgent]] - Generates markdown with code examples
- [[GuideGenerationAgent]] - Creates operational guides
- [[WikiIndexAgent]] - Generates navigation structures

**Supporting Systems**:
- [[WikiManager]] - Handles markdown file operations and frontmatter
- [[LinkDiscoveryAgent]] - Discovers and injects cross-page hyperlinks
- [[StateManager]] - Persists processing state across runs

## Quick Start

### Installation

```bash
git clone <repository-url>
cd CodeWiki-Generator
npm install
npm test
```

### Generate Documentation for Your Project

```bash
node generate-self-wiki.js
```

Or use programmatically:

```javascript
const Processor = require('./lib/processor');
const processor = new Processor('./output-wiki');
await processor.processRepository('https://github.com/owner/repo');
```

For detailed setup, see [[Getting Started Guide|guides/getting-started.md]].

### View Generated Documentation

```bash
ls -la wiki/
# - wiki/guides/getting-started.md
# - wiki/concepts/architecture.md
# - wiki/index.md
```

## MCP Server Integration

CodeWiki Generator includes an MCP (Model Context Protocol) server enabling AI assistants like Claude Code to query generated documentation for development context.

### Starting the Server

```bash
npm run mcp-server
# Or: node mcp-server.js --wiki ./wikis/your-project
```

### Exposed Tools

- **query_wiki**: Search documentation with intelligent context gathering
- **request_documentation**: Queue documentation for topics not yet covered

### Claude Code Integration

Configure your MCP client to connect to the server:

```json
{
  "mcpServers": {
    "codewiki": {
      "command": "node",
      "args": ["/path/to/mcp-server.js"],
      "cwd": "/path/to/CodeWiki-Generator"
    }
  }
}
```

Once configured, ask Claude Code questions like "How do I run tests?" or "What's the architecture of this system?" and it will automatically query the wiki for context.

## Prerequisites & Setup

**Requirements**:
- Node.js 24.x or higher (tested on 22.x with warnings)
- Anthropic API key (for production use)
- Git (for repository analysis)

**Note**: API keys are NOT required for testing—all tests use mocks to avoid costs.

```bash
cp .env.example .env
# Edit .env: ANTHROPIC_API_KEY=your_key_here
```

## Testing & Quality Assurance

```bash
# Run 220+ tests
npm test

# Watch mode for development
npm test:watch

# All tests use mocks—no API costs
```

**Test Approach**:
- Unit tests for all agents and components
- Integration tests for complete workflows
- Self-validation through dogfooding (the system documents itself)

## Cost Analysis

Processing typical repositories with Claude Sonnet 4.5:
- ~100 commits: $3–$5 total
- Per commit: $0.03–$0.05
- CodeWiki Generator self-documentation: ~$1–$2

## Documentation Quality Assessment

The auto-generated wiki achieves **87% quality** compared to manual documentation:

### Strengths
- ✅ Explains design rationale and trade-offs better than typical wiki entries
- ✅ Automatic cross-page navigation with intelligent hyperlinking
- ✅ Coherent narrative explaining system architecture
- ✅ Immediately actionable getting-started guidance

### Current Limitations (Being Addressed)
- ⚠️ Code examples extracted from tests (implemented, pending regeneration)
- ⚠️ Test coverage statistics need better integration
- ⚠️ Some component relationships could be more detailed

## Development Philosophy

This project practices **wiki-driven development**:

1. Build a feature
2. Run the wiki generator on this codebase
3. Read the generated documentation
4. If unclear → improve the documentation system
5. Proceed to next feature

**The quality of self-generated documentation validates system quality itself.** This creates a powerful feedback loop where documentation clarity directly drives architectural improvement.

## Project Roadmap

**✅ Complete**:
- Core infrastructure (WikiManager, StateManager, GitHub integration)
- AI agent system (all agents deployed)
- Processing engine with state persistence
- Cross-page linking system
- Code example extraction and integration
- MCP server with Claude Code integration

**⏸️ Next Phase**:
- Web dashboard interface for monitoring and control
- Incremental update mode (process only new commits)
- Enhanced MCP server features

## Next Steps

**Immediate** (< 4 hours):
- Generate fresh wiki with improved code examples
- Validate quality improvements across pages

**Medium-Term** (4–8 hours):
- Test coverage extraction and documentation
- Configuration system for customization
- Enhanced component relationship mapping

**Long-Term** (8+ hours):
- Web dashboard implementation
- Incremental processing mode
- Advanced MCP server capabilities

## Key Insights

- **Self-Validation**: The project's ability to document itself at production quality proves the system works as designed
- **Agent Specialization**: Dedicated agents for different documentation tasks produce more coherent and accurate results than monolithic approaches
- **Cost Efficiency**: $0.03–$0.05 per commit makes large-scale documentation economically viable
- **Navigation Critical**: 90% navigation quality indicates automatic cross-linking is essential for usability
- **Quality Feedback Loop**: Using generated documentation to improve the system creates continuous quality enhancement

## See Also

- [[Architecture Concept|concepts/architecture.md]] - Detailed system design with architectural rationale
- [[Agent-Based Documentation Pipeline|concepts/agent-based-documentation-pipeline.md]] - How agents collaborate
- [[Category-Based Documentation Organization|concepts/category-based-documentation-structure.md]] - Content organization patterns
- [[Getting Started Guide|guides/getting-started.md]] - Setup and usage instructions
- [[Wiki Manager|components/wiki-manager-api-consistency.md]] - File and frontmatter operations