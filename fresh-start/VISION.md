# CodeWiki - Vision & Philosophy

## The Central Insight

**Code tells you what. Documentation tells you why. History tells you how.**

Most documentation fails because it's:
- Written once, never updated
- Separate from the code it describes
- Created after the fact, missing context
- Expensive to maintain

CodeWiki generates documentation that **grows organically** alongside code by walking through git history chronologically.

---

## What CodeWiki Does

1. **Connects to your GitHub repository**
2. **Walks through commits chronologically**
3. **Analyzes changes with LLM agents**
4. **Builds a wiki that captures**:
   - Concepts: Mental models and abstractions
   - Components: Actual code structures
   - Relationships: How pieces connect
   - Evolution: How understanding deepened

The wiki isn't static—it's **archaeological documentation**. You see when concepts were introduced, changed, and refined.

---

## Core Philosophy

### Documentation as Emergent Property
Understanding deepens naturally:
- First pass: "This file handles authentication"
- Later: "This is OAuth2 with refresh token rotation"
- Even later: "This implements RFC 6749 with custom extensions"

### Organic Growth, Not Comprehensive Coverage
Important code gets referenced repeatedly → detailed documentation.
Peripheral utilities mentioned once → brief note.
Boring config files → might be ignored.

The system discovers what matters by seeing what's significant.

### Self-Limiting Complexity
Wikis naturally stay manageable. Verbosity is a bug. If a page grows too long, it needs splitting. The medium enforces good practices.

---

## For Developers

Open an unfamiliar codebase and ask:
- "How does authentication work?" → Wiki has a clear page
- "Where are tests configured?" → Operational guide exists
- "Why was this approach chosen?" → History shows the decision point

The wiki becomes your **external brain** for the codebase.

---

## For AI Coding Agents

**Current problem**: AI agents get massive context dumps and struggle to find relevant information.

**With CodeWiki**:
- Agent queries: "How do I run tests?"
- MCP server returns the exact wiki page
- Agent has perfect context, not overwhelming context

The wiki is a **compressed, indexed, structured knowledge base**—optimized for retrieval.

---

## The Feedback Loop

```
Developer commits code
    ↓
System generates documentation
    ↓
Developer reads documentation (or AI agent queries it)
    ↓
Gaps identified
    ↓
Documentation requests queued
    ↓
System fills gaps
    ↓
Documentation improves
```

The system **learns what documentation is needed** by observing what gets requested.

---

## Key Principles

1. **Start Minimal, Grow Organically** - Let importance reveal itself
2. **Embrace Imperfection** - Early docs will be rough; stale is worse than imperfect
3. **Trust the Medium** - Wikis work; don't fight the format
4. **Make It Useful First** - One excellent page beats 50 mediocre ones
5. **Dogfood Aggressively** - If you avoid using it on yourself, something's wrong

---

## SaaS Model

### Why SaaS?
- **No setup friction** - Connect GitHub, start generating
- **Managed infrastructure** - We handle processing, storage, scaling
- **MCP integration** - Works with Claude Code out of the box
- **Continuous improvement** - Updates benefit all users

### MVP Scope
- GitHub OAuth login
- Connect repositories
- Process commits with LLM agents
- View generated wikis
- MCP server for AI agents

### Future
- Public wikis
- Team collaboration
- Custom agents
- GitHub webhooks for auto-sync
- Advanced analytics

---

## Success Looks Like

You connect a repository. Processing runs. You open the wiki.

In 15 minutes of reading, you understand:
- The overall architecture
- Where each major component lives
- How to run and test it
- Why key decisions were made

A new developer joins. They read the wiki for an hour. They're productive—not because the wiki is comprehensive, but because it answers the right questions.

---

## The Meta-Question

**Can a system that generates understanding generate understanding of itself?**

If yes, we've created something genuinely useful.
If no, we learn exactly where AI-generated documentation fails.

Either outcome teaches us something profound.

---

*This is not just a tool. It's an exploration of whether machines can help us understand complexity—starting with helping us understand themselves.*
