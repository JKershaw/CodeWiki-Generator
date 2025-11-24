const SecurityAnalysisAgent = require('../../../lib/agents/security-analysis-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('SecurityAnalysisAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    // Create mock Claude client
    mockClaudeClient = {
      sendMessageJSON: jest.fn()
    };

    agent = new SecurityAnalysisAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('analyze', () => {
    it('should analyze code for security issues and return structured findings', async () => {
      const mockResponse = {
        findings: [
          {
            category: 'injection',
            severity: 'high',
            title: 'SQL Injection Risk',
            description: 'Unsanitized user input in SQL query',
            location: 'src/database.js:45',
            cwe: 'CWE-89',
            owasp: 'A03',
            remediation: 'Use parameterized queries',
            falsePositiveRisk: 'low'
          }
        ],
        securePatterns: ['Input validation on API boundaries'],
        antiPatterns: ['Direct string concatenation in queries']
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockResponse);

      const fileDiff = '+ const query = "SELECT * FROM users WHERE id=" + userId';
      const codeAnalysis = {
        codeElements: [
          { name: 'getUserById', type: 'function', purpose: 'Fetches user from database' }
        ]
      };

      const result = await agent.analyze('src/database.js', fileDiff, codeAnalysis);

      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].category).toBe('injection');
      expect(result.findings[0].severity).toBe('high');
      expect(result.findings[0].title).toBe('SQL Injection Risk');
      expect(result.findings[0].cwe).toBe('CWE-89');
      expect(result.summary.totalFindings).toBe(1);
      expect(result.summary.high).toBe(1);
      expect(result.overallRisk).toBe('high');
      expect(result.securePatterns).toHaveLength(1);
      expect(result.antiPatterns).toHaveLength(1);
    });

    it('should skip non-security-relevant files', async () => {
      const result = await agent.analyze('README.md', '+ documentation', {});

      expect(result.findings).toHaveLength(0);
      expect(result.summary.totalFindings).toBe(0);
      expect(mockClaudeClient.sendMessageJSON).not.toHaveBeenCalled();
    });

    it('should skip test files', async () => {
      const result = await agent.analyze('src/auth.test.js', '+ test code', {});

      expect(result.findings).toHaveLength(0);
      expect(mockClaudeClient.sendMessageJSON).not.toHaveBeenCalled();
    });

    it('should analyze security-sensitive config files', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        findings: [],
        securePatterns: [],
        antiPatterns: []
      });

      await agent.analyze('src/auth.js', '+ auth code', {});
      expect(mockClaudeClient.sendMessageJSON).toHaveBeenCalled();

      mockClaudeClient.sendMessageJSON.mockClear();
      await agent.analyze('.env', 'SECRET=123', {});
      expect(mockClaudeClient.sendMessageJSON).toHaveBeenCalled();
    });

    it('should filter findings by minimum severity', async () => {
      const mockResponse = {
        findings: [
          {
            category: 'config',
            severity: 'low',
            title: 'Missing Security Header',
            description: 'X-Frame-Options not set',
            location: 'src/server.js:10',
            remediation: 'Add security headers',
            falsePositiveRisk: 'low'
          },
          {
            category: 'injection',
            severity: 'critical',
            title: 'Command Injection',
            description: 'Unsanitized input in shell command',
            location: 'src/exec.js:20',
            cwe: 'CWE-78',
            remediation: 'Sanitize input',
            falsePositiveRisk: 'low'
          }
        ],
        securePatterns: [],
        antiPatterns: []
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockResponse);

      // Agent has minSeverity = 'medium' by default, so low should be filtered out
      const result = await agent.analyze('src/test.js', '+ code', {});

      expect(result.findings).toHaveLength(1); // Only critical one
      expect(result.findings[0].severity).toBe('critical');
      expect(result.summary.critical).toBe(1);
      expect(result.summary.low).toBe(0);
    });

    it('should normalize severity levels', async () => {
      const mockResponse = {
        findings: [
          {
            category: 'other',
            severity: 'severe', // Should be normalized to 'critical'
            title: 'Test',
            description: 'Test',
            location: 'test.js:1',
            remediation: 'Fix',
            falsePositiveRisk: 'low'
          },
          {
            category: 'other',
            severity: 'info', // Should be normalized to 'low' (but filtered out by minSeverity)
            title: 'Test2',
            description: 'Test2',
            location: 'test.js:2',
            remediation: 'Fix',
            falsePositiveRisk: 'high'
          }
        ],
        securePatterns: [],
        antiPatterns: []
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockResponse);

      const result = await agent.analyze('src/test.js', '+ code', {});

      expect(result.findings).toHaveLength(1); // Only critical (normalized from severe)
      expect(result.findings[0].severity).toBe('critical');
    });

    it('should calculate overall risk correctly', async () => {
      const mockResponse = {
        findings: [
          { category: 'other', severity: 'medium', title: 'Issue 1', description: '', location: '', remediation: '', falsePositiveRisk: 'low' },
          { category: 'other', severity: 'medium', title: 'Issue 2', description: '', location: '', remediation: '', falsePositiveRisk: 'low' },
          { category: 'other', severity: 'medium', title: 'Issue 3', description: '', location: '', remediation: '', falsePositiveRisk: 'low' }
        ],
        securePatterns: [],
        antiPatterns: []
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockResponse);

      const result = await agent.analyze('src/test.js', '+ code', {});

      // 3 medium issues should result in 'medium' overall risk
      expect(result.overallRisk).toBe('medium');
    });

    it('should handle empty findings', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        findings: [],
        securePatterns: ['Uses HTTPS', 'Input validation'],
        antiPatterns: []
      });

      const result = await agent.analyze('src/test.js', '+ code', {});

      expect(result.findings).toHaveLength(0);
      expect(result.summary.totalFindings).toBe(0);
      expect(result.overallRisk).toBe('low');
      expect(result.securePatterns).toHaveLength(2);
    });

    it('should truncate large diffs', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        findings: [],
        securePatterns: [],
        antiPatterns: []
      });

      // Create a diff with 1500 lines
      const largeDiff = Array(1500).fill('+ line').join('\n');

      await agent.analyze('src/test.js', largeDiff, {});

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      // Prompt should contain truncation message
      expect(promptCall).toContain('truncated');
    });

    it('should format code elements in prompt', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        findings: [],
        securePatterns: [],
        antiPatterns: []
      });

      const codeAnalysis = {
        codeElements: [
          { name: 'authenticate', type: 'function', purpose: 'Verifies credentials' },
          { name: 'hashPassword', type: 'function', purpose: 'Hashes password' }
        ]
      };

      await agent.analyze('src/auth.js', '+ code', codeAnalysis);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      expect(promptCall).toContain('authenticate');
      expect(promptCall).toContain('hashPassword');
    });
  });

  describe('_isSecurityRelevant', () => {
    it('should accept source files', () => {
      expect(agent._isSecurityRelevant('src/auth.js')).toBe(true);
      expect(agent._isSecurityRelevant('src/api.ts')).toBe(true);
      expect(agent._isSecurityRelevant('src/database.py')).toBe(true);
    });

    it('should accept security-sensitive files', () => {
      expect(agent._isSecurityRelevant('src/auth.js')).toBe(true);
      expect(agent._isSecurityRelevant('src/security.ts')).toBe(true);
      expect(agent._isSecurityRelevant('.env')).toBe(true);
    });

    it('should reject test files', () => {
      expect(agent._isSecurityRelevant('src/auth.test.js')).toBe(false);
      expect(agent._isSecurityRelevant('src/api.spec.ts')).toBe(false);
      expect(agent._isSecurityRelevant('__tests__/security.js')).toBe(false);
    });

    it('should reject documentation', () => {
      expect(agent._isSecurityRelevant('README.md')).toBe(false);
      expect(agent._isSecurityRelevant('CHANGELOG.txt')).toBe(false);
    });

    it('should reject build artifacts', () => {
      expect(agent._isSecurityRelevant('dist/bundle.js')).toBe(false);
      expect(agent._isSecurityRelevant('build/output.js')).toBe(false);
      expect(agent._isSecurityRelevant('node_modules/lib.js')).toBe(false);
    });
  });

  describe('_calculateOverallRisk', () => {
    it('should return critical for any critical findings', () => {
      const summary = { critical: 1, high: 0, medium: 0, low: 0, totalFindings: 1 };
      expect(agent._calculateOverallRisk(summary)).toBe('critical');
    });

    it('should return high for any high findings', () => {
      const summary = { critical: 0, high: 1, medium: 0, low: 0, totalFindings: 1 };
      expect(agent._calculateOverallRisk(summary)).toBe('high');
    });

    it('should return medium for multiple medium findings', () => {
      const summary = { critical: 0, high: 0, medium: 3, low: 0, totalFindings: 3 };
      expect(agent._calculateOverallRisk(summary)).toBe('medium');
    });

    it('should return low-medium for single medium finding', () => {
      const summary = { critical: 0, high: 0, medium: 1, low: 0, totalFindings: 1 };
      expect(agent._calculateOverallRisk(summary)).toBe('low-medium');
    });

    it('should return low for no findings', () => {
      const summary = { critical: 0, high: 0, medium: 0, low: 0, totalFindings: 0 };
      expect(agent._calculateOverallRisk(summary)).toBe('low');
    });
  });
});
