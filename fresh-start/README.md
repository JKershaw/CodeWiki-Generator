# CodeWiki SaaS - Fresh Start

This folder contains everything needed to start the CodeWiki SaaS project fresh, incorporating learnings from the prototype.

## Contents

| File/Folder | Purpose |
|-------------|---------|
| **MVP-PLAN.md** | Complete implementation plan with phases, architecture, and decisions |
| **VISION.md** | Product vision and philosophy |
| **prompts/** | LLM prompt templates (refined from prototype) |
| **fixtures/** | Test fixture templates (to be populated) |

## Starting the New Project

### 1. Create New Repository
```bash
mkdir codewiki-saas
cd codewiki-saas
git init
npm init -y
```

### 2. Copy Resources
```bash
cp -r /path/to/fresh-start/* .
mv prompts src/prompts  # or wherever you want them
```

### 3. Install Dependencies
```bash
npm install express mongodb express-session connect-mongo \
  @anthropic-ai/sdk @octokit/rest dotenv pino

npm install -D jest @playwright/test
```

### 4. Follow MVP-PLAN.md
Work through phases 0-8 in order.

## What's NOT Here (Reference Prototype For)

These items exist in the prototype but weren't copied. Reference as needed:

| Item | Location in Prototype | When to Reference |
|------|----------------------|-------------------|
| Agent implementation patterns | `lib/agents/*.js` | When building agents |
| ClaudeClient cost tracking | `lib/claude.js` | When implementing LLM adapter |
| WikiManager file operations | `lib/wiki-manager.js` | For understanding wiki structure |
| MCP server protocol | `mcp-server.js` | When implementing MCP |
| Test mocking patterns | `tests/setup.js` | When setting up test mocks |
| E2E test structure | `tests/e2e/*.spec.js` | When writing Playwright tests |

## Key Learnings from Prototype

### What Worked
- Prompt templates (included in `prompts/`)
- Agent concept categorization (concept/component/guide)
- Cost tracking per API call
- Wiki frontmatter format
- MCP query_wiki tool design

### What to Do Differently
- **MongoDB from start** - Not file-based storage
- **Standard agent interface** - shouldRun + execute with injected deps
- **API tests as primary** - Not unit tests for everything
- **Clean architecture** - adapters/repositories/services/utils
- **No dashboard frontend** - Build API first, UI later

## Prompt Templates

The `prompts/` folder contains:
- `code-analysis.txt` - Extract concepts from diffs
- `documentation-writer.txt` - Generate wiki page content
- `wiki-index.txt` - Generate index page
- `guide-generation.txt` - Create how-to guides
- `architecture-overview.txt` - System overview
- `meta-analysis.txt` - Progress analysis
- `meta-document-ingestion.txt` - Process Idea.md/Spec files
- `security-analysis.txt` - Find security issues
- `tech-debt-analysis.txt` - Identify technical debt

These have been refined through prototype development and handle edge cases well.

## Test Fixtures

Create fixtures in `fixtures/` for:

### GitHub API
- `github/user.json` - User profile
- `github/repos.json` - Repository list
- `github/commits.json` - Commit history
- `github/commit-detail.json` - Single commit with files

### Anthropic API
- `anthropic/code-analysis.json` - Analysis response
- `anthropic/documentation.json` - Doc writer response
- `anthropic/index.json` - Index generation response

### Stripe API (future)
- `stripe/customer.json`
- `stripe/subscription.json`

## Definition of Done

**Per task**: Tests pass, no regressions, committed

**Per phase**: All tasks done, full suite passes, smoke tested

---

## Quick Reference

**Tech Stack**: Node.js, Express, MongoDB, Jest, Playwright

**Testing**: API tests primary, E2E for happy paths, unit tests selective

**Mocking**: Real MongoDB, mock only GitHub/Anthropic/Stripe

**Architecture**: adapters → services → repositories → routes
