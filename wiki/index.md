# CodeWiki-Generator

CodeWiki-Generator is an intelligent documentation system that automatically generates comprehensive wikis for codebases using LLM-powered agents. The system analyzes repository structure, synthesizes architectural insights, and creates organized documentation that helps developers understand and navigate complex projects.

## Concepts

Core architectural patterns and methodologies that drive the wiki generation system:

- [Architecture synthesis agent pattern](concepts/architecture-synthesis-agent-pattern.md) - Pattern for agents that analyze and synthesize architectural insights from codebases
- [Category-based content organization](concepts/category-based-content-organization.md) - Strategy for organizing documentation into logical categories for better navigation
- [JSON response cleaning for LLM APIs](concepts/json-response-cleaning-for-llm-apis.md) - Techniques for sanitizing and validating JSON responses from language models
- [Operational documentation generation](concepts/operational-documentation-generation.md) - Automated creation of deployment, configuration, and operational guides
- [Repository fingerprinting](concepts/repository-fingerprinting.md) - Method for analyzing and characterizing repository structure and patterns
- [Resilient LLM response parsing](concepts/resilient-llm-response-parsing.md) - Robust parsing strategies for handling unpredictable LLM outputs
- [System-level documentation generation](concepts/system-level-documentation-generation.md) - Generation of high-level architectural and system documentation
- [Wiki index generation with auto-navigation](concepts/wiki-index-generation-with-auto-navigation.md) - Automated creation of navigation indexes for generated documentation

## Components

Key system components and architectural elements:

- [ArchitectureOverviewAgent](components/architecture-overview-agent.md) - Agent responsible for generating high-level architectural documentation
- [GuideGenerationAgent](components/guide-generation-agent.md) - Specialized agent for creating practical guides and tutorials
- [Progressive JSON repair strategy](components/progressive-json-repair-strategy.md) - Multi-stage approach to fixing malformed JSON responses
- [Repository Structure Analysis](components/repository-structure-analysis.md) - Component for analyzing and mapping repository organization
- [Architecture](concepts/architecture.md) - System architecture overview and design decisions

## Guides

Practical documentation for using and extending the system:

- [Getting Started](guides/getting-started.md) - Quick start guide for setting up and running the wiki generator
- [Extension Patterns](guides/extension-patterns.md) - Patterns and best practices for extending the system with new agents
- [Testing Approach](guides/testing-approach.md) - Testing strategies and methodologies used in the project
- [Troubleshooting](guides/troubleshooting.md) - Common issues and solutions for wiki generation problems

## Navigation

Start with the [Getting Started](guides/getting-started.md) guide to quickly begin using CodeWiki-Generator. For understanding the system design, review the [Architecture](concepts/architecture.md) overview. Explore the **Concepts** section to understand the underlying patterns and methodologies that make the system work effectively.
