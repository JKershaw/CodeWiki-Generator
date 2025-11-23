# CodeWiki-Generator

CodeWiki-Generator is an intelligent documentation system that automatically generates comprehensive wikis from code repositories. It uses AI agents to analyze repository structure, synthesize architectural overviews, and create organized documentation with automatic navigation.

## Concepts

Core architectural patterns and design principles that drive the system:

- [Architecture synthesis agent pattern](concepts/architecture-synthesis-agent-pattern.md) - AI-driven approach to automatically generating system architecture documentation
- [Category-based content organization](concepts/category-based-content-organization.md) - Structured approach to organizing wiki content into logical categories
- [JSON response cleaning for LLM APIs](concepts/json-response-cleaning-for-llm-apis.md) - Techniques for sanitizing and validating JSON responses from language models
- [Operational documentation generation](concepts/operational-documentation-generation.md) - Automated creation of deployment and operational guides
- [Repository fingerprinting](concepts/repository-fingerprinting.md) - Method for analyzing and characterizing code repository structure
- [Resilient LLM response parsing](concepts/resilient-llm-response-parsing.md) - Robust strategies for handling malformed or incomplete AI responses
- [System-level documentation generation](concepts/system-level-documentation-generation.md) - Comprehensive approach to creating high-level system documentation
- [Wiki index generation with auto-navigation](concepts/wiki-index-generation-with-auto-navigation.md) - Automatic creation of navigation hubs for wiki content

## Components

Key system components and architectural elements:

- [ArchitectureOverviewAgent](components/architecture-overview-agent.md) - AI agent responsible for generating high-level system architecture documentation
- [GuideGenerationAgent](components/guide-generation-agent.md) - Specialized agent for creating user guides and tutorials
- [Progressive JSON repair strategy](components/progressive-json-repair-strategy.md) - Multi-stage approach to fixing malformed JSON responses
- [Repository Structure Analysis](components/repository-structure-analysis.md) - Component for analyzing and understanding repository organization
- [System Architecture](concepts/architecture.md) - Overall system design and component relationships

## Guides

Practical documentation for users and developers:

- [Getting Started](guides/getting-started.md) - Quick start guide for setting up and using the system
- [Extension Patterns](guides/extension-patterns.md) - How to extend and customize the wiki generation system
- [Testing Approach](guides/testing-approach.md) - Guidelines for testing wiki generation components
- [Troubleshooting](guides/troubleshooting.md) - Common issues and solutions

## Navigation Tips

- Start with the [Getting Started](guides/getting-started.md) guide for initial setup
- Review the [System Architecture](concepts/architecture.md) to understand the overall design
- Explore [Concepts](concepts/) for deep dives into design patterns and principles
- Check [Components](components/) for implementation details of specific system parts
- Use [Guides](guides/) for practical usage and customization information
