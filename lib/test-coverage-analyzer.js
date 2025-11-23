const fs = require('fs').promises;
const path = require('path');

/**
 * TestCoverageAnalyzer extracts test coverage information for source files
 */
class TestCoverageAnalyzer {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Analyze test coverage for a given source file
   * @param {string} sourceFilePath - Path to the source file
   * @returns {Object} Test coverage information
   */
  async analyzeFile(sourceFilePath) {
    if (!sourceFilePath || sourceFilePath === 'Not specified') {
      return this._emptyResult();
    }

    try {
      const testFilePath = await this._findTestFile(sourceFilePath);

      if (!testFilePath) {
        return this._emptyResult();
      }

      const testContent = await fs.readFile(testFilePath, 'utf-8');
      const stats = this._extractTestStats(testContent);

      return {
        hasTests: true,
        testFile: path.relative(this.projectRoot, testFilePath),
        ...stats
      };
    } catch (error) {
      console.warn(`Could not analyze test coverage for ${sourceFilePath}:`, error.message);
      return this._emptyResult();
    }
  }

  /**
   * Find the corresponding test file for a source file
   * @private
   */
  async _findTestFile(sourceFilePath) {
    const fileName = path.basename(sourceFilePath, path.extname(sourceFilePath));

    // Potential test file patterns
    const testPatterns = [
      `tests/unit/${fileName}.test.js`,
      `tests/unit/**/${fileName}.test.js`,
      `tests/integration/${fileName}.test.js`,
      `tests/${fileName}.test.js`,
      `test/${fileName}.test.js`,
      `__tests__/${fileName}.test.js`,
      `${path.dirname(sourceFilePath)}/__tests__/${fileName}.test.js`,
      `${path.dirname(sourceFilePath)}/${fileName}.test.js`,
      `${path.dirname(sourceFilePath)}/${fileName}.spec.js`
    ];

    for (const pattern of testPatterns) {
      const testPath = path.join(this.projectRoot, pattern.replace('**/', ''));

      try {
        await fs.access(testPath);
        return testPath;
      } catch {
        // Try next pattern
        continue;
      }
    }

    return null;
  }

  /**
   * Extract test statistics from test file content
   * @private
   */
  _extractTestStats(testContent) {
    const stats = {
      totalTests: 0,
      describeBlocks: 0,
      testTypes: []
    };

    // Count describe blocks (test suites)
    const describeMatches = testContent.match(/describe\s*\(/g) || [];
    stats.describeBlocks = describeMatches.length;

    // Count individual tests
    const itMatches = testContent.match(/\b(it|test)\s*\(/g) || [];
    stats.totalTests = itMatches.length;

    // Identify test categories
    const testCategories = new Set();

    // Look for common test patterns
    if (testContent.includes('describe(')) {
      const describePattern = /describe\s*\(\s*['"`]([^'"`]+)['"`]/g;
      let match;
      while ((match = describePattern.exec(testContent)) !== null) {
        testCategories.add(match[1]);
      }
    }

    stats.testCategories = Array.from(testCategories);

    return stats;
  }

  /**
   * Generate a summary text for documentation
   * @param {string} sourceFilePath - Source file path
   * @returns {string} Formatted test coverage summary
   */
  async generateSummary(sourceFilePath) {
    const coverage = await this.analyzeFile(sourceFilePath);

    if (!coverage.hasTests) {
      return 'No automated tests found.';
    }

    const lines = [
      `**Test Coverage**: ${coverage.testFile}`,
      `- ${coverage.totalTests} test case${coverage.totalTests !== 1 ? 's' : ''}`,
      `- ${coverage.describeBlocks} test suite${coverage.describeBlocks !== 1 ? 's' : ''}`
    ];

    if (coverage.testCategories && coverage.testCategories.length > 0) {
      lines.push(`- Test categories: ${coverage.testCategories.join(', ')}`);
    }

    return lines.join('\n');
  }

  /**
   * Empty result when no tests found
   * @private
   */
  _emptyResult() {
    return {
      hasTests: false,
      testFile: null,
      totalTests: 0,
      describeBlocks: 0,
      testCategories: []
    };
  }
}

module.exports = TestCoverageAnalyzer;
