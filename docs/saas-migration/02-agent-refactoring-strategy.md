# Agent Refactoring Strategy

## Current Agent Patterns

### Existing Pattern (Problems)
1. Each agent instantiates its own `ClaudeClient` and `PromptManager`
2. No standard interface - methods vary (analyzeCode, writeDocumentation, generateIndex, etc.)
3. No `shouldRun` logic - Processor decides externally
4. Constructor takes no parameters - dependencies are hidden
5. Some agents are pure (LinkDiscoveryAgent), most require LLM

---

## Proposed Agent Interface

### Standard Agent Contract

Every agent should export:

| Property/Method | Type | Purpose |
|-----------------|------|---------|
| `name` | string | Unique identifier |
| `version` | string | Semver version |
| `description` | string | Human-readable description |
| `shouldRun(context)` | function | Decides if agent should run for given input |
| `execute(input, deps)` | function | Performs the agent's work |

### Context Object (for shouldRun)
```
{
  commit: { sha, message, files, timestamp },
  repository: { name, owner, language },
  existingPages: [{ path, title, category }],
  jobType: 'commit' | 'full' | 'incremental'
}
```

### Dependencies Object (for execute)
```
{
  llm: ClaudeClient instance,
  promptManager: PromptManager instance,
  wikiManager: WikiManager instance (optional),
  logger: Logger instance
}
```

### Input/Output by Agent Type

| Agent Type | Input | Output |
|------------|-------|--------|
| Analysis | { filePath, diff, commitMessage, context } | { concepts: [...], metadata: {...} } |
| Writer | { concept, analysis, existingContent } | { content: string, metadata: {...} } |
| Index | { allPages, repositoryName } | { content: string } |
| Discovery | { content, allPages } | { mentions: [...], related: [...] } |

---

## Agent Categorization

### Category 1: Pure Functions (No LLM)
These can remain as simple functions, no refactoring needed beyond interface compliance.

- **LinkDiscoveryAgent** - Finds mentions of page titles in content
  - Input: content string, page list
  - Output: array of mentions with positions

### Category 2: LLM-Dependent Analysis
Transform data using LLM, produce structured output.

- **CodeAnalysisAgent** - Analyzes diffs, extracts concepts
- **MetaAnalysisAgent** - Analyzes progress across concepts
- **SecurityAnalysisAgent** - Finds security issues
- **TechDebtAnalysisAgent** - Identifies technical debt

### Category 3: LLM-Dependent Generation
Generate markdown content using LLM.

- **DocumentationWriterAgent** - Writes page content
- **WikiIndexAgent** - Generates index page
- **GuideGenerationAgent** - Creates guides
- **ArchitectureOverviewAgent** - Creates architecture overview
- **MetaDocumentIngestionAgent** - Processes meta documents

### Category 4: Orchestration (Combines LLM calls)
Makes multiple LLM calls with intermediate decisions.

- **WikiContextAgent** - Research agent with iterative refinement

---

## Refactoring Approach by Agent

### 1. CodeAnalysisAgent

**Current Interface:**
- `analyzeCode(filePath, fileDiff, commitMessage, relatedPages)`

**New Interface:**
- `shouldRun(context)` - Returns true if commit has significant code files
- `execute(input, deps)` - Analyzes code, returns concepts

**shouldRun Logic:**
- Check if any file in commit passes `isSignificantFile()` test
- Skip if commit is merge/revert only

**Keep:**
- `isSignificantFile()` logic (useful utility)
- `_truncateDiff()` logic
- `_validateResponse()` logic

### 2. DocumentationWriterAgent

**Current Interface:**
- `writeDocumentation(conceptName, codeAnalysis, existingContent, options)`
- `addCrossLinks(content, currentPagePath, allPages)`
- `sanitizeMarkdown(markdown)`

**New Interface:**
- `shouldRun(context)` - Always true when concepts exist
- `execute(input, deps)` - Writes documentation

**Note:** `addCrossLinks` and `sanitizeMarkdown` are pure functions - extract to utilities.

### 3. WikiIndexAgent

**Current Interface:**
- `generateIndex(wikiData)`

**New Interface:**
- `shouldRun(context)` - True if pages exist and threshold met
- `execute(input, deps)` - Generates index content

**shouldRun Logic:**
- Use frequency-based check (every N commits)
- Always run on final commit

### 4. LinkDiscoveryAgent (Pure)

**Current Interface:**
- `findMentions(content, allPages)`
- `findRelatedPages(content, currentPath, allPages)`

**Keep as utility functions** - no LLM dependency, pure transformations.

### 5. WikiContextAgent (Special Case)

**Current Interface:**
- `research(query, options)`

**This agent is fundamentally different** - it's an interactive research tool, not a batch processor.

**Recommendation:** Keep separate from standard agent interface. Used by:
- MCP server
- wiki-context CLI
- Dashboard context research

---

## Migration Steps

### Phase 1: Extract Pure Functions
1. Extract `isSignificantFile()` to shared utility
2. Extract `sanitizeMarkdown()` to shared utility
3. Extract `addCrossLinks()` to shared utility
4. Extract diff truncation logic to shared utility
5. Keep LinkDiscoveryAgent as pure utility module

### Phase 2: Create Agent Interface
1. Define TypeScript types for AgentContext, AgentInput, AgentOutput
2. Create base agent validation utilities
3. Create agent registry structure

### Phase 3: Refactor Analysis Agents
1. CodeAnalysisAgent - add shouldRun, convert to execute
2. SecurityAnalysisAgent - add shouldRun, convert to execute
3. TechDebtAnalysisAgent - add shouldRun, convert to execute
4. MetaAnalysisAgent - add shouldRun, convert to execute

### Phase 4: Refactor Generation Agents
1. DocumentationWriterAgent - add shouldRun, convert to execute
2. WikiIndexAgent - add shouldRun, convert to execute
3. GuideGenerationAgent - add shouldRun, convert to execute
4. ArchitectureOverviewAgent - add shouldRun, convert to execute
5. MetaDocumentIngestionAgent - add shouldRun, convert to execute

### Phase 5: Update Processor
1. Load agents from registry
2. For each commit, filter agents by shouldRun
3. Execute filtered agents with dependencies injected
4. Collect and aggregate results

---

## Agent Registry

Simple object map - no dynamic discovery:

```
const agents = {
  'code-analysis': CodeAnalysisAgent,
  'documentation-writer': DocumentationWriterAgent,
  // ...
};
```

Import all agents at startup, validate interface, done.

---

## Testing Agents

Test agents through API tests primarily. Unit test only where agent initialization is complex.

For agents with complex setup:
- Test shouldRun with various contexts
- Test execute with mocked LLM (via injected deps)

---

## Decisions

| Question | Answer |
|----------|--------|
| Return type? | Analysis: structured data. Writers: markdown string |
| Agent dependencies? | Processor orchestrates order, passes previous results |
| shouldRun async? | No, keep sync |
| Handle failures? | Return error result, processor decides retry |

---

## Reference

The current project wiki (being merged soon) documents existing agent behavior and can be consulted during refactoring.
