const TechDebtAnalysisAgent = require('../../../lib/agents/tech-debt-analysis-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('TechDebtAnalysisAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    // Create mock Claude client
    mockClaudeClient = {
      sendMessageJSON: jest.fn()
    };

    agent = new TechDebtAnalysisAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('analyze', () => {
    it('should analyze code for tech debt and return structured findings', async () => {
      const mockResponse = {
        items: [
          {
            type: 'code-smell',
            severity: 'high',
            title: 'Complex Method',
            description: 'Method has cyclomatic complexity of 15',
            location: 'src/processor.js:123',
            recommendation: 'Extract logic into smaller methods',
            impact: 'Difficult to test and maintain'
          }
        ],
        trend: 'neutral',
        recommendations: ['Consider refactoring complex methods']
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockResponse);

      const fileDiff = '+ function complexMethod() { ... }';
      const codeAnalysis = {
        codeElements: [
          { name: 'complexMethod', type: 'function', purpose: 'Processes data' }
        ]
      };

      const result = await agent.analyze('src/processor.js', fileDiff, codeAnalysis);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe('code-smell');
      expect(result.items[0].severity).toBe('high');
      expect(result.items[0].title).toBe('Complex Method');
      expect(result.summary.totalItems).toBe(1);
      expect(result.summary.highPriority).toBe(1);
      expect(result.trend).toBe('neutral');
    });

    it('should skip non-source files', async () => {
      const result = await agent.analyze('package.json', '+ "dep": "1.0"', {});

      expect(result.items).toHaveLength(0);
      expect(result.summary.totalItems).toBe(0);
      expect(mockClaudeClient.sendMessageJSON).not.toHaveBeenCalled();
    });

    it('should skip test files', async () => {
      const result = await agent.analyze('src/test.test.js', '+ test code', {});

      expect(result.items).toHaveLength(0);
      expect(mockClaudeClient.sendMessageJSON).not.toHaveBeenCalled();
    });

    it('should filter items by minimum severity', async () => {
      const mockResponse = {
        items: [
          {
            type: 'code-smell',
            severity: 'low',
            title: 'Minor Issue',
            description: 'Minor issue',
            location: 'src/test.js:10',
            recommendation: 'Fix when convenient',
            impact: 'Low impact'
          },
          {
            type: 'maintainability',
            severity: 'high',
            title: 'Major Issue',
            description: 'Major issue',
            location: 'src/test.js:20',
            recommendation: 'Fix immediately',
            impact: 'High impact'
          }
        ],
        trend: 'worsening',
        recommendations: []
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockResponse);

      // Agent has minSeverity = 'low' by default, so both should be included
      const result = await agent.analyze('src/test.js', '+ code', {});

      expect(result.items).toHaveLength(2);
      expect(result.summary.lowPriority).toBe(1);
      expect(result.summary.highPriority).toBe(1);
    });

    it('should normalize severity levels', async () => {
      const mockResponse = {
        items: [
          {
            type: 'code-smell',
            severity: 'critical', // Should be normalized to 'high'
            title: 'Test',
            description: 'Test',
            location: 'test.js:1',
            recommendation: 'Fix',
            impact: 'Impact'
          }
        ],
        trend: 'neutral',
        recommendations: []
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockResponse);

      const result = await agent.analyze('src/test.js', '+ code', {});

      expect(result.items[0].severity).toBe('high'); // Normalized
    });

    it('should handle empty response', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        items: [],
        trend: 'improving',
        recommendations: []
      });

      const result = await agent.analyze('src/test.js', '+ code', {});

      expect(result.items).toHaveLength(0);
      expect(result.summary.totalItems).toBe(0);
      expect(result.trend).toBe('improving');
    });

    it('should truncate large diffs', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        items: [],
        trend: 'neutral',
        recommendations: []
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
        items: [],
        trend: 'neutral',
        recommendations: []
      });

      const codeAnalysis = {
        codeElements: [
          { name: 'MyClass', type: 'class', purpose: 'Handles data' },
          { name: 'myMethod', type: 'function', purpose: 'Processes data' }
        ]
      };

      await agent.analyze('src/test.js', '+ code', codeAnalysis);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      expect(promptCall).toContain('MyClass');
      expect(promptCall).toContain('myMethod');
    });
  });

  describe('_isSignificantForDebtAnalysis', () => {
    it('should accept source files', () => {
      expect(agent._isSignificantForDebtAnalysis('src/test.js')).toBe(true);
      expect(agent._isSignificantForDebtAnalysis('src/test.ts')).toBe(true);
      expect(agent._isSignificantForDebtAnalysis('src/test.py')).toBe(true);
    });

    it('should reject test files', () => {
      expect(agent._isSignificantForDebtAnalysis('src/test.test.js')).toBe(false);
      expect(agent._isSignificantForDebtAnalysis('src/test.spec.js')).toBe(false);
      expect(agent._isSignificantForDebtAnalysis('__tests__/test.js')).toBe(false);
    });

    it('should reject config and documentation', () => {
      expect(agent._isSignificantForDebtAnalysis('package.json')).toBe(false);
      expect(agent._isSignificantForDebtAnalysis('README.md')).toBe(false);
      expect(agent._isSignificantForDebtAnalysis('config.yml')).toBe(false);
    });

    it('should reject build artifacts', () => {
      expect(agent._isSignificantForDebtAnalysis('dist/bundle.js')).toBe(false);
      expect(agent._isSignificantForDebtAnalysis('build/output.js')).toBe(false);
      expect(agent._isSignificantForDebtAnalysis('node_modules/lib.js')).toBe(false);
    });
  });
});
