# CodeWiki-Generator Architecture

## System Overview

CodeWiki-Generator is an intelligent documentation automation system that analyzes software repositories and generates comprehensive, navigable wiki-style documentation. The system uses specialized AI agents to understand repository structure, extract architectural patterns, and produce organized documentation that helps developers quickly understand and navigate unfamiliar codebases. It transforms raw code repositories into structured knowledge bases with automated categorization, cross-referencing, and progressive content generation.

## Core Architecture

The system follows an **agent-based architecture** where specialized AI agents handle distinct aspects of documentation generation. Each agent implements the **architecture synthesis agent pattern**, combining repository analysis with LLM-powered content generation to produce structured documentation. The design emphasizes **resilient LLM response parsing** and **progressive JSON repair strategy** to handle the inherent unpredictability of AI-generated content while maintaining system reliability.

The architecture separates concerns into three distinct layers: analysis (repository fingerprinting and structure analysis), synthesis (content generation via specialized agents), and organization (wiki index generation and category-based content organization). This separation allows for independent scaling and testing of each component while maintaining a cohesive documentation pipeline.

## Major Components

### Repository Structure Analysis
The foundational component that performs **repository fingerprinting** to understand codebase organization, technology stack, and architectural patterns. It creates a structured representation of the repository that feeds into all downstream documentation generation processes.

### ArchitectureOverviewAgent
Specializes in **system-level documentation generation**, analyzing the overall system design and producing high-level architectural documentation. This agent synthesizes information from multiple sources to create comprehensive system overviews that provide mental models for understanding complex codebases.

### GuideGenerationAgent
Handles **operational documentation generation** by creating step-by-step guides, procedures, and how-to documentation. It focuses on **Operational Guide Generation** patterns to produce actionable documentation that helps users accomplish specific tasks within the system.

### Wiki Index Generation System
Manages the **wiki index generation with auto-navigation** by creating structured navigation systems and cross-references between documentation pages. It implements **category-based content organization** to ensure documentation is discoverable and logically organized.

### Progressive JSON Repair Strategy
A critical reliability component that handles **JSON response cleaning for LLM APIs** and provides **resilient LLM response parsing**. This component ensures the system can recover from malformed AI responses and maintain operational continuity even when LLM outputs are imperfect.

### Content Categorization Engine
Orchestrates the **category-based content organization** by automatically classifying generated content into concepts, components, and guides. It maintains consistency across the documentation structure and ensures proper cross-referencing between related content.

### Documentation Pipeline Coordinator
The central orchestration component that manages the end-to-end documentation generation workflow, coordinating between agents and ensuring proper sequencing of analysis, generation, and organization phases.

## Data Flow

The system processes repositories through a multi-stage pipeline:

```
Repository Input
       ↓
Repository Structure Analysis (fingerprinting)
       ↓
Parallel Agent Processing:
├─ ArchitectureOverviewAgent → System docs
├─ GuideGenerationAgent → Operational docs  
└─ [Other specialized agents] → Domain-specific docs
       ↓
Progressive JSON Repair Strategy (response cleaning)
       ↓
Content Categorization Engine
       ↓
Wiki Index Generation System
       ↓
Structured Documentation Output
```

Data flows bidirectionally between the categorization engine and individual agents, allowing for iterative refinement based on emerging patterns in the documentation. The **wiki index generation system** maintains state about the overall documentation structure, enabling dynamic cross-referencing as new content is generated.

## Key Design Decisions

### Agent-Based Content Generation
**Choice**: Implement specialized agents for different documentation types rather than a monolithic generator
**Rationale**: Different documentation types (architectural overviews, operational guides, API references) require distinct analysis approaches and domain expertise. Specialized agents can be optimized for their specific content types and evolved independently.
**Trade-offs**: Increased system complexity and coordination overhead, but gained flexibility, maintainability, and content quality through specialization.

### Progressive JSON Repair Over Strict Validation
**Choice**: Implement progressive repair strategies rather than rejecting malformed LLM responses
**Rationale**: LLMs frequently generate nearly-correct JSON with minor syntax errors. Rather than discarding these responses, the system attempts progressive repair to salvage usable content.
**Trade-offs**: Added complexity in parsing logic, but significantly improved system resilience and reduced waste of expensive LLM processing.

### Category-Based Organization Over Flat Structure
**Choice**: Enforce structured categorization (concepts, components, guides) rather than allowing free-form organization
**Rationale**: Consistent organization patterns make documentation more navigable and predictable across different repositories. The three-category system maps well to how developers think about software systems.
**Trade-offs**: Less flexibility for domain-specific organization, but gained consistency and improved discoverability across projects.

### Repository Fingerprinting Over File-by-File Analysis
**Choice**: Analyze repository structure holistically before generating content
**Rationale**: Understanding the overall system architecture enables better content generation decisions and prevents fragmented documentation that misses system-level patterns.
**Trade-offs**: Higher upfront computational cost, but produces more coherent and architecturally-aware documentation.

## Extension Points

### Custom Agent Development
Developers can create specialized agents for domain-specific documentation by extending the base agent interface and implementing the **architecture synthesis agent pattern**. New agents automatically integrate with the existing pipeline and benefit from shared infrastructure like **resilient LLM response parsing**.

### Content Category Extensions
The **category-based content organization** system supports additional categories beyond the default concepts/components/guides structure. Custom categories can be defined with their own organization rules and cross-referencing patterns.

### Repository Analysis Plugins
The **Repository Structure Analysis** component supports pluggable analyzers for new languages, frameworks, or architectural patterns. Custom analyzers can extend the **repository fingerprinting** capabilities to recognize domain-specific patterns.

### Output Format Adapters
While the system defaults to wiki-style markdown, the content generation pipeline can be extended with adapters for different output formats (HTML, PDF, confluence, etc.) without modifying the core generation logic.

### LLM Backend Integration
The system's LLM integration layer is abstracted to support different AI providers and models. New LLM backends can be integrated by implementing the standard interface and leveraging the existing **JSON response cleaning for LLM APIs** infrastructure.
