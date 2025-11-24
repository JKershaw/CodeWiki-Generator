const CodeAnalysisAgent = require('../../../lib/agents/code-analysis-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('CodeAnalysisAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    // Create mock Claude client
    mockClaudeClient = {
      sendMessageJSON: jest.fn()
    };

    agent = new CodeAnalysisAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('analyzeCode', () => {
    it('should analyze code changes and return structured data', async () => {
      const mockAnalysis = {
        concepts: ['Authentication', 'Session Management'],
        codeElements: [
          {
            name: 'AuthService',
            type: 'class',
            purpose: 'Handles user authentication flow'
          }
        ],
        relationships: ['uses SessionManager', 'called by UserController']
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockAnalysis);

      const fileDiff = '+ class AuthService { ... }';
      const commitMessage = 'Add authentication service';
      const relatedPages = ['SessionManager docs'];

      const result = await agent.analyzeCode('src/auth.js', fileDiff, commitMessage, relatedPages);

      // Result should have normalized concepts to object format
      expect(result.concepts).toHaveLength(2);
      expect(result.concepts[0].name).toBe('Authentication');
      expect(result.concepts[0].category).toBe('component'); // Default for legacy format
      expect(result.concepts[1].name).toBe('Session Management');
      expect(result.codeElements[0].name).toBe('AuthService');
      expect(result.relationships).toEqual(['uses SessionManager', 'called by UserController']);
      expect(result.suggestedGuides).toEqual([]);
    });

    it('should pass file path, diff, and commit message to prompt', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        concepts: [],
        codeElements: [],
        relationships: []
      });

      await agent.analyzeCode('src/test.js', '+ code', 'Test commit', []);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      expect(promptCall).toContain('src/test.js');
      expect(promptCall).toContain('+ code');
      expect(promptCall).toContain('Test commit');
    });

    it('should format related pages into prompt', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        concepts: [],
        codeElements: [],
        relationships: []
      });

      const relatedPages = ['Page 1', 'Page 2', 'Page 3'];
      await agent.analyzeCode('src/test.js', '+ code', 'Commit', relatedPages);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      expect(promptCall).toContain('Page 1');
      expect(promptCall).toContain('Page 2');
    });

    it('should handle empty related pages', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        concepts: [],
        codeElements: [],
        relationships: []
      });

      await agent.analyzeCode('src/test.js', '+ code', 'Commit', []);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      expect(promptCall).toBeDefined();
    });

    it('should truncate large diffs', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        concepts: [],
        codeElements: [],
        relationships: []
      });

      // Create a very large diff
      const largeDiff = '+ line\n'.repeat(3000);

      await agent.analyzeCode('src/test.js', largeDiff, 'Commit', []);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      // Should be truncated (much shorter than 3000 lines)
      const lineCount = promptCall.split('\n').length;
      expect(lineCount).toBeLessThan(2500);
    });

    it('should use appropriate model and token limits', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        concepts: [],
        codeElements: [],
        relationships: []
      });

      await agent.analyzeCode('src/test.js', '+ code', 'Commit', []);

      const options = mockClaudeClient.sendMessageJSON.mock.calls[0][1];
      // Model is now set by config, not hardcoded by agent
      expect(options.maxTokens).toBe(4000);
    });

    it('should handle API errors gracefully', async () => {
      mockClaudeClient.sendMessageJSON.mockRejectedValue(new Error('API Error'));

      await expect(
        agent.analyzeCode('src/test.js', '+ code', 'Commit', [])
      ).rejects.toThrow('API Error');
    });

    it('should validate response structure', async () => {
      // Invalid response missing required fields
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        concepts: ['Test']
        // Missing codeElements and relationships
      });

      const result = await agent.analyzeCode('src/test.js', '+ code', 'Commit', []);

      // Should still return something valid
      expect(result).toHaveProperty('concepts');
    });
  });

  describe('isSignificantFile', () => {
    it('should identify JavaScript files as significant', () => {
      expect(agent.isSignificantFile('src/index.js')).toBe(true);
      expect(agent.isSignificantFile('lib/utils.ts')).toBe(true);
    });

    it('should identify Python files as significant', () => {
      expect(agent.isSignificantFile('main.py')).toBe(true);
    });

    it('should skip configuration files', () => {
      expect(agent.isSignificantFile('package.json')).toBe(false);
      expect(agent.isSignificantFile('.eslintrc.js')).toBe(false);
      expect(agent.isSignificantFile('tsconfig.json')).toBe(false);
    });

    it('should skip lock files', () => {
      expect(agent.isSignificantFile('package-lock.json')).toBe(false);
      expect(agent.isSignificantFile('yarn.lock')).toBe(false);
    });

    it('should skip test files', () => {
      expect(agent.isSignificantFile('test.spec.js')).toBe(false);
      expect(agent.isSignificantFile('component.test.tsx')).toBe(false);
    });

    it('should skip markdown and documentation', () => {
      expect(agent.isSignificantFile('README.md')).toBe(false);
      expect(agent.isSignificantFile('docs/guide.md')).toBe(false);
    });

    it('should skip build artifacts', () => {
      expect(agent.isSignificantFile('dist/bundle.js')).toBe(false);
      expect(agent.isSignificantFile('build/output.js')).toBe(false);
    });
  });
});
