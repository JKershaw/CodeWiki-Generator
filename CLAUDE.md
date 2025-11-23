# CodeWiki-Generator - AI Assistant Guide

## Project Overview

**Core Philosophy**: "Code tells you what. Documentation tells you why. History tells you how."

CodeWiki-Generator automatically generates comprehensive wiki documentation from codebases using LLM agents. The system analyzes git history, code structure, and tests to produce context-enriched documentation organized into concepts, components, and guides.

## Using the Wiki Context Tool

**Before starting any development task**, use the `wiki-context` CLI to gather relevant context:

```bash
# Research context for your task
./wiki-context.js "your task description here"

# Example: Adding a new feature
./wiki-context.js "add test coverage tracking to dashboard"

# Example: Understanding existing code
./wiki-context.js "how does the wiki linking system work"

# For demo wiki
./wiki-context.js --wiki ./wikis/demo "implement calculator component"
```

**When to use wiki-context**:
- Before implementing new features
- When debugging unfamiliar code
- To understand architectural patterns
- Before making significant refactors
- When reviewing related components

The tool analyzes the wiki and provides:
- Relevant wiki pages with explanations
- Key components and their locations
- Related concepts and how they apply
- Step-by-step implementation guidance
- Related file paths to examine

## Development Workflow

### Key Commands

```bash
# Install dependencies
npm install

# Run tests (220+ tests, should all pass)
npm test

# Generate wiki for this project
node generate-self-wiki.js

# Add cross-page links to wiki
node enhance-wiki-linking.js
```

### Architecture

- **lib/agents/** - LLM agents (CodeAnalysis, DocumentationWriter, WikiIndex, LinkDiscovery)
- **lib/processor.js** - Main orchestrator for wiki generation
- **lib/wiki-manager.js** - Handles markdown file operations
- **lib/claude.js** - Claude API client
- **lib/prompts/** - Prompt templates for agents

### Testing Requirements

- All new code must have unit tests
- Use mocks for LLM calls (see `tests/` for examples)
- Tests must pass before committing
- Coverage should remain high (aim for 80%+)

## Code Style

- Use async/await for asynchronous operations
- Classes for agents and managers
- JSDoc comments for public methods
- Descriptive variable names
- Error handling with try/catch and logging

## Git Conventions

### Commit Messages

Use clear, descriptive commit messages:

```
Add feature: Brief description

Detailed explanation if needed:
- Bullet point changes
- Important notes
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements
- `claude/*` - AI-assisted development sessions

### Before Committing

1. Run tests: `npm test`
2. Check git status for unintended changes
3. Stage only relevant files
4. Write clear commit message
5. Push to feature branch

## Wiki Structure

Generated wikis follow this organization:

- **meta/** - Philosophy and specifications
- **concepts/** - Architectural patterns and design decisions
- **components/** - Implementation details of specific modules
- **guides/** - Step-by-step instructions
- **history/** - Project evolution and progress reports
- **index.md** - Auto-generated navigation hub

## Common Tasks

### Adding a New Agent

1. Use `wiki-context.js "create new agent for X"` to understand agent patterns
2. Create class in `lib/agents/`
3. Extend base agent pattern (see existing agents)
4. Add unit tests in `tests/unit/agents/`
5. Update processor.js to integrate
6. Document in wiki (will auto-generate on next run)

### Modifying Wiki Generation

1. Check `lib/prompts/` for relevant prompt templates
2. Modify agent logic in `lib/agents/`
3. Test with `node generate-self-wiki.js`
4. Verify output in `./wikis/codewiki-generator/`

### Fixing Link Issues

- HTML in markdown: Check `lib/agents/wiki-index-agent.js` HTML conversion
- Broken cross-links: Run `node enhance-wiki-linking.js`
- Missing links: Ensure bold mentions `**Page Title**` in content

## Important Notes

- **API Costs**: LLM calls cost money. Use mocks in tests. Be mindful when running `generate-self-wiki.js`
- **State Management**: State is saved in `state.json`. Delete to force full regeneration
- **Wiki Regeneration**: Incremental by default. Delete wiki directory for complete rebuild
- **Error Handling**: Check console output. Agents may fail gracefully and log warnings

## Getting More Context

For detailed information, see the auto-generated wiki:

```bash
# View the wiki index
cat ./wikis/codewiki-generator/index.md

# Or use wiki-context to research specific topics
./wiki-context.js "detailed explanation of X"
```

Key wiki pages:
- `meta/philosophy.md` - Core vision and principles
- `concepts/architecture.md` - System design
- `guides/getting-started.md` - Setup and first steps
- `guides/development-workflow.md` - Detailed development practices

## Questions or Issues?

1. Use `wiki-context.js` to search the wiki first
2. Check existing tests for examples
3. Review related components in `lib/`
4. Consult the auto-generated wiki in `./wikis/codewiki-generator/`
