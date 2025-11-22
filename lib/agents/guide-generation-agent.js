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
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4000; // Guides need more tokens than other agents
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

    // Call Claude
    const response = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Parse and validate JSON response
    const result = JSON.parse(response);

    // Validate structure
    if (!result.guides || !Array.isArray(result.guides)) {
      throw new Error('Invalid guide generation response: missing guides array');
    }

    // Validate each guide
    result.guides.forEach(guide => {
      if (!guide.title || !guide.content) {
        throw new Error('Invalid guide structure: missing title or content');
      }
    });

    return result;
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
}

module.exports = GuideGenerationAgent;
