const fs = require('fs').promises;
const path = require('path');
const ClaudeClient = require('../claude');

/**
 * WikiContextAgent - Agentic wiki research with interleaved thinking
 *
 * Uses Claude Haiku 4.5 with interleaved thinking to iteratively research
 * wiki content and provide relevant context for development tasks.
 */
class WikiContextAgent {
  constructor(wikiPath = './wikis/codewiki-generator') {
    this.wikiPath = path.resolve(wikiPath);
    this.claudeClient = new ClaudeClient();
    this.allPages = null; // Cache for performance
  }

  /**
   * Get all wiki pages with metadata (cached)
   * @returns {Array} Array of page objects with path, title, category, content
   */
  async getAllPages() {
    if (this.allPages) return this.allPages;

    const pages = [];

    const scanDirectory = async (dirPath, relativePath = '') => {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relPath = path.join(relativePath, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_')) {
          await scanDirectory(fullPath, relPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const metadata = this.extractMetadata(content);

            pages.push({
              path: relPath,
              title: metadata.title || entry.name.replace('.md', ''),
              category: metadata.category || this.inferCategory(relPath),
              metadata,
              content
            });
          } catch (error) {
            console.warn(`Warning: Could not read ${relPath}:`, error.message);
          }
        }
      }
    };

    await scanDirectory(this.wikiPath);
    this.allPages = pages;
    return pages;
  }

  /**
   * Extract metadata from frontmatter
   * @private
   */
  extractMetadata(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return {};

    const metadata = {};
    const lines = frontmatterMatch[1].split('\n');
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        if (value.startsWith('[') && value.endsWith(']')) {
          metadata[key] = value.slice(1, -1).split(',').map(v => v.trim());
        } else {
          metadata[key] = value;
        }
      }
    }
    return metadata;
  }

  /**
   * Infer category from file path
   * @private
   */
  inferCategory(filePath) {
    if (filePath.includes('/concepts/')) return 'concept';
    if (filePath.includes('/components/')) return 'component';
    if (filePath.includes('/guides/')) return 'guide';
    if (filePath.includes('/meta/')) return 'meta';
    if (filePath.includes('/history/')) return 'history';
    return 'other';
  }

  /**
   * Generate smart initial context based on the task
   * @param {string} taskDescription - The development task
   * @returns {Object} Initial context with rankedPages and wikiIndex
   */
  async generateInitialContext(taskDescription) {
    const allPages = await this.getAllPages();

    // Simple keyword-based relevance scoring
    const scorePage = (page) => {
      const taskLower = taskDescription.toLowerCase();

      // Title matches score higher
      const titleMatch = page.title.toLowerCase().includes(taskLower) ? 5 : 0;

      // Content matches (filter short words)
      const contentWords = taskLower.split(/\s+/).filter(w => w.length > 3);
      const contentMatches = contentWords.reduce((score, word) => {
        const regex = new RegExp(word, 'gi');
        const matches = (page.content.match(regex) || []).length;
        return score + matches;
      }, 0);

      return titleMatch + contentMatches;
    };

    // Get top 5 candidates for initial context
    const rankedPages = allPages
      .map(page => ({ page, score: scorePage(page) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.page);

    return {
      allPages,
      rankedPages,
      wikiIndex: allPages.map(p => ({
        path: p.path,
        title: p.title,
        category: p.category
      }))
    };
  }

  /**
   * Extract key content from a page (first N chars, smart truncation)
   * @param {string} content - Full page content
   * @param {number} maxChars - Maximum characters to extract
   * @returns {string} Truncated content
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
   * @param {Array} wikiIndex - Array of page info objects
   * @returns {Array} Array of category groups
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
    const categoryOrder = ['concept', 'component', 'guide', 'meta', 'history', 'other'];
    return categoryOrder
      .filter(cat => groups[cat])
      .map(cat => ({
        category: cat,
        pages: groups[cat]
      }));
  }

  /**
   * Build carefully crafted system prompt
   * @returns {string} System prompt
   */
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

  /**
   * Build initial user prompt with context
   * @param {string} taskDescription - The development task
   * @param {Array} rankedPages - Top candidate pages
   * @param {Array} wikiIndex - Full wiki index
   * @returns {string} User prompt
   */
  buildInitialPrompt(taskDescription, rankedPages, wikiIndex) {
    return `# Development Task
"${taskDescription}"

# Initial Context - Top 5 Candidate Pages
${rankedPages.map((p, i) => `
## ${i + 1}. ${p.title} (${p.path})
Category: ${p.category}

${this.extractKeyContent(p.content, 800)}${p.content.length > 800 ? '\n[Content truncated - use read_wiki_page to see full content]' : ''}
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

  /**
   * Define tools available to the LLM
   * @returns {Array} Array of tool definitions
   */
  getTools() {
    return [
      {
        name: "read_wiki_page",
        description: "Read the full content of a specific wiki page by its path. Use this when you need detailed information from a page that seems relevant.",
        input_schema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The path to the wiki page (e.g., 'concepts/architecture.md')"
            }
          },
          required: ["path"]
        }
      },
      {
        name: "search_wiki_content",
        description: "Search for pages containing specific keywords or phrases. Use this to find pages you might have missed in the initial context.",
        input_schema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query (keywords or phrases)"
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (default: 5)"
            }
          },
          required: ["query"]
        }
      },
      {
        name: "list_pages_by_category",
        description: "List all pages in a specific category. Categories: concept, component, guide, meta, history, other.",
        input_schema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "The category to list (concept, component, guide, meta, history, other)"
            }
          },
          required: ["category"]
        }
      },
      {
        name: "finalize_context",
        description: "Call this when you have gathered enough information and are ready to provide the final context synthesis.",
        input_schema: {
          type: "object",
          properties: {
            context: {
              type: "object",
              description: "The synthesized context with all required fields",
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

  /**
   * Execute a tool call
   * @param {string} toolName - Name of the tool
   * @param {Object} toolInput - Tool input parameters
   * @returns {Object} Tool execution result
   */
  async executeTool(toolName, toolInput) {
    const allPages = await this.getAllPages();

    switch (toolName) {
      case 'read_wiki_page': {
        const page = allPages.find(p => p.path === toolInput.path);
        if (!page) {
          return { error: `Page not found: ${toolInput.path}` };
        }
        return {
          path: page.path,
          title: page.title,
          category: page.category,
          content: page.content
        };
      }

      case 'search_wiki_content': {
        const limit = toolInput.limit || 5;
        const query = toolInput.query.toLowerCase();

        const results = allPages
          .map(page => {
            const matches = (page.content.toLowerCase().match(new RegExp(query, 'g')) || []).length;
            return { page, matches };
          })
          .filter(item => item.matches > 0)
          .sort((a, b) => b.matches - a.matches)
          .slice(0, limit)
          .map(item => ({
            path: item.page.path,
            title: item.page.title,
            category: item.page.category,
            matchCount: item.matches
          }));

        return { results };
      }

      case 'list_pages_by_category': {
        const category = toolInput.category;
        const pages = allPages
          .filter(p => p.category === category)
          .map(p => ({
            path: p.path,
            title: p.title,
            category: p.category
          }));

        return { pages };
      }

      case 'finalize_context': {
        return { finalized: true, context: toolInput.context };
      }

      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  }

  /**
   * Research wiki for context using agentic approach
   * @param {string} taskDescription - The development task
   * @param {Object} options - Options (maxIterations)
   * @returns {Object} Final context object
   */
  async research(taskDescription, options = {}) {
    const { maxIterations = 10 } = options;

    console.log(`🔍 Researching wiki for: "${taskDescription}"\n`);

    // 1. Generate initial context
    const { rankedPages, wikiIndex } = await this.generateInitialContext(taskDescription);

    console.log(`📚 Found ${wikiIndex.length} wiki pages`);
    console.log(`🎯 Providing top ${rankedPages.length} candidates as initial context\n`);

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

      // Log thinking blocks (for debugging)
      const thinkingBlocks = response.content.filter(b => b.type === 'thinking');
      if (thinkingBlocks.length > 0) {
        const firstThinking = thinkingBlocks[0].thinking || '';
        console.log(`   💭 Thinking: ${firstThinking.substring(0, 80)}...`);
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
}

module.exports = WikiContextAgent;
