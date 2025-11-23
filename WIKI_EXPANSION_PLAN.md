# Wiki Expansion Plan: Multi-Layer Context System

**Created**: 2025-11-23
**Status**: In Progress
**Goal**: Expand wiki to include meta-documentation and create research-oriented context retrieval

---

## Executive Summary

Transform the CodeWiki from a **code-only** knowledge base into a **multi-layer context system** that includes:
- Philosophy and vision (from Idea.md)
- Specifications and requirements (from Specification.md)
- Historical context (from progress reports)
- Quality metrics (from test coverage and assessments)

Enable AI agents (via Claude Code slash command) to research the wiki like a human would, gathering comprehensive context that includes WHY, WHAT, HOW, and HISTORY.

---

## Current State

### Existing Wiki Structure
```
wikis/codewiki-generator/
├── concepts/       (9 pages - architectural patterns from code)
├── components/     (4 pages - code modules)
├── guides/         (4 pages - operational how-tos)
├── index.md
└── _metadata.json
```

### Available Meta-Documentation (Root Directory)
- `Idea.md` - Project philosophy and vision
- `Specification.md` - Technical requirements and success criteria
- `ImplementationGuide.md` - Development roadmap
- `COMPREHENSIVE_PROGRESS_REPORT.md` - Current status and achievements
- Various assessment and plan files

---

## Target State

### Expanded Wiki Structure
```
wikis/codewiki-generator/
├── concepts/           (architectural patterns from code)
├── components/         (code modules)
├── guides/             (operational how-tos)
├── meta/              ✨ NEW: High-level context
│   ├── philosophy.md         (from Idea.md)
│   ├── specification.md      (from Specification.md)
│   └── vision.md
├── history/           ✨ NEW: Project evolution
│   ├── progress-report.md    (from COMPREHENSIVE_PROGRESS_REPORT.md)
│   └── implementation-notes.md
├── quality/           ✨ NEW: Quality & validation
│   └── testing-strategy.md
├── index.md           (updated with new sections)
└── _metadata.json     (enhanced with layer tracking)
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (4-6 hours)

**1.1 Create Directory Structure**
- Create `meta/`, `history/`, `quality/` subdirectories
- Update WikiManager to recognize new categories

**1.2 Build MetaDocumentIngestionAgent**
- Agent to transform root markdown files into wiki pages
- Extract key concepts and relationships
- Generate appropriate frontmatter
- Cross-link to existing code-layer pages

**1.3 Ingest Initial Meta-Documents**
- Idea.md → meta/philosophy.md
- Specification.md → meta/specification.md
- COMPREHENSIVE_PROGRESS_REPORT.md → history/progress-report.md

### Phase 2: Context Retrieval System (3-4 hours)

**2.1 Create WikiResearcher Class**
```javascript
class WikiResearcher {
  async gatherContext(taskDescription) {
    // Multi-layer search across all categories
    // Relevance ranking
    // Context package assembly
  }
}
```

**2.2 Enhance WikiManager**
- Add layer-based search capabilities
- Support filtering by category (meta, history, quality, code)
- Improved relevance scoring

**2.3 Update Metadata System**
- Track source files for imported docs
- Layer categorization
- Cross-layer relationship tracking

### Phase 3: Claude Code Integration (2-3 hours)

**3.1 Create Slash Command**
- `.claude/commands/context.md`
- Integrates with WikiResearcher
- Returns multi-layer context report

**3.2 Update Wiki Index**
- Add sections for meta, history, quality
- Improve navigation across layers

**3.3 Cross-Layer Linking**
- Bi-directional links between meta and code
- Automatic relationship detection

---

## Key Features

### 1. Multi-Layer Knowledge Base

**Meta Layer** - The "Why"
- Project philosophy and core beliefs
- Technical specifications and requirements
- Architectural decisions and rationale

**Code Layer** - The "What"
- Concepts (patterns)
- Components (modules)
- Guides (how-tos)

**History Layer** - The "How We Got Here"
- Progress reports
- Implementation notes
- Phase completions and retrospectives

**Quality Layer** - The "How We Know It Works"
- Testing strategies
- Quality assessments
- Coverage metrics

### 2. Context Retrieval

**Task-Specific Context Types**:
- Feature implementation → spec + patterns + guides
- Bug investigation → component + tests + history
- Architectural decisions → philosophy + concepts + past decisions
- Onboarding → philosophy + getting started + overview

### 3. Cross-Layer Linking

**Automatic Relationship Detection**:
- Meta-docs mention code components → create links
- Code pages reference specifications → bidirectional links
- History references past decisions → contextual navigation

---

## Success Criteria

The expansion succeeds when:

1. ✅ `/context` command returns relevant info from multiple layers
2. ✅ New developers can understand both vision AND implementation
3. ✅ Meta-documents are integrated into wiki navigation
4. ✅ Cross-layer links enable seamless exploration
5. ✅ AI agents can reason about philosophy, not just code
6. ✅ Historical context informs current decisions

**Ultimate Test**: Can Claude Code use `/context` on this codebase to understand both the technical implementation AND the philosophical vision?

---

## Implementation Checklist

### Immediate Tasks
- [x] Create WIKI_EXPANSION_PLAN.md
- [ ] Create directory structure (meta/, history/, quality/)
- [ ] Implement MetaDocumentIngestionAgent
- [ ] Ingest Idea.md → meta/philosophy.md
- [ ] Ingest Specification.md → meta/specification.md
- [ ] Ingest progress report → history/progress-report.md
- [ ] Create WikiResearcher class
- [ ] Create /context slash command
- [ ] Update WikiManager for layer-based search
- [ ] Update wiki index with new sections
- [ ] Test context retrieval
- [ ] Verify cross-layer linking

### Follow-Up Tasks
- [ ] Auto-sync system for meta-doc changes
- [ ] Enhanced relevance ranking
- [ ] Context usage analytics
- [ ] Pre-computed context index

---

## Example Usage

### Example 1: Feature Implementation
```bash
/context "add MCP server for Claude Code integration"
```

**Returns**:
- **Meta**: Specification Phase 6 requirements, why MCP matters
- **Code**: WikiManager API, existing server structure
- **Guides**: Extension patterns, testing approach
- **History**: Why MCP was deferred, current readiness

### Example 2: Understanding Design Decisions
```bash
/context "why 7 specialized agents instead of one?"
```

**Returns**:
- **Meta**: Agent specialization philosophy
- **Code**: Multi-agent architecture concept
- **History**: Evolution from 3→7 agents, rationale
- **Examples**: ArchitectureOverviewAgent as case study

### Example 3: Onboarding
```bash
/context "understand the project and get started"
```

**Returns**:
- **Meta**: Philosophy ("Code tells what, docs tell why, history tells how")
- **Guides**: Getting started, installation
- **Code**: Architecture overview
- **History**: Current status and achievements

---

## Technical Design

### MetaDocumentIngestionAgent

**Input**:
- File path (e.g., `Idea.md`)
- Target category (meta/history/quality)
- Document type (philosophy/spec/progress)

**Processing**:
1. Read markdown content
2. Claude API: Extract concepts, identify relationships to code
3. Generate wiki page with frontmatter
4. Detect cross-references to existing pages
5. Create bidirectional links

**Output**:
- Wiki page in appropriate category
- Updated _metadata.json with relationships
- Cross-link updates to related pages

### WikiResearcher

**API**:
```javascript
const researcher = new WikiResearcher(wikiManager);
const context = await researcher.gatherContext("task description");

// Returns:
{
  highLevelContext: [...],  // Meta docs
  codeContext: [...],       // Components/concepts
  guides: [...],            // How-tos
  historicalContext: [...], // Past decisions
  relatedConcepts: [...]    // Patterns
}
```

**Algorithm**:
1. Extract keywords from task description
2. Search all layers (meta, code, history, quality)
3. Rank results by relevance using Claude
4. Assemble context package by layer
5. Return structured context report

### Enhanced Metadata Format

```json
{
  "pages": {
    "Philosophy": {
      "path": "meta/philosophy.md",
      "category": "meta",
      "layer": "meta",
      "sourceFile": "Idea.md",
      "sourceType": "imported",
      "incomingLinks": 45,
      "outgoingReferences": ["Processor", "WikiManager"],
      "lastSynced": "2025-11-23T10:00:00Z"
    },
    "Processor": {
      "path": "components/processor.md",
      "category": "component",
      "layer": "code",
      "sourceType": "generated",
      "specifiedIn": "meta/specification.md",
      "philosophy": "meta/philosophy.md"
    }
  },
  "layers": {
    "code": ["concepts/", "components/", "guides/"],
    "meta": ["meta/"],
    "history": ["history/"],
    "quality": ["quality/"]
  }
}
```

---

## Benefits

1. **Comprehensive Context** - AI agents get full picture (why + what + how + history)
2. **Multi-Dimensional Understanding** - Vertical depth, horizontal breadth, temporal evolution
3. **Self-Referential Power** - System can explain its own philosophy AND implementation
4. **Living Documentation** - Meta-docs version controlled, auto-synced
5. **Accelerated Onboarding** - New developers understand vision + code together
6. **Better Decisions** - Historical context prevents repeated mistakes

---

## Testing Plan

### Unit Tests
- MetaDocumentIngestionAgent extracts concepts correctly
- WikiResearcher ranks results appropriately
- Layer-based search returns correct categories

### Integration Tests
- End-to-end ingestion of Idea.md
- Cross-layer linking creates bidirectional relationships
- Context retrieval for sample tasks

### Manual Validation
- Use /context command for real development tasks
- Verify returned context is actually useful
- Test navigation across layers in wiki UI

---

## Timeline

- **Phase 1** (Infrastructure): 4-6 hours
- **Phase 2** (Retrieval): 3-4 hours
- **Phase 3** (Integration): 2-3 hours
- **Total**: 9-13 hours for complete implementation

---

## Notes

- This expansion aligns with the core philosophy: "Code tells you what. Documentation tells you why. History tells you how."
- Meta-layer completes the triangle: WHY (philosophy) + WHAT (code) + HOW (history)
- The system continues to be self-documenting, now at multiple levels
- Success is measured by actual usefulness for development tasks

---

**Status**: Ready for implementation
**Next Step**: Create directory structure and MetaDocumentIngestionAgent
