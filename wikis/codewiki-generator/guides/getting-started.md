# Getting Started

## Overview

CodeWiki-Generator is an agent-based documentation generation system that automatically creates and maintains wiki documentation from your codebase. This guide will walk you through installation, setup, and running your first documentation generation.

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Git (for repository operations)
- A GitHub personal access token (for GitHub API operations)

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd CodeWiki-Generator
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` and add your GitHub credentials:
```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repository
```

## Running the Application

1. **Generate documentation for a repository:**
```bash
npm start
```

This command will:
- Analyze your repository structure
- Extract code patterns and documentation
- Generate wiki pages with frontmatter metadata
- Build cross-page links automatically
- Create an index of all generated content

2. **Expected output:**

After running, you should see:
- Generated wiki files in the `wiki/` directory
- An `index.md` file listing all generated pages
- Console output showing:
  - Number of files analyzed
  - Pages generated
  - Links created
  - API calls made (with cost tracking)
  - Processing statistics

## Running Tests

1. **Run all tests:**
```bash
npm test
```

2. **Run tests in watch mode (for development):**
```bash
npm test -- --watch
```

3. **Run specific test file:**
```bash
npm test -- src/agents/__tests__/GuideGenerationAgent.test.ts
```

4. **Generate coverage report:**
```bash
npm test -- --coverage
```

Tests use Jest and include:
- Unit tests for all agents (ArchitectureOverviewAgent, GuideGenerationAgent, etc.)
- Integration tests for the documentation pipeline
- Mock GitHub API client for test environment isolation
- Cost tracking verification tests

## Project Structure

```
CodeWiki-Generator/
├── src/
│   ├── agents/              # Multi-agent architecture
│   │   ├── ArchitectureOverviewAgent.ts
│   │   ├── CodeAnalysisAgent.ts
│   │   ├── GuideGenerationAgent.ts
│   │   ├── MetaAnalysisAgent.ts
│   │   └── WikiIndexAgent.ts
│   ├── clients/             # External API integrations
│   │   ├── ClaudeClient.ts
│   │   └── GitHubClient.ts
│   ├── config/              # Configuration management
│   │   └── Config.ts
│   ├── processors/          # Page processing logic
│   │   └── Processor.ts
│   └── index.ts             # Entry point
├── wiki/                    # Generated documentation output
├── package.json
└── tsconfig.json
```

## Key Concepts

- **Agent-based Architecture**: Multiple specialized agents handle different aspects of documentation generation
- **Category-based Organization**: Wiki pages are organized by category for better navigation
- **Commit-driven Pipeline**: Documentation updates are tracked with git commit history
- **Cost-aware Processing**: API usage is tracked to monitor Claude API costs

## Next Steps

1. **Review generated documentation:**
   - Check the `wiki/` directory for generated pages
   - Open `wiki/index.md` to see the full documentation index

2. **Configure for your needs:**
   - See the [Configuration Guide](./guides/configuration.md) for advanced setup options
   - Customize category mappings and page templates

3. **Understand the architecture:**
   - Read [Agent-based Architecture](./concepts/architecture.md) to learn how the system works
   - Review [Extension Patterns](./guides/extension-patterns.md) to add custom agents

4. **Learn testing practices:**
   - See the [Testing Approach Guide](./guides/testing-approach.md) for testing patterns

## Troubleshooting

**Issue: "GITHUB_TOKEN not found"**
- Solution: Ensure your `.env` file has `GITHUB_TOKEN` set with a valid GitHub personal access token

**Issue: "Module not found" errors**
- Solution: Run `npm install` again, then verify with `npm test`

**Issue: Tests fail with API errors**
- Solution: Tests use mocked APIs - ensure you're using `npm test` not running files directly

**Issue: Out of memory during large repository analysis**
- Solution: The system includes cost-aware batching - check your `.env` for batch size settings