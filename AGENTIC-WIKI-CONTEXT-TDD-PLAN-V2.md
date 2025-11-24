# Agentic Wiki Context - Revised TDD Implementation Plan (v2)

## Key Updates from Latest Research

### 🚀 Claude Haiku 4.5 (October 2025)
- **Model ID**: `claude-haiku-4-5-20251001`
- **Performance**: 73.3% on SWE-bench Verified (comparable to Sonnet 4)
- **Speed**: 2x+ faster than Sonnet 4
- **Cost**: $1/$5 per million tokens (1/3 the cost of Sonnet)
- **Best for**: Coding, agentic workflows, tool use

### 🧠 Interleaved Thinking (New Beta Feature)
- **Beta Header**: `interleaved-thinking-2025-05-14`
- **What it does**: Allows Claude to think between tool calls
- **Benefits**: More sophisticated reasoning after tool results, better chaining
- **Usage**: Works with Claude 4 models (including Haiku 4.5)

**This is perfect for our use case!** The LLM can:
1. Think about what information it needs
2. Request specific pages via tools
3. Think about the results
4. Request more if needed
5. Finalize with synthesized context

---

## Revised Architecture

### Old Approach (Brute Force)
```
All pages → LLM → Response
(85K tokens, $0.25/query)
```

### New Approach (Agentic with Interleaved Thinking)
```
Initial Context (5 pages)
    ↓
LLM + Interleaved Thinking
    ↓
[Thinking] "I need processor details"
    ↓
[Tool Call] read_wiki_page("components/processor.md")
    ↓
[Thinking] "Now I understand the structure"
    ↓
[Tool Call] finalize_context(synthesized_result)
    ↓
Response

(~15K tokens, $0.015/query - 94% savings!)
```

---

## Critical Implementation Changes

### 1. Use Interleaved Thinking

**ClaudeClient Enhancement:**

```javascript
async sendMessage(messages, options = {}) {
  const {
    model = this.defaultModel,
    maxTokens = this.defaultMaxTokens,
    system = null,
    tools = null,
    thinking = null,  // NEW
    betas = null      // NEW
  } = options;

  const messageParams = {
    model,
    max_tokens: maxTokens,
    messages: Array.isArray(messages) ? messages : [{
      role: 'user',
      content: messages
    }]
  };

  if (system) messageParams.system = system;
  if (tools) messageParams.tools = tools;

  // Enable interleaved thinking for Claude 4 models
  if (thinking) {
    messageParams.thinking = thinking;
  }

  const headers = {};
  if (betas) {
    headers['anthropic-beta'] = betas.join(',');
  }

  const response = await this._retryRequest(async () => {
    return await this.client.messages.create(messageParams, { headers });
  });

  return response; // Return full response for tool handling
}
```

### 2. Carefully Crafted System Prompt

**Key Insight**: The prompt should guide the LLM to be strategic and efficient, completing research in 1-3 iterations.

```javascript
buildSystemPrompt() {
  return `You are an expert wiki research assistant helping developers quickly understand codebases.

## Your Mission
Analyze a wiki and extract relevant context for a development task. Complete your research efficiently (typically 1-3 tool calls) and provide actionable guidance.

## Strategic Approach
1. **First, analyze initial context carefully** - You receive 5 top-candidate pages + full wiki index
2. **Identify critical gaps** - What key information is missing?
3. **Make targeted requests** - Use tools strategically to fill gaps
4. **Synthesize quickly** - Once you have sufficient context, finalize immediately

## Tools Available
- **read_wiki_page(path)** - Read full content of a specific page
- **search_wiki_content(query, limit)** - Search pages by keywords
- **list_pages_by_category(category)** - List all pages in a category
- **finalize_context(context)** - Complete research with synthesized results

## Thinking Strategy
Use your thinking blocks to:
- Assess what you already know from initial context
- Identify specific information gaps
- Plan which 1-2 pages would be most valuable
- Synthesize findings after reading additional pages
- Decide when you have sufficient context

## Quality Standards
Your final context must include:
- **Summary**: High-level overview (2-3 sentences)
- **Relevant Pages**: 3-7 pages with specific relevance explanations
- **Key Components**: 2-5 components with purpose and location
- **Key Concepts**: 2-4 concepts with application to this task
- **Implementation Guidance**: 4-8 concrete, actionable steps
- **Related Files**: Actual file paths from the codebase

## Efficiency Goal
Complete research in 1-3 iterations:
- **Simple tasks**: Use initial context, maybe 1 additional page
- **Moderate tasks**: 2-3 additional pages
- **Complex tasks**: Search + read 3-5 targeted pages

Avoid:
- Reading pages you don't need
- Re-reading similar content
- Requesting category lists unless truly exploring
- Over-researching simple tasks

Remember: Speed and precision matter. The developer wants actionable guidance now.`;
}
```

### 3. Optimized Initial User Prompt

```javascript
buildInitialPrompt(taskDescription, rankedPages, wikiIndex) {
  return `# Development Task
"${taskDescription}"

# Initial Context - Top 5 Candidate Pages
${rankedPages.map((p, i) => `
## ${i + 1}. ${p.title} (${p.path})
Category: ${p.category}

${this.extractKeyContent(p.content, 800)} ${p.content.length > 800 ? '\n[Content truncated - use read_wiki_page to see full content]' : ''}
`).join('\n---\n')}

# Available Pages - Full Wiki Index
${this.groupPagesByCategory(wikiIndex).map(group => `
**${group.category.toUpperCase()}** (${group.pages.length} pages)
${group.pages.map(p => `  - ${p.title} (${p.path})`).join('\n')}
`).join('\n')}

# Your Task
1. **Think** about the task and initial context
2. **Identify gaps** - What critical information is missing?
3. **Use tools** strategically to fill gaps (aim for 1-3 tool calls)
4. **Finalize** when you have sufficient context

When ready, call finalize_context with this structure:
\`\`\`json
{
  "context": {
    "summary": "High-level overview...",
    "relevantPages": [
      {
        "path": "concepts/architecture.md",
        "title": "Architecture Overview",
        "relevance": "Explains system design patterns needed for this task"
      }
    ],
    "keyComponents": [
      {
        "name": "Processor",
        "purpose": "Main orchestrator for wiki generation",
        "location": "lib/processor.js"
      }
    ],
    "keyConcepts": [
      {
        "concept": "Real-time Status Monitoring",
        "description": "5-second polling pattern for UI sync",
        "application": "Use this pattern for progress tracking implementation"
      }
    ],
    "implementationGuidance": [
      "Step 1: Extend /api/status endpoint to include progress metrics",
      "Step 2: Modify Processor class to emit progress events",
      "Step 3: Update dashboard polling to handle progress data",
      "Step 4: Add progress UI elements (bars, counters)"
    ],
    "relatedFiles": [
      "lib/processor.js",
      "lib/dashboard-controller.js",
      "public/app.js"
    ]
  }
}
\`\`\`

Begin by thinking about the task and what you need to know.`;
}
```

### 4. Helper Methods for Better Context

```javascript
/**
 * Extract key content from a page (first N chars, smart truncation)
 */
extractKeyContent(content, maxChars = 800) {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

  if (withoutFrontmatter.length <= maxChars) {
    return withoutFrontmatter;
  }

  // Try to truncate at paragraph boundary
  const truncated = withoutFrontmatter.substring(0, maxChars);
  const lastParagraph = truncated.lastIndexOf('\n\n');

  if (lastParagraph > maxChars * 0.7) {
    return truncated.substring(0, lastParagraph);
  }

  return truncated;
}

/**
 * Group pages by category for better index presentation
 */
groupPagesByCategory(wikiIndex) {
  const groups = {};

  for (const page of wikiIndex) {
    if (!groups[page.category]) {
      groups[page.category] = [];
    }
    groups[page.category].push(page);
  }

  // Return sorted by category importance
  const categoryOrder = ['concept', 'component', 'guide', 'meta', 'other'];
  return categoryOrder
    .filter(cat => groups[cat])
    .map(cat => ({
      category: cat,
      pages: groups[cat]
    }));
}
```

---

## Complete Implementation (TDD)

### Phase 1: ClaudeClient Enhancement (1-2 hours)

**Test File**: `tests/unit/claude.test.js`

```javascript
describe('ClaudeClient - Haiku 4.5 & Interleaved Thinking', () => {
  describe('Haiku 4.5 support', () => {
    it('should support claude-haiku-4-5-20251001 model', async () => {
      const client = new ClaudeClient();
      expect(client.pricing['claude-haiku-4-5-20251001']).toBeDefined();
      expect(client.pricing['claude-haiku-4-5-20251001'].input).toBe(1.0);
      expect(client.pricing['claude-haiku-4-5-20251001'].output).toBe(5.0);
    });
  });

  describe('Interleaved thinking', () => {
    it('should accept thinking parameter', async () => {
      mockClient.messages.create.mockResolvedValue({
        content: [
          { type: 'thinking', thinking: 'I should read...' },
          { type: 'tool_use', name: 'read_wiki_page', input: { path: 'test.md' } }
        ],
        stop_reason: 'tool_use'
      });

      const response = await client.sendMessage([{ role: 'user', content: 'test' }], {
        model: 'claude-haiku-4-5-20251001',
        thinking: { type: 'enabled', budget_tokens: 5000 },
        tools: [/* tools */],
        betas: ['interleaved-thinking-2025-05-14']
      });

      expect(response.content[0].type).toBe('thinking');
    });

    it('should pass beta header correctly', async () => {
      await client.sendMessage('test', {
        betas: ['interleaved-thinking-2025-05-14']
      });

      const headers = mockClient.messages.create.mock.calls[0][1];
      expect(headers.headers['anthropic-beta']).toBe('interleaved-thinking-2025-05-14');
    });
  });
});
```

**Implementation**: Update `lib/claude.js`

1. Add Haiku 4.5 pricing
2. Add thinking and betas parameters
3. Pass beta headers correctly
4. Return full response (not just text)

### Phase 2: WikiContextAgent (2-3 hours)

**Test File**: `tests/unit/agents/wiki-context-agent.test.js`

Key tests:
- ✅ getAllPages with caching
- ✅ generateInitialContext (top 5 + scoring)
- ✅ extractKeyContent (smart truncation)
- ✅ groupPagesByCategory (organized index)
- ✅ Tool definitions
- ✅ Tool execution
- ✅ Response parsing

**Implementation**: Create `lib/agents/wiki-context-agent.js`

Core methods:
- `getAllPages()` - Scan and cache wiki
- `generateInitialContext(task)` - Smart initial selection
- `getTools()` - Define tool schema
- `executeTool(name, input)` - Execute tool calls
- `buildSystemPrompt()` - Carefully crafted instructions
- `buildInitialPrompt(task, pages, index)` - Structured user prompt
- `extractKeyContent(content, maxChars)` - Smart truncation
- `groupPagesByCategory(index)` - Organized presentation

### Phase 3: Research Orchestration (2-3 hours)

**Test File**: Same as above, continued

```javascript
describe('WikiContextAgent - Research', () => {
  it('should call Claude with interleaved thinking enabled', async () => {
    const result = await agent.research('add progress tracking');

    const claudeCall = mockClaudeClient.sendMessage.mock.calls[0];
    expect(claudeCall[1].model).toBe('claude-haiku-4-5-20251001');
    expect(claudeCall[1].thinking).toEqual({
      type: 'enabled',
      budget_tokens: 10000
    });
    expect(claudeCall[1].betas).toContain('interleaved-thinking-2025-05-14');
  });

  it('should handle thinking blocks in response', async () => {
    mockClaudeClient.sendMessage.mockResolvedValue({
      content: [
        { type: 'thinking', thinking: 'I need to read processor page...' },
        { type: 'tool_use', id: 'tool_1', name: 'read_wiki_page', input: { path: 'components/processor.md' } }
      ],
      stop_reason: 'tool_use'
    });

    await agent.research('test task');

    // Should execute tool call
    expect(agent.executeTool).toHaveBeenCalledWith('read_wiki_page', { path: 'components/processor.md' });
  });

  it('should complete in 1-3 iterations for typical tasks', async () => {
    // Mock sequence: initial -> read page -> finalize
    mockClaudeClient.sendMessage
      .mockResolvedValueOnce({
        content: [
          { type: 'thinking', thinking: '...' },
          { type: 'tool_use', id: 'tool_1', name: 'read_wiki_page', input: { path: 'test.md' } }
        ],
        stop_reason: 'tool_use'
      })
      .mockResolvedValueOnce({
        content: [
          { type: 'thinking', thinking: '...' },
          { type: 'tool_use', id: 'tool_2', name: 'finalize_context', input: { context: { /* complete */ } } }
        ],
        stop_reason: 'tool_use'
      });

    const result = await agent.research('test task');

    expect(mockClaudeClient.sendMessage).toHaveBeenCalledTimes(2); // 2 iterations
    expect(result).toHaveProperty('summary');
  });
});
```

**Implementation**: `research()` method

```javascript
async research(taskDescription, options = {}) {
  const { maxIterations = 10 } = options;

  // 1. Generate initial context
  const { rankedPages, wikiIndex } = await this.generateInitialContext(taskDescription);

  // 2. Build prompts
  const systemPrompt = this.buildSystemPrompt();
  const userPrompt = this.buildInitialPrompt(taskDescription, rankedPages, wikiIndex);

  // 3. Initialize conversation
  let messages = [{ role: 'user', content: userPrompt }];
  let iterationCount = 0;

  console.log(`🤖 Starting agentic research with Haiku 4.5...\n`);

  // 4. Iteration loop with interleaved thinking
  while (iterationCount < maxIterations) {
    iterationCount++;
    console.log(`   Iteration ${iterationCount}...`);

    const response = await this.claudeClient.sendMessage(messages, {
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 8000,
      system: systemPrompt,
      tools: this.getTools(),
      thinking: {
        type: 'enabled',
        budget_tokens: 10000  // Can exceed maxTokens for multi-turn
      },
      betas: ['interleaved-thinking-2025-05-14']
    });

    // Log thinking blocks (optional, for debugging)
    const thinkingBlocks = response.content.filter(b => b.type === 'thinking');
    if (thinkingBlocks.length > 0) {
      console.log(`   💭 Thinking: ${thinkingBlocks[0].thinking.substring(0, 80)}...`);
    }

    // Check for tool use
    if (response.stop_reason === 'tool_use') {
      const toolUses = response.content.filter(b => b.type === 'tool_use');

      // Add assistant message to conversation
      messages.push({
        role: 'assistant',
        content: response.content
      });

      // Execute tools and add results
      const toolResults = [];
      for (const toolUse of toolUses) {
        console.log(`   📎 Tool: ${toolUse.name}`);

        // Check for finalization
        if (toolUse.name === 'finalize_context') {
          console.log(`\n✅ Research complete in ${iterationCount} iterations\n`);
          return toolUse.input.context;
        }

        // Execute tool
        const result = await this.executeTool(toolUse.name, toolUse.input);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(result)
        });
      }

      // Add tool results to conversation
      messages.push({
        role: 'user',
        content: toolResults
      });

    } else {
      // Conversation ended without finalization
      throw new Error('Research ended without calling finalize_context');
    }
  }

  throw new Error(`Research exceeded max iterations (${maxIterations})`);
}
```

### Phase 4: Integration Testing (1-2 hours)

**Test File**: `tests/integration/wiki-context-agentic.test.js`

```javascript
describe('Agentic Wiki Context - Integration', () => {
  it('should complete simple task in 1-2 iterations', async () => {
    // Test with actual wiki fixtures
    const agent = new WikiContextAgent('./tests/fixtures/wiki-agentic');

    // Mock Claude to simulate realistic flow
    mockClaude
      .mockResolvedValueOnce({
        // First call: think + read processor
        content: [
          { type: 'thinking', thinking: 'Initial context shows dashboard, need processor details' },
          { type: 'tool_use', id: 'tool_1', name: 'read_wiki_page', input: { path: 'components/processor.md' } }
        ],
        stop_reason: 'tool_use'
      })
      .mockResolvedValueOnce({
        // Second call: think + finalize
        content: [
          { type: 'thinking', thinking: 'Now I have everything needed' },
          { type: 'tool_use', id: 'tool_2', name: 'finalize_context', input: { context: mockContext } }
        ],
        stop_reason: 'tool_use'
      });

    const result = await agent.research('add progress tracking');

    expect(result.summary).toBeDefined();
    expect(result.relevantPages.length).toBeGreaterThan(0);
    expect(mockClaude).toHaveBeenCalledTimes(2); // Efficient!
  });
});
```

### Phase 5: CLI Integration (1 hour)

Update `wiki-context-agentic.js` to use new agent:

```javascript
async function main() {
  // ... arg parsing ...

  try {
    const agent = new WikiContextAgent(wikiPath);
    const results = await agent.research(taskDescription);
    const formatted = formatResults(results);

    console.log(formatted);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}
```

---

## Expected Performance

### Iterations by Task Complexity

| Task Type | Example | Iterations | Cost |
|-----------|---------|------------|------|
| Simple | "How does auth work?" | 1-2 | $0.01 |
| Moderate | "Add progress tracking" | 2-3 | $0.015 |
| Complex | "Refactor entire pipeline" | 3-5 | $0.025 |

### Cost Comparison

| Approach | Input Tokens | Model | Cost/Query | Relative |
|----------|--------------|-------|------------|----------|
| Brute Force | 85,000 | Sonnet 4 | $0.255 | 100% |
| Agentic (Sonnet 4) | 25,000 | Sonnet 4 | $0.075 | 29% |
| **Agentic (Haiku 4.5)** | **25,000** | **Haiku 4.5** | **$0.015** | **6%** |

**94% cost savings!** 🎉

---

## Implementation Timeline

### Day 1 (4-5 hours)
- **Morning**: ClaudeClient enhancement + tests
  - Add Haiku 4.5 pricing
  - Add thinking/betas support
  - Test interleaved thinking

- **Afternoon**: WikiContextAgent core + tests
  - getAllPages with caching
  - generateInitialContext with scoring
  - Helper methods (extract, group)

### Day 2 (4-5 hours)
- **Morning**: Tool system + tests
  - Define tool schemas
  - Implement tool execution
  - Test all 4 tools

- **Afternoon**: Research orchestration + tests
  - Build prompts (system + user)
  - Implement iteration loop
  - Handle thinking blocks
  - Test with mocked responses

### Day 3 (2-3 hours)
- **Morning**: Integration testing
  - Create test fixtures
  - End-to-end scenarios
  - Performance verification

- **Afternoon**: CLI integration + documentation
  - Update CLI wrapper
  - Add usage examples
  - Update README

**Total: 10-13 hours** (vs 3 weeks in v1!)

---

## Testing with Real Haiku 4.5

Once implemented, test with actual API:

```bash
# Simple task (should be 1-2 iterations)
./wiki-context-agentic.js "how does the processor work"

# Moderate task (should be 2-3 iterations)
./wiki-context-agentic.js "add progress tracking to wiki generation"

# Complex task (should be 3-5 iterations)
./wiki-context-agentic.js "implement caching layer for wiki pages"
```

Watch for:
- Iteration count (target: 1-3 for most tasks)
- Quality of synthesized context
- Relevance of selected pages
- Actionability of implementation guidance

---

## Key Success Factors

### 1. **Prompt Quality**
The system prompt is critical. It must:
- Emphasize efficiency (1-3 iterations)
- Guide strategic thinking
- Define quality standards
- Encourage targeted tool use

### 2. **Initial Context Quality**
Smart initial selection reduces iterations:
- Keyword scoring catches obvious candidates
- Preview of content (800 chars) gives context
- Organized index makes exploration easy

### 3. **Interleaved Thinking**
This is the secret weapon:
- LLM thinks before each tool call
- LLM processes tool results thoughtfully
- Better decision-making throughout

### 4. **Haiku 4.5 Performance**
Perfect model choice:
- Fast enough for sub-second tool calls
- Smart enough for strategic decisions
- Cheap enough for frequent use

---

## Migration Strategy

### Week 1: Parallel Deployment
- Keep original `wiki-context.js`
- Deploy new `wiki-context-agentic.js`
- Test both, compare results

### Week 2: Evaluation
- Track: iterations, cost, quality, user preference
- Gather feedback from team
- Refine prompts based on results

### Week 3: Consolidation
- Make agentic the default
- Keep brute-force as `--legacy` flag
- Document differences

---

## Sources

- [Introducing Claude Haiku 4.5 - Anthropic](https://www.anthropic.com/news/claude-haiku-4-5)
- [Claude Haiku 4.5 System Card - Anthropic](https://www.anthropic.com/claude-haiku-4-5-system-card)
- [Building with extended thinking - Claude Docs](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)
- [How to Access Claude Haiku 4.5 - Skywork AI](https://skywork.ai/blog/how-to-access-claude-haiku-4-5-guide/)
- [Models overview - Claude Docs](https://docs.claude.com/en/docs/about-claude/models/overview)

---

## Next Steps

1. **Start with ClaudeClient tests** (lib/claude.js enhancement)
2. **Add Haiku 4.5 + interleaved thinking support**
3. **Create WikiContextAgent with carefully crafted prompts**
4. **Test with mock responses**
5. **Test with real API (small budget)**
6. **Iterate on prompts based on results**

Ready to build! 🚀
