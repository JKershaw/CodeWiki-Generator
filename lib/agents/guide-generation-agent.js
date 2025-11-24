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

    // Validate response is not empty
    if (!response || response.trim().length === 0) {
      console.warn('Warning: Guide generation returned empty response');
      return { guides: [] };
    }

    // Clean and parse JSON response with error handling
    try {
      const cleanedResponse = this._cleanJSON(response);

      // Additional validation: check if we have valid JSON structure
      if (!cleanedResponse || cleanedResponse.trim().length === 0) {
        console.warn('Warning: Cleaned response is empty');
        return { guides: [] };
      }

      const result = JSON.parse(cleanedResponse);

      // Validate structure
      if (!result.guides || !Array.isArray(result.guides)) {
        console.warn('Warning: Guide generation response missing guides array, got:', typeof result.guides);
        return { guides: [] };
      }

      // Validate each guide and filter out invalid ones
      const validGuides = result.guides.filter(guide => {
        if (!guide.title || !guide.content) {
          console.warn('Warning: Skipping invalid guide (missing title or content)');
          return false;
        }
        return true;
      });

      return { guides: validGuides };

    } catch (error) {
      // Log the error with context for debugging
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
   * Clean JSON response from Claude (remove markdown code blocks)
   * Enhanced to handle malformed responses and truncated content
   * @private
   */
  _cleanJSON(response) {
    // Remove markdown code blocks
    let cleaned = response.trim();

    // Remove ```json ... ``` wrappers
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*\n/, '').replace(/\n```\s*$/, '');
    }
    // Remove ``` ... ``` wrappers
    else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*\n/, '').replace(/\n```\s*$/, '');
    }

    cleaned = cleaned.trim();

    // Try to extract JSON if wrapped in other content
    // Look for first { to last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    // Test if it's valid JSON, if not try to repair common issues
    try {
      JSON.parse(cleaned);
      return cleaned; // Valid JSON, return as-is
    } catch (e) {
      console.warn('JSON parse failed, attempting repair...');

      // Strategy 1: Try progressive truncation to last complete guide
      // If response was cut off mid-guide, find the last complete one
      const guidesMatch = cleaned.match(/"guides"\s*:\s*\[/);
      if (guidesMatch) {
        try {
          // Find all complete guide objects (those that end with })
          // Work backwards to find the last complete guide
          let truncateAt = cleaned.length;
          let depth = 0;
          let inString = false;
          let escapeNext = false;

          // Parse backwards to find last complete guide structure
          for (let i = cleaned.length - 1; i >= 0; i--) {
            const char = cleaned[i];

            if (escapeNext) {
              escapeNext = false;
              continue;
            }

            if (char === '\\') {
              escapeNext = true;
              continue;
            }

            if (char === '"' && !escapeNext) {
              inString = !inString;
              continue;
            }

            if (inString) continue;

            if (char === '}') {
              depth++;
              // If we just found a closing brace at depth 1, this might be end of a guide
              if (depth === 1) {
                truncateAt = i + 1;
              }
            } else if (char === '{') {
              depth--;
            }
          }

          // Try to construct valid JSON with the guides array properly closed
          if (truncateAt < cleaned.length) {
            const truncated = cleaned.substring(0, truncateAt) + ']}';
            try {
              JSON.parse(truncated);
              console.warn('Successfully truncated to last complete guide');
              return truncated;
            } catch (truncError) {
              // Truncation didn't help, continue with other repairs
            }
          }
        } catch (truncError) {
          console.warn('Truncation strategy failed:', truncError.message);
        }
      }

      // Strategy 2: Fix common JSON syntax issues
      let repaired = cleaned;

      // 1. Fix unescaped newlines in strings (but be careful not to break already-escaped ones)
      // Only fix newlines that are clearly inside strings
      repaired = repaired.replace(/("[^"]*?)\n([^"]*?")/g, '$1\\n$2');

      // 2. Fix unterminated strings at the end
      // Count quotes to see if we have an odd number (unterminated string)
      const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        // Find the last quote and add a closing quote
        const lastQuoteIndex = repaired.lastIndexOf('"');
        if (lastQuoteIndex !== -1) {
          repaired = repaired.substring(0, lastQuoteIndex + 1) + '"' + repaired.substring(lastQuoteIndex + 1);
        }
      }

      // 3. Close unclosed arrays and objects
      const openBraces = (repaired.match(/{/g) || []).length;
      const closeBraces = (repaired.match(/}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/]/g) || []).length;

      // Add missing closing brackets and braces
      if (openBrackets > closeBrackets) {
        repaired += ']'.repeat(openBrackets - closeBrackets);
      }
      if (openBraces > closeBraces) {
        repaired += '}'.repeat(openBraces - closeBraces);
      }

      // 4. Remove trailing commas (invalid in JSON)
      repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

      // 5. Validate the repair worked
      try {
        JSON.parse(repaired);
        console.warn('JSON repair successful');
        return repaired;
      } catch (repairError) {
        // Last resort: try to extract just the guides array
        try {
          const guidesArrayMatch = repaired.match(/"guides"\s*:\s*(\[[^\]]*\])/);
          if (guidesArrayMatch) {
            const lastResort = `{"guides":${guidesArrayMatch[1]}}`;
            JSON.parse(lastResort);
            console.warn('Used last-resort extraction of guides array');
            return lastResort;
          }
        } catch (lastResortError) {
          // Nothing worked
        }

        // Repair failed - throw with context
        throw new Error(`JSON repair failed. Original error: ${e.message}, Repair error: ${repairError.message}`);
      }
    }
  }
}

module.exports = GuideGenerationAgent;
