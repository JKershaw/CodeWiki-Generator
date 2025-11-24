const CodeAnalysisAgent = require('../../lib/agents/code-analysis-agent');

describe('CodeAnalysisAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new CodeAnalysisAgent();
  });

  describe('_validateResponse', () => {
    it('should normalize concepts with sourceFile', () => {
      const mockResponse = {
        concepts: [
          {
            name: 'DashboardController',
            category: 'component',
            abstraction: 'low',
            reason: 'Main controller for dashboard',
            sourceFile: 'lib/dashboard-controller.js'
          }
        ]
      };

      const result = agent._validateResponse(mockResponse);

      expect(result.concepts[0]).toHaveProperty('sourceFile', 'lib/dashboard-controller.js');
    });

    it('should add sourceFile to concepts that are missing it', () => {
      const mockResponse = {
        concepts: [
          {
            name: 'TestCoverageAnalyzer',
            category: 'component',
            abstraction: 'low',
            reason: 'Analyzes test coverage',
            sourceFile: 'lib/test-coverage-analyzer.js'
          }
        ]
      };

      const result = agent._validateResponse(mockResponse);

      expect(result.concepts[0].sourceFile).toBe('lib/test-coverage-analyzer.js');
    });

    it('should use "Not specified" when sourceFile is missing', () => {
      const mockResponse = {
        concepts: [
          {
            name: 'SomeConcept',
            category: 'concept',
            abstraction: 'high',
            reason: 'Some reason'
          }
        ]
      };

      const result = agent._validateResponse(mockResponse);

      expect(result.concepts[0].sourceFile).toBe('Not specified');
    });

    it('should handle legacy string format concepts', () => {
      const mockResponse = {
        concepts: ['Processor', 'WikiManager']
      };

      const result = agent._validateResponse(mockResponse);

      expect(result.concepts).toHaveLength(2);
      expect(result.concepts[0]).toMatchObject({
        name: 'Processor',
        category: 'component',
        abstraction: 'low'
      });
      expect(result.concepts[1]).toMatchObject({
        name: 'WikiManager',
        category: 'component',
        abstraction: 'low'
      });
    });

    it('should return only concepts field', () => {
      const mockResponse = {
        concepts: [
          {
            name: 'Example',
            category: 'component',
            abstraction: 'medium',
            reason: 'Example component',
            sourceFile: 'lib/example.js'
          }
        ]
      };

      const result = agent._validateResponse(mockResponse);

      expect(result).toMatchObject({
        concepts: [
          {
            name: 'Example',
            category: 'component',
            abstraction: 'medium',
            reason: 'Example component',
            sourceFile: 'lib/example.js'
          }
        ]
      });
      // Ensure no extra fields
      expect(Object.keys(result)).toEqual(['concepts']);
    });
  });

  describe('isSignificantFile', () => {
    it('should accept JavaScript source files', () => {
      expect(agent.isSignificantFile('lib/processor.js')).toBe(true);
      expect(agent.isSignificantFile('src/components/Button.jsx')).toBe(true);
    });

    it('should reject test files', () => {
      expect(agent.isSignificantFile('tests/unit/processor.test.js')).toBe(false);
      expect(agent.isSignificantFile('src/__tests__/Button.spec.js')).toBe(false);
    });

    it('should reject config files', () => {
      expect(agent.isSignificantFile('package.json')).toBe(false);
      expect(agent.isSignificantFile('tsconfig.json')).toBe(false);
      expect(agent.isSignificantFile('.eslintrc.js')).toBe(false);
    });

    it('should reject documentation files', () => {
      expect(agent.isSignificantFile('README.md')).toBe(false);
      expect(agent.isSignificantFile('docs/guide.txt')).toBe(false);
    });

    it('should reject build artifacts', () => {
      expect(agent.isSignificantFile('dist/bundle.js')).toBe(false);
      expect(agent.isSignificantFile('node_modules/package/index.js')).toBe(false);
      expect(agent.isSignificantFile('coverage/lcov.info')).toBe(false);
    });
  });
});
