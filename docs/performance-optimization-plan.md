# CodeWiki Generator - Performance Optimization Plan

**Created:** 2025-11-24
**Status:** In Progress
**Goal:** Reduce 100-commit processing time from 58 minutes to 8-10 minutes

## Baseline Performance (After History Bug Fix)

- **10 commits:** 8 minutes 38 seconds (518s)
- **100 commits (projected):** 58 minutes
- **Average per commit:** ~52 seconds

## Current Bottlenecks

1. **API calls to Claude:** ~1-3s per call, sequential
2. **Cross-linking:** O(n) per page, runs every 5 commits
3. **File I/O:** Sequential reads/writes
4. **Index/guide generation:** Processes all pages every time
5. **Architecture overview:** Full wiki scan every 10 commits

---

## Phase 1: Quick Wins (Target: 50-60% speedup)

**Estimated Effort:** 5-6 hours
**Target Time:** 25-30 minutes for 100 commits

### 1. Parallel File Processing Within Commits
- **Effort:** 1-2 hours
- **Impact:** 30-40% speedup on commits with multiple files
- **Implementation:** Use `Promise.all()` to process files concurrently
- **Location:** `lib/processor.js:79` - processCommit() file loop

### 2. Concurrent API Requests with Rate Limiting
- **Effort:** 2 hours
- **Impact:** 40-50% speedup on API-heavy operations
- **Implementation:** Batch requests with controlled concurrency (5 concurrent)
- **Location:** Multiple agent files, create shared request queue

### 3. Skip Historical Cross-Linking
- **Effort:** 30 minutes
- **Impact:** 15-20% speedup
- **Implementation:** Only run cross-linking on last 10 commits
- **Location:** `lib/processor.js:541` - shouldRunAgent check

### 4. Cache Concept Extraction Results
- **Effort:** 1 hour
- **Impact:** 10-15% speedup
- **Implementation:** Cache by file hash, invalidate on significant changes
- **Location:** `lib/processor.js:110` - analyzeCode call

---

## Phase 2: Medium Wins (Target: Additional 40-50% speedup)

**Estimated Effort:** 10-12 hours
**Target Time:** 12-15 minutes for 100 commits

### 5. Incremental Cross-Linking
- **Effort:** 3-4 hours
- **Impact:** 50-70% speedup on cross-linking
- **Implementation:** Track modified pages, only process changes
- **Location:** `lib/processor.js:753` - addCrossLinksToAllPages()

### 6. Incremental Index Generation
- **Effort:** 3-4 hours
- **Impact:** 30-40% speedup on index generation
- **Implementation:** Update index incrementally instead of full regeneration
- **Location:** `lib/agents/wiki-index-agent.js`

### 7. Parallel Cross-Linking Batches
- **Effort:** 2-3 hours
- **Impact:** 30-40% speedup on cross-linking
- **Implementation:** Process pages in parallel batches of 10
- **Location:** `lib/processor.js:773` - cross-linking loop

---

## Phase 3: Advanced Optimizations (Target: Additional 30-40% speedup)

**Estimated Effort:** 15-20 hours
**Target Time:** 8-10 minutes for 100 commits

### 9. LLM Response Caching
- **Effort:** 6-8 hours
- **Impact:** 50-80% speedup on repeated patterns
- **Implementation:** Cache responses by prompt hash
- **Location:** `lib/claude.js` - request method

### 10. Smart Diff-Based Processing
- **Effort:** 8-10 hours
- **Impact:** 30-50% speedup
- **Implementation:** Only analyze changed sections, merge with existing docs
- **Location:** `lib/agents/code-analysis-agent.js`

---

## Testing Protocol

After each phase, run:
```bash
# Clean slate
rm -rf wikis/codewiki-generator state.json

# 10-commit test
time node generate-self-wiki.js 10

# Record:
# - Total time
# - Pages created/updated
# - Cross-linking performance
# - Any issues
```

---

## Progress Tracking

| Phase | Status | Time (10 commits) | Speedup | Notes |
|-------|--------|-------------------|---------|-------|
| Baseline | ✅ Complete | 8m 38s (518s) | - | After history bug fix |
| Phase 1 | 🔄 In Progress | - | - | - |
| Phase 2 | ⏳ Pending | - | - | - |
| Phase 3 | ⏳ Pending | - | - | - |

---

## Risk Mitigation

**Low Risk (Do First):**
- ✅ Parallel file processing
- ✅ Concurrent API requests
- ✅ Skip historical cross-linking
- ✅ Cache extraction

**Medium Risk (Careful Implementation):**
- ⚠️ Incremental cross-linking (need accurate tracking)
- ⚠️ Incremental index generation (maintain state consistency)
- ⚠️ LLM response caching (cache invalidation strategy)

**High Risk (Avoid for Now):**
- ❌ Parallel commit processing (complex dependencies)
- ❌ Smart diff-based processing (merge complexity)

---

## Success Criteria

- ✅ All tests passing after each phase
- ✅ No regressions in wiki quality
- ✅ Measurable performance improvement
- ✅ Clean code, well-documented
- ✅ 100-commit run completes in < 15 minutes

---

## Notes

- Each optimization should be committed separately
- Run full test suite after each change
- Document any edge cases or limitations
- Update this file with actual results
