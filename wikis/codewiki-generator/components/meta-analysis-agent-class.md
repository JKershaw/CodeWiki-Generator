---
title: MetaAnalysisAgent class
category: component
sourceFile: lib/agents/meta-analysis-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# MetaAnalysisAgent

## Purpose and Overview

The `MetaAnalysisAgent` class performs periodic analysis across multiple commits to identify cross-cutting patterns, documentation gaps, and structural improvement opportunities. Unlike per-commit analysis agents that process individual changes, this agent runs at configurable intervals to detect themes and gaps that emerge from accumulated documentation work, enabling system-wide optimization decisions.

## Key Functionality

### Periodic Analysis Scheduling
The agent determines whether meta-analysis should execute based on a configurable frequency interval (default: every 5 commits) and tracks the timestamp of the last analysis. This prevents redundant processing while ensuring regular pattern detection across the documentation corpus.

### Pattern Detection and Gap Analysis
When triggered, `analyzeProgress()` sends accumulated concepts and pages to Claude for intelligent analysis. The agent:
- Identifies recurring themes across documentation
- Detects missing or underdocumented areas
- Suggests new pages or documentation sections
- Recommends structural reorganization improvements

### Response Validation
The agent implements defensive validation through `_validateResponse()` to ensure Claude responses conform to expected structure (arrays for themes, gaps, newPagesNeeded, and reorganization suggestions). Missing or malformed fields are normalized to safe defaults, preventing downstream errors.

## Relationships

- **ClaudeClient**: Provides AI-powered pattern analysis for identifying themes and gaps
- **PromptManager**: Renders meta-analysis prompt templates for Claude interaction
- **Commit Tracking System**: Integrates with current commit tracking and last analysis timestamps
- **Documentation Agents**: Consumes outputs from extraction agents that collect concepts and page lists
- **Agent Architecture**: Part of the broader agent-based system alongside per-commit analysis agents

## Usage Example

```javascript
const MetaAnalysisAgent = require('./lib/agents/meta-analysis-agent');

const agent = new MetaAnalysisAgent({
  claudeClient: claudeClientInstance,
  promptManager: promptManagerInstance,
  frequencyInterval: 5  // Run every 5 commits
});

// Check if analysis should run at current commit
if (agent.shouldRunMetaAnalysis(currentCommit, lastAnalysisTimestamp)) {
  // Perform analysis on accumulated documentation
  const analysis = await agent.analyzeProgress(
    concepts,           // Array of concepts collected
    pages,              // Array of page identifiers
    currentCommit,
    lastAnalysisTimestamp
  );
  
  // analysis contains: themes, gaps, newPagesNeeded, reorganizationSuggestions
  console.log('Identified themes:', analysis.themes);
  console.log('Documentation gaps:', analysis.gaps);
}
```

## Testing

No automated tests are currently available for this component. Consider adding test coverage for:
- Frequency interval calculations and timing logic
- Response validation and normalization for various Claude output formats
- Integration with mock ClaudeClient and PromptManager instances
- Edge cases such as empty concept/page lists and malformed API responses