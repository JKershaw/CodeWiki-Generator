# Getting Started

## Introduction

Welcome to CodeWiki-Generator! This guide will help you set up the repository, understand its structure, and run tests. Whether you're contributing new features or exploring the codebase, this is your starting point.

## Prerequisites

Before you begin, ensure you have:
- **Node.js**: Version 14.0 or higher
- **npm**: Version 6.0 or higher (comes with Node.js)
- **Git**: For cloning and version control
- A code editor (VS Code, WebStorm, etc.)

Verify your installation:
```bash
node --version
npm --version
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/CodeWiki-Generator.git
cd CodeWiki-Generator
```

2. Install dependencies:
```bash
npm install
```

This installs all packages listed in `package.json`, including Jest for testing.

## Project Structure

Key directories and files in this repository:

```
CodeWiki-Generator/
├── package.json              # Project metadata and npm scripts
├── jest.config.js            # Jest testing configuration
├── src/                       # Source code
│   ├── config/               # Configuration modules
│   ├── state/                # State management
│   ├── wiki/                 # Wiki operations
│   └── utils/                # Utility functions
├── tests/                    # Test files (Jest)
├── docs/                     # Documentation
│   └── concepts/             # Conceptual guides
└── README.md                 # Repository overview
```

## Understanding Key Components

The codebase implements several important patterns:

- **Configuration Validation Pattern**: Centralized config management with validation
- **Persistent State Management**: File-based state with directory handling
- **Frontmatter-based Serialization**: Markdown pages with YAML frontmatter
- **Environment-based Configuration**: Separate test and production modes
- **Wiki Markdown Management**: Core system for managing wiki content

See the existing wiki structure for detailed concept explanations.

## Running Tests

Jest is configured for this project. Tests are essential to verify your changes work correctly.

Run all tests:
```bash
npm test
```

Run tests in watch mode (reruns on file changes):
```bash
npm test -- --watch
```

Run tests with coverage report:
```bash
npm test -- --coverage
```

Run a specific test file:
```bash
npm test -- path/to/test.js
```

### Expected Test Output

When tests run successfully, you'll see:
```
PASS  tests/wiki.test.js
PASS  tests/state.test.js
PASS  tests/config.test.js

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
```

## Development Workflow

1. **Create a new branch** for your work:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** to the source code in the `src/` directory

3. **Write or update tests** for your changes in the `tests/` directory

4. **Run tests** to verify everything works:
```bash
npm test
```

5. **Check test coverage** to ensure adequate testing:
```bash
npm test -- --coverage
```

## Next Steps

Now that you have the project running, explore these guides:

- **Testing Approach** - Learn the testing patterns and conventions used in this codebase
- **Extension Patterns** - Understand how to add new features following established patterns
- **Configuration** - Detailed guide on configuring the system for different environments

For conceptual understanding, review:
- `Automatic Metadata Lifecycle Management` - How metadata is managed
- `Source Code Organization Pattern` - How the codebase is structured
- `State Schema Validation Pattern` - How state validation works

## Troubleshooting

**Tests won't run:**
- Ensure all dependencies are installed: `npm install`
- Clear Jest cache: `npm test -- --clearCache`
- Check Node.js version: `node --version` (should be 14+)

**Port already in use:**
- If the application runs on a specific port, check what's using it
- Change the port in configuration if needed

**Module not found errors:**
- Run `npm install` again to ensure all packages are installed
- Delete `node_modules/` and reinstall: `rm -rf node_modules && npm install`