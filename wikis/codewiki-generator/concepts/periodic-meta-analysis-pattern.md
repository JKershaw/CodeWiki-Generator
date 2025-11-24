---
title: Periodic meta-analysis pattern
category: concept
sourceFile: lib/agents/meta-analysis-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Periodic Meta-Analysis Pattern

## Purpose and Overview

The meta-analysis agent identifies cross-cutting patterns, documentation gaps, and improvement opportunities by analyzing accumulated concepts and pages across multiple commits. Unlike per-commit processing that handles individual changes, periodic meta-analysis runs at configurable intervals to enable system-wide optimization decisions and maintain long-term documentation coherence.

## Key Functionality

### Pattern Detection and Analysis

The `MetaAnalysisAgent` class leverages Claude to analyze documentation progress across a batch of commits. It sends accumulated concepts and pages to the AI for intelligent pattern recognition, returning:

- **Themes**: Recurring topics and patterns across the documentation
- **Gaps**: Missing documentation areas or undocumented concepts
- **New Pages Needed**: Recommendations for new documentation pages
- **Reorganization Suggestions**: Structural improvements to existing documentation

### Scheduling and Frequency Control

The `shouldRunMetaAnalysis` function determines whether analysis should execute based on:
- Current commit number
- Last analysis timestamp
- Configurable frequency interval (default: every 5 commits)

This prevents unnecessary processing while ensuring regular system-wide reviews occur.

### Response Validation

The `_validateResponse` function implements defensive validation to ensure Claude responses conform to expected structure. All array fields (themes, gaps, newPagesNeeded, reorganizationSuggestions) are validated and normalized with safe defaults, preventing downstream errors from malformed API responses.

## Relationships

- **ClaudeClient**: Provides AI-powered analysis capabilities
- **PromptManager**: Renders meta-analysis prompt templates for Claude
- **Commit Tracking System**: Integrates via `currentCommit` and `lastAnalysis` parameters
- **Documentation Extraction Agents**: Processes outputs containing concepts and page lists
- **Agent Architecture**: Operates alongside per-commit analysis agents in the broader system

## Usage Example

```javascript
const MetaAnalysisAgent = require('./lib/agents/meta-analysis-agent');

const agent = new MetaAnalysisAgent(claudeClient, promptManager);

// Check if meta-analysis should run
if (agent.shouldRunMetaAnalysis(currentCommit, lastAnalysisCommit, frequency)) {
  // Analyze accumulated documentation progress
  const analysis = await agent.analyzeProgress(concepts, pages, currentCommit);
  
  console.log('Identified themes:', analysis.themes);
  console.log('Documentation gaps:', analysis.gaps);
  console.log('Recommended new pages:', analysis.newPagesNeeded);
}
```

## Architecture Notes

Meta-analysis operates at a higher abstraction level than per-commit agents. While per-commit agents handle incremental documentation updates, meta-analysis provides strategic insights by examining patterns across multiple commits. This enables:

- Detection of undocumented patterns emerging from multiple changes
- Identification of structural inefficiencies in documentation organization
- Long-term quality improvement through systematic gap analysis

The periodic nature allows the system to balance thorough analysis with computational efficiency.