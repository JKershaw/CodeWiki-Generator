---
title: Repository-level batch processing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Repository-level Batch Processing

## Purpose and Overview

Repository-level batch processing enables comprehensive analysis of entire GitHub repositories as a single operation, with built-in cost controls and resumable state management. This system processes commits sequentially while maintaining progress state, allowing long-running analyses to be safely interrupted and resumed without losing work.

## Key Functionality

### Core Processing Flow
- **Sequential commit processing** - Analyzes repository commits in chronological order
- **Resumable state management** - Saves progress after each commit to enable safe interruption
- **Cost monitoring** - Tracks API expenses and halts processing when limits are reached
- **Adaptive meta-analysis** - Runs periodic assessments of documentation quality and progress

### Cost-Aware Processing
The system implements configurable spending limits that prevent runaway API costs:
- Monitors cumulative API expenses during processing
- Automatically pauses when cost thresholds are exceeded
- Preserves all progress for later resumption

### GitHub Integration
- Fetches commit history directly from GitHub repositories
- Handles authentication and rate limiting
- Processes commits with full diff and metadata context

## Relationships

**Extends existing systems:**
- Builds on commit processing pipeline for individual commit analysis
- Uses `StateManager` for persistent progress tracking across sessions
- Leverages `WikiManager` for documentation generation and updates

**Coordinates multiple components:**
- `GitHubClient` handles repository data fetching
- `MetaAnalysisAgent` performs periodic quality assessments
- `ClaudeClient` cost tracking enforces spending limits

## Usage Examples

### Basic Repository Processing
```javascript
await processRepository({
  owner: 'username',
  repo: 'repository-name',
  maxCost: 50.00,
  resumeFromState: true
});
```

### Processing with Custom Limits
```javascript
await processRepository({
  owner: 'org',
  repo: 'large-project',
  maxCost: 100.00,
  metaAnalysisInterval: 50, // Run meta-analysis every 50 commits
  resumeFromState: true
});
```

### Resuming Interrupted Processing
When processing hits cost limits or is manually interrupted, simply run the same command - the system automatically detects and resumes from the last processed commit.