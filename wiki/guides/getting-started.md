---
related: [components/guide-generation-agent.md]
updated: 2025-11-23
---

# Getting Started

## Introduction

This guide helps you set up and run the CodeWiki-Generator for the first time. This tool automatically generates comprehensive documentation wikis for code repositories using AI agents.

## Prerequisites

- Node.js (version 14 or higher)
- npm package manager
- Access to repository you want to document

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

## First Run

1. **Configure your target repository**
   - Ensure the repository you want to document is accessible
   - The system uses Repository Structure Analysis to fingerprint codebases

2. **Generate documentation**
   - The [ArchitectureOverviewAgent](../components/architecture-overview-agent.md) will analyze your repository structure
   - The [GuideGenerationAgent](../components/guide-generation-agent.md) will create operational guides
   - Wiki index generation will create auto-navigation

3. **Review output**
   - Generated documentation follows the [category-based content organization](../concepts/category-based-content-organization.md) pattern
   - Check for concepts/architecture.md and index.md files

## Understanding the Output

The generator creates:
- **Concepts**: Architecture patterns and design principles
- **Components**: Code structure documentation
- **Guides**: Operational documentation (like this guide)

## Next Steps

- Review the generated concepts/architecture.md for system overview
- Check the index.md for navigation structure
- Explore the Testing Approach guide to contribute improvements
- See Extension Patterns guide to add new documentation types