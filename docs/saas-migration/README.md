# CodeWiki SaaS Migration

## Documents

| Document | Purpose |
|----------|---------|
| [01-current-state-analysis.md](./01-current-state-analysis.md) | What exists now |
| [02-agent-refactoring-strategy.md](./02-agent-refactoring-strategy.md) | Agent interface changes |
| [03-database-and-testing-strategy.md](./03-database-and-testing-strategy.md) | MongoDB models, testing approach |
| [04-implementation-roadmap.md](./04-implementation-roadmap.md) | **Main roadmap** |
| [05-decisions-and-answers.md](./05-decisions-and-answers.md) | Key decisions |

## Start Here

1. **04-implementation-roadmap.md** - The plan
2. Reference other docs as needed

## Principles

- **API tests are primary** - Comprehensive API coverage
- **E2E for user flows** - Every happy path + error types
- **Unit tests selective** - Only where init is complex
- **Real MongoDB** - Mock only GitHub, Anthropic, Stripe
- **Manual tests with real APIs** - Before major releases

## Reference

The current project wiki (merging soon) documents existing behavior.
