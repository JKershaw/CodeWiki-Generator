# CodeWiki-Generator

An automated wiki generation system that creates and maintains comprehensive documentation for code repositories. This tool leverages AI-powered content generation, hierarchical metadata management, and automated navigation to transform codebases into well-organized, searchable wikis.

## Concepts

Core architectural patterns and design principles that drive the wiki generation system:

- [Automated wiki navigation generation](concepts/automated-wiki-navigation-generation.md) - Dynamic generation of navigation structures and index pages
- [Category-aware routing system](concepts/category-aware-routing-system.md) - Intelligent routing based on content categorization and metadata
- [Category-based page organization](concepts/category-based-page-organization.md) - Hierarchical organization of wiki content by functional categories
- [Concept format migration pattern](concepts/concept-format-migration-pattern.md) - Systematic approach to evolving and migrating documentation formats
- [Cost-Aware Processing](concepts/cost-aware-processing.md) - Optimization strategies to minimize computational and API costs
- [Cost-aware testing](concepts/cost-aware-testing.md) - Testing methodologies that balance coverage with resource consumption
- [Flexible concept representation](concepts/flexible-concept-representation.md) - Adaptable content models that support diverse documentation needs
- [Global metadata tracking system](concepts/global-metadata-tracking-system.md) - Centralized system for managing metadata across all wiki pages
- [Global metadata tracking](concepts/global-metadata-tracking.md) - Comprehensive tracking of page states, dependencies, and processing history
- [Graceful degradation for non-critical operations](concepts/graceful-degradation-for-non-critical-operations.md) - Resilient handling of failures in non-essential processes
- [Hierarchical metadata architecture](concepts/hierarchical-metadata-architecture.md) - Structured metadata organization supporting inheritance and composition
- [Local Development Testing](concepts/local-development-testing.md) - Development workflow optimized for local testing and iteration
- [Meta-Analysis Integration](concepts/meta-analysis-integration.md) - System for analyzing and improving documentation quality and coverage
- [Mock GitHub Client Pattern](concepts/mock-git-hub-client-pattern.md) - Testing pattern for simulating GitHub API interactions
- [Options-based API pattern](concepts/options-based-api-pattern.md) - Flexible API design using configuration objects for extensibility
- [Page lifecycle metadata management](concepts/page-lifecycle-metadata-management.md) - Comprehensive tracking of page creation, updates, and dependencies
- [Phase-based processing workflow](concepts/phase-based-processing-workflow.md) - Sequential processing pipeline with clear separation of concerns
- [Processing state normalization](concepts/processing-state-normalization.md) - Consistent state representation across different processing phases
- [Repository-Level Processing](concepts/repository-level-processing.md) - Holistic approach to analyzing and documenting entire repositories
- [Self-documentation workflow](concepts/self-documentation-workflow.md) - Automated process for documenting the documentation system itself
- [Self-testing pattern](concepts/self-testing-pattern.md) - Recursive testing approach where the system validates its own functionality
- [Stateful Processing with Resume Capability](concepts/stateful-processing-with-resume-capability.md) - Robust processing pipeline with checkpoint and resume functionality
- [Template-driven AI content generation](concepts/template-driven-ai-content-generation.md) - Structured approach to generating consistent, high-quality content using AI
- [Wiki index generation](concepts/wiki-index-generation.md) - Automated creation of navigation and overview pages
- [Wiki page lifecycle management](concepts/wiki-page-lifecycle-management.md) - Complete workflow for creating, updating, and maintaining wiki pages

## Components

Key architectural components and modules that implement the wiki generation functionality:

- [_metadata.json file format](components/_metadata.json-file-format.md) - Standardized metadata format for tracking page and processing information
- [Categorized concept extraction](components/categorized-concept-extraction.md) - Intelligent extraction and categorization of concepts from source code
- [Git Integration Layer](components/git-integration-layer.md) - Abstraction layer for version control operations and repository management
- [Local git integration](components/local-git-integration.md) - Direct integration with local git repositories for development workflows
- [Mock GitHub client pattern](components/mock-git-hub-client-pattern.md) - Testing infrastructure for GitHub API interactions without external dependencies
- [WikiIndexAgent](components/wiki-index-agent.md) - Specialized agent responsible for generating and maintaining wiki navigation

## Guides

Practical guides for using and extending the wiki generation system:

- [Safe output isolation](guides/safe-output-isolation.md) - Best practices for isolating generated content and preventing data corruption

## Navigation

This wiki is automatically generated and maintained by the CodeWiki-Generator system. Each page includes metadata about its generation process and relationships to other content. Use the category-based organization above to explore different aspects of the system, or browse the automatically generated cross-references within individual pages to discover related concepts and components.
