---
related: [concepts/web-dashboard-architecture.md, concepts/related-pages-discovery-system.md, concepts/test-coverage-discovery-and-analysis.md, concepts/enhanced-documentation-metadata-system.md, components/wiki-manager-integration.md]
updated: 2025-11-23
---

# CodeWiki-Generator Architecture

## System Overview

CodeWiki-Generator is an intelligent documentation system that automatically generates interconnected wiki pages from source code repositories. The system analyzes code structure, tests, and relationships to create context-enriched documentation with intelligent cross-linking between related concepts, components, and code examples. Unlike static documentation generators, it discovers and maintains semantic relationships between code elements, creating a living knowledge graph that helps developers understand both individual components and their broader system context.

## Core Architecture

The system follows an **agent-based architecture** with specialized discovery agents that analyze different aspects of the codebase independently before coordinating their findings. This design enables parallel processing of large codebases while maintaining separation of concerns between different types of analysis (structural, semantic, test coverage, etc.).

The core pattern is a **two-phase processing pipeline**: Phase 1 focuses on content extraction and analysis, while Phase 2 handles relationship discovery and cross-linking. This separation allows for incremental updates and selective regeneration when code changes, rather than requiring full system rebuilds.

A **[Web dashboard architecture](../concepts/web-dashboard-architecture.md)** provides both human-readable interfaces and API endpoints for programmatic access, supporting both interactive exploration and integration with existing development workflows.

## Major Components

### [WikiManager Integration](../components/wiki-manager-integration.md)
The central orchestrator that coordinates all documentation generation activities. It manages the overall workflow, maintains system state, and provides the primary API interface for triggering documentation updates and retrieving generated content.

### [LinkDiscoveryAgent](../components/link-discovery-agent.md)
Implements the **[Related pages discovery system](../concepts/related-pages-discovery-system.md)** by analyzing code relationships, import patterns, and semantic connections between modules. This agent builds the foundation for the **[Cross-linking system](../concepts/cross-linking-system.md)** by identifying which pages should reference each other and why.

### [Test Coverage Discovery and Analysis](../concepts/test-coverage-discovery-and-analysis.md)
Scans the codebase to identify test files, extract test cases, and map them to their corresponding production code. This component enables **[Test-aware documentation generation](../concepts/test-aware-documentation-generation.md)** by ensuring that documentation includes relevant test examples and coverage information.

### Test-driven Code Example Extraction
Processes identified test cases to extract meaningful code examples that demonstrate actual usage patterns. Works closely with the test coverage component to provide practical examples that are guaranteed to be current and functional.

### [Enhanced Documentation Metadata System](../concepts/enhanced-documentation-metadata-system.md)
Manages structured metadata for all generated pages, including relationships, tags, categories, and cross-references. This component maintains the data structures that enable sophisticated querying and navigation of the documentation graph.

### [Cross-page Linking System](../concepts/cross-page-linking-system.md)
Implements the **[Two-phase cross-linking system](../concepts/two-phase-cross-linking-system.md)** by first identifying potential link targets (Phase 1) and then resolving and inserting actual links (Phase 2). This component ensures that the generated documentation forms a coherent, navigable knowledge graph rather than isolated pages.

### [Production-ready Server Setup](../components/production-ready-server-setup.md)
Provides the web interface and API layer for accessing generated documentation. Handles authentication, caching, incremental updates, and serves both the dashboard interface and programmatic access points.

## Data Flow

The system processes repositories through a structured pipeline:

```
Repository Input → Discovery Agents → Content Generation → Cross-linking → Web Interface

Phase 1: Analysis
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Source Code │───→│ LinkDiscovery    │───→│ Metadata        │
│ Repository  │    │ Agent            │    │ Extraction      │
└─────────────┘    └──────────────────┘    └─────────────────┘
       │                     │                       │
       ▼                     ▼                       ▼
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Test Files  │───→│ Test Coverage    │───→│ Code Examples   │
│             │    │ Analysis         │    │ & Usage         │
└─────────────┘    └──────────────────┘    └─────────────────┘

Phase 2: Synthesis
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Relationship    │───→│ Cross-page       │───→│ Final Wiki      │
│ Discovery       │    │ Link Generation  │    │ Pages           │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Key Design Decisions

### Two-Phase Processing Architecture
**Choice**: Separate discovery/analysis (Phase 1) from relationship building and linking (Phase 2)
**Rationale**: Enables incremental updates when only portions of the codebase change, improves performance on large repositories, and allows for better error isolation and debugging
**Trade-offs**: Increased complexity and temporary storage requirements, but significantly better scalability and maintainability

### Agent-Based Discovery System
**Choice**: Use specialized agents for different types of analysis rather than monolithic processors
**Rationale**: Each type of analysis (structural, semantic, test-related) has different requirements and can benefit from specialized algorithms; parallel processing improves performance
**Trade-offs**: More complex coordination logic, but much better extensibility and the ability to optimize each analysis type independently

### [Context-Enriched Documentation Generation](../concepts/context-enriched-documentation-generation.md)
**Choice**: Generate documentation that includes not just API details but also usage patterns, relationships, and test examples
**Rationale**: Developers need to understand not just what code does, but how it fits into the larger system and how to use it effectively
**Trade-offs**: Significantly more processing time and complexity, but creates documentation that is actually useful for onboarding and maintenance

### Test-Aware Documentation Strategy
**Choice**: Integrate test analysis as a first-class concern rather than treating it as an afterthought
**Rationale**: Tests provide the most reliable examples of how code is actually used; they're guaranteed to be current and functional
**Trade-offs**: Requires sophisticated test discovery and analysis, but results in documentation with practical, working examples

### Web Dashboard Over Static Files
**Choice**: Provide an interactive web interface rather than generating static HTML files
**Rationale**: Enables real-time queries, dynamic cross-linking, search functionality, and integration with development workflows
**Trade-offs**: Requires server infrastructure and is more complex than static generation, but provides a much richer user experience

## Extension Points

The system provides several well-defined extension points for customization:

**Discovery Agents**: Implement the agent interface to add new types of analysis (performance metrics, security scanning, dependency analysis, etc.). New agents automatically participate in the two-phase processing pipeline.

**Link Discovery Strategies**: Extend the **[Related pages discovery system](../concepts/related-pages-discovery-system.md)** with domain-specific relationship detection algorithms. The system supports pluggable strategies for different types of codebases or frameworks.

**Metadata Extractors**: Add custom metadata extraction for specialized file types, annotations, or documentation formats through the **[Enhanced documentation metadata system](../concepts/enhanced-documentation-metadata-system.md)**.

**Output Formats**: While the core system generates web-based documentation, the structured data layer can support additional output formats (PDF, confluence, static sites) through custom renderers.

**Dashboard Widgets**: The **[Web dashboard architecture](../concepts/web-dashboard-architecture.md)** supports custom widgets and views for specific development team needs or integration with other tools.

**Test Analysis Plugins**: Extend **[Test coverage discovery and analysis](../concepts/test-coverage-discovery-and-analysis.md)** to support additional testing frameworks, custom assertion patterns, or specialized test types.
