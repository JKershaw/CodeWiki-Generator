---
related: [components/wiki-manager-integration.md, concepts/web-dashboard-architecture.md, concepts/two-phase-cross-linking-system.md, components/link-discovery-agent.md, concepts/cross-linking-system.md]
updated: 2025-11-23
---

# Getting Started

This guide will help you set up and run the CodeWiki-Generator for the first time.

## Who This Guide Is For

Developers who want to:
- Set up the CodeWiki-Generator locally
- Generate documentation for their code repositories
- Understand the basic workflow

## Prerequisites

- Node.js (version 14 or higher)
- npm package manager
- A code repository you want to generate documentation for

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodeWiki-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm test
   ```
   This runs the Jest test suite to ensure everything is working correctly.

## First Run

1. **Generate documentation for a sample repository**
   The [WikiManager integration](../components/wiki-manager-integration.md) is the core component that orchestrates documentation generation.

2. **Start the web dashboard** (if available)
   The [web dashboard architecture](../concepts/web-dashboard-architecture.md) provides a user interface for viewing generated documentation.

3. **Explore the output**
   Generated documentation will include:
   - Context-enriched documentation with enhanced metadata
   - Cross-linked pages using the [two-phase cross-linking system](../concepts/two-phase-cross-linking-system.md)
   - Test-aware documentation with coverage analysis

## Key Features You'll Use

- **[LinkDiscoveryAgent](../components/link-discovery-agent.md)**: Automatically discovers relationships between code components
- **[Cross-linking system](../concepts/cross-linking-system.md)**: Creates navigable connections between documentation pages
- **Test coverage discovery**: Integrates test information into documentation
- **Related pages discovery**: Suggests relevant documentation sections

## Next Steps

- Review the [Testing Approach](testing-approach.md) to understand how to run and write tests
- Check out [Development Workflow](development-workflow.md) for contribution guidelines
- Explore the [Architecture](../concepts/architecture.md) to understand the system design

## Troubleshooting

If you encounter issues during setup:
1. Ensure Node.js and npm are properly installed
2. Check that all dependencies installed without errors
3. Run `npm test` to verify the test suite passes
4. Review any error messages for missing dependencies or configuration issues