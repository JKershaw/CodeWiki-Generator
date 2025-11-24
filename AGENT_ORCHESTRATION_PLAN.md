# Agent Orchestration Refactoring Plan

## Context

Currently, the CodeWiki-Generator has inconsistent agent scheduling:

- **Per-commit agents** (CodeAnalysisAgent, DocumentationWriterAgent) are hardcoded in the main loop
- **End-of-processing agents** (ArchitectureOverviewAgent, GuideGenerationAgent, WikiIndexAgent) are hardcoded to run once at completion
- **MetaAnalysisAgent** has configurable frequency logic (`shouldRunMetaAnalysis()`) that runs every N commits
- **MetaDocumentIngestionAgent** is completely separate - requires manual CLI invocation to sync root-level docs into wiki pages

This inconsistency means:
- Meta wiki pages (history, progress reports) don't stay up to date automatically
- Adding new agents requires modifying `Processor` core logic
- No unified way to configure when agents run
- Developer must remember to manually run `ingest-meta-docs.js` after updating source documents

## Goals

1. **Unify agent scheduling** - Treat all agents equally with a single orchestration system
2. **Keep history current** - History pages update automatically as commits are processed
3. **Declarative configuration** - Easy to see and modify when agents run without code changes
4. **Eliminate manual syncing** - No separate ingestion process for meta documents
5. **Simplify extensibility** - Adding new agents shouldn't require touching `Processor` internals
6. **Environment configurability** - Adjust agent frequencies via `.env` without code changes

## Proposed Architecture

### 1. Agent Configuration File

Create `lib/agent-config.js` that declares all agents and their trigger conditions:

- Agent name and class path
- Trigger type (per-commit, every-n-commits, at-end, after-agent)
- Frequency (for periodic agents)
- Priority (execution order)
- Dependencies (for sequential execution)

**Supported trigger types:**
- `per-commit` - Run for every commit
- `every-n-commits` - Run every N commits (configurable)
- `at-end` - Run once after all commits processed
- `after-agent` - Run after another agent completes
- `on-file-change` - (future) Run when specific files change
- `on-threshold` - (future) Run when metrics exceed threshold

### 2. AgentOrchestrator Class

Create `lib/agent-orchestrator.js` that:

- Loads agent configuration
- Initializes all agents at startup
- Determines which agents should run at each commit based on triggers
- Executes agents in priority order
- Tracks last run time for each agent
- Handles errors gracefully without stopping other agents

### 3. Standardized Agent Interface

Create `lib/agents/base-agent.js` that all agents extend:

- Common `run(context)` method that all agents implement
- Receives execution context (commit data, wiki manager, state manager)
- Returns result object
- Provides metadata (name, version, description)

### 4. New HistoryAgent

Create `lib/agents/history-agent.js` that:

- Analyzes commits since last run
- Generates progress reports from commit patterns
- Updates `history/progress-report.md` incrementally
- Creates implementation timeline
- Uses LLM to synthesize narrative from commits
- Configured to run every 10 commits by default

This replaces the manual `ingest-meta-docs.js` workflow for history documents.

### 5. Refactor Existing Agents

Update all existing agents to:

- Extend `BaseAgent`
- Implement standardized `run(context)` method
- Move agent-specific logic into the agent classes (out of `Processor`)
- Remove hardcoded scheduling logic

Agents to refactor:
- CodeAnalysisAgent
- DocumentationWriterAgent
- MetaAnalysisAgent (already has frequency logic - extract pattern)
- ArchitectureOverviewAgent
- GuideGenerationAgent
- WikiIndexAgent
- LinkDiscoveryAgent

### 6. Simplify Processor

Refactor `lib/processor.js` to:

- Initialize `AgentOrchestrator` instead of individual agents
- In commit loop, call `orchestrator.runAgents(commitNum, context, isLastCommit)`
- Remove all hardcoded agent invocations
- Remove hardcoded end-of-processing agent calls
- Let orchestrator handle all agent lifecycle

### 7. Configuration via Environment

Extend `lib/config.js` to support:

- `META_ANALYSIS_FREQUENCY` - How often MetaAnalysisAgent runs (default: 5)
- `HISTORY_UPDATE_FREQUENCY` - How often HistoryAgent runs (default: 10)
- `GUIDES_UPDATE_FREQUENCY` - How often GuideGenerationAgent runs (default: 0 = only at end)

Or dynamically load from `agent-config.js` to allow full configuration without code changes.

## Implementation Phases

### Phase 1: Foundation (2-3 hours)
1. Create `BaseAgent` class with standardized interface
2. Create `AgentOrchestrator` class with trigger evaluation logic
3. Create `agent-config.js` with initial configuration
4. Add unit tests for orchestrator trigger logic

### Phase 2: Refactor Existing (3-4 hours)
1. Update each existing agent to extend `BaseAgent`
2. Standardize their execution methods to `run(context)`
3. Update Processor to use orchestrator for one agent (proof of concept)
4. Gradually migrate all agents to orchestrator
5. Remove hardcoded agent calls from Processor

### Phase 3: Add HistoryAgent (2-3 hours)
1. Create `HistoryAgent` class
2. Create prompt template for history generation
3. Implement commit analysis and progress report generation
4. Configure in `agent-config.js` to run every 10 commits
5. Test with real commit history

### Phase 4: Cleanup & Documentation (1-2 hours)
1. Deprecate or remove `ingest-meta-docs.js`
2. Update `CLAUDE.md` with new architecture
3. Update wiki documentation about agent system
4. Add configuration examples to README

## Key Design Decisions

### Avoid Over-Engineering

**Don't build:**
- Complex event bus or pub/sub system
- Plugin architecture with dynamic loading
- Agent dependency graphs or DAGs
- Advanced scheduling system (cron-like expressions)
- Agent state persistence (beyond simple "last run" tracking)

**Keep it simple:**
- Flat configuration file with clear trigger types
- Linear execution within priority groups
- Synchronous agent execution (one at a time)
- Simple trigger evaluation (boolean logic)
- Minimal abstraction layers

### Prioritize Pragmatism

- Start with existing agent patterns (MetaAnalysisAgent already has frequency logic)
- Don't change agent internals unless necessary
- Configuration should be obvious (no magic)
- Errors in one agent shouldn't crash the whole system
- Maintain backward compatibility where possible

## Expected Benefits

1. **Consistency** - All agents scheduled the same way
2. **Visibility** - Easy to see when agents run (check config file)
3. **Maintainability** - Adding agents doesn't require core changes
4. **Automation** - History updates happen automatically
5. **Flexibility** - Adjust frequencies via environment variables
6. **Simplicity** - Less code in Processor, more declarative configuration

## Success Criteria

- [ ] All existing agents work through orchestrator
- [ ] HistoryAgent generates progress reports every 10 commits
- [ ] `Processor.js` has no hardcoded agent calls
- [ ] Agent frequencies configurable via `.env`
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Manual meta-document ingestion no longer required

## Migration Notes

- Existing wikis and state files remain compatible
- No changes to agent prompt templates required
- Existing agent logic can be wrapped in `run()` method initially
- Gradual rollout - can migrate one agent at a time
- Old ingestion script can remain for legacy workflows if needed

## Estimated Effort

**Total: 8-12 hours** for complete implementation and testing

- Can be broken into smaller PRs per phase
- Phase 1 provides proof of concept
- Phases 2-4 can proceed incrementally
