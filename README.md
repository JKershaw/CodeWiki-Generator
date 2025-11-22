# CodeWiki Generator

An autonomous system that generates and maintains comprehensive wiki documentation by progressively analyzing git history. The system uses AI (Claude) to understand code changes and create living documentation that evolves with your codebase.

## Core Concept

**Code tells you what. Documentation tells you why. History tells you how.**

CodeWiki Generator walks through git history chronologically, analyzes code changes using AI, and builds interconnected wiki documentation that captures concepts, components, relationships, and evolution over time.

## Features (v1.0)

- **Chronological Analysis**: Processes git commits in order to understand code evolution
- **AI-Powered Documentation**: Uses Claude to analyze code and generate clear, concise documentation
- **Interactive Dashboard**: Web UI for monitoring and controlling the documentation generation process
- **Manual Stepping**: Process commits one at a time to validate and tune documentation quality
- **Batch Processing**: Automated processing with pause/resume capabilities
- **Meta-Analysis**: Identifies themes and patterns across multiple commits
- **Cost Control**: Budget tracking and limits for API usage
- **Real-time Updates**: WebSocket-based progress monitoring
- **Self-Documenting**: The system generates its own documentation (dogfooding)

## Prerequisites

- Node.js 24.x or higher
- Anthropic API key (for Claude access)
- GitHub Personal Access Token (optional, for private repos)

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd CodeWiki-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (for manual testing):
```bash
cp .env.example .env
# Edit .env and add your API keys
# See ENVIRONMENT.md for detailed configuration options
```

**Note**: API keys are NOT required for running tests. Tests automatically use mocks.

4. Start the server:
```bash
npm start
```

5. Open the dashboard:
```
http://localhost:3000
```

## Quick Start

1. Enter a GitHub repository URL in the dashboard
2. Click "Load Repository" to fetch commit history
3. Use "Step" mode to process commits one at a time
4. Review generated wiki pages in the sidebar
5. Once satisfied with quality, use "Process Next N" for batch processing

## Project Status

🚧 **Currently in development** 🚧

This project is being built following test-driven development principles and will document itself as it's being created. The generated wiki for this codebase will serve as the primary architectural documentation.

## Architecture

See the generated wiki in `wiki/` for comprehensive architecture documentation once the system is operational.

Key components:
- **Dashboard**: Express.js web interface for control and monitoring
- **Processor**: Main processing loop that walks through commits
- **AI Agents**: Specialized Claude API calls for code analysis, documentation writing, and meta-analysis
- **Wiki Manager**: Handles reading and writing markdown documentation
- **GitHub Integration**: Octokit wrapper for repository access
- **State Manager**: Persistence for processing state and progress

## Development Philosophy

This project practices **wiki-driven development**:
1. Build a feature
2. Run the wiki generator on the codebase
3. Read the generated documentation
4. If unclear, improve the documentation system
5. Proceed to next feature

The quality of the self-generated documentation validates the quality of the system itself.

## Testing

### Running Tests

Run the full test suite:
```bash
npm test
```

Watch mode for development:
```bash
npm test:watch
```

**Important**: Tests automatically use mocks for all API calls. No API keys required, no API costs incurred.

### Manual Testing with Real APIs

To test with actual GitHub and Anthropic APIs:
1. Add your API keys to `.env`
2. Set `TEST_MODE=false` in `.env`
3. Run the server: `npm start`
4. Use the dashboard to process a repository

See [ENVIRONMENT.md](ENVIRONMENT.md) for detailed configuration options.

## Cost Estimation

- Processing ~100 commits: $3-5 (with Claude Sonnet)
- Average per commit: $0.03-0.05
- Configurable daily budget limits

## Future Enhancements

- MCP server for Claude Code integration
- Diagram generation (Mermaid)
- Multi-repository support
- Team collaboration features
- Custom agent creation
- Advanced analytics

## License

MIT

## Contributing

This project is currently in initial development. Contributions welcome once v1.0 is complete.

---

*Meta-note: This README will be replaced with a comprehensive version once the system is complete and can generate its own documentation.*
