const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * GuideGenerationAgent generates operational guides from wiki content
 */
class GuideGenerationAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Configuration from spec
    this.maxTokens = 8000; // Guides are comprehensive and need more tokens
  }

  /**
   * Generate guides from wiki data
   * @param {Object} wikiData - Repository and wiki information
   * @param {string} wikiData.repositoryName - Name of the repository
   * @param {Array} wikiData.components - Component pages
   * @param {Array} wikiData.concepts - Concept pages
   * @param {Object} wikiData.repositoryInfo - Repository metadata
   * @returns {Object} Generated guides
   */
  async generateGuides(wikiData) {
    const { repositoryName, components, concepts, repositoryInfo } = wikiData;

    // Format wiki structure for prompt
    const wikiStructure = this._formatWikiStructure({ components, concepts });
    const repoInfo = this._formatRepositoryInfo(repositoryInfo);

    // Render prompt template
    const prompt = this.promptManager.render('guide-generation', {
      repositoryName,
      repositoryInfo: repoInfo,
      wikiStructure
    });

    // Call Claude - returns markdown with delimiters
    const response = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Validate response is not empty
    if (!response || response.trim().length === 0) {
      console.warn('Warning: Guide generation returned empty response');
      return { guides: [] };
    }

    // Parse markdown delimited response
    try {
      const guides = this._parseDelimitedGuides(response);
      return { guides };
    } catch (error) {
      console.error('Error parsing guide generation response:', error.message);
      console.error('Response length:', response.length);
      console.error('Response preview (first 500 chars):', response.substring(0, 500));
      console.error('Response preview (last 500 chars):', response.substring(Math.max(0, response.length - 500)));

      // Return empty guides array instead of throwing
      return { guides: [] };
    }
  }

  /**
   * Detect repository information from file structure
   * @param {Object} repoStructure - Repository file structure
   * @returns {Object} Repository information
   */
  detectRepositoryInfo(repoStructure) {
    const files = repoStructure.files || [];

    const info = {
      hasTests: false,
      testFramework: null,
      hasCI: false,
      packageManager: null,
      hasDocker: false,
      hasTypeScript: false
    };

    // Detect tests
    const testPatterns = [
      /\.test\.(js|ts|jsx|tsx)$/,
      /\.spec\.(js|ts|jsx|tsx)$/,
      /__tests__/,
      /test\//,
      /tests\//
    ];

    info.hasTests = files.some(file =>
      testPatterns.some(pattern => pattern.test(file))
    );

    // Detect test framework
    if (files.some(f => f.includes('jest.config') || f.includes('package.json'))) {
      info.testFramework = 'jest';
    } else if (files.some(f => f.includes('mocha') || f.includes('.mocharc'))) {
      info.testFramework = 'mocha';
    } else if (files.some(f => f.includes('vitest.config'))) {
      info.testFramework = 'vitest';
    }

    // Detect CI
    info.hasCI = files.some(f =>
      f.includes('.github/workflows') ||
      f.includes('.gitlab-ci.yml') ||
      f.includes('.travis.yml') ||
      f.includes('circle.yml')
    );

    // Detect package manager
    if (files.includes('package.json')) {
      if (files.includes('package-lock.json')) {
        info.packageManager = 'npm';
      } else if (files.includes('yarn.lock')) {
        info.packageManager = 'yarn';
      } else if (files.includes('pnpm-lock.yaml')) {
        info.packageManager = 'pnpm';
      } else {
        info.packageManager = 'npm'; // default
      }
    }

    // Detect Docker
    info.hasDocker = files.some(f =>
      f.includes('Dockerfile') || f.includes('docker-compose')
    );

    // Detect TypeScript
    info.hasTypeScript = files.some(f =>
      f.includes('tsconfig.json') || f.endsWith('.ts') || f.endsWith('.tsx')
    );

    return info;
  }

  /**
   * Format wiki structure for prompt
   * @private
   */
  _formatWikiStructure(wikiData) {
    const lines = [];

    if (wikiData.concepts && wikiData.concepts.length > 0) {
      lines.push('Concepts:');
      wikiData.concepts.forEach(concept => {
        lines.push(`- ${concept.title}`);
      });
      lines.push('');
    }

    if (wikiData.components && wikiData.components.length > 0) {
      lines.push('Components:');
      wikiData.components.forEach(component => {
        lines.push(`- ${component.title}`);
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Format repository info for prompt
   * @private
   */
  _formatRepositoryInfo(info) {
    if (!info) return 'No repository information available';

    const lines = [];

    if (info.hasTests) {
      lines.push(`- Has tests (${info.testFramework || 'unknown framework'})`);
    }
    if (info.hasCI) {
      lines.push('- Has CI/CD pipeline');
    }
    if (info.packageManager) {
      lines.push(`- Package manager: ${info.packageManager}`);
    }
    if (info.hasDocker) {
      lines.push('- Uses Docker');
    }
    if (info.hasTypeScript) {
      lines.push('- Uses TypeScript');
    }

    return lines.length > 0 ? lines.join('\n') : 'Basic repository structure';
  }

  /**
   * Parse markdown delimited guides from Claude response
   * Format: ---GUIDE: Title---\n# Content...
   * @private
   */
  _parseDelimitedGuides(response) {
    // Clean any markdown code fences if present
    let cleaned = response.trim();
    if (cleaned.startsWith('```markdown') || cleaned.startsWith('```md') || cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:markdown|md)?\s*\n/, '');
      cleaned = cleaned.replace(/\n```\s*$/, '');
      cleaned = cleaned.trim();
    }

    // Split by delimiter: ---GUIDE: Title---
    const delimiter = /---GUIDE:\s*([^-\n]+)---/gi;
    const guides = [];

    // Find all delimiters and their positions
    let match;
    const matches = [];
    while ((match = delimiter.exec(cleaned)) !== null) {
      matches.push({
        title: match[1].trim(),
        startIndex: match.index + match[0].length
      });
    }

    // Extract content between delimiters
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const next = matches[i + 1];

      // Content is from end of current delimiter to start of next (or end of string)
      const endIndex = next ? next.startIndex - next.title.length - 15 : cleaned.length; // 15 = length of "---GUIDE: ---"
      const content = cleaned.substring(current.startIndex, endIndex).trim();

      if (content.length > 0) {
        guides.push({
          title: current.title,
          content: content
        });
      } else {
        console.warn(`Warning: Guide "${current.title}" has no content, skipping`);
      }
    }

    // Validate we found at least one guide
    if (guides.length === 0) {
      // Check if response might be using old JSON format (backward compatibility)
      if (cleaned.includes('"guides"') && cleaned.includes('{')) {
        console.warn('Response appears to be JSON format, but expected markdown delimiters');
      }
      console.warn('No guides found in response');
    }

    return guides;
  }
}

module.exports = GuideGenerationAgent;
