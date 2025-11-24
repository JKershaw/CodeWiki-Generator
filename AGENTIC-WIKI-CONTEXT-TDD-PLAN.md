# Agentic Wiki Context - TDD Implementation Plan

## Overview

Implement an agentic/iterative approach to wiki context research where:
1. Initial context is automatically generated (smart subset of wiki)
2. LLM receives initial context + tools to request more information
3. LLM iteratively refines understanding by requesting additional pages
4. LLM synthesizes final comprehensive context

**Key Decision:** Use **Claude 3.5 Haiku** (`claude-3-5-haiku-20241022`) for speed and cost efficiency.

## Project Patterns to Follow

Based on analysis of existing codebase:

1. **Class-based agents** in `lib/` directory
2. **Jest tests** with mocks in `tests/unit/`
3. **Test fixtures** in `tests/fixtures/`
4. **Mock ClaudeClient** in test mode
5. **Descriptive test blocks** with `describe` and `it`
6. **Single responsibility** per method
7. **JSDoc comments** for public methods

---

## Phase 1: Core Infrastructure (TDD)

### 1.1 WikiContextAgent Base Class

**File:** `lib/agents/wiki-context-agent.js`

**Test File:** `tests/unit/agents/wiki-context-agent.test.js`

#### Tests (Write First):

```javascript
describe('WikiContextAgent', () => {
  describe('getAllPages', () => {
    it('should scan wiki directory and return all pages');
    it('should extract metadata from frontmatter');
    it('should infer category from file path');
    it('should cache pages after first scan');
    it('should skip hidden directories starting with . or _');
  });

  describe('generateInitialContext', () => {
    it('should return top 5 candidates based on keyword matching');
    it('should score pages by title matches higher than content');
    it('should include wiki index with all page paths');
    it('should filter out short words (< 4 chars) from scoring');
  });

  describe('searchWikiContent', () => {
    it('should find pages containing query terms');
    it('should return results ranked by match count');
    it('should respect limit parameter');
    it('should be case-insensitive');
  });

  describe('readWikiPage', () => {
    it('should return full page content by path');
    it('should return error for non-existent page');
    it('should include metadata and category');
  });

  describe('listPagesByCategory', () => {
    it('should return all pages in specified category');
    it('should return empty array for invalid category');
    it('should support categories: concept, component, guide, meta, other');
  });
});
```

#### Implementation Steps:

1. ✅ Write failing tests for `getAllPages`
2. ✅ Implement `getAllPages` to make tests pass
3. ✅ Write failing tests for `generateInitialContext`
4. ✅ Implement keyword-based scoring algorithm
5. ✅ Write failing tests for search/read/list methods
6. ✅ Implement remaining methods
7. ✅ Verify all tests pass

**Key Implementation Details:**
- Use `fs.promises` for async file operations
- Cache `allPages` to avoid re-scanning
- Simple keyword matching (no embeddings in v1)
- Title matches score 5x higher than content matches

---

### 1.2 Tool Execution System

**File:** `lib/agents/wiki-context-agent.js` (continued)

#### Tests (Write First):

```javascript
describe('WikiContextAgent - Tools', () => {
  describe('getTools', () => {
    it('should return array of tool definitions');
    it('should include read_wiki_page tool');
    it('should include search_wiki_content tool');
    it('should include list_pages_by_category tool');
    it('should include finalize_context tool');
    it('should have valid JSON schemas for all tools');
  });

  describe('executeTool', () => {
    it('should execute read_wiki_page and return page content');
    it('should execute search_wiki_content and return ranked results');
    it('should execute list_pages_by_category and return filtered pages');
    it('should execute finalize_context and return context object');
    it('should return error for unknown tool');
    it('should return error for invalid tool input');
  });

  describe('extractToolUses', () => {
    it('should extract tool_use blocks from Claude response');
    it('should return empty array if no tool uses');
    it('should handle multiple tool uses in one response');
  });
});
```

#### Implementation Steps:

1. ✅ Write failing tests for `getTools`
2. ✅ Define tool schemas following Anthropic's format
3. ✅ Write failing tests for `executeTool`
4. ✅ Implement tool execution with switch/case
5. ✅ Write failing tests for `extractToolUses`
6. ✅ Implement Claude response parsing
7. ✅ Verify all tests pass

**Tool Definitions:**

```javascript
getTools() {
  return [
    {
      name: "read_wiki_page",
      description: "Read full content of a specific wiki page",
      input_schema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Page path" }
        },
        required: ["path"]
      }
    },
    {
      name: "search_wiki_content",
      description: "Search for pages containing keywords",
      input_schema: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "number", default: 5 }
        },
        required: ["query"]
      }
    },
    {
      name: "list_pages_by_category",
      description: "List all pages in a category",
      input_schema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["concept", "component", "guide", "meta", "other"]
          }
        },
        required: ["category"]
      }
    },
    {
      name: "finalize_context",
      description: "Finalize research with synthesized context",
      input_schema: {
        type: "object",
        properties: {
          context: {
            type: "object",
            properties: {
              summary: { type: "string" },
              relevantPages: { type: "array" },
              keyComponents: { type: "array" },
              keyConcepts: { type: "array" },
              implementationGuidance: { type: "array" },
              relatedFiles: { type: "array" }
            },
            required: ["summary", "relevantPages"]
          }
        },
        required: ["context"]
      }
    }
  ];
}
```

---

## Phase 2: Agentic Research Loop (TDD)

### 2.1 Research Orchestration

**File:** `lib/agents/wiki-context-agent.js` (continued)

#### Tests (Write First):

```javascript
describe('WikiContextAgent - Research', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    mockClaudeClient = {
      sendMessage: jest.fn()
    };
    agent = new WikiContextAgent('./test-wiki');
    agent.claudeClient = mockClaudeClient;
  });

  describe('research', () => {
    it('should generate initial context');
    it('should call Claude with initial prompt and tools');
    it('should use claude-3-5-haiku-20241022 model');
    it('should handle tool_use response and execute tools');
    it('should iterate until finalize_context is called');
    it('should respect maxIterations limit (default 10)');
    it('should return final context when finalized');
    it('should handle error if max iterations reached');
  });

  describe('buildSystemPrompt', () => {
    it('should return system prompt explaining agent role');
    it('should include instructions for tool use');
    it('should emphasize strategic tool usage');
  });

  describe('buildInitialPrompt', () => {
    it('should include task description');
    it('should include initial context pages');
    it('should include full wiki index');
    it('should include finalize_context format');
  });

  describe('iterative tool use', () => {
    it('should handle single tool call and continue');
    it('should handle multiple tool calls in sequence');
    it('should pass tool results back to Claude');
    it('should build conversation history correctly');
    it('should detect finalize_context and stop iteration');
  });
});
```

#### Implementation Steps:

1. ✅ Write failing test for basic `research` flow
2. ✅ Implement skeleton with iteration loop
3. ✅ Write failing tests for prompt building
4. ✅ Implement system and initial prompts
5. ✅ Write failing tests for tool use handling
6. ✅ Implement conversation management
7. ✅ Write failing tests for iteration limits
8. ✅ Implement max iteration safeguard
9. ✅ Verify all tests pass

**Key Implementation Details:**

```javascript
async research(taskDescription, options = {}) {
  const { maxIterations = 10 } = options;

  // 1. Generate initial context (top 5 pages + index)
  const { rankedPages, wikiIndex } = await this.generateInitialContext(taskDescription);

  // 2. Build prompts
  const systemPrompt = this.buildSystemPrompt();
  const userPrompt = this.buildInitialPrompt(taskDescription, rankedPages, wikiIndex);

  // 3. Initialize conversation
  let messages = [{ role: 'user', content: userPrompt }];
  let iterationCount = 0;

  // 4. Iteration loop
  while (iterationCount < maxIterations) {
    iterationCount++;

    // Call Claude with tools
    const response = await this.claudeClient.sendMessage(messages, {
      model: 'claude-3-5-haiku-20241022', // Fast Haiku!
      maxTokens: 4000,
      system: systemPrompt,
      tools: this.getTools()
    });

    // Check for tool use
    if (response.stop_reason === 'tool_use') {
      const toolUses = this.extractToolUses(response);

      // Execute each tool
      for (const toolUse of toolUses) {
        // Check if finalized
        if (toolUse.name === 'finalize_context') {
          return toolUse.input.context;
        }

        // Execute tool
        const result = await this.executeTool(toolUse.name, toolUse.input);

        // Add to conversation
        messages.push({
          role: 'assistant',
          content: response.content
        });
        messages.push({
          role: 'user',
          content: [{
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(result)
          }]
        });
      }
    } else {
      // No more tool use, conversation ended
      break;
    }
  }

  throw new Error('Research did not finalize within max iterations');
}
```

---

## Phase 3: ClaudeClient Enhancement (TDD)

### 3.1 Add Tool Support to ClaudeClient

**File:** `lib/claude.js`

**Test File:** `tests/unit/claude.test.js`

#### Tests (Write First):

```javascript
describe('ClaudeClient - Tool Support', () => {
  describe('sendMessage with tools', () => {
    it('should accept tools parameter');
    it('should pass tools to Anthropic API');
    it('should return response with tool_use blocks');
    it('should preserve stop_reason in response');
    it('should handle tool_use stop reason');
  });

  describe('Haiku 3.5 model', () => {
    it('should support claude-3-5-haiku-20241022 model');
    it('should have correct pricing for Haiku 3.5');
    it('should calculate costs correctly for Haiku');
  });
});
```

#### Implementation Steps:

1. ✅ Write failing tests for tool support
2. ✅ Enhance `sendMessage` to accept `tools` and `system` parameters
3. ✅ Update API call to pass tools
4. ✅ Return full response object (not just text) when tools present
5. ✅ Write failing tests for Haiku 3.5 pricing
6. ✅ Add Haiku 3.5 to pricing table
7. ✅ Verify all tests pass

**Pricing Update:**

```javascript
this.pricing = {
  'claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
  'claude-3-5-haiku-20241022': { input: 0.80, output: 4.0 }, // Latest Haiku
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 }
};
```

**Enhanced sendMessage:**

```javascript
async sendMessage(prompt, options = {}) {
  const {
    model = this.defaultModel,
    maxTokens = this.defaultMaxTokens,
    systemPrompt = null,
    system = null,       // NEW: support system parameter
    tools = null         // NEW: support tools
  } = options;

  const messageParams = {
    model,
    max_tokens: maxTokens,
    messages: Array.isArray(prompt) ? prompt : [{
      role: 'user',
      content: prompt
    }]
  };

  if (system) {
    messageParams.system = system;
  } else if (systemPrompt) {
    messageParams.system = systemPrompt;
  }

  if (tools) {
    messageParams.tools = tools;
  }

  const response = await this._retryRequest(async () => {
    return await this.client.messages.create(messageParams);
  });

  this._trackUsage(response);

  // If tools present, return full response (includes content blocks)
  if (tools) {
    return response;
  }

  // Otherwise return text only (backward compatible)
  return response.content[0].text;
}
```

---

## Phase 4: CLI Integration (TDD)

### 4.1 CLI Wrapper

**File:** `wiki-context-agentic.js` (already created, needs tests)

**Test File:** `tests/unit/wiki-context-agentic.test.js`

#### Tests (Write First):

```javascript
describe('AgenticWikiContextCLI', () => {
  describe('constructor', () => {
    it('should initialize with default wiki path');
    it('should accept custom wiki path');
    it('should create WikiContextAgent instance');
  });

  describe('research', () => {
    it('should call agent.research with task description');
    it('should return formatted results');
    it('should handle errors gracefully');
  });

  describe('formatResults', () => {
    it('should format summary section');
    it('should format relevant pages with bullets');
    it('should format key components');
    it('should format key concepts');
    it('should format implementation guidance');
    it('should format related files');
    it('should handle missing optional sections');
  });

  describe('CLI arguments', () => {
    it('should parse task description from args');
    it('should parse --wiki flag');
    it('should show usage if no task provided');
    it('should handle multiple word task descriptions');
  });
});
```

#### Implementation Steps:

1. ✅ Write failing tests for CLI class
2. ✅ Refactor existing code to use WikiContextAgent
3. ✅ Write failing tests for formatting
4. ✅ Implement formatting methods
5. ✅ Write failing tests for argument parsing
6. ✅ Implement CLI argument handling
7. ✅ Verify all tests pass

---

## Phase 5: Integration Testing

### 5.1 End-to-End Tests

**Test File:** `tests/integration/wiki-context-agentic.test.js`

#### Tests:

```javascript
describe('Agentic Wiki Context - Integration', () => {
  describe('with test fixtures', () => {
    it('should complete research in 1-3 iterations for simple task');
    it('should make tool calls to read additional pages');
    it('should search wiki when needed');
    it('should finalize with complete context object');
    it('should respect max iterations limit');
  });

  describe('mock Claude responses', () => {
    it('should handle tool_use response correctly');
    it('should handle multiple tool calls in one response');
    it('should handle finalize_context tool call');
    it('should build conversation history correctly');
  });

  describe('performance', () => {
    it('should use less than 50% of wiki content for focused query');
    it('should track iteration count');
    it('should log tool calls for debugging');
  });
});
```

---

## Phase 6: Test Fixtures

### 6.1 Create Test Wiki

**Directory:** `tests/fixtures/wiki-agentic/`

Create minimal test wiki with:
- 10 sample pages across categories
- Concepts: architecture.md, authentication.md
- Components: processor.md, dashboard.md
- Guides: getting-started.md, deployment.md
- Meta: philosophy.md

### 6.2 Mock Claude Responses

**File:** `tests/fixtures/mock-claude-responses.js`

```javascript
module.exports = {
  // Initial response with tool calls
  toolUseResponse: {
    content: [
      { type: 'text', text: 'Let me read the processor page...' },
      {
        type: 'tool_use',
        id: 'tool_1',
        name: 'read_wiki_page',
        input: { path: 'components/processor.md' }
      }
    ],
    stop_reason: 'tool_use'
  },

  // Finalize response
  finalizeResponse: {
    content: [
      { type: 'text', text: 'I have sufficient context.' },
      {
        type: 'tool_use',
        id: 'tool_2',
        name: 'finalize_context',
        input: {
          context: {
            summary: 'Test summary...',
            relevantPages: [...],
            // ... complete context
          }
        }
      }
    ],
    stop_reason: 'tool_use'
  }
};
```

---

## Implementation Order (TDD Red-Green-Refactor)

### Week 1: Core Infrastructure

**Day 1-2: WikiContextAgent - Data Access**
1. ✅ Write tests for `getAllPages`
2. ✅ Implement `getAllPages`
3. ✅ Write tests for `generateInitialContext`
4. ✅ Implement keyword scoring

**Day 3-4: WikiContextAgent - Tools**
1. ✅ Write tests for `getTools`
2. ✅ Define tool schemas
3. ✅ Write tests for `executeTool`
4. ✅ Implement tool execution

**Day 5: Test Fixtures**
1. ✅ Create test wiki with sample pages
2. ✅ Create mock Claude responses
3. ✅ Verify fixtures work in tests

### Week 2: Agentic Loop

**Day 1-3: Research Orchestration**
1. ✅ Write tests for `research` method
2. ✅ Implement iteration loop
3. ✅ Write tests for prompt building
4. ✅ Implement system/user prompts
5. ✅ Write tests for conversation management
6. ✅ Implement message history handling

**Day 4-5: ClaudeClient Enhancement**
1. ✅ Write tests for tool support
2. ✅ Enhance `sendMessage` method
3. ✅ Add Haiku 3.5 pricing
4. ✅ Test with mock responses

### Week 3: Integration & Polish

**Day 1-2: CLI Integration**
1. ✅ Write CLI tests
2. ✅ Refactor CLI to use agent
3. ✅ Test argument parsing
4. ✅ Test formatting

**Day 3-4: Integration Tests**
1. ✅ Write end-to-end tests
2. ✅ Test with mock Claude
3. ✅ Test iteration scenarios
4. ✅ Test error handling

**Day 5: Documentation & Cleanup**
1. ✅ Add JSDoc comments
2. ✅ Update README
3. ✅ Add usage examples
4. ✅ Run full test suite

---

## Success Metrics

### Test Coverage
- ✅ 100% coverage of WikiContextAgent methods
- ✅ 100% coverage of tool execution paths
- ✅ Integration tests for full research flow
- ✅ Edge cases: max iterations, errors, missing pages

### Performance
- ✅ Research completes in 1-5 iterations (average: 2-3)
- ✅ Initial context uses <20% of wiki content
- ✅ Final context includes 5-10 relevant pages (vs 36 all pages)
- ✅ Uses Haiku 3.5 for 80% cost savings vs Sonnet

### Code Quality
- ✅ Follows project patterns (class-based, mocked tests)
- ✅ JSDoc comments on all public methods
- ✅ Descriptive test names
- ✅ No test code in production files

---

## Cost Analysis

### Current Approach (Brute Force)
- Input: ~341KB wiki → ~85,000 tokens
- Model: Sonnet 4 ($3/M input)
- Cost per query: ~$0.25

### Agentic Approach (Haiku 3.5)
- Initial: ~50KB (5 pages) → ~12,500 tokens
- Tool calls: 2-3 additional pages → ~6,000 tokens each
- Average input: ~25,000 tokens total
- Model: Haiku 3.5 ($0.80/M input)
- Cost per query: ~$0.02

**Savings: 92% cost reduction** 🎉

---

## Running the Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/unit/agents/wiki-context-agent.test.js

# Run with coverage
npm test -- --coverage

# Watch mode during development
npm test -- --watch
```

---

## Final Project Structure

```
lib/
  agents/
    wiki-context-agent.js          # NEW: Agentic research agent
    code-analysis-agent.js          # Existing
    ...
  claude.js                          # ENHANCED: Tool support
  ...

tests/
  unit/
    agents/
      wiki-context-agent.test.js    # NEW: Unit tests
  integration/
    wiki-context-agentic.test.js    # NEW: Integration tests
  fixtures/
    wiki-agentic/                   # NEW: Test wiki
    mock-claude-responses.js        # NEW: Mock responses

wiki-context-agentic.js             # NEW: CLI wrapper
AGENTIC-WIKI-CONTEXT-TDD-PLAN.md    # This file
```

---

## Migration Path

### Phase 1: Parallel Deployment
- Keep existing `wiki-context.js` (brute force)
- Add new `wiki-context-agentic.js` (agentic)
- Users can test both and compare

### Phase 2: Evaluation
- Compare accuracy of both approaches
- Compare cost and performance
- Gather user feedback

### Phase 3: Deprecation (if agentic proves superior)
- Make agentic the default
- Keep brute force as `--legacy` flag
- Eventually deprecate legacy

---

## Next Steps

1. **Create test fixtures** (wiki + mock responses)
2. **Start with Day 1 TDD**: Write first test for `getAllPages`
3. **Red-Green-Refactor**: Make it fail, make it pass, make it clean
4. **Commit after each passing test**
5. **Follow the 3-week schedule**

Ready to start implementing! 🚀
