# Path 2: Content Quality First - Implementation Plan

## Goal
Improve auto-generated wiki quality from 70-75% → 85-90% by addressing the three identified content gaps:
1. Missing high-level architecture overview
2. Missing "Getting Started" guide
3. Concept granularity too fine (over-segmentation)

**Estimated Time**: 4-6 hours
**Success Metric**: Auto-wiki becomes primary onboarding resource (comparable to manual dev-wiki)

---

## Phase 2.1: Prompt Enhancements (1.5 hours)

### Task 1.1: Enhance CodeAnalysisAgent Prompt for Consolidation

**File**: `lib/prompts/code-analysis.txt`

**Current Issue**: Generates 25 micro-concepts with duplicates:
- "category-aware-concept-extraction" + "category-aware-concept-routing" (should be one)
- "global-metadata-tracking" + "global-metadata-tracking-system" (duplicate)
- Multiple "cost-aware" and "self-testing" variants

**Changes Needed**:
```markdown
Add after line 60 (abstraction levels):

Concept Consolidation Guidelines:
- Prefer FEWER, BROADER concepts over many narrow ones
- Combine related implementation details into a single architectural concept
- Example: "Category-based documentation routing" NOT "category-aware extraction" + "category routing" separately
- Avoid creating near-duplicate concepts with slight naming variations
- When in doubt, use a higher abstraction level that encompasses related details

Anti-patterns to avoid:
- Creating separate concepts for "X system" and "X tracking" (consolidate to "X")
- Splitting conceptually related code changes into multiple micro-concepts
- Documenting implementation details that should be part of a broader pattern

Quality Check: If you identify >5 concepts for a single file change, you're likely over-segmenting. Consolidate.
```

**Expected Outcome**: Future runs generate 10-15 high-quality concepts instead of 25+ fragmented ones

**Validation**:
- Re-run on last 5 commits
- Verify concept count reduced while coverage maintained
- Check for duplicate elimination

---

### Task 1.2: Enhance GuideGenerationAgent Prompt for "Getting Started"

**File**: `lib/prompts/guide-generation.txt`

**Current Issue**: Guide generated "safe-output-separation" and "self-documentation-testing" but NOT "Getting Started"

**Changes Needed**:
```markdown
Add before line 13 (Consider the following guide types):

CRITICAL PRIORITY GUIDES (generate if ANY evidence exists):
1. **Getting Started** - ALWAYS generate if repository has:
   - package.json with scripts
   - README.md or setup instructions
   - Any runnable entry points
   This is the MOST IMPORTANT guide for developers.

After line 20 (Troubleshooting), add:

Guide Prioritization (create in this order):
1. Getting Started (CRITICAL - always attempt)
2. Testing Approach (if tests exist)
3. Development Workflow (if clear dev process)
4. Extension Patterns (if design patterns evident)
5. Configuration (if config options exist)
6. Troubleshooting (if error handling present)

Maximum 4 guides, but MUST include Getting Started if repository is runnable.
```

**Expected Outcome**: "Getting Started" guide generated in next run

**Validation**:
- Re-run guide generation
- Verify guides/getting-started.md created
- Check it includes installation, setup, first run instructions

---

## Phase 2.2: Architecture Overview Agent (2 hours)

### Task 2.1: Create ArchitectureOverviewAgent

**New File**: `lib/agents/architecture-overview-agent.js`

**Purpose**: Generate high-level system architecture from all existing concepts

**Implementation**:
```javascript
class ArchitectureOverviewAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4000; // Architecture overview needs detail
  }

  async generateArchitectureOverview(wikiData) {
    // Input: all concepts, components, guides
    // Output: comprehensive architecture.md for concepts/ directory

    const { repositoryName, concepts, components, guides } = wikiData;

    const prompt = this.promptManager.render('architecture-overview', {
      repositoryName,
      concepts: this._formatConcepts(concepts),
      components: this._formatComponents(components),
      guides: this._formatGuides(guides)
    });

    const content = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    return this._cleanMarkdown(content);
  }

  _formatConcepts(concepts) {
    return concepts.map(c => `- ${c.title}`).join('\n');
  }

  // ... similar formatters
}
```

**New File**: `lib/prompts/architecture-overview.txt`

**Prompt Template**:
```markdown
You are creating a high-level architecture overview for a software system.

Repository: {{repositoryName}}

Existing Documentation Structure:

Concepts (design patterns and principles):
{{concepts}}

Components (implementation modules):
{{components}}

Guides (operational procedures):
{{guides}}

Task: Generate a comprehensive architecture.md document that provides a system-level overview.

Required Sections:
1. **System Overview** (3-4 sentences) - What this system does, its purpose
2. **Core Architecture** - High-level design approach, key architectural patterns
3. **Major Components** - 5-7 most important components and how they interact
4. **Data Flow** - How information moves through the system
5. **Key Design Decisions** - Important architectural choices and why
6. **Extension Points** - How developers can extend the system

Guidelines:
- Write for a developer seeing the codebase for the first time
- Focus on the "why" behind architectural decisions
- Create a mental model of how pieces fit together
- Reference existing concept and component pages by name
- Include ASCII diagrams if helpful for understanding flow
- Aim for 200-300 lines - comprehensive but scannable
- Use clear, technical language (not marketing speak)

Quality Standard: After reading this page, a developer should understand:
- What problem the system solves
- How it's architecturally organized
- Where to find specific functionality
- How to approach making changes

DO NOT output markdown code blocks (```markdown). Output raw markdown only.
```

**Testing**: Create `tests/unit/agents/architecture-overview-agent.test.js`

**Test Cases**:
- Should generate architecture overview from wiki data
- Should format concepts, components, guides correctly
- Should use correct model and token limits
- Should clean markdown output
- Should handle empty sections gracefully

---

### Task 2.2: Integrate ArchitectureOverviewAgent into Processor

**File**: `lib/processor.js`

**Changes**:
```javascript
// Add import
const ArchitectureOverviewAgent = require('./agents/architecture-overview-agent');

// Add to constructor
this.architectureOverviewAgent = new ArchitectureOverviewAgent();

// Add new method after generateWikiGuides()
async generateArchitectureOverview(repoInfo) {
  try {
    const allPages = await this.wikiManager.getAllPages();
    const repositoryName = repoInfo.repo || 'Repository';

    const wikiData = {
      repositoryName,
      concepts: allPages.filter(p => p.metadata.category === 'concept'),
      components: allPages.filter(p =>
        p.metadata.category === 'component' ||
        p.metadata.category === 'components'
      ),
      guides: allPages.filter(p => p.metadata.category === 'guide')
    };

    const overviewContent = await this.architectureOverviewAgent.generateArchitectureOverview(wikiData);

    // Write to concepts/architecture.md
    const fs = require('fs').promises;
    const path = require('path');
    const archPath = path.join(this.wikiManager.wikiPath, 'concepts/architecture.md');
    await fs.writeFile(archPath, overviewContent, 'utf-8');

  } catch (error) {
    console.warn('Warning: Failed to generate architecture overview:', error.message);
  }
}

// Update processRepository() to call it
// After guides and before index generation:
await this.generateArchitectureOverview(repoInfo);
await this.generateWikiGuides(repoInfo);
await this.generateWikiIndex(repoInfo);
```

**Expected Outcome**: `wiki/concepts/architecture.md` generated automatically

---

## Phase 2.3: Testing & Validation (1.5 hours)

### Task 3.1: Re-run Self-Documentation

**Command**: `rm -rf wiki/ state.json && node generate-self-wiki.js`

**Validation Checklist**:
- [ ] Total pages reduced from 35 to 20-25 (consolidation working)
- [ ] `wiki/concepts/architecture.md` exists and is comprehensive
- [ ] `wiki/guides/getting-started.md` exists with clear instructions
- [ ] No duplicate concepts (e.g., only one "metadata tracking" concept)
- [ ] Concept names are broader (e.g., "Category-based Documentation System" not separate extraction/routing)
- [ ] All 192 tests still passing

### Task 3.2: Quality Comparison

**Compare to Manual Dev-Wiki**:

| Aspect | Manual Dev-Wiki | Auto-Wiki (Before) | Auto-Wiki (After Path 2) | Target |
|--------|----------------|-------------------|------------------------|--------|
| Architecture Overview | ✅ 265 lines | ❌ Missing | ✅ Generated | ✅ |
| Getting Started Guide | ✅ Present | ❌ Missing | ✅ Generated | ✅ |
| Concept Count | 2 (high-level) | 25 (micro) | 12-15 (consolidated) | ✅ |
| Duplicate Concepts | 0 | 5+ | 0-1 | ✅ |
| Onboarding Value | 100% | 70% | 85-90% | ✅ |

### Task 3.3: Manual Review

**Read and Evaluate**:
1. `wiki/concepts/architecture.md` - Is it comprehensive? Does it provide system-level understanding?
2. `wiki/guides/getting-started.md` - Can a new developer follow it? Complete and accurate?
3. Concept pages - Are they appropriately scoped? No fragmentation?
4. Overall navigation - Can you find information quickly? Clear hierarchy?

**Success Criteria**:
- Architecture page answers: "What is this system? How does it work?"
- Getting Started works without referring to dev-wiki
- Concept list is scannable (12-15 items, not 25+)
- No obvious duplicates or near-duplicates

---

## Phase 2.4: Documentation & Commit (30 minutes)

### Task 4.1: Update PHASE_4_FINDINGS.md

**Add Section**:
```markdown
## Path 2 Implementation Results

### Prompt Enhancements
- ✅ CodeAnalysisAgent: Added consolidation guidelines
- ✅ GuideGenerationAgent: Prioritized "Getting Started"

### New Agent
- ✅ ArchitectureOverviewAgent: Generates system-level overview

### Results
- Concept count: 25 → XX (XX% reduction)
- Architecture overview: Generated (XXX lines)
- Getting Started guide: Generated
- Duplicates eliminated: X pairs consolidated
- Quality improvement: 70-75% → XX%

### Before/After Comparison
[Include specific examples of consolidation]
```

### Task 4.2: Commit Changes

**Commits**:
```bash
# Commit 1: Prompt improvements
git add lib/prompts/code-analysis.txt lib/prompts/guide-generation.txt
git commit -m "Enhance prompts for consolidation and Getting Started priority"

# Commit 2: Architecture agent
git add lib/agents/architecture-overview-agent.js lib/prompts/architecture-overview.txt tests/
git commit -m "Implement ArchitectureOverviewAgent for system-level documentation"

# Commit 3: Integration
git add lib/processor.js
git commit -m "Integrate architecture overview generation into processing workflow"

# Commit 4: Validation
git add wiki/ PHASE_4_FINDINGS.md
git commit -m "Validate Path 2 improvements - quality increased to XX%"
```

---

## Expected Outcomes

### Quantitative Improvements
- **Concept count**: 25 → 12-15 (40-50% reduction)
- **Duplicate concepts**: 5+ → 0
- **Critical guides present**: 0/3 → 3/3 (Architecture, Getting Started, Testing)
- **Quality score**: 70-75% → 85-90%

### Qualitative Improvements
- ✅ New developer can onboard using auto-wiki alone
- ✅ System architecture immediately understandable
- ✅ Concept list is navigable (not overwhelming)
- ✅ No information fragmentation or duplication

### Validation Method
**The Onboarding Test**: Can a developer unfamiliar with the codebase:
1. Understand what the system does? (architecture.md)
2. Get it running? (getting-started.md)
3. Find specific functionality? (concept/component navigation)

If YES to all three → Path 2 successful ✅

---

## Rollback Plan

If improvements don't achieve 85%+ quality:

**Option A**: Revert prompt changes, try different consolidation strategy
**Option B**: Manual curation of auto-generated concepts post-processing
**Option C**: Hybrid approach - auto-generate + manual architecture.md

**Confidence**: High - prompt improvements are low-risk, high-reward

---

## Next Steps After Path 2

Once quality reaches 85-90%:

1. **Scale Testing** (2 hours)
   - Run on 100+ commit repository
   - Measure cost per commit
   - Validate performance at scale

2. **Choose Next Path**:
   - Path 1: Implement Web UI (8 hours)
   - Path 3: Implement MCP Server (6 hours)
   - Continue refinement: Tune prompts further based on results

---

## Time Breakdown

| Task | Estimated Time |
|------|----------------|
| 1.1: Enhance CodeAnalysisAgent prompt | 30 min |
| 1.2: Enhance GuideGenerationAgent prompt | 30 min |
| 2.1: Create ArchitectureOverviewAgent | 1.5 hours |
| 2.2: Integrate into Processor | 30 min |
| 3.1: Re-run self-documentation | 15 min |
| 3.2: Quality comparison | 30 min |
| 3.3: Manual review | 30 min |
| 4.1: Update findings | 15 min |
| 4.2: Commit and push | 15 min |
| **Total** | **4.5 hours** |

---

## Success Definition

**Path 2 is COMPLETE when**:
1. ✅ Architecture overview generated and comprehensive
2. ✅ Getting Started guide generated and actionable
3. ✅ Concept count reduced by 40%+ through consolidation
4. ✅ Zero duplicate concepts
5. ✅ Auto-wiki quality ≥85% (validated by onboarding test)
6. ✅ All tests passing (192/192)

**Ready to execute** - proceed task by task following TDD principles.
