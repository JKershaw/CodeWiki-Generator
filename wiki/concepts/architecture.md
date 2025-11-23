# CodeWiki-Generator Architecture

## System Overview

CodeWiki-Generator is an autonomous documentation system that analyzes software repositories and generates comprehensive, structured wikis using AI agents. The system transforms raw codebases into navigable documentation by extracting architectural patterns, generating operational guides, and creating organized content hierarchies. It bridges the gap between code implementation and human understanding through intelligent content synthesis and automated knowledge organization.

## Core Architecture

The system follows an **agent-based architecture** where specialized AI agents handle distinct documentation generation tasks. This approach leverages the **Architecture synthesis agent pattern** to decompose complex repository analysis into focused, composable operations. The architecture emphasizes **Category-based content organization** to ensure generated documentation follows a consistent, discoverable structure across different repository types.

The design prioritizes resilience and extensibility, using progressive repair strategies for handling LLM response variability and modular agent composition for different documentation needs.

## Major Components

### ArchitectureOverviewAgent
The primary orchestrator responsible for **System-level documentation generation**. This agent analyzes repository structure, identifies key architectural patterns, and synthesizes high-level system overviews. It coordinates with other agents to ensure architectural documentation aligns with detailed operational guides.

### GuideGenerationAgent
Handles **Operational Guide Generation** by converting code analysis into step-by-step procedures and operational documentation. This agent specializes in translating technical implementation details into actionable guidance for developers and operators.

### Repository Structure Analysis
The foundational component implementing **Repository fingerprinting** to extract structural metadata, dependency relationships, and architectural signatures from codebases. This analysis drives content generation decisions across all other agents.

### Progressive JSON repair strategy
A critical resilience component providing **Resilient LLM response parsing** through multi-stage error recovery. This strategy handles malformed JSON responses from language models by applying incremental repair techniques rather than failing fast.

### Wiki Index Generation System
Implements the **Wiki index generation system** and **Wiki index generation with auto-navigation** concepts to create discoverable, cross-linked documentation structures. This component ensures generated content is automatically organized and navigable.

### JSON Response Cleaning Pipeline
A specialized processor implementing **JSON response cleaning for LLM APIs** to normalize and validate AI-generated content before integration into documentation structures.

## Data Flow

The system follows a three-phase processing pipeline:

```
Repository Input → Analysis Phase → Generation Phase → Organization Phase
                       ↓               ↓                ↓
                 Fingerprinting → Agent Processing → Wiki Assembly
                       ↓               ↓                ↓
                 Structure Map → Content Generation → Indexed Output
```

**Phase 1: Analysis**
Repository Structure Analysis performs fingerprinting to identify architectural patterns, component relationships, and documentation requirements. This creates a structural map that guides subsequent generation.

**Phase 2: Generation**
Multiple specialized agents (ArchitectureOverviewAgent, GuideGenerationAgent) process the structural map to generate focused documentation components. The Progressive JSON repair strategy ensures reliable content extraction from LLM responses.

**Phase 3: Organization**
The Wiki Index Generation System assembles generated content into navigable structures, applying category-based organization and auto-navigation linking to create the final documentation hierarchy.

## Key Design Decisions

### Agent-Based Decomposition
**Choice**: Split documentation generation across specialized agents rather than a monolithic processor
**Rationale**: Different documentation types (architectural overviews vs operational guides) require distinct analysis approaches and prompt strategies. Agent specialization allows optimization for specific content types.
**Trade-offs**: Increased system complexity and coordination overhead in exchange for higher quality, focused output and easier extensibility.

### Progressive Error Recovery
**Choice**: Implement multi-stage JSON repair instead of retry-based error handling
**Rationale**: LLM responses often contain partially valid content that can be salvaged through incremental repair rather than complete regeneration, reducing API costs and latency.
**Trade-offs**: More complex parsing logic but significantly improved success rates and reduced generation costs.

### Category-Based Content Organization
**Choice**: Enforce a fixed taxonomy (Concepts, Components, Guides) rather than flexible, repository-specific structures
**Rationale**: Consistent organization improves discoverability across different repositories and enables standardized navigation patterns.
**Trade-offs**: Some repository-specific organizational preferences are lost in favor of cross-repository consistency and predictability.

### Fingerprint-Driven Generation
**Choice**: Perform comprehensive upfront analysis before content generation rather than on-demand analysis
**Rationale**: Understanding full repository structure enables better content planning and cross-referencing, resulting in more cohesive documentation.
**Trade-offs**: Higher initial processing overhead but more comprehensive and interconnected final output.

## Extension Points

### Custom Agent Integration
New documentation types can be added by implementing specialized agents following the established pattern. Agents should accept repository fingerprint data and return structured content following the JSON response format expected by the cleaning pipeline.

### Repository Fingerprinting Extensions
The Repository Structure Analysis component can be extended with additional analyzers for specific technology stacks or architectural patterns. New analyzers should contribute to the shared fingerprint structure without breaking existing agent dependencies.

### Content Organization Customization
While the core category structure (Concepts, Components, Guides) is fixed, custom organization rules can be added through the Wiki Index Generation System. Extensions should focus on within-category organization and cross-linking strategies.

### Output Format Adaptation
The system can be extended to generate documentation in formats beyond markdown by implementing alternative renderers that consume the same structured content pipeline output.

### LLM Provider Integration
New language model providers can be integrated by implementing adapters that conform to the expected response format and integrate with the Progressive JSON repair strategy for error handling.
