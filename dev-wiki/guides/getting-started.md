---
title: Getting Started with CodeWiki Generator
created: 2025-11-22
updated: 2025-11-22
related: [Architecture]
---

# Getting Started

This guide helps you set up and start developing the CodeWiki Generator.

## Prerequisites

- Node.js 24.x or higher (currently running on 22.x with warnings)
- Git
- Anthropic API key (for production use)
- GitHub Personal Access Token (optional, for private repos)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CodeWiki-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your API keys (optional for development)
```

## Project Structure

```
CodeWiki-Generator/
├── lib/              # Core library code
│   ├── agents/       # AI agent implementations
│   └── ...           # Other modules
├── views/            # EJS templates
│   └── partials/     # Reusable view components
├── public/           # Static assets (CSS, JS)
├── wiki/             # Generated documentation (gitignored)
├── dev-wiki/         # Hand-written development documentation
├── tests/            # Test files
└── server.js         # Express application entry point
```

## Development Workflow

1. **Test-Driven Development**: Always write tests before implementation
2. **Frequent Commits**: Commit after each passing test or feature
3. **Wiki-Driven Development**: Run the generator on itself after major features
4. **Self-Validation**: If generated docs are unclear, improve the system

## Running Tests

```bash
npm test              # Run all tests once
npm test:watch        # Watch mode for development
```

## Starting the Server

```bash
npm start             # Production mode
npm run dev           # Development mode with auto-reload
```

## Next Steps

- Read [Architecture](../concepts/architecture.md) to understand the system design
- Explore the implementation guide in `ImplementationGuide.md`
- Follow the test-driven development approach
