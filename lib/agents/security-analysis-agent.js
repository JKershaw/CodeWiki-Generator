const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * SecurityAnalysisAgent identifies security vulnerabilities and concerns in code changes
 * Focuses on OWASP Top 10 and common security anti-patterns
 */
class SecurityAnalysisAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Configuration
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 2000;
    this.minSeverity = 'medium'; // Higher threshold for security - only report medium+ by default
  }

  /**
   * Analyze code change for security issues
   * @param {string} filePath - Path to the changed file
   * @param {string} fileDiff - The diff content
   * @param {Object} codeAnalysis - Code analysis result from CodeAnalysisAgent
   * @returns {Object} Analysis with security findings, severity, and remediation
   */
  async analyze(filePath, fileDiff, codeAnalysis) {
    // Skip analysis for non-security-relevant files
    if (!this._isSecurityRelevant(filePath)) {
      return {
        filePath,
        findings: [],
        summary: {
          totalFindings: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        }
      };
    }

    // Truncate large diffs
    const truncatedDiff = this._truncateDiff(fileDiff);

    // Format code elements from analysis
    const codeElementsText = this._formatCodeElements(codeAnalysis);

    // Render prompt template
    const prompt = this.promptManager.render('security-analysis', {
      filePath,
      diff: truncatedDiff,
      codeElements: codeElementsText
    });

    // Call Claude
    const response = await this.claudeClient.sendMessageJSON(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Validate and return response
    return this._validateResponse(response, filePath);
  }

  /**
   * Determine if file should be analyzed for security
   * @private
   */
  _isSecurityRelevant(filePath) {
    const fileName = filePath.toLowerCase();

    // Skip test files (they may contain intentionally vulnerable test code)
    if (fileName.includes('.test.') ||
        fileName.includes('.spec.') ||
        fileName.includes('__tests__') ||
        fileName.includes('__mocks__')) {
      return false;
    }

    // Skip documentation and config (unless it's security config)
    if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
      return false;
    }

    // Always analyze security-sensitive config files
    if (fileName.includes('auth') ||
        fileName.includes('security') ||
        fileName.includes('credential') ||
        fileName.includes('.env')) {
      return true;
    }

    // Skip build artifacts
    if (fileName.includes('dist/') ||
        fileName.includes('build/') ||
        fileName.includes('node_modules/')) {
      return false;
    }

    // Analyze all source code files
    const sourceExtensions = [
      '.js', '.jsx', '.ts', '.tsx',
      '.py', '.rb', '.java', '.go',
      '.rs', '.c', '.cpp', '.h',
      '.php', '.swift', '.kt',
      '.sql', '.graphql'
    ];

    return sourceExtensions.some(ext => fileName.endsWith(ext));
  }

  /**
   * Truncate diff if too large
   * @private
   */
  _truncateDiff(diff) {
    const maxLines = 1000;
    const lines = diff.split('\n');

    if (lines.length <= maxLines) {
      return diff;
    }

    const keepStart = Math.floor(maxLines * 0.7);
    const keepEnd = Math.floor(maxLines * 0.3);

    const truncated = [
      ...lines.slice(0, keepStart),
      '',
      `... [${lines.length - keepStart - keepEnd} lines truncated] ...`,
      '',
      ...lines.slice(-keepEnd)
    ];

    return truncated.join('\n');
  }

  /**
   * Format code elements from analysis for prompt
   * @private
   */
  _formatCodeElements(codeAnalysis) {
    if (!codeAnalysis || !codeAnalysis.codeElements || codeAnalysis.codeElements.length === 0) {
      return 'No code elements identified';
    }

    return codeAnalysis.codeElements
      .map(el => `- ${el.name} (${el.type}): ${el.purpose}`)
      .join('\n');
  }

  /**
   * Validate response structure
   * @private
   */
  _validateResponse(response, filePath) {
    // Ensure findings array exists
    let findings = Array.isArray(response.findings) ? response.findings : [];

    // Validate each finding
    findings = findings.map(finding => ({
      category: finding.category || 'general',
      severity: this._normalizeSeverity(finding.severity),
      title: finding.title || 'Security Issue',
      description: finding.description || '',
      location: finding.location || filePath,
      cwe: finding.cwe || null, // Common Weakness Enumeration ID
      owasp: finding.owasp || null, // OWASP Top 10 category
      remediation: finding.remediation || '',
      falsePositiveRisk: finding.falsePositiveRisk || 'low' // How likely this is a false positive
    }));

    // Filter by minimum severity
    findings = findings.filter(finding => this._meetsMinimumSeverity(finding.severity));

    // Calculate summary
    const summary = {
      totalFindings: findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length
    };

    // Extract security patterns (both good and bad)
    const securePatterns = Array.isArray(response.securePatterns) ? response.securePatterns : [];
    const antiPatterns = Array.isArray(response.antiPatterns) ? response.antiPatterns : [];

    return {
      filePath,
      findings,
      summary,
      securePatterns,
      antiPatterns,
      overallRisk: this._calculateOverallRisk(summary)
    };
  }

  /**
   * Normalize severity to standard levels
   * @private
   */
  _normalizeSeverity(severity) {
    const normalized = (severity || 'low').toLowerCase();
    if (['critical', 'high', 'medium', 'low'].includes(normalized)) {
      return normalized;
    }
    // Map non-standard values
    if (['severe', 'urgent'].includes(normalized)) return 'critical';
    if (['minor', 'info', 'informational'].includes(normalized)) return 'low';
    return 'medium'; // Default
  }

  /**
   * Check if severity meets minimum threshold
   * @private
   */
  _meetsMinimumSeverity(severity) {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    const findingLevel = levels[severity] || 1;
    const minLevel = levels[this.minSeverity] || 2;
    return findingLevel >= minLevel;
  }

  /**
   * Calculate overall risk level based on findings
   * @private
   */
  _calculateOverallRisk(summary) {
    if (summary.critical > 0) return 'critical';
    if (summary.high > 0) return 'high';
    if (summary.medium > 2) return 'medium'; // Multiple medium issues
    if (summary.medium > 0) return 'low-medium';
    return 'low';
  }
}

module.exports = SecurityAnalysisAgent;
