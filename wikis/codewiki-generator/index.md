---
related: [concepts/test-coverage-integration.md]
updated: 2025-11-23
---

# CodeWiki-Generator

CodeWiki-Generator is an intelligent documentation system that combines automated code analysis with [test coverage integration](../concepts/test-coverage-integration.md) to generate comprehensive, context-enriched documentation. It features a web-based dashboard for real-time monitoring and control of the documentation generation process.

## Meta (Philosophy & Vision)

High-level context explaining the "why" behind the project:

- [Core Philosophy & Vision](meta/philosophy.md) - The fundamental ideas and philosophy driving this project
- [Technical Specification](meta/specification.md) - Comprehensive technical requirements and architecture specification

## Concepts

Core architectural and design concepts that drive the system's functionality:

- [Context-enriched documentation generation](concepts/context-enriched-documentation-generation.md) - Enhanced documentation through intelligent context analysis and integration
- [Production-ready server configuration](concepts/production-ready-server-configuration.md) - Robust server setup and deployment configurations for production environments
- [Real-time Status Monitoring](concepts/real-time-status-monitoring.md) - Live tracking and monitoring of system status and documentation generation progress
- [Step-wise processing control](concepts/step-wise-processing-control.md) - Granular control over documentation generation workflow stages
- [Test-aware documentation generation](concepts/test-aware-documentation-generation.md) - Documentation generation that leverages test information for enhanced context
- [Test coverage documentation system](concepts/test-coverage-documentation-system.md) - Comprehensive system for documenting and tracking code coverage metrics
- [Test Coverage Integration](concepts/test-coverage-integration.md) - Seamless integration of test coverage data into documentation workflows
- [Test-driven documentation enrichment](concepts/test-driven-documentation-enrichment.md) - Using test insights to create more meaningful and accurate documentation
- [Web Dashboard Architecture](concepts/web-dashboard-architecture.md) - Design and structure of the web-based management interface

## Components

Key system components and their implementations:

- [Dashboard Control Interface](components/dashboard-control-interface.md) - User interface components for dashboard interaction and control
- [DashboardController](components/dashboard-controller.md) - Main controller managing dashboard operations and user interactions
- [Express web interface for documentation management](components/express-web-interface-for-documentation-management.md) - Web-based interface built on Express.js for managing documentation processes
- [Source file metadata tracking](components/source-file-metadata-tracking.md) - System for tracking and managing metadata associated with source files
- [TestCoverageAnalyzer class](components/test-coverage-analyzer-class.md) - Core class responsible for analyzing and processing test coverage data
- [Web dashboard control interface](components/web-dashboard-control-interface.md) - Browser-based interface for controlling documentation generation workflows
- [Wiki Integration](components/wiki-integration.md) - Integration layer for connecting with wiki systems and platforms

## Guides

Practical guides for using and developing with the system:

- [Architecture](concepts/architecture.md) - System architecture overview and design principles
- [Configuration](guides/configuration.md) - Setup and configuration instructions for various deployment scenarios
- [Development Workflow](guides/development-workflow.md) - Guidelines and best practices for contributing to the project
- [Getting Started](guides/getting-started.md) - Quick start guide for new users and developers
- [Testing Approach](guides/testing-approach.md) - Testing strategies and methodologies used in the project

## History (Project Evolution)

Historical context showing how the project evolved:

- [Project History and Achievement Analysis](history/progress-report.md) - Comprehensive progress report documenting achievements and current status

## Quality (Testing & Validation)

Information about how the system is tested and validated:

- [Testing Strategy](guides/testing-approach.md) - Detailed testing methodologies and practices

## Navigation

- **New users**: Start with [Getting Started](guides/getting-started.md) to set up the system
- **Understanding the vision**: Read [Core Philosophy & Vision](meta/philosophy.md) to understand why this project exists
- **Developers**: Review [Architecture](concepts/architecture.md) and [Development Workflow](guides/development-workflow.md)
- **Configuration**: See [Configuration](guides/configuration.md) for deployment options
- **Technical specs**: Check [Technical Specification](meta/specification.md) for detailed requirements
- **Core concepts**: Explore the Concepts section to understand system design principles
- **Project history**: See [Project History](history/progress-report.md) for achievements and evolution

## Using the /context Command

This wiki is designed to be searchable via the `/context` slash command in Claude Code:

```bash
# Example: Get context for implementing a new feature
/context implement MCP server for Claude Code integration

# Example: Understand the project philosophy
/context what is the core philosophy of this project?

# Example: Debug an issue
/context fix failing tests in the processor
```

The context command searches across all layers (meta, code, history, quality) to provide comprehensive information for your task.
