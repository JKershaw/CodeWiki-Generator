# CodeWiki-Generator Architecture

## System Overview

CodeWiki-Generator is an intelligent documentation system that automatically analyzes code repositories and generates comprehensive, structured wikis. It uses specialized AI agents to understand repository structure, extract architectural patterns, and create developer-focused documentation that evolves with the codebase. The system transforms raw source code into navigable knowledge bases that help teams understand, maintain, and extend their software systems.

## Core Architecture

The system follows an **agent-based architecture** with specialized AI agents responsible for different aspects of documentation generation. This design leverages the **Architecture synthesis agent pattern** to break down complex documentation tasks into focused, expert-level analysis components. Each agent operates independently but collaborates through a shared understanding of repository structure and content organization principles.

The architecture emphasizes **resilient processing** and **progressive enhancement**, allowing the system to handle diverse repository types while gracefully recovering from parsing errors or incomplete analysis. All generated content follows **Category-based content organization** to ensure consistency and discoverability.

## Major Components

### Repository Structure Analysis
The foundation component that performs **Repository fingerprinting** to understand codebase organization, technology stack, and architectural patterns. It creates a comprehensive map of the repository that guides all downstream documentation generation, identifying key directories, file types, and structural relationships.

### ArchitectureOverviewAgent
Responsible for **System-level documentation generation** by analyzing the entire codebase to identify high-level patterns, component relationships, and architectural decisions. This agent synthesizes information from multiple sources to create comprehensive architecture documentation that provides mental models for developers.

### GuideGenerationAgent
Handles **Operational documentation generation** and **Operational Guide Generation** by analyzing code patterns, configuration files, and existing documentation to create step-by-step procedures. It focuses on translating technical implementation details into actionable guidance for developers and operators.

### Progressive JSON repair strategy
A critical infrastructure component that implements **Resilient LLM response parsing** and **JSON response cleaning for LLM APIs**. This component ensures reliable communication with AI services by automatically detecting and correcting malformed responses, enabling robust operation even when LLM outputs are incomplete or incorrectly formatted.

### Wiki Index Generation System
Implements the **Wiki index generation system** and **Wiki index generation with auto-navigation** patterns to create navigable documentation structures. This component automatically organizes generated content into logical hierarchies and creates cross-references that help users discover related information.

### Content Organization Engine
Manages the **Category-based content organization** by classifying generated documentation into Concepts, Components, and Guides. This engine ensures consistent information architecture across all generated documentation and maintains clear separation between different types of knowledge.

### LLM Integration Layer
Handles all interactions with language models, implementing retry logic, response validation, and error recovery. This layer abstracts the complexity of AI service communication and provides reliable interfaces for all documentation generation agents.

## Data Flow

The system processes repositories through a multi-stage pipeline that progressively builds understanding and generates documentation:

```
Repository Input
       ↓
Repository Structure Analysis
       ↓
[Fingerprinting & Pattern Detection]
       ↓
Parallel Agent Processing
       ↓
┌─────────────────┬─────────────────┬─────────────────┐
│ Architecture    │ Guide           │ Content         │
│ Overview Agent  │ Generation      │ Organization    │
│                 │ Agent           │ Engine          │
└─────────────────┴─────────────────┴─────────────────┘
       ↓                 ↓                 ↓
JSON Response Processing (Progressive Repair)
       ↓
Content Classification & Organization
       ↓
Wiki Index Generation
       ↓
Final Documentation Structure
```

Information flows bidirectionally between agents, with each component contributing insights that enhance the analysis of others. The Progressive JSON repair strategy operates as a cross-cutting concern, ensuring reliable data exchange throughout the pipeline.

## Key Design Decisions

### Agent-Based Decomposition
**Choice**: Separate specialized agents for different documentation types rather than a monolithic generator
**Rationale**: Different documentation types (architecture overviews, operational guides, component descriptions) require distinct analytical approaches and domain expertise
**Trade-offs**: Increased system complexity but significantly better output quality and maintainability

### Progressive JSON Repair Strategy
**Choice**: Implement sophisticated error recovery for LLM responses instead of simple retry mechanisms
**Rationale**: LLMs frequently produce malformed JSON that contains valuable content but fails strict parsing
**Trade-offs**: Additional processing overhead but dramatically improved reliability and content recovery rates

### Category-Based Organization
**Choice**: Enforce strict categorization of all generated content into Concepts, Components, and Guides
**Rationale**: Developers need predictable information architecture to quickly locate relevant documentation
**Trade-offs**: Some content may not fit perfectly into categories, but the consistency benefits outweigh edge case complexity

### Repository Fingerprinting Approach
**Choice**: Comprehensive upfront analysis before documentation generation begins
**Rationale**: Understanding repository structure and patterns enables more accurate and contextually appropriate documentation
**Trade-offs**: Higher initial processing time but significantly better documentation quality and relevance

### Resilient Processing Model
**Choice**: Design all components to gracefully handle partial failures and continue processing
**Rationale**: Documentation generation should provide value even when some analysis steps fail or produce incomplete results
**Trade-offs**: More complex error handling logic but much better user experience and system reliability

## Extension Points

The system provides several well-defined extension mechanisms for customization and enhancement:

**Custom Agents**: Developers can implement new specialized agents by following the established agent interface pattern. New agents automatically benefit from the shared Repository Structure Analysis and Progressive JSON repair strategy infrastructure.

**Content Categories**: The Category-based content organization system supports additional documentation types beyond Concepts, Components, and Guides through configuration-driven category definitions.

**Repository Analysis Plugins**: The Repository fingerprinting system accepts custom analyzers for specific technologies, frameworks, or architectural patterns not covered by the default implementation.

**Output Format Adapters**: The Wiki index generation system supports pluggable formatters for different documentation platforms (GitHub wikis, GitLab pages, custom static site generators).

**LLM Provider Integration**: The LLM Integration Layer provides a standardized interface for adding support for new language model services while leveraging existing Resilient LLM response parsing capabilities.

**Template Customization**: All documentation generation follows template-driven approaches, allowing organizations to customize output formats, styling, and content structure while maintaining the underlying analytical capabilities.
