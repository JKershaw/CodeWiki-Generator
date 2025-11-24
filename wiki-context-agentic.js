#!/usr/bin/env node

/**
 * Agentic Wiki Context Research CLI
 *
 * Uses an iterative, tool-augmented approach where the LLM:
 * 1. Receives initial context (wiki index + top candidates)
 * 2. Can request additional pages via tools
 * 3. Iteratively refines understanding
 * 4. Synthesizes final context
 */

const fs = require('fs').promises;
const path = require('path');
const ClaudeClient = require('./lib/claude');

class AgenticWikiContextCLI {
  constructor(wikiPath = './wikis/codewiki-generator') {
    this.wikiPath = path.resolve(wikiPath);
    this.claudeClient = new ClaudeClient();
    this.allPages = null; // Cache for performance
  }

  /**
   * Get all wiki pages with metadata (cached)
   */
  async getAllPages() {
    if (this.allPages) return this.allPages;

    const pages = [];

    async function scanDirectory(dirPath, relativePath = '') {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relPath = path.join(relativePath, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_')) {
          await scanDirectory(fullPath, relPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const metadata = extractMetadata(content);

            pages.push({
              path: relPath,
              title: metadata.title || entry.name.replace('.md', ''),
              category: metadata.category || inferCategory(relPath),
              metadata,
              content
            });
          } catch (error) {
            console.warn(`Warning: Could not read ${relPath}:`, error.message);
          }
        }
      }
    }

    function extractMetadata(content) {
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

    function inferCategory(filePath) {
      if (filePath.includes('/concepts/')) return 'concept';
      if (filePath.includes('/components/')) return 'component';
      if (filePath.includes('/guides/')) return 'guide';
      if (filePath.includes('/meta/')) return 'meta';
      return 'other';
    }

    await scanDirectory(this.wikiPath);
    this.allPages = pages;
    return pages;
  }

  /**
   * Generate smart initial context based on the task
   */
  async generateInitialContext(taskDescription) {
    const allPages = await this.getAllPages();

    // Simple keyword-based relevance scoring
    const scorePage = (page) => {
      const taskLower = taskDescription.toLowerCase();
      const titleMatch = page.title.toLowerCase().includes(taskLower) ? 5 : 0;
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
   * Define tools available to the LLM
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
        description: "List all pages in a specific category. Categories: concept, component, guide, meta, other.",
        input_schema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "The category to list (concept, component, guide, meta, other)"
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
              }
            }
          },
          required: ["context"]
        }
      }
    ];
  }

  /**
   * Execute a tool call
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
   */
  async research(taskDescription) {
    console.log(`🔍 Researching wiki for: "${taskDescription}"\n`);

    // Generate initial context
    const { rankedPages, wikiIndex } = await this.generateInitialContext(taskDescription);

    console.log(`📚 Found ${wikiIndex.length} wiki pages`);
    console.log(`🎯 Providing top ${rankedPages.length} candidates as initial context\n`);

    // Build initial prompt
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildInitialPrompt(taskDescription, rankedPages, wikiIndex);

    // Iterative conversation with tool use
    let messages = [{ role: 'user', content: userPrompt }];
    let finalContext = null;
    let iterationCount = 0;
    const maxIterations = 10;

    console.log(`🤖 Starting agentic research...\n`);

    while (iterationCount < maxIterations) {
      iterationCount++;
      console.log(`   Iteration ${iterationCount}...`);

      const response = await this.claudeClient.sendMessage(messages, {
        model: 'claude-sonnet-4-20250514',
        maxTokens: 4000,
        system: systemPrompt,
        tools: this.getTools()
      });

      // Check for tool use
      if (response.stop_reason === 'tool_use') {
        const toolUses = this.extractToolUses(response);

        for (const toolUse of toolUses) {
          console.log(`   📎 Tool call: ${toolUse.name}(${JSON.stringify(toolUse.input).substring(0, 50)}...)`);

          // Check if finalized
          if (toolUse.name === 'finalize_context') {
            finalContext = toolUse.input.context;
            console.log(`\n✅ Research complete after ${iterationCount} iterations\n`);
            return finalContext;
          }

          // Execute tool
          const result = await this.executeTool(toolUse.name, toolUse.input);

          // Add assistant response and tool result to messages
          messages.push({
            role: 'assistant',
            content: response.content
          });
          messages.push({
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: JSON.stringify(result)
              }
            ]
          });
        }
      } else {
        // No tool use, conversation ended
        console.log(`\n⚠️ Research ended without finalization`);
        break;
      }
    }

    if (iterationCount >= maxIterations) {
      console.log(`\n⚠️ Max iterations reached (${maxIterations})`);
    }

    // Fallback: parse from final message
    return this.parseResponseFallback(response);
  }

  /**
   * Extract tool uses from Claude response
   */
  extractToolUses(response) {
    const toolUses = [];
    for (const block of response.content) {
      if (block.type === 'tool_use') {
        toolUses.push({
          id: block.id,
          name: block.name,
          input: block.input
        });
      }
    }
    return toolUses;
  }

  /**
   * Build system prompt
   */
  buildSystemPrompt() {
    return `You are a wiki research assistant helping developers understand codebases. Your task is to analyze a wiki and extract relevant context for a development task.

You will be provided with:
1. A task description
2. Initial context (top candidate pages and wiki index)
3. Tools to request additional information

Your process:
1. Analyze the initial context provided
2. Identify gaps in your understanding
3. Use tools to request additional pages or search for specific information
4. Iteratively refine your understanding
5. When confident you have sufficient context, call finalize_context with a comprehensive synthesis

Be strategic with tool use:
- Don't request pages you already have
- Use search_wiki_content to find pages by topic
- Use read_wiki_page to get full details of specific pages
- Use list_pages_by_category to explore a category

Provide implementation-focused guidance that helps developers start working immediately.`;
  }

  /**
   * Build initial user prompt
   */
  buildInitialPrompt(taskDescription, rankedPages, wikiIndex) {
    return `**Task Description:**
"${taskDescription}"

**Initial Context - Top Candidate Pages:**
${rankedPages.map(p => `
=== ${p.title} (${p.path}) ===
Category: ${p.category}
${p.content}
`).join('\n---\n')}

**Available Wiki Pages (Full Index):**
${wikiIndex.map(p => `- [${p.category}] ${p.title} (${p.path})`).join('\n')}

**Your Task:**
Analyze the initial context and determine if you need additional information. Use the available tools to:
1. Read specific pages in full detail
2. Search for relevant content
3. Explore categories

When you have sufficient understanding, call finalize_context with:
{
  "context": {
    "summary": "High-level overview",
    "relevantPages": [{"path": "...", "title": "...", "relevance": "..."}],
    "keyComponents": [{"name": "...", "purpose": "...", "location": "..."}],
    "keyConcepts": [{"concept": "...", "description": "...", "application": "..."}],
    "implementationGuidance": ["Step 1: ...", "Step 2: ..."],
    "relatedFiles": ["path/to/file.js"]
  }
}`;
  }

  /**
   * Parse response (fallback if finalize_context not called)
   */
  parseResponseFallback(response) {
    // Try to extract JSON from text content
    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    try {
      let cleaned = textContent.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const data = JSON.parse(cleaned);
      return data.context || data;
    } catch (error) {
      console.error('Failed to parse response:', error.message);
      throw new Error('Could not parse research results');
    }
  }

  /**
   * Format results (same as original)
   */
  formatResults(results) {
    let output = '';

    output += '═'.repeat(80) + '\n';
    output += '  AGENTIC WIKI CONTEXT RESEARCH RESULTS\n';
    output += '═'.repeat(80) + '\n\n';

    // Summary
    output += '📝 SUMMARY\n';
    output += '─'.repeat(80) + '\n';
    output += results.summary + '\n\n';

    // Relevant Pages
    if (results.relevantPages && results.relevantPages.length > 0) {
      output += '📄 RELEVANT PAGES\n';
      output += '─'.repeat(80) + '\n';
      for (const page of results.relevantPages) {
        output += `• ${page.title} (${page.path})\n`;
        output += `  → ${page.relevance}\n\n`;
      }
    }

    // Key Components
    if (results.keyComponents && results.keyComponents.length > 0) {
      output += '🔧 KEY COMPONENTS\n';
      output += '─'.repeat(80) + '\n';
      for (const comp of results.keyComponents) {
        output += `• ${comp.name}\n`;
        output += `  Purpose: ${comp.purpose}\n`;
        output += `  Location: ${comp.location}\n\n`;
      }
    }

    // Key Concepts
    if (results.keyConcepts && results.keyConcepts.length > 0) {
      output += '💡 KEY CONCEPTS\n';
      output += '─'.repeat(80) + '\n';
      for (const concept of results.keyConcepts) {
        output += `• ${concept.concept}\n`;
        output += `  ${concept.description}\n`;
        output += `  Application: ${concept.application}\n\n`;
      }
    }

    // Implementation Guidance
    if (results.implementationGuidance && results.implementationGuidance.length > 0) {
      output += '🎯 IMPLEMENTATION GUIDANCE\n';
      output += '─'.repeat(80) + '\n';
      for (let i = 0; i < results.implementationGuidance.length; i++) {
        output += `${i + 1}. ${results.implementationGuidance[i]}\n`;
      }
      output += '\n';
    }

    // Related Files
    if (results.relatedFiles && results.relatedFiles.length > 0) {
      output += '📁 RELATED FILES\n';
      output += '─'.repeat(80) + '\n';
      for (const file of results.relatedFiles) {
        output += `• ${file}\n`;
      }
      output += '\n';
    }

    output += '═'.repeat(80) + '\n';

    return output;
  }
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let wikiPath = './wikis/codewiki-generator';
  let taskDescription = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--wiki' && i + 1 < args.length) {
      wikiPath = args[i + 1];
      i++;
    } else {
      taskDescription = args[i];
    }
  }

  // Validate input
  if (!taskDescription) {
    console.error('Usage: wiki-context-agentic [--wiki <path>] "<task description>"');
    console.error('');
    console.error('Examples:');
    console.error('  wiki-context-agentic "add test coverage tracking"');
    console.error('  wiki-context-agentic --wiki ./wikis/demo "implement a calculator"');
    process.exit(1);
  }

  try {
    const cli = new AgenticWikiContextCLI(wikiPath);
    const results = await cli.research(taskDescription);
    const formatted = cli.formatResults(results);

    console.log(formatted);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = AgenticWikiContextCLI;
