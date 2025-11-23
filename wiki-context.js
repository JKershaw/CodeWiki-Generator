#!/usr/bin/env node

/**
 * Wiki Context Research CLI
 *
 * Intelligently researches the wiki to provide relevant context for a given task.
 * Uses an AI agent with wiki access tools to find and synthesize information.
 *
 * Usage:
 *   ./wiki-context.js "add test coverage tracking to the dashboard"
 *   ./wiki-context.js --wiki ./wikis/demo "implement a calculator component"
 */

const fs = require('fs').promises;
const path = require('path');
const ClaudeClient = require('./lib/claude');

class WikiContextCLI {
  constructor(wikiPath = './wikis/codewiki-generator') {
    this.wikiPath = path.resolve(wikiPath);
    this.claudeClient = new ClaudeClient();
  }

  /**
   * Get all wiki pages with metadata
   */
  async getAllPages() {
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
          // Handle arrays in square brackets
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
      return 'other';
    }

    await scanDirectory(this.wikiPath);
    return pages;
  }

  /**
   * Research wiki for context relevant to a task
   */
  async research(taskDescription) {
    console.log(`🔍 Researching wiki for: "${taskDescription}"\n`);

    // Get all available pages
    const allPages = await this.getAllPages();

    if (allPages.length === 0) {
      throw new Error(`No wiki pages found in ${this.wikiPath}`);
    }

    console.log(`📚 Found ${allPages.length} wiki pages\n`);

    // Build index for the AI
    const wikiIndex = allPages.map(p => ({
      path: p.path,
      title: p.title,
      category: p.category
    }));

    // Create research prompt for the AI agent
    const researchPrompt = this.buildResearchPrompt(taskDescription, wikiIndex, allPages);

    // Call Claude to analyze and synthesize context
    console.log(`🤖 Analyzing wiki content...\n`);

    const response = await this.claudeClient.sendMessage(researchPrompt, {
      model: 'claude-sonnet-4-20250514',
      maxTokens: 4000
    });

    return this.parseResponse(response);
  }

  /**
   * Build the research prompt for the AI agent
   */
  buildResearchPrompt(taskDescription, wikiIndex, allPages) {
    return `You are a wiki research assistant. Your task is to analyze a wiki and extract the most relevant context for a specific development task.

**Task Description:**
"${taskDescription}"

**Available Wiki Pages:**
${wikiIndex.map(p => `- [${p.category}] ${p.title} (${p.path})`).join('\n')}

**Full Wiki Content:**
${allPages.map(p => `
=== ${p.title} (${p.path}) ===
Category: ${p.category}
${p.content}
`).join('\n---\n')}

**Your Task:**
1. Analyze the task description to understand what the developer is trying to accomplish
2. Identify which wiki pages contain relevant information for this task
3. Extract the key concepts, components, and implementation details from those pages
4. Synthesize a comprehensive but concise context response

**Response Format:**
Provide a JSON response with the following structure:
{
  "relevantPages": [
    {
      "path": "path/to/page.md",
      "title": "Page Title",
      "relevance": "Why this page is relevant to the task"
    }
  ],
  "context": {
    "summary": "High-level overview of what the developer needs to know",
    "keyComponents": [
      {
        "name": "Component Name",
        "purpose": "What it does",
        "location": "file path or wiki page"
      }
    ],
    "keyConcepts": [
      {
        "concept": "Concept Name",
        "description": "Brief explanation",
        "application": "How it applies to this task"
      }
    ],
    "implementationGuidance": [
      "Step 1: ...",
      "Step 2: ...",
      "Step 3: ..."
    ],
    "relatedFiles": [
      "path/to/relevant/file.js"
    ]
  }
}

Respond ONLY with valid JSON, no additional text.`;
  }

  /**
   * Parse and validate the AI response
   */
  parseResponse(response) {
    try {
      // Remove markdown code blocks if present
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const data = JSON.parse(cleaned);

      // Validate structure
      if (!data.relevantPages || !data.context) {
        throw new Error('Invalid response structure');
      }

      return data;
    } catch (error) {
      console.error('Failed to parse AI response:', error.message);
      console.error('Raw response:', response.substring(0, 500));
      throw new Error('Could not parse research results');
    }
  }

  /**
   * Format the research results for display
   */
  formatResults(results) {
    let output = '';

    output += '═'.repeat(80) + '\n';
    output += '  WIKI CONTEXT RESEARCH RESULTS\n';
    output += '═'.repeat(80) + '\n\n';

    // Summary
    output += '📝 SUMMARY\n';
    output += '─'.repeat(80) + '\n';
    output += results.context.summary + '\n\n';

    // Relevant Pages
    output += '📄 RELEVANT PAGES\n';
    output += '─'.repeat(80) + '\n';
    for (const page of results.relevantPages) {
      output += `• ${page.title} (${page.path})\n`;
      output += `  → ${page.relevance}\n\n`;
    }

    // Key Components
    if (results.context.keyComponents && results.context.keyComponents.length > 0) {
      output += '🔧 KEY COMPONENTS\n';
      output += '─'.repeat(80) + '\n';
      for (const comp of results.context.keyComponents) {
        output += `• ${comp.name}\n`;
        output += `  Purpose: ${comp.purpose}\n`;
        output += `  Location: ${comp.location}\n\n`;
      }
    }

    // Key Concepts
    if (results.context.keyConcepts && results.context.keyConcepts.length > 0) {
      output += '💡 KEY CONCEPTS\n';
      output += '─'.repeat(80) + '\n';
      for (const concept of results.context.keyConcepts) {
        output += `• ${concept.concept}\n`;
        output += `  ${concept.description}\n`;
        output += `  Application: ${concept.application}\n\n`;
      }
    }

    // Implementation Guidance
    if (results.context.implementationGuidance && results.context.implementationGuidance.length > 0) {
      output += '🎯 IMPLEMENTATION GUIDANCE\n';
      output += '─'.repeat(80) + '\n';
      for (let i = 0; i < results.context.implementationGuidance.length; i++) {
        output += `${i + 1}. ${results.context.implementationGuidance[i]}\n`;
      }
      output += '\n';
    }

    // Related Files
    if (results.context.relatedFiles && results.context.relatedFiles.length > 0) {
      output += '📁 RELATED FILES\n';
      output += '─'.repeat(80) + '\n';
      for (const file of results.context.relatedFiles) {
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
    console.error('Usage: wiki-context [--wiki <path>] "<task description>"');
    console.error('');
    console.error('Examples:');
    console.error('  wiki-context "add test coverage tracking"');
    console.error('  wiki-context --wiki ./wikis/demo "implement a calculator"');
    process.exit(1);
  }

  try {
    const cli = new WikiContextCLI(wikiPath);
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

module.exports = WikiContextCLI;
