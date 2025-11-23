---
title: Progressive JSON repair strategy
category: component
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Progressive JSON Repair Strategy

## Purpose and Overview

The Progressive JSON repair strategy addresses the common challenge of parsing structured data from Large Language Model (LLM) responses that may be malformed, wrapped in unexpected content, or incomplete. This component implements a multi-step approach to systematically identify and fix JSON parsing issues, ensuring reliable extraction of structured data from AI-generated responses.

## Key Functionality

The strategy operates through several progressive repair stages:

### Content Extraction
- Locates JSON content within markdown code blocks or mixed text responses
- Strips surrounding narrative text that LLMs often include with structured outputs
- Handles cases where JSON is embedded within explanatory content

### String Repair
- Fixes common JSON formatting issues like unescaped quotes
- Corrects malformed string literals that break standard JSON parsers
- Handles encoding issues and special characters

### Structure Completion
- Attempts to complete incomplete JSON structures
- Balances missing brackets, braces, and quotes
- Reconstructs truncated responses where content may have been cut off

### Implementation

The core functionality is implemented in the `_cleanJSON` function, which:

1. **First attempts** standard JSON parsing
2. **Progressively applies** repair strategies if initial parsing fails
3. **Returns** successfully parsed JSON object or raises informative errors
4. **Logs** repair attempts for debugging and monitoring

## Relationships

- **Part of GuideGenerationAgent's response processing pipeline** - ensures reliable parsing of structured guide content from Claude API responses
- **Addresses reliability issues** when parsing structured outputs from external LLM APIs
- **Implements defensive programming pattern** for external API integration, providing fault tolerance in production environments

## Usage Context

This strategy is particularly valuable when:

- Working with LLM APIs that don't guarantee perfect JSON formatting
- Processing responses that mix structured data with natural language
- Building production systems that require high reliability in parsing AI outputs
- Implementing agents that depend on structured data extraction from conversational AI responses

The progressive approach ensures that minor formatting issues don't cause complete parsing failures, while maintaining strict validation for successfully repaired JSON structures.