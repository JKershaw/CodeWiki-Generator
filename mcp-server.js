#!/usr/bin/env node

/**
 * MCP Server for CodeWiki-Generator
 *
 * Provides Model Context Protocol (MCP) interface for Claude Code to query
 * the generated wiki documentation. Implements JSON-RPC 2.0 over stdio.
 *
 * Usage:
 *   node mcp-server.js [--wiki <path>]
 *
 * Or as npm script:
 *   npm run mcp-server
 */

const readline = require('readline');
const path = require('path');
const fs = require('fs').promises;
const WikiResearcher = require('./lib/wiki-researcher');

class MCPServer {
  constructor(wikiPath = './wikis/codewiki-generator') {
    this.wikiPath = path.resolve(wikiPath);
    this.researcher = new WikiResearcher(this.wikiPath);

    // Metrics tracking
    this.metrics = {
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      queryHistory: [],
      missingDocRequests: []
    };

    // Initialize readline interface for stdin/stdout
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    // Server capabilities
    this.capabilities = {
      tools: true,
      resources: true,
      prompts: false
    };

    this.initialized = false;
  }

  /**
   * Start the MCP server
   */
  async start() {
    // Log to stderr (stdout is reserved for JSON-RPC)
    this.log('MCP Server starting...');
    this.log(`Wiki path: ${this.wikiPath}`);

    // Verify wiki exists
    try {
      await fs.access(this.wikiPath);
    } catch (error) {
      this.logError(`Wiki path does not exist: ${this.wikiPath}`);
      process.exit(1);
    }

    // Listen for incoming JSON-RPC messages
    this.rl.on('line', async (line) => {
      try {
        const request = JSON.parse(line);
        await this.handleRequest(request);
      } catch (error) {
        this.logError(`Failed to parse request: ${error.message}`);
        this.sendError(null, -32700, 'Parse error');
      }
    });

    this.rl.on('close', () => {
      this.log('MCP Server shutting down...');
      this.saveMetrics();
      process.exit(0);
    });

    this.log('MCP Server ready');
  }

  /**
   * Handle incoming JSON-RPC request
   */
  async handleRequest(request) {
    const { id, method, params } = request;

    this.log(`Received request: ${method} (id: ${id})`);

    try {
      let result;

      switch (method) {
        case 'initialize':
          result = await this.handleInitialize(params);
          this.initialized = true;
          break;

        case 'tools/list':
          result = await this.handleToolsList();
          break;

        case 'tools/call':
          if (!this.initialized) {
            throw new Error('Server not initialized');
          }
          result = await this.handleToolCall(params);
          break;

        case 'resources/list':
          result = await this.handleResourcesList();
          break;

        case 'resources/read':
          result = await this.handleResourceRead(params);
          break;

        case 'metrics/get':
          result = this.getMetrics();
          break;

        default:
          throw new Error(`Unknown method: ${method}`);
      }

      this.sendResponse(id, result);
    } catch (error) {
      this.logError(`Error handling ${method}: ${error.message}`);
      this.sendError(id, -32603, error.message);
    }
  }

  /**
   * Handle initialize request
   */
  async handleInitialize(params) {
    this.log('Initializing MCP server...');

    return {
      protocolVersion: '1.0.0',
      serverInfo: {
        name: 'codewiki-mcp-server',
        version: '1.0.0',
        description: 'MCP server for querying CodeWiki-Generator documentation'
      },
      capabilities: this.capabilities
    };
  }

  /**
   * Handle tools/list request
   */
  async handleToolsList() {
    return {
      tools: [
        {
          name: 'query_wiki',
          description: 'Search the wiki for relevant documentation context based on a task description or question',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The task description or question to search for (e.g., "How do I run tests?" or "implement authentication")'
              },
              taskType: {
                type: 'string',
                enum: ['feature', 'bug', 'architectural', 'onboarding'],
                description: 'Type of task for optimized context gathering (optional)'
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of wiki pages to return (default: 5)',
                default: 5
              }
            },
            required: ['query']
          }
        },
        {
          name: 'request_documentation',
          description: 'Request documentation for a topic that is missing or needs improvement',
          inputSchema: {
            type: 'object',
            properties: {
              topic: {
                type: 'string',
                description: 'The topic or area that needs documentation'
              },
              reason: {
                type: 'string',
                description: 'Why this documentation is needed'
              },
              priority: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
                description: 'Priority level for this documentation request',
                default: 'medium'
              }
            },
            required: ['topic', 'reason']
          }
        }
      ]
    };
  }

  /**
   * Handle tools/call request
   */
  async handleToolCall(params) {
    const { name, arguments: args } = params;

    this.metrics.totalQueries++;

    try {
      let result;

      switch (name) {
        case 'query_wiki':
          result = await this.queryWiki(args);
          this.metrics.successfulQueries++;
          break;

        case 'request_documentation':
          result = await this.requestDocumentation(args);
          this.metrics.successfulQueries++;
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      // Track query history
      this.metrics.queryHistory.push({
        timestamp: new Date().toISOString(),
        tool: name,
        query: args.query || args.topic,
        success: true
      });

      return result;
    } catch (error) {
      this.metrics.failedQueries++;
      this.metrics.queryHistory.push({
        timestamp: new Date().toISOString(),
        tool: name,
        query: args.query || args.topic,
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Query the wiki for relevant context
   */
  async queryWiki(args) {
    const { query, taskType, maxResults = 5 } = args;

    this.log(`Querying wiki: "${query}" (type: ${taskType || 'default'})`);

    // Use WikiResearcher for intelligent context gathering
    let context;
    if (taskType) {
      context = await this.researcher.getContextForTaskType(taskType, query);
    } else {
      context = await this.researcher.gatherContext(query);
    }

    // Extract relevant pages from context
    const relevantPages = [];
    const seenPaths = new Set();

    // Helper to add unique pages
    const addPage = (page) => {
      if (page && page.path && !seenPaths.has(page.path)) {
        seenPaths.add(page.path);
        relevantPages.push({
          path: page.path,
          title: page.metadata?.title || page.path,
          category: page.metadata?.category || 'unknown',
          summary: this.extractSummary(page),
          relevanceScore: page.relevanceScore || 0
        });
      }
    };

    // Collect pages from different context sections
    context.highLevelContext?.forEach(addPage);
    context.codeContext?.forEach(addPage);
    context.guides?.forEach(addPage);
    context.historicalContext?.forEach(addPage);
    context.qualityContext?.forEach(addPage);

    // Limit results
    const limitedPages = relevantPages
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);

    // Format response
    return {
      content: [
        {
          type: 'text',
          text: this.formatWikiResponse(query, limitedPages, context)
        }
      ],
      isError: false
    };
  }

  /**
   * Extract summary from page content
   */
  extractSummary(page) {
    if (page.metadata?.summary) {
      return page.metadata.summary;
    }

    // Extract first paragraph as summary
    const content = page.content || '';
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      // Skip frontmatter, headers, and empty lines
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
        return trimmed.substring(0, 200) + (trimmed.length > 200 ? '...' : '');
      }
    }

    return '';
  }

  /**
   * Format wiki response for Claude Code
   */
  formatWikiResponse(query, pages, context) {
    let response = `# Wiki Context for: "${query}"\n\n`;

    response += `## Summary\n\n`;
    response += `Found ${pages.length} relevant wiki pages.\n\n`;

    if (pages.length > 0) {
      response += `## Relevant Documentation\n\n`;

      for (const page of pages) {
        response += `### ${page.title}\n`;
        response += `**Path**: \`${page.path}\`\n`;
        response += `**Category**: ${page.category}\n`;
        if (page.summary) {
          response += `\n${page.summary}\n`;
        }
        response += `\n`;
      }
    }

    // Add keywords and concepts
    if (context.keywords && context.keywords.length > 0) {
      response += `## Related Keywords\n\n`;
      response += context.keywords.join(', ') + '\n\n';
    }

    // Add file paths if available
    const relatedFiles = new Set();
    pages.forEach(page => {
      if (page.metadata?.sourceFile) {
        relatedFiles.add(page.metadata.sourceFile);
      }
    });

    if (relatedFiles.size > 0) {
      response += `## Related Source Files\n\n`;
      for (const file of relatedFiles) {
        response += `- ${file}\n`;
      }
      response += `\n`;
    }

    if (pages.length === 0) {
      response += `## No Results Found\n\n`;
      response += `Consider requesting documentation for this topic using the \`request_documentation\` tool.\n`;
    }

    return response;
  }

  /**
   * Handle documentation request
   */
  async requestDocumentation(args) {
    const { topic, reason, priority = 'medium' } = args;

    this.log(`Documentation requested: "${topic}" (priority: ${priority})`);

    // Add to missing docs queue
    this.metrics.missingDocRequests.push({
      timestamp: new Date().toISOString(),
      topic,
      reason,
      priority
    });

    await this.saveMetrics();

    return {
      content: [
        {
          type: 'text',
          text: `Documentation request recorded for: "${topic}"\n\nThis request has been added to the queue with ${priority} priority. The documentation team will be notified.`
        }
      ],
      isError: false
    };
  }

  /**
   * Handle resources/list request
   */
  async handleResourcesList() {
    const allPages = await this.researcher.wikiManager.getAllPages();

    return {
      resources: allPages.map(page => ({
        uri: `wiki:///${page.path}`,
        name: page.metadata?.title || page.path,
        description: page.metadata?.summary || `Wiki page: ${page.path}`,
        mimeType: 'text/markdown'
      }))
    };
  }

  /**
   * Handle resources/read request
   */
  async handleResourceRead(params) {
    const { uri } = params;

    // Extract path from URI (wiki:///path/to/page.md)
    const path = uri.replace('wiki:///', '');

    const page = await this.researcher.wikiManager.getPage(path);

    if (!page) {
      throw new Error(`Page not found: ${path}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: page.content
        }
      ]
    };
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      totalQueries: this.metrics.totalQueries,
      successfulQueries: this.metrics.successfulQueries,
      failedQueries: this.metrics.failedQueries,
      recentQueries: this.metrics.queryHistory.slice(-20),
      missingDocRequests: this.metrics.missingDocRequests,
      uptime: process.uptime()
    };
  }

  /**
   * Save metrics to file
   */
  async saveMetrics() {
    try {
      const metricsPath = path.join(process.cwd(), 'mcp-metrics.json');
      await fs.writeFile(
        metricsPath,
        JSON.stringify(this.metrics, null, 2),
        'utf-8'
      );
      this.log(`Metrics saved to ${metricsPath}`);
    } catch (error) {
      this.logError(`Failed to save metrics: ${error.message}`);
    }
  }

  /**
   * Send JSON-RPC response
   */
  sendResponse(id, result) {
    const response = {
      jsonrpc: '2.0',
      id,
      result
    };
    console.log(JSON.stringify(response));
  }

  /**
   * Send JSON-RPC error
   */
  sendError(id, code, message) {
    const response = {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message
      }
    };
    console.log(JSON.stringify(response));
  }

  /**
   * Log to stderr (stdout reserved for JSON-RPC)
   */
  log(message) {
    console.error(`[MCP Server] ${message}`);
  }

  /**
   * Log error to stderr
   */
  logError(message) {
    console.error(`[MCP Server ERROR] ${message}`);
  }
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);

  let wikiPath = './wikis/codewiki-generator';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--wiki' && i + 1 < args.length) {
      wikiPath = args[i + 1];
      i++;
    } else if (args[i] === '--help') {
      console.error('Usage: mcp-server [--wiki <path>]');
      console.error('');
      console.error('Options:');
      console.error('  --wiki <path>   Path to wiki directory (default: ./wikis/codewiki-generator)');
      console.error('  --help          Show this help message');
      process.exit(0);
    }
  }

  const server = new MCPServer(wikiPath);
  await server.start();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('[MCP Server FATAL]', error.message);
    process.exit(1);
  });
}

module.exports = MCPServer;
