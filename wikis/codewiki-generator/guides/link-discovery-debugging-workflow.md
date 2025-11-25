---
title: Link discovery debugging workflow
category: guide
sourceFile: debug-related.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Link Discovery Debugging Workflow

## Purpose and Overview

The link discovery debugging workflow provides a structured approach to validate and debug the link discovery agent's functionality against a real wiki corpus. This debugging script implements full-page content loading patterns to ensure accurate cross-linking analysis and serves as a reference for verifying that mention finding and related page detection work correctly.

## Key Functionality

The debugging workflow implements several key patterns:

- **Full-page content loading**: Loads complete page objects rather than just metadata before performing link discovery analysis, ensuring the cross-linking system has access to all necessary content for accurate mention and relationship detection
- **Structured validation**: Provides a systematic approach to test the link discovery agent against real wiki data
- **Cross-linking verification**: Demonstrates how to verify that mentions and related pages are detected correctly across different pages in the wiki

The workflow addresses a critical fix where cross-linking requires full page content access rather than metadata-only approaches, enabling more reliable link discovery functionality.

## Relationships

This debugging workflow connects to:

- **Link Discovery Agent**: Serves as the primary testing and validation tool for the link discovery system
- **Wiki Content Processing**: Relies on full page content loading mechanisms to provide complete data for analysis
- **Cross-linking System**: Validates the core cross-linking functionality that connects related pages and mentions

## Usage Example

No usage examples available - see source code for implementation details.

The debugging workflow is implemented as a standalone script that can be run to validate link discovery functionality against your wiki corpus.

## Testing

No automated tests found for this debugging workflow. The component serves as a manual testing and validation tool for the link discovery system.