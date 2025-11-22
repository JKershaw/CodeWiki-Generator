---
title: CodeWiki Generator - Development Wiki
created: 2025-11-22
updated: 2025-11-22
---

# CodeWiki Generator - Development Wiki

Welcome to the development wiki for CodeWiki Generator. This wiki documents the architecture, components, and development practices for this project.

## What is CodeWiki Generator?

An autonomous system that generates and maintains comprehensive wiki documentation by progressively analyzing git history. The system uses AI (Claude) to understand code changes and create living documentation that evolves with your codebase.

## Key Concept

**This system documents itself.** As we build the CodeWiki Generator, we run it on its own codebase to generate this documentation. If the documentation is unclear or incomplete, that reveals flaws in the documentation system itself.

## Documentation Structure

### Concepts
High-level architectural concepts, patterns, and mental models:
- [Architecture](concepts/architecture.md) - Overall system design
- [Agent System](concepts/agent-system.md) - AI agent architecture

### Components
Detailed documentation of individual code modules:

**Core Infrastructure:**
- [WikiManager](components/wiki-manager.md) - Read/write wiki markdown files
- [StateManager](components/state-manager.md) - Processing state persistence
- [GitHub Integration](components/github-integration.md) - Fetch repository data

**AI System:**
- [Claude Client](components/claude-client.md) - Anthropic SDK wrapper with cost tracking
- [Prompt Manager](components/prompt-manager.md) - Template system for AI prompts

**AI Agents:**
- [Agent System Overview](components/agents/overview.md) - Architecture of the AI agent pipeline
- [Code Analysis Agent](components/agents/code-analysis.md) - Analyzes code changes
- [Documentation Writer Agent](components/agents/documentation-writer.md) - Generates markdown docs
- [Meta-Analysis Agent](components/agents/meta-analysis.md) - Identifies patterns and gaps

**Processing Engine:**
- [Processor](components/processor.md) - Main orchestration layer coordinating all components

### Guides
How-to guides and operational documentation:
- [Getting Started](guides/getting-started.md) - Setup and installation
- [Testing Approach](guides/testing-approach.md) - TDD methodology
- [Processing Logic](guides/processing-logic.md) - Decision trees and processing algorithms

## Development Status

✅ **Phase 1 Complete**: Core Infrastructure (WikiManager, StateManager, GitHub Integration)
✅ **Phase 2 Complete**: AI Agent System (Claude Client, Agents, Prompt Templates)
✅ **Phase 3 Complete**: Processing Engine (Commit Processor, Repository Processor)
🚧 **Phase 4 In Progress**: Web Interface

## Navigation

Use the links above to explore the documentation. Each page includes frontmatter with related pages for easy navigation.
