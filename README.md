# CodeWiki Generator

An intelligent documentation automation system that analyzes software repositories and generates comprehensive wiki-style documentation using Large Language Model (LLM) agents.

## Core Concept

**Code tells you what. Documentation tells you why. History tells you how.**

CodeWiki Generator automatically analyzes your codebase, discovers architectural patterns, and produces structured markdown documentation organized into concepts, components, and guides.

## Features

- ✅ **AI-Powered Documentation**: Uses Claude Sonnet 4.5 to analyze code and generate clear, insightful documentation
- ✅ **Specialized Agent System**: Dedicated agents for code analysis, documentation writing, architecture overview, and guide generation
- ✅ **Cross-Page Linking**: Automatic hyperlink discovery and injection for seamless navigation
- ✅ **Category-Based Organization**: Documents organized into concepts/, components/, and guides/
- ✅ **Repository Fingerprinting**: Analyzes repository structure to guide documentation generation
- ✅ **Resilient LLM Parsing**: Progressive JSON repair for handling unreliable LLM outputs
- ✅ **Self-Documenting**: The system successfully documents its own architecture (meta-validation)
- ✅ **Test-Driven Development**: 220+ passing tests with comprehensive coverage
- ✅ **MCP Server**: Integration with Claude Code and other AI tools via Model Context Protocol
- ⏸️ **Web Dashboard** (Phase 4 - Planned): Interactive UI for monitoring and control

## Current Status

**🎯 Production-Ready Core | 87% Quality | 18 Pages Generated**

The system has successfully documented itself:
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

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd CodeWiki-Generator

# Install dependencies
npm install

# Run tests to verify installation
npm test
```

### 2. Explore the Generated Wiki

```bash
# View the auto-generated wiki for this project
ls -la wiki/

# Key pages:
# - wiki/guides/getting-started.md - Setup and usage guide
# - wiki/concepts/architecture.md - System design overview
# - wiki/index.md - Navigation hub
```

### 3. Generate Wiki for Your Project

```bash
# Run the wiki generator (CLI tool)
node generate-self-wiki.js

# Or import and use programmatically:
const Processor = require('./lib/processor');
const processor = new Processor('./output-wiki');
await processor.processRepository('https://github.com/owner/repo');
```

**For detailed setup instructions**, see [wiki/guides/getting-started.md](wiki/guides/getting-started.md)

## MCP Server (AI Assistant Integration)

The MCP (Model Context Protocol) server enables AI assistants like Claude Code to query your generated wiki documentation for context while developing.

### Starting the MCP Server

```bash
# Start the MCP server
npm run mcp-server

# Or with custom wiki path
node mcp-server.js --wiki ./wikis/your-project
```

### Using with Claude Code

Configure Claude Code to connect to the MCP server for intelligent wiki queries:

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

### Available Tools

The MCP server exposes two tools:

1. **query_wiki**: Search the wiki for relevant documentation
   - Provides intelligent context gathering based on task descriptions
   - Returns relevant wiki pages with summaries and links
   - Example: "How do I implement authentication?"

2. **request_documentation**: Request missing documentation
   - Queues documentation requests for topics not yet covered
   - Tracks priorities and reasons for documentation needs
   - Generates metrics for documentation gaps

### Example Usage

Once configured, you can ask Claude Code questions like:
- "How do I run tests?"
- "What's the architecture of the wiki generator?"
- "Help me implement a new agent"

Claude Code will automatically query the MCP server and use the wiki context to provide informed answers.

### Testing the MCP Server

```bash
# Run the test suite
node test-mcp-server.js

# Check metrics
cat mcp-metrics.json
```

## Prerequisites

- **Node.js** 24.x or higher (currently tested on 22.x with warnings)
- **Anthropic API key** (for production use - not required for tests)
- **Git** (for repository analysis)

## Environment Setup

```bash
# Optional: Add API key for production use
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=your_key_here
```

**Note**: API keys are NOT required for running tests. All tests use mocks to avoid API costs.

## Architecture

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

**Key Components**:
- **Processor** - Orchestrates analysis and documentation generation
- **ArchitectureOverviewAgent** - Synthesizes high-level architectural insights
- **CodeAnalysisAgent** - Analyzes code structure and patterns
- **DocumentationWriterAgent** - Generates markdown with code examples
- **GuideGenerationAgent** - Creates operational guides
- **LinkDiscoveryAgent** - Discovers and injects cross-page hyperlinks
- **WikiManager** - Handles markdown file operations
- **WikiIndexAgent** - Generates navigation structure

For comprehensive architecture documentation, see [wiki/concepts/architecture.md](wiki/concepts/architecture.md)

## Testing

```bash
# Run full test suite (220+ tests)
npm test

# Watch mode for development
npm test:watch

# All tests use mocks - no API costs incurred
```

**Test Coverage**:
- Unit tests for all agents and core components
- Integration tests for complete workflows
- Self-validation through dogfooding

## Development Philosophy

This project practices **wiki-driven development**:
1. Build a feature
2. Run the wiki generator on this codebase
3. Read the generated documentation
4. If unclear, improve the documentation system
5. Proceed to next feature

**The quality of our self-generated documentation validates the quality of the system itself.**

## Cost Estimation

- Processing ~100 commits: $3-$5 (with Claude Sonnet 4.5)
- Average per commit: $0.03-$0.05
- This repository (self-documentation): ~$1-$2

## Documentation Quality

Our auto-generated wiki achieves **87% quality** compared to manually-written documentation:

**Strengths**:
- ✅ Explains design rationale and trade-offs (better than manual wiki)
- ✅ Cross-page navigation with automatic hyperlinking
- ✅ Coherent narrative explaining system architecture
- ✅ Immediately useful Getting Started guide

**Current Limitations** (being addressed):
- ⚠️ Code examples extracted from tests (implemented, pending regeneration)
- ⚠️ Test coverage statistics not yet documented
- ⚠️ Some component relationships could be more detailed

See [WIKI_COMPARISON_ASSESSMENT.md](WIKI_COMPARISON_ASSESSMENT.md) for honest assessment vs manual documentation.

## Project Roadmap

**✅ Phase 1: Core Infrastructure**
- WikiManager, StateManager, GitHub Integration

**✅ Phase 2: AI Agent System**
- CodeAnalysisAgent, DocumentationWriterAgent, MetaAnalysisAgent
- ArchitectureOverviewAgent, GuideGenerationAgent, LinkDiscoveryAgent

**✅ Phase 3: Processing Engine**
- Repository processing, state persistence

**✅ Phase 5: Integration & Polish** (Partial)
- Cross-page linking, code examples, error handling

**✅ Phase 6: MCP Server** (Complete)
- Claude Code integration via Model Context Protocol
- Intelligent wiki querying for development context
- Request queue for missing documentation
- Basic metrics tracking

**⏸️ Phase 4: Web Interface** (Next)
- Dashboard, WebSocket updates, live preview

## Next Steps

**Immediate** (< 4 hours):
- ✅ Add code examples to component pages (+2.5 quality points)
- ✅ Add file path references (+1 quality point)
- Generate fresh wiki to validate improvements

**Medium-Term** (4-8 hours):
- Test coverage extraction and documentation
- Configuration system for customization
- Enhanced component relationship mapping

**Long-Term** (8+ hours):
- Web dashboard interface (Phase 4)
- Incremental update mode (process only new commits)
- Enhanced MCP server features (prompts, advanced metrics)

## How It Works

1. **Repository Analysis**: Fingerprints repository structure and patterns
2. **Agent Dispatch**: Routes analysis to specialized LLM agents
3. **Content Generation**: Each agent generates documentation for its domain
4. **Quality Assurance**: Progressive JSON repair and response validation
5. **Assembly**: Organizes content into category-based structure
6. **Linking**: Discovers mentions and injects cross-page hyperlinks
7. **Index Generation**: Creates navigable table of contents

## Example Output

See `wiki/` directory for real examples:
- [wiki/concepts/architecture.md](wiki/concepts/architecture.md) - System design with rationale
- [wiki/guides/getting-started.md](wiki/guides/getting-started.md) - Quick start guide
- [wiki/components/architecture-overview-agent.md](wiki/components/architecture-overview-agent.md) - Agent documentation
- [wiki/index.md](wiki/index.md) - Auto-generated navigation

## Contributing

This project is in active development. Key areas for contribution:
- Phase 4: Web dashboard implementation
- Test coverage extraction and reporting
- Additional specialized agents
- Documentation improvements

## License

MIT

## Acknowledgments

Built with:
- **Claude Sonnet 4.5** (Anthropic) - LLM for documentation generation
- **Node.js** - Runtime environment
- **Jest** - Testing framework

---

**Self-Validation Statement**: This README describes a system that has successfully documented its own architecture at 87% quality. The auto-generated wiki in `wiki/` serves as proof that the system works as described.
