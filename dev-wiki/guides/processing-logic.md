---
title: Processing Logic Guide
category: guides
created: 2025-11-22
updated: 2025-11-22
related:
  - processor
  - agents/overview
  - architecture
---

# Processing Logic Guide

## Overview

This guide explains the decision trees, logic flows, and algorithms used by the CodeWiki Generator processor to transform git history into documentation.

## Main Processing Loop

The repository processor follows this high-level flow:

```
1. Load saved state (if exists) or initialize new state
2. Fetch all commits from GitHub
3. Determine starting point (resume or start fresh)
4. FOR EACH commit from start point to end:
   a. Check if cost limit reached → STOP if exceeded
   b. Process commit (see Commit Processing Flow)
   c. Update statistics
   d. Save state to disk
   e. Check if meta-analysis should run → RUN if triggered
   f. Continue to next commit
5. Mark processing as completed
6. Return final statistics
```

## Resume or Start Fresh Decision

```
IF state.repoUrl == requested repoUrl AND state.currentCommit > 0:
    → RESUME from state.currentCommit
    → Keep existing statistics
ELSE:
    → START FRESH from commit 0
    → Initialize new state
    → Reset statistics
```

**Rationale:**
- Different repository → Always start fresh
- Same repository, no progress → Start fresh
- Same repository, partial progress → Resume

## Commit Processing Flow

For each commit, the processor analyzes all changed files:

```
1. Initialize commit statistics
2. FOR EACH file in commit.files:
   a. Check if file has patch → SKIP if no patch
   b. Check if file is significant → SKIP if insignificant
   c. Get relevant wiki context (up to 3 pages)
   d. Analyze code changes → Get concepts and elements
   e. FOR EACH concept identified:
      i.   Determine wiki page path
      ii.  Check if page exists
      iii. Generate documentation (with existing content if updating)
      iv.  Create or update wiki page
      v.   Track statistics
   f. Mark file as processed
3. Return commit summary
```

## File Filtering Logic

### Has Patch Check

```
IF file.patch is undefined OR file.patch is null OR file.patch is empty:
    → SKIP (file was deleted or is binary)
ELSE:
    → CONTINUE to significance check
```

**Files without patches:**
- Deleted files (status: 'removed')
- Binary files (images, PDFs, executables)
- Renamed files without changes

### File Significance Check

Delegates to `CodeAnalysisAgent.isSignificantFile(filePath)`:

```
# Extract file extension and path components
extension = filePath.split('.').last
fileName = filePath.split('/').last
pathParts = filePath.split('/')

# Check against exclusion rules
IF fileName matches CONFIG_FILE_PATTERN:
    → SKIP (package.json, tsconfig.json, .eslintrc.*)
ELSE IF fileName matches LOCK_FILE_PATTERN:
    → SKIP (package-lock.json, yarn.lock, Gemfile.lock)
ELSE IF fileName matches TEST_FILE_PATTERN:
    → SKIP (*.test.js, *.spec.ts, *_test.py)
ELSE IF extension == 'md':
    → SKIP (documentation files)
ELSE IF 'dist' in pathParts OR 'build' in pathParts OR '.next' in pathParts:
    → SKIP (build artifacts)
ELSE IF extension in SOURCE_EXTENSIONS:
    → PROCESS (.js, .ts, .py, .java, .go, .rs, .rb, .php)
ELSE:
    → SKIP (unknown file type)
```

**Design Decision:**
- Whitelist approach for source extensions
- Blacklist approach for common exclusions
- File-level granularity (not directory-level)

## Context Retrieval Logic

Before analyzing code, find related wiki pages:

```
# Extract keywords from file path
filePath = "src/auth/service.js"
fileName = "service.js"  # Last path component
baseName = "service"     # Remove extension
keywords = baseName

# Search wiki
allPages = wikiManager.getRelatedPages(keywords)

# Limit to top 3
IF allPages.length > 3:
    relatedPages = allPages.slice(0, 3)
ELSE:
    relatedPages = allPages

# Pass to code analysis
analysis = analyzeCode(file, diff, message, relatedPages)
```

**Matching Algorithm (in WikiManager):**
- Searches page titles and content
- Case-insensitive matching
- Returns pages with most matches first
- Includes snippet of matching content

**Why limit to 3 pages?**
- Keeps prompt size manageable
- Most relevant pages are sufficient
- Token/cost optimization

## Page Path Determination

Convert concept names to wiki page paths:

```
conceptName = "UserAuthenticationManager"

# Step 1: CamelCase to kebab-case
# Insert dash before uppercase letters (except first)
temp = "User-Authentication-Manager"

# Step 2: Replace spaces with dashes
temp = temp.replace(/\s+/g, '-')

# Step 3: Convert to lowercase
temp = "user-authentication-manager"

# Step 4: Add components/ prefix
pagePath = "components/" + temp
# Result: "components/user-authentication-manager"
```

**Examples:**
- `AuthService` → `components/auth-service`
- `Session Manager` → `components/session-manager`
- `API` → `components/api`

## Create or Update Decision

For each concept identified:

```
pagePath = determinePagePath(conceptName)
existingPage = wikiManager.getPage(pagePath)

IF existingPage is null:
    # Create new page
    markdown = documentationWriterAgent.writeDocumentation(
        conceptName,
        codeAnalysis,
        '' # No existing content
    )

    wikiManager.createPage(
        pagePath,
        conceptName,
        markdown,
        { category: 'components', related: [] }
    )

    stats.pagesCreated++
ELSE:
    # Update existing page
    markdown = documentationWriterAgent.writeDocumentation(
        conceptName,
        codeAnalysis,
        existingPage.content # Merge with existing
    )

    wikiManager.updatePage(
        pagePath,
        conceptName,
        markdown
    )

    stats.pagesUpdated++
```

**Agent Behavior:**
- **New pages**: Generate from scratch following standard template
- **Existing pages**: Preserve structure, merge new information, update insights

## Cost Limit Enforcement

Before processing each commit:

```
costSummary = claudeClient.getCostSummary()

IF costSummary.totalCost >= options.maxCost:
    # Stop processing
    stats.stopped = true
    stats.stopReason = 'cost_limit'
    state.status = 'paused'
    stateManager.saveState(state)
    BREAK # Exit processing loop
ELSE:
    # Continue processing
    processCommit(...)
```

**When limit is reached:**
1. Stop immediately (don't process current commit)
2. Mark stats as stopped with reason
3. Save state as 'paused'
4. Return partial results

**Resuming after limit:**
1. Increase maxCost in options
2. Call processRepository again
3. Will resume from last saved commit
4. Process until new limit or completion

## Meta-Analysis Trigger Logic

After processing each commit:

```
currentCommit = state.currentCommit
lastAnalysis = state.lastMetaAnalysis || 0
frequency = metaAnalysisAgent.frequency || 5

# Check if we should run
shouldRun = metaAnalysisAgent.shouldRunMetaAnalysis(
    currentCommit,
    lastAnalysis
)

# Implementation:
IF currentCommit == lastAnalysis:
    shouldRun = false # Don't re-analyze same commit
ELSE IF currentCommit % frequency == 0:
    shouldRun = true  # Hit frequency interval
ELSE:
    shouldRun = false # Between intervals
```

**When meta-analysis runs:**

```
IF shouldRun:
    analysis = metaAnalysisAgent.analyzeProgress(
        stats.allConcepts,      # All concepts found so far
        stats.allPages          # All pages created/updated
    )

    # Store results
    state.lastMetaAnalysis = currentCommit
    state.lastMetaAnalysisResults = {
        themes: [...],           # Architectural patterns
        newPagesNeeded: [...],   # Suggested pages
        gaps: [...],             # Missing documentation
        reorganization: [...]    # Structural improvements
    }

    stateManager.saveState(state)
    stats.metaAnalysisRuns++
```

**Frequency Examples:**
- Frequency = 5: Runs at commits 5, 10, 15, 20...
- Frequency = 10: Runs at commits 10, 20, 30, 40...
- Frequency = 1: Runs after every commit (expensive!)

## State Persistence Strategy

State is saved at multiple points:

```
# After each commit
processCommit(...)
state.currentCommit++
stateManager.saveState(state)  ← Save point 1

# After meta-analysis
IF shouldRunMetaAnalysis:
    runMetaAnalysis(...)
    state.lastMetaAnalysis = currentCommit
    stateManager.saveState(state)  ← Save point 2

# On cost limit
IF cost >= maxCost:
    state.status = 'paused'
    stateManager.saveState(state)  ← Save point 3
    BREAK

# On completion
IF all commits processed:
    state.status = 'completed'
    stateManager.saveState(state)  ← Save point 4
```

**Why save so frequently?**
- Minimizes lost work on crash/interruption
- Enables fine-grained resumption
- Small overhead (JSON write is fast)

## Error Propagation Strategy

The processor does NOT catch errors - it propagates them:

```
try:
    # Not actually wrapped in try-catch
    commits = await githubClient.getCommits(...)
    analysis = await codeAnalysisAgent.analyzeCode(...)
    markdown = await docWriterAgent.writeDocumentation(...)
except Error as e:
    # Error propagates to caller
    # State was saved before error
    # Can resume after fixing issue
    throw e
```

**Rationale:**
- GitHub API errors → Likely auth or network issue, needs user attention
- Claude API errors → Likely quota or auth issue, needs user attention
- File system errors → Likely permissions issue, needs user attention
- Best to fail fast and clearly

**State on Error:**
- Last saved state is valid
- Can resume from last successful commit
- No corrupted partial state

## Statistics Aggregation

Statistics are accumulated across commits:

```
# Initialize
stats = {
    commitsProcessed: 0,
    totalFiles: 0,
    filesProcessed: 0,
    filesSkipped: 0,
    pagesCreated: 0,
    pagesUpdated: 0,
    metaAnalysisRuns: 0,
    allConcepts: [],
    allPages: []
}

# Per commit
FOR EACH commit:
    commitSummary = processCommit(commit, state)

    stats.commitsProcessed++
    stats.totalFiles += commit.files.length
    stats.filesProcessed += commitSummary.filesProcessed
    stats.filesSkipped += commitSummary.filesSkipped
    stats.pagesCreated += commitSummary.pagesCreated
    stats.pagesUpdated += commitSummary.pagesUpdated
    stats.allConcepts.push(...commitSummary.concepts)
    # (allPages would be tracked similarly)

# Finalize
stats.totalCost = claudeClient.getCostSummary().totalCost
return stats
```

**Statistics Usage:**
- User feedback (progress, costs, outcomes)
- Debugging (where did processing stop?)
- Meta-analysis input (concepts and pages)
- Resume decision (how much done?)

## Key Decision Points Summary

| Decision | Condition | Action |
|----------|-----------|--------|
| Resume or start | Same repo + progress exists | Resume from saved point |
| Process file | Has patch + is significant | Analyze and document |
| Skip file | No patch OR insignificant | Skip, increment skipped count |
| Create or update page | Page doesn't exist | Create new page |
| Create or update page | Page exists | Update existing page |
| Stop processing | Cost >= limit | Pause, save state, return |
| Run meta-analysis | currentCommit % frequency == 0 | Run analysis, save results |
| Mark complete | All commits processed | Set status = 'completed' |

## Performance Considerations

**Sequential Processing:**
- Commits are processed one at a time
- State must be consistent after each commit
- Cannot parallelize (would require complex state merging)

**File-Level Parallelization:**
- Within a commit, files COULD be processed in parallel
- Currently sequential for simplicity
- Future optimization opportunity

**API Call Batching:**
- Code analysis: 1 call per significant file
- Documentation writing: 1 call per concept
- Meta-analysis: 1 call per N commits
- No batching currently (Claude API doesn't support)

**Caching Opportunities:**
- Prompt templates (already cached)
- Related pages search (could cache)
- File significance checks (pure function)
- Cost tracking (already in-memory)
