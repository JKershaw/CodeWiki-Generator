# Cross-Page Linking Implementation Plan

## Executive Summary

**Problem:** Wiki pages have no hyperlinks between them, reducing usability by 20-25 quality points
**Solution:** Implement automated cross-page link discovery and injection system
**Impact:** Quality improves from 79% → 84-86% (+5-7 points)
**Effort:** 3-4 hours
**Priority:** 🔴 **HIGHEST** (Priority 1 from WIKI_ASSESSMENT.md)

---

## Current State

### What's Broken
1. **Frontmatter `related:` field is always empty** `[]` on every page
2. **Textual references use bold but have NO hyperlinks**
   - Example: `**agent-based architecture**` should link to the architecture page
   - Architecture.md mentions concepts but doesn't link to their pages
3. **No cross-referencing between concepts and components**
4. **Poor discoverability** - readers must manually search for related pages

### Example of Current vs. Desired

**Current (architecture.md):**
```markdown
The system follows an **agent-based architecture** where specialized AI agents
handle distinct documentation generation tasks. This approach leverages the
**Architecture synthesis agent pattern**...
```

**Desired:**
```markdown
The system follows an **[agent-based architecture](concepts/architecture-synthesis-agent-pattern.md)**
where specialized AI agents handle distinct documentation generation tasks. This approach leverages the
**[Architecture synthesis agent pattern](concepts/architecture-synthesis-agent-pattern.md)**...
```

---

## Architecture Design

### Phase 1: Link Discovery System

#### 1.1 LinkDiscoveryAgent
**Location:** `lib/agents/link-discovery-agent.js`
**Purpose:** Detect mentions of wiki page titles in content

**Core Functionality:**
```javascript
class LinkDiscoveryAgent {
  /**
   * Find all mentions of wiki pages in content
   * @param {string} content - Page markdown content
   * @param {Array} allPages - All wiki pages with titles and paths
   * @returns {Array} Link replacements to make
   */
  findMentions(content, allPages) {
    const mentions = [];

    for (const page of allPages) {
      const title = page.title;

      // Pattern 1: **Title** (bold text)
      // Pattern 2: "Title" (quoted text)
      // Pattern 3: Title (plain text, word boundaries)

      const patterns = [
        new RegExp(`\\*\\*(${this._escapeRegex(title)})\\*\\*`, 'gi'),
        new RegExp(`"(${this._escapeRegex(title)})"`, 'gi'),
        new RegExp(`\\b(${this._escapeRegex(title)})\\b`, 'gi')
      ];

      patterns.forEach(pattern => {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          mentions.push({
            originalText: match[0],
            titleText: match[1],
            targetPath: page.path,
            targetTitle: page.title,
            position: match.index
          });
        }
      });
    }

    return this._deduplicateMentions(mentions);
  }

  /**
   * Detect related pages based on content similarity
   * Used to populate frontmatter `related:` field
   */
  findRelatedPages(pageContent, pagePath, allPages) {
    const mentions = this.findMentions(pageContent, allPages);

    // Filter out self-references
    const related = mentions
      .filter(m => m.targetPath !== pagePath)
      .map(m => m.targetPath);

    // Deduplicate and limit to top 5
    return [...new Set(related)].slice(0, 5);
  }
}
```

**Key Design Decisions:**
- **Pattern matching**: Bold text gets highest priority (likely intentional emphasis)
- **Case-insensitive**: "Agent-Based Architecture" matches "agent-based architecture"
- **Word boundaries**: Prevents "Test" from matching "TestRunner"
- **Deduplication**: Same page mentioned multiple times → single entry in `related:`
- **Limit to 5**: Prevents frontmatter bloat

#### 1.2 Link Injection Strategy

**Where to inject links:**
1. **Inline content** - Replace bold mentions with links: `**Title**` → `**[Title](path)**`
2. **Frontmatter** - Populate `related:` array with page paths
3. **Architecture.md** - High-value target (mentions many concepts/components)

**What NOT to link:**
- Headings (clutters navigation)
- Code blocks (breaks syntax)
- Already-linked text (avoid double-linking)
- First 50 chars of page (usually title/intro)

---

### Phase 2: Integration with Existing System

#### 2.1 DocumentationWriterAgent Enhancement
**File:** `lib/agents/documentation-writer-agent.js`

**New Method:**
```javascript
/**
 * Add cross-page hyperlinks to content
 * @param {string} content - Original markdown
 * @param {string} currentPagePath - Path of current page
 * @param {Array} allPages - All wiki pages
 * @returns {string} Content with hyperlinks added
 */
_addCrossLinks(content, currentPagePath, allPages) {
  const linkDiscovery = new LinkDiscoveryAgent();

  // Find all mentions
  const mentions = linkDiscovery.findMentions(content, allPages);

  // Filter out self-references and already-linked text
  const validMentions = mentions.filter(m =>
    m.targetPath !== currentPagePath &&
    !this._isAlreadyLinked(content, m.position)
  );

  // Replace mentions with links (reverse order to preserve positions)
  let linkedContent = content;
  validMentions.reverse().forEach(mention => {
    const replacement = this._createLink(mention);
    linkedContent =
      linkedContent.substring(0, mention.position) +
      replacement +
      linkedContent.substring(mention.position + mention.originalText.length);
  });

  return linkedContent;
}

_createLink(mention) {
  // **Title** → **[Title](path)**
  if (mention.originalText.startsWith('**')) {
    return `**[${mention.titleText}](${mention.targetPath})**`;
  }
  // "Title" → [Title](path)
  else if (mention.originalText.startsWith('"')) {
    return `[${mention.titleText}](${mention.targetPath})`;
  }
  // Plain text → [Title](path)
  else {
    return `[${mention.titleText}](${mention.targetPath})`;
  }
}
```

#### 2.2 Processor Workflow Update
**File:** `lib/processor.js`

**Modified `processConceptDocumentation()`:**
```javascript
async processConceptDocumentation(concept, analysis, summary) {
  const pagePath = this.determinePagePath(concept);

  // Generate content (existing logic)
  const content = await this.documentationWriterAgent.generateDocumentation(...);

  // NEW: Add cross-page links
  const allPages = await this.wikiManager.getAllPages();
  const linkedContent = this.documentationWriterAgent._addCrossLinks(
    content,
    pagePath,
    allPages
  );

  // NEW: Update frontmatter with related pages
  const related = this.linkDiscoveryAgent.findRelatedPages(
    linkedContent,
    pagePath,
    allPages
  );

  // Write page with updated frontmatter
  await this.wikiManager.writePage(pagePath, linkedContent, {
    ...existingMetadata,
    related
  });
}
```

**Modified `generateWikiIndex()`:**
```javascript
async generateWikiIndex(repoInfo) {
  // Generate index content (existing)
  let indexContent = await this.wikiIndexAgent.generateIndex(...);

  // NEW: Add cross-links to index
  const allPages = await this.wikiManager.getAllPages();
  indexContent = this.documentationWriterAgent._addCrossLinks(
    indexContent,
    'index.md',
    allPages
  );

  await this.wikiManager.writeIndex(indexContent);
}
```

**Modified `generateArchitectureOverview()`:**
```javascript
async generateArchitectureOverview(repoInfo) {
  // Generate architecture content (existing)
  let overviewContent = await this.architectureOverviewAgent.generateArchitectureOverview(...);

  // NEW: Add cross-links to architecture page
  const allPages = await this.wikiManager.getAllPages();
  const archPath = 'concepts/architecture.md';
  overviewContent = this.documentationWriterAgent._addCrossLinks(
    overviewContent,
    archPath,
    allPages
  );

  await fs.writeFile(path.join(this.wikiManager.wikiPath, archPath), overviewContent);
}
```

---

### Phase 3: Retroactive Linking Pass

#### 3.1 Post-Generation Link Injection
**New Method in Processor:**
```javascript
/**
 * Add cross-page links to all existing pages
 * Run after all pages are generated
 */
async addCrossLinksToAllPages() {
  console.log('Adding cross-page links to all wiki pages...');

  const allPages = await this.wikiManager.getAllPages();
  let linksAdded = 0;

  for (const page of allPages) {
    const content = page.content;
    const pagePath = page.path;

    // Add inline links
    const linkedContent = this.documentationWriterAgent._addCrossLinks(
      content,
      pagePath,
      allPages
    );

    // Find related pages for frontmatter
    const related = this.linkDiscoveryAgent.findRelatedPages(
      linkedContent,
      pagePath,
      allPages
    );

    // Only update if changes were made
    if (linkedContent !== content || related.length > 0) {
      await this.wikiManager.writePage(pagePath, linkedContent, {
        ...page.metadata,
        related
      });
      linksAdded++;
    }
  }

  console.log(`Cross-links added to ${linksAdded} pages`);
}
```

**Call from `processRepository()`:**
```javascript
async processRepository(repoUrl, options = {}) {
  // ... existing commit processing ...

  // Generate architecture, guides, index (existing)
  await this.generateArchitectureOverview(repoInfo);
  await this.generateWikiGuides(repoInfo);
  await this.generateWikiIndex(repoInfo);

  // NEW: Add cross-page links to all pages
  await this.addCrossLinksToAllPages();

  return stats;
}
```

---

## Implementation Steps

### Step 1: Create LinkDiscoveryAgent (1 hour)
- [ ] Create `lib/agents/link-discovery-agent.js`
- [ ] Implement `findMentions()` with pattern matching
- [ ] Implement `findRelatedPages()` for frontmatter
- [ ] Add regex escaping and deduplication logic
- [ ] Create unit tests: `tests/unit/agents/link-discovery-agent.test.js`
  - Test pattern matching (bold, quoted, plain)
  - Test case-insensitive matching
  - Test deduplication
  - Test related pages discovery

### Step 2: Enhance DocumentationWriterAgent (45 min)
- [ ] Add `_addCrossLinks()` method
- [ ] Add `_createLink()` helper
- [ ] Add `_isAlreadyLinked()` check (look for `](` before position)
- [ ] Update existing tests to verify cross-linking
- [ ] Add new test cases for link injection

### Step 3: Update Processor Integration (45 min)
- [ ] Import LinkDiscoveryAgent in processor.js
- [ ] Update `processConceptDocumentation()` to add links
- [ ] Update `generateWikiIndex()` to add links
- [ ] Update `generateArchitectureOverview()` to add links
- [ ] Implement `addCrossLinksToAllPages()` method
- [ ] Call retroactive linking from `processRepository()`

### Step 4: Testing & Validation (45 min)
- [ ] Run full wiki generation: `node generate-self-wiki.js`
- [ ] Verify architecture.md has hyperlinks to concepts
- [ ] Verify concept pages link to each other
- [ ] Verify frontmatter `related:` fields are populated
- [ ] Check link accuracy (no broken links)
- [ ] Validate link formatting (correct markdown syntax)
- [ ] Test on subset of pages first (architecture.md + 3 concepts)

### Step 5: Documentation (15 min)
- [ ] Update PHASE_4_FINDINGS.md with cross-linking results
- [ ] Document quality improvement (+5-7 points expected)
- [ ] Add architecture decision to ARCHITECTURE.md

---

## Success Criteria

### Quantitative
- [ ] **100% of pages** have at least 1 hyperlink to another page (excluding orphans)
- [ ] **Architecture.md** has 8-12 hyperlinks to concepts/components
- [ ] **Average `related:` length** = 2-4 pages per page
- [ ] **0 broken links** (all paths point to existing pages)
- [ ] **Quality score** increases from 79% → 84-86%

### Qualitative
- [ ] Links feel natural (not forced or awkward)
- [ ] Bold emphasis is preserved (`**[Title](path)**`)
- [ ] No double-linking (same mention linked only once per paragraph)
- [ ] Related pages are genuinely related (not random)
- [ ] Easy to discover connected concepts

---

## Edge Cases & Considerations

### 1. Ambiguous Titles
**Problem:** "Testing" could mean concept "Testing Approach" or component "TestRunner"
**Solution:** Prefer exact title matches, skip partial matches

### 2. Already-Linked Text
**Problem:** Don't want `[**Title**](path)` → `[**[Title](path2)**](path)`
**Solution:** Check for `](` pattern before position, skip if found

### 3. Self-References
**Problem:** Page mentioning its own title
**Solution:** Filter out `targetPath === currentPagePath`

### 4. Circular Links
**Problem:** A links to B, B links to A (infinite loop concern)
**Solution:** Not a problem - circular references are valid and useful

### 5. Title Variations
**Problem:** "agent-based architecture" vs "Agent-Based Architecture"
**Solution:** Case-insensitive regex matching

### 6. Performance
**Problem:** O(n²) complexity (every page checks every other page)
**Solution:** Acceptable for <100 pages; consider indexing if wiki grows >500 pages

### 7. Link Freshness
**Problem:** New pages added after linking pass
**Solution:** Run `addCrossLinksToAllPages()` at end of every generation

---

## Rollback Plan

If cross-linking causes issues:
1. **Flag to disable:** Add `options.enableCrossLinking = false` parameter
2. **Revert commit:** Git history preserves pre-linking state
3. **Selective linking:** Only link architecture.md and index.md as MVP

---

## Future Enhancements

### Phase 4 (Optional - Not in Scope)
1. **Backlink tracking:** Show "Referenced by" section at bottom of pages
2. **Link strength scoring:** Bold mentions = stronger relationship
3. **Semantic similarity:** Use embeddings to find related pages beyond text matching
4. **Link validation:** Automated check for broken links in CI
5. **Link visualization:** Graph view of wiki page relationships
6. **Alias support:** "Auth" → "Authentication System" mapping

---

## Estimated Timeline

| Task | Duration | Cumulative |
|------|----------|------------|
| LinkDiscoveryAgent creation + tests | 1h | 1h |
| DocumentationWriterAgent enhancement | 45m | 1h 45m |
| Processor integration | 45m | 2h 30m |
| Testing & validation | 45m | 3h 15m |
| Documentation | 15m | 3h 30m |
| **Buffer for issues** | 30m | **4h** |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Pattern matching too aggressive | Medium | Medium | Strict word boundaries, manual review |
| Performance degradation | Low | Low | Current wiki is small (<50 pages) |
| Broken links | Low | High | Validation step, existing page check |
| Over-linking (too noisy) | Medium | Medium | Limit to bold mentions, skip headings |
| Frontmatter corruption | Low | High | Backup wiki/ before running, git safety |

---

## Approval & Next Steps

**Status:** ✅ READY FOR IMPLEMENTATION
**Approver:** User
**Next Action:** Implement Step 1 (LinkDiscoveryAgent)

**Question for user:**
Would you like me to proceed with implementing this cross-linking system? This is the highest-priority improvement (Priority 1) and will add +5-7 quality points to the wiki.
