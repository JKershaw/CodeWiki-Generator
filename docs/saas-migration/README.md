# CodeWiki SaaS Migration Documentation

This directory contains the planning documentation for migrating CodeWiki-Generator from a prototype to a SaaS application.

## Documents

| Document | Purpose |
|----------|---------|
| [01-current-state-analysis.md](./01-current-state-analysis.md) | Analysis of existing codebase, components, and architecture |
| [02-agent-refactoring-strategy.md](./02-agent-refactoring-strategy.md) | Strategy for refactoring agents to standard interface |
| [03-database-and-testing-strategy.md](./03-database-and-testing-strategy.md) | MongoDB data models and testing approach |
| [04-implementation-roadmap.md](./04-implementation-roadmap.md) | **Main roadmap** - phased implementation plan with tasks |
| [05-decisions-and-answers.md](./05-decisions-and-answers.md) | Architectural decisions and answers to key questions |

## Quick Start

1. Read **01-current-state-analysis.md** to understand what exists
2. Read **04-implementation-roadmap.md** for the step-by-step plan
3. Reference other documents as needed during implementation

## Core Principles

1. **Test-Driven Development** - Write failing test first, then implement
2. **Real Database in Tests** - Use real MongoDB, mock only external APIs
3. **Explicit Dependencies** - Pass dependencies as parameters, no singletons
4. **Simplicity First** - No over-abstraction, optimize when measured

## Implementation Order

```
Phase 0: Preparation (environment, documentation)
Phase 1: Test Infrastructure (MongoDB, mocks, fixtures)
Phase 2: Frontend Simplification (remove dashboard, keep health)
Phase 3: Data Layer (all MongoDB models and repositories)
Phase 4: Authentication (GitHub OAuth, sessions)
Phase 5: Repository Management (connect, sync)
Phase 6: Agent System Refactor (standard interface)
Phase 7: Job System (queue, executor)
Phase 8: Wiki System (storage, retrieval)
Phase 9: MCP Integration (authentication)
Phase 10: Polish and Deploy
```

## Key Changes from Current State

### Removing
- Dashboard frontend (views/*.ejs)
- Static assets (public/)
- File-based state management
- Activity feed WebSocket
- Planning manager
- Suggestion engine

### Keeping
- MCP server (with auth added)
- Agent prompt templates
- Core agent logic (refactored interface)
- Jest/Playwright test setup
- Cost tracking

### Adding
- MongoDB persistence
- GitHub OAuth
- Job queue system
- API authentication
- Stripe integration (future)

## Definition of Done

Each task is complete when:
- [ ] Test written first (TDD)
- [ ] Implementation passes test
- [ ] No regressions (all tests pass)
- [ ] Committed with clear message

## Questions?

Refer to [05-decisions-and-answers.md](./05-decisions-and-answers.md) for architectural decisions and rationale.
