---
title: Wiki Improvement Strategy
category: concepts
created: 2025-11-22
updated: 2025-11-22
related:
  - architecture
  - agents/overview
---

# Wiki Improvement Plan: Bridging Auto-Generated and Manual Documentation

## Analysis Summary

### What the Auto-Generated Wiki Does Well
1. **Pattern Extraction** - Identifies 28 distinct architectural patterns from 6 commits
2. **Granular Decomposition** - Single-concept pages (exponential backoff, cost tracking, lazy loading)
3. **Cross-Cutting Concerns** - Finds patterns that span multiple components
4. **Naming** - Explicitly names patterns that weren't named in code
5. **Conciseness** - Each page ~60 lines, focused on one idea

### Critical Gaps (vs. Specification)
1. **No index.md** - Missing entry point and navigation hub
2. **No directory structure** - Should have concepts/, components/, guides/
3. **No metadata.json** - Missing page relationships and statistics
4. **No guides/** - Missing tutorials and how-to documentation
5. **No concepts/** - Missing high-level architectural overviews
6. **Flat organization** - Everything in components/ regardless of abstraction level
7. **No related pages** - Frontmatter has empty `related: []` arrays

### Alignment with Original Vision

**From Idea.md:**
> "Good documentation emerges from understanding, not from exhaustive cataloging."

✅ **Achieved** - The system is selective, not comprehensive

> "Documentation as Emergent Property... understanding deepens naturally"

❌ **Missing** - No mechanism to deepen understanding across commits (all pages created once)

> "The wiki becomes your external brain for the codebase"

❌ **Missing** - No navigation structure makes it hard to use as reference

**From Specification.md:**
```
wiki/
├── concepts/         # High-level abstractions
├── components/       # Classes, modules, services
├── guides/          # How-to documentation
├── index.md         # Entry point
└── _metadata.json   # Page relationships, stats
```

❌ **Current state:** Only components/ exists, no hierarchy

## Root Cause Analysis

### Why the Current System Produces Flat Structure

1. **CodeAnalysisAgent** extracts "concepts" but doesn't categorize them by abstraction level
2. **Processor.determinePagePath()** hardcodes `components/${kebab}.md` for all concepts
3. **No agent responsible for** creating guides or high-level concept pages
4. **No post-processing** to generate index.md or maintain metadata
5. **DocumentationWriterAgent** doesn't know if it's writing a guide vs. component vs. concept

### The Conceptual Mismatch

**Current design:** CodeAnalysisAgent → concept name → single page path
**Needed design:** CodeAnalysisAgent → concept with category → appropriate directory → related pages linked

## Improvement Strategy

### Design Principles

1. **Keep the strengths** - Pattern extraction, granular decomposition
2. **Add structure** - Index, categories, relationships
3. **Minimal prompt changes** - Architectural enhancements, not just prompt tweaking
4. **Backward compatible** - Existing wikis should still work
5. **Self-documenting** - Must improve self-documentation quality

### Not Just Prompts - Architectural Changes Needed

This requires **5 distinct improvements**:

## Improvement 1: Category-Aware Concept Extraction

### Current Code Analysis Output
```json
{
  "concepts": ["Exponential Backoff Retry Strategy", "Cost Tracking"],
  "codeElements": [...],
  "relationships": [...]
}
```

### Proposed Enhanced Output
```json
{
  "concepts": [
    {
      "name": "Agent-based Architecture",
      "category": "concept",
      "abstraction": "high",
      "reason": "Overarching system design pattern"
    },
    {
      "name": "CodeAnalysisAgent",
      "category": "component",
      "abstraction": "low",
      "reason": "Specific implementation class"
    }
  ],
  "codeElements": [...],
  "relationships": [...],
  "suggestedGuides": [
    {
      "title": "How to Add a New Agent",
      "reason": "Pattern is established, guide would help extension"
    }
  ]
}
```

### Implementation
- **File**: `lib/agents/code-analysis-agent.js`
- **Change**: Update prompt template to request categorization
- **Validation**: Ensure backward compatibility with simple string concepts

### Prompt Enhancement
Add to `prompts/code-analysis.txt`:
```
For each concept, determine its abstraction level:
- "concept" = high-level architectural pattern or mental model
- "component" = specific class, module, or service implementation
- "guide" = operational knowledge (how to run, test, deploy, extend)

Concepts like "Agent-based architecture" or "Event-driven design" are high-level.
Concepts like "ClaudeClient class" or "retry logic implementation" are component-level.
```

## Improvement 2: Intelligent Path Determination

### Current Implementation
```javascript
determinePagePath(conceptName) {
  const kebab = conceptName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
  return `components/${kebab}.md`;  // Hardcoded!
}
```

### Proposed Implementation
```javascript
determinePagePath(concept) {
  const kebab = concept.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

  // Route based on category
  const directory = concept.category || 'components';
  return `${directory}/${kebab}.md`;
}
```

### Implementation
- **File**: `lib/processor.js`
- **Change**: Accept concept objects, not just strings
- **Test**: Verify concepts/ and components/ and guides/ are created correctly

## Improvement 3: Wiki Index Agent

### New Agent Purpose
Generate and maintain index.md based on existing wiki structure

### Input
```javascript
{
  "pages": [
    { "path": "concepts/architecture.md", "title": "Agent-based Architecture", "created": "2025-11-22" },
    { "path": "components/claude-client.md", "title": "Claude Client", "created": "2025-11-22" },
    // ... all pages
  ],
  "structure": {
    "concepts": 5,
    "components": 28,
    "guides": 2
  }
}
```

### Output
```markdown
---
title: CodeWiki Generator Documentation
created: 2025-11-22
updated: 2025-11-22
---

# CodeWiki Generator Documentation

## Overview
[AI-generated project summary based on concepts]

## Concepts
High-level architectural patterns and mental models:
- [Agent-based Architecture](concepts/agent-based-architecture.md)
- [Event-driven Design](concepts/event-driven-design.md)

## Components
Core implementation modules:
- [Claude Client](components/claude-client.md) - AI API wrapper with cost tracking
- [Code Analysis Agent](components/code-analysis-agent.md) - Pattern extraction
...

## Guides
Tutorials and operational documentation:
- [Getting Started](guides/getting-started.md)
- [Testing Approach](guides/testing-approach.md)
```

### Implementation
- **File**: `lib/agents/wiki-index-agent.js`
- **Trigger**: After processing completes (or every N commits)
- **Dependencies**: WikiManager to read all pages
- **Test**: Verify index.md is generated and well-structured

## Improvement 4: Metadata Tracking System

### Current State
No _metadata.json exists

### Proposed Structure
```json
{
  "generated": "2025-11-22T21:31:00Z",
  "pages": {
    "concepts/agent-based-architecture.md": {
      "title": "Agent-based Architecture",
      "created": "2025-11-22",
      "updated": "2025-11-22",
      "incomingLinks": ["components/code-analysis-agent.md", "components/meta-analysis-agent.md"],
      "outgoingLinks": ["components/claude-client.md"],
      "category": "concept",
      "commits": ["abc123", "def456"]
    },
    "components/claude-client.md": {
      "title": "Claude Client",
      "created": "2025-11-22",
      "updated": "2025-11-22",
      "incomingLinks": ["concepts/agent-based-architecture.md"],
      "outgoingLinks": [],
      "category": "component",
      "commits": ["abc123"]
    }
  },
  "statistics": {
    "totalPages": 35,
    "concepts": 5,
    "components": 28,
    "guides": 2,
    "totalCommitsProcessed": 10,
    "orphanedPages": []
  }
}
```

### Implementation
- **File**: `lib/wiki-manager.js`
- **Enhancement**: Track metadata on every page create/update
- **Method**: `updateMetadata(pagePath, metadata)`
- **Method**: `getMetadata()` - returns full _metadata.json
- **Test**: Verify metadata is maintained correctly

## Improvement 5: Related Pages in Frontmatter

### Current Output
```yaml
---
title: Cost tracking for API usage
category: components
related: []   # Always empty!
---
```

### Proposed Enhancement

**In DocumentationWriterAgent:**
- Input includes related concepts from CodeAnalysisAgent
- Output includes suggested related pages

**In Processor:**
- When creating/updating page, populate `related:` with actual page paths
- Use metadata to find related pages by concept name

### Implementation
```javascript
// In processor.processCommit()
const relatedPaths = this.findRelatedPaths(
  analysisResult.relationships,
  state.pagesByCategory
);

await this.wikiManager.createPage(
  pagePath,
  newContent,
  {
    title: conceptName,
    category: concept.category,
    related: relatedPaths  // Now populated!
  }
);
```

## Improvement 6: Guide Generation

### Challenge
Guides are operational knowledge, not extracted from single commits

### Strategy: Post-Processing Agent

**When to trigger:** After processing completes or every 20 commits

**GuideGenerationAgent:**
- Analyzes existing components
- Identifies patterns worth documenting as guides
- Generates guides like:
  - "Getting Started" (from repository structure + test files)
  - "Testing Approach" (from test files)
  - "Adding a New Agent" (from agent pattern)
  - "Cost Management" (from cost tracking components)

### Input
```javascript
{
  "components": [/* all component pages */],
  "concepts": [/* all concept pages */],
  "repository": {
    "hasTests": true,
    "testFramework": "jest",
    "hasCI": false,
    "packageManager": "npm"
  }
}
```

### Output
```json
{
  "guides": [
    {
      "title": "Getting Started",
      "sections": ["Installation", "Configuration", "First Run"],
      "content": "..."
    },
    {
      "title": "Testing Approach",
      "sections": ["Unit Tests", "Running Tests", "Test Structure"],
      "content": "..."
    }
  ]
}
```

### Implementation
- **File**: `lib/agents/guide-generation-agent.js`
- **Trigger**: Processor calls after completion
- **Test**: Verify guides/ directory created with useful content

## Implementation Phases

### Phase 1: Structural Foundation (Weekend 1)
1. ✅ Update CodeAnalysisAgent to output categorized concepts
2. ✅ Update Processor.determinePagePath() to route by category
3. ✅ Implement _metadata.json tracking in WikiManager
4. ✅ Populate related: [] frontmatter from relationships
5. ✅ Test on self-documentation run

**Success Metric:** Wiki has concepts/, components/, guides/ with proper categorization

### Phase 2: Navigation & Index (Weekend 1)
1. ✅ Implement WikiIndexAgent
2. ✅ Generate index.md after processing
3. ✅ Update index.md to show category breakdown
4. ✅ Test navigation usability

**Success Metric:** Can navigate wiki from index.md, understand structure

### Phase 3: Guide Generation (Weekend 2)
1. ✅ Implement GuideGenerationAgent
2. ✅ Generate "Getting Started" from repository
3. ✅ Generate "Testing Approach" from test files
4. ✅ Allow manual guide editing
5. ✅ Test guide quality

**Success Metric:** Guides are useful for onboarding

### Phase 4: Refinement (Weekend 2)
1. ✅ Run on self-documentation
2. ✅ Compare to manual dev-wiki
3. ✅ Identify gaps
4. ✅ Tune prompts based on gaps
5. ✅ Re-run and validate

**Success Metric:** Auto-generated wiki is 80% as useful as manual wiki

## Testing Strategy

### Unit Tests
- Test category detection in CodeAnalysisAgent
- Test path routing in Processor
- Test metadata updates in WikiManager
- Test index generation in WikiIndexAgent

### Integration Tests
- Process 10 commits, verify structure is correct
- Verify index.md is generated
- Verify _metadata.json is populated
- Verify related pages are linked

### Quality Tests
- Self-documentation: Run on this codebase
- Human review: Compare to manual dev-wiki
- Navigation test: Can you find information quickly?
- Completeness test: Are key concepts documented?

## Expected Outcomes

### Before (Current)
```
wiki/
└── components/
    ├── agent-based-architecture-for-documentation.md
    ├── ai-api-client-wrapper-pattern.md
    └── ... (28 files, flat structure)
```

### After (Improved)
```
wiki/
├── index.md                         # Navigation hub
├── _metadata.json                   # Relationships & stats
├── concepts/
│   ├── agent-based-architecture.md
│   ├── event-driven-processing.md
│   └── cost-aware-api-design.md
├── components/
│   ├── claude-client.md
│   ├── code-analysis-agent.md
│   ├── documentation-writer-agent.md
│   └── ... (specific implementations)
└── guides/
    ├── getting-started.md
    ├── testing-approach.md
    └── adding-new-agents.md
```

### Quality Comparison

| Feature | Manual dev-wiki | Auto-generated (current) | Auto-generated (improved) |
|---------|----------------|--------------------------|---------------------------|
| Page count | 15 | 28 | ~35 |
| Avg page length | 231 lines | 59 lines | 100-150 lines |
| Has index | ✅ | ❌ | ✅ |
| Has categories | ✅ | ❌ | ✅ |
| Has guides | ✅ | ❌ | ✅ |
| Pattern extraction | Manual | ✅ Excellent | ✅ Excellent |
| Navigation | ✅ Excellent | ❌ Poor | ✅ Good |
| Related links | ✅ | ❌ | ✅ |
| Learning path | ✅ | ❌ | ✅ Partial |

## Validation Plan

### Self-Documentation Test
1. Delete current wiki/
2. Run improved system on this codebase (10-20 commits)
3. Read only the generated wiki
4. Answer these questions:
   - What is this system?
   - How do I run it?
   - How do I add a new agent?
   - What's the processing flow?
   - How are costs tracked?

If you can answer all 5 questions from the wiki alone, the system works.

### User Acceptance Test
1. Show the auto-generated wiki to a developer unfamiliar with this project
2. Give them 15 minutes to read
3. Ask them to:
   - Explain the architecture
   - Find where API costs are tracked
   - Understand the agent system
4. If they succeed, documentation is effective

## Non-Goals (Keep System Focused)

❌ Don't try to match manual wiki exactly
❌ Don't over-engineer category detection
❌ Don't create guides for everything
❌ Don't build a full-fledged CMS
❌ Don't add complex graph visualization (yet)

✅ Do preserve pattern extraction strength
✅ Do add minimal structure needed for navigation
✅ Do maintain simplicity and speed
✅ Do focus on self-documentation quality

## Success Criteria

1. **Structural**: Wiki has index.md, concepts/, components/, guides/
2. **Navigable**: Can find information in <2 clicks from index
3. **Complete**: Key concepts, components, and guides exist
4. **Accurate**: Information matches codebase reality
5. **Useful**: New developer can onboard using wiki
6. **Self-validating**: System's own wiki is high quality

## Timeline

- **Week 1, Days 1-2**: Phase 1 (Structural Foundation)
- **Week 1, Days 3-4**: Phase 2 (Navigation & Index)
- **Week 2, Days 1-2**: Phase 3 (Guide Generation)
- **Week 2, Days 3-4**: Phase 4 (Refinement)

Total: ~8 days of focused development

## Conclusion

The auto-generated wiki **proves the core idea works**: AI can extract patterns and generate useful documentation. The improvements needed are not about fixing broken prompts - they're about **adding the architectural layers** that the specification always intended.

The current system is like having excellent sentence construction but no paragraph structure. We need to add the organizational layers that make documentation navigable and learnable.

This is **architectural enhancement**, not prompt tuning. And it aligns perfectly with the original vision from Idea.md:

> "Can a system that generates understanding generate understanding of itself?"

The current system generates pattern understanding excellently. Now we add the structure that makes that understanding accessible.
