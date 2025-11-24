const path = require('path');
const WikiManager = require('./wiki-manager');
const ClaudeClient = require('./claude');

/**
 * WikiContextService provides intelligent context research for development tasks
 *
 * This service analyzes wiki pages to find relevant information for a given query,
 * using AI to understand context and relevance rather than simple keyword matching.
 *
 * @example
 * const service = new WikiContextService();
 * const results = await service.research('add test coverage tracking', 'my-project');
 * console.log(results.summary);
 * console.log(results.relevantPages);
 */
class WikiContextService {
  /**
   * Create a new WikiContextService
   *
   * @param {Object} options - Configuration options
   * @param {string} options.wikiBasePath - Base path where all wikis are stored (default: './wikis')
   * @param {ClaudeClient} options.claudeClient - Optional ClaudeClient instance (for testing)
   */
  constructor(options = {}) {
    this.wikiBasePath = options.wikiBasePath || './wikis';
    this.claudeClient = options.claudeClient || new ClaudeClient();

    // Model configuration
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4000;
  }

  /**
   * Research wiki content to find relevant context for a task
   *
   * @param {string} query - The task or question to research
   * @param {string} projectName - Name of the project (wiki subdirectory)
   * @returns {Promise<Object>} Research results with structured context
   * @throws {Error} If wiki path doesn't exist or API call fails
   *
   * @example
   * const results = await service.research(
   *   'implement dark mode toggle',
   *   'my-app'
   * );
   */
  async research(query, projectName) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }

    if (!projectName || typeof projectName !== 'string') {
      throw new Error('Project name must be a non-empty string');
    }

    // Construct wiki path
    const wikiPath = path.resolve(this.wikiBasePath, projectName);
    const wikiManager = new WikiManager(wikiPath);

    // Get all wiki pages
    const pages = await this._getAllPagesWithContent(wikiManager);

    if (pages.length === 0) {
      throw new Error(`No wiki pages found in ${wikiPath}`);
    }

    // Build index for quick reference
    const wikiIndex = pages.map(p => ({
      path: p.path,
      title: p.title,
      category: p.category
    }));

    // Create research prompt
    const researchPrompt = this._buildResearchPrompt(query, wikiIndex, pages);

    // Call Claude to analyze and synthesize context
    let response;
    try {
      response = await this.claudeClient.sendMessage(researchPrompt, {
        model: this.model,
        maxTokens: this.maxTokens
      });
    } catch (error) {
      throw new Error(`Failed to analyze wiki content: ${error.message}`);
    }

    // Parse and validate response
    const results = this._parseResponse(response);

    // Return structured results
    return this._formatResults(results);
  }

  /**
   * Get all pages with their full content
   *
   * @private
   * @param {WikiManager} wikiManager - WikiManager instance
   * @returns {Promise<Array>} Array of page objects with content
   */
  async _getAllPagesWithContent(wikiManager) {
    const pages = [];
    const fs = require('fs').promises;

    // Get all page metadata
    const allPages = await wikiManager.getAllPages();

    // Read full content for each page
    for (const pageInfo of allPages) {
      try {
        // Read raw content (not HTML) for better analysis
        const fullPath = path.join(wikiManager.wikiPath, pageInfo.path);
        const rawContent = await fs.readFile(fullPath, 'utf-8');

        // Extract content without frontmatter
        const { content } = this._parseFrontmatter(rawContent);

        pages.push({
          path: pageInfo.path,
          title: pageInfo.metadata.title || this._getTitleFromPath(pageInfo.path),
          category: pageInfo.metadata.category || this._inferCategory(pageInfo.path),
          metadata: pageInfo.metadata,
          content: content
        });
      } catch (error) {
        console.warn(`Warning: Could not read page ${pageInfo.path}:`, error.message);
      }
    }

    return pages;
  }

  /**
   * Parse frontmatter from markdown content
   *
   * @private
   * @param {string} content - Raw markdown content
   * @returns {Object} Object with metadata and content
   */
  _parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { metadata: {}, content };
    }

    const [, frontmatterText, pageContent] = match;
    const metadata = {};

    // Parse YAML-like frontmatter
    const lines = frontmatterText.split('\n');
    for (const line of lines) {
      const keyValueMatch = line.match(/^(\w+):\s*(.+)$/);
      if (keyValueMatch) {
        const [, key, value] = keyValueMatch;
        // Handle arrays [item1, item2]
        if (value.startsWith('[') && value.endsWith(']')) {
          metadata[key] = value.slice(1, -1).split(',').map(v => v.trim());
        } else {
          metadata[key] = value;
        }
      }
    }

    return { metadata, content: pageContent };
  }

  /**
   * Get title from file path
   *
   * @private
   * @param {string} filePath - Path to file
   * @returns {string} Extracted title
   */
  _getTitleFromPath(filePath) {
    const basename = path.basename(filePath, '.md');
    return basename
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Infer category from file path
   *
   * @private
   * @param {string} filePath - Path to file
   * @returns {string} Inferred category
   */
  _inferCategory(filePath) {
    if (filePath.includes('/concepts/') || filePath.startsWith('concepts/')) return 'concept';
    if (filePath.includes('/components/') || filePath.startsWith('components/')) return 'component';
    if (filePath.includes('/guides/') || filePath.startsWith('guides/')) return 'guide';
    if (filePath.includes('/meta/') || filePath.startsWith('meta/')) return 'meta';
    if (filePath.includes('/history/') || filePath.startsWith('history/')) return 'history';
    return 'other';
  }

  /**
   * Build the research prompt for the AI agent
   *
   * @private
   * @param {string} query - User's query
   * @param {Array} wikiIndex - Array of page metadata
   * @param {Array} allPages - Array of all pages with content
   * @returns {string} Formatted prompt
   */
  _buildResearchPrompt(query, wikiIndex, allPages) {
    return `You are a wiki research assistant. Your task is to analyze a wiki and extract the most relevant context for a specific development task.

**Task Description:**
"${query}"

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
      "relevance": "Why this page is relevant to the task",
      "excerpt": "A brief excerpt or quote from the page (2-3 sentences)"
    }
  ],
  "context": {
    "summary": "High-level overview of what the developer needs to know (2-3 sentences)",
    "keyComponents": [
      {
        "name": "Component Name",
        "purpose": "What it does",
        "location": "file path or location reference"
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
      "Step 1: Clear, actionable step",
      "Step 2: Another step",
      "Step 3: Final step"
    ],
    "relatedFiles": [
      "path/to/relevant/file.js",
      "path/to/another/file.js"
    ]
  }
}

Important guidelines:
- Limit relevantPages to the top 5 most relevant pages
- Provide specific, actionable implementation guidance
- Include actual file paths when mentioned in the wiki
- Keep the summary concise but informative
- Focus on practical, actionable information

Respond ONLY with valid JSON, no additional text.`;
  }

  /**
   * Parse and validate the AI response
   *
   * @private
   * @param {string} response - Raw response from Claude
   * @returns {Object} Parsed response object
   * @throws {Error} If response cannot be parsed
   */
  _parseResponse(response) {
    try {
      // Remove markdown code blocks if present
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const data = JSON.parse(cleaned);

      // Validate required structure
      if (!data.relevantPages || !Array.isArray(data.relevantPages)) {
        throw new Error('Missing or invalid relevantPages array');
      }

      if (!data.context || typeof data.context !== 'object') {
        throw new Error('Missing or invalid context object');
      }

      return data;
    } catch (error) {
      console.error('Failed to parse AI response:', error.message);
      console.error('Raw response (first 500 chars):', response.substring(0, 500));
      throw new Error(`Could not parse research results: ${error.message}`);
    }
  }

  /**
   * Format results into a consistent structure
   *
   * @private
   * @param {Object} results - Parsed results from AI
   * @returns {Object} Formatted results
   */
  _formatResults(results) {
    return {
      // High-level summary (2-3 sentences)
      summary: results.context.summary || 'No summary available',

      // Top 5 relevant pages with excerpts
      relevantPages: (results.relevantPages || []).slice(0, 5).map(page => ({
        path: page.path || '',
        title: page.title || '',
        relevance: page.relevance || '',
        excerpt: page.excerpt || ''
      })),

      // Key components with locations
      keyComponents: (results.context.keyComponents || []).map(comp => ({
        name: comp.name || '',
        purpose: comp.purpose || '',
        location: comp.location || ''
      })),

      // Key concepts with explanations
      keyConcepts: (results.context.keyConcepts || []).map(concept => ({
        concept: concept.concept || '',
        description: concept.description || '',
        application: concept.application || ''
      })),

      // Step-by-step implementation guidance
      implementationGuidance: results.context.implementationGuidance || [],

      // Related file paths
      relatedFiles: results.context.relatedFiles || [],

      // Metadata
      metadata: {
        pageCount: results.relevantPages ? results.relevantPages.length : 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get service statistics (useful for monitoring)
   *
   * @returns {Object} Statistics about API usage
   */
  getStatistics() {
    return this.claudeClient.getCostSummary();
  }

  /**
   * Reset statistics counters
   */
  resetStatistics() {
    this.claudeClient.resetCost();
  }
}

module.exports = WikiContextService;
