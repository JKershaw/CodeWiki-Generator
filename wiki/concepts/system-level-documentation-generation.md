---
title: System-level documentation generation
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# System-level Documentation Generation

System-level documentation generation synthesizes individual component documentation into comprehensive architectural overviews. This capability transforms isolated documentation pieces into cohesive system understanding by analyzing existing wiki content and generating high-level architectural insights.

## Key Functionality

The system operates through the `ArchitectureOverviewAgent` which performs three core functions:

1. **Content Categorization** - Retrieves all existing wiki pages and organizes them into concepts, components, and guides based on their location and content type
2. **Synthesis Analysis** - Analyzes categorized content to identify system patterns, relationships, and architectural themes
3. **Overview Generation** - Creates comprehensive architecture documentation that captures system-wide understanding in `concepts/architecture.md`

The agent integrates into the post-processing workflow, executing after individual component documentation is complete but before final wiki indexing.

### Processing Workflow

```
Individual Components → Documentation Generation → Architecture Analysis → System Overview
```

The `generateArchitectureOverview` function orchestrates this process by:
- Querying WikiManager for all existing documentation pages
- Categorizing content by directory structure and content type
- Generating synthesized documentation using the same LLM infrastructure as other agents

## Relationships

**Integration Points:**
- Executes alongside `DocumentationWriterAgent` and other agents in the main processor workflow
- Depends on `WikiManager` for accessing all existing wiki content
- Runs in post-processing phase with guide generation and wiki indexing
- Outputs follow established wiki structure conventions

**Data Flow:**
- Consumes: All existing wiki documentation pages
- Processes: Content categorization and architectural synthesis
- Produces: System-level architecture overview documentation

The architecture overview agent represents the culmination of the documentation generation pipeline, transforming component-level understanding into system-wide architectural knowledge that helps users understand how all pieces fit together.