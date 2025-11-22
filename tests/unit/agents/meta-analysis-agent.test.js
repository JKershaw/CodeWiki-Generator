const MetaAnalysisAgent = require('../../../lib/agents/meta-analysis-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('MetaAnalysisAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    // Create mock Claude client
    mockClaudeClient = {
      sendMessageJSON: jest.fn()
    };

    agent = new MetaAnalysisAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('analyzeProgress', () => {
    it('should analyze multiple commits and identify patterns', async () => {
      const mockAnalysis = {
        themes: ['Authentication system', 'Database layer'],
        newPagesNeeded: [
          {
            title: 'Security Architecture',
            reason: 'Multiple auth-related commits suggest need for overview',
            category: 'concepts'
          }
        ],
        gaps: ['Missing documentation on error handling'],
        reorganization: []
      };

      mockClaudeClient.sendMessageJSON.mockResolvedValue(mockAnalysis);

      const concepts = ['Auth', 'Database', 'Session'];
      const pageList = ['AuthService', 'UserManager', 'DatabaseConnection'];

      const result = await agent.analyzeProgress(concepts, pageList);

      expect(result).toEqual(mockAnalysis);
      expect(result.themes).toContain('Authentication system');
    });

    it('should pass concepts and page list to prompt', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: [],
        newPagesNeeded: [],
        gaps: [],
        reorganization: []
      });

      const concepts = ['Concept A', 'Concept B'];
      const pageList = ['Page 1', 'Page 2'];

      await agent.analyzeProgress(concepts, pageList);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      expect(promptCall).toContain('Concept A');
      expect(promptCall).toContain('Page 1');
    });

    it('should format concepts as list', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: [],
        newPagesNeeded: [],
        gaps: [],
        reorganization: []
      });

      const concepts = ['Auth', 'Database'];
      await agent.analyzeProgress(concepts, []);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      // Should be formatted as a readable list
      expect(promptCall).toMatch(/Auth.*Database/s);
    });

    it('should format page list as list', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: [],
        newPagesNeeded: [],
        gaps: [],
        reorganization: []
      });

      const pageList = ['components/auth.md', 'concepts/security.md'];
      await agent.analyzeProgress([], pageList);

      const promptCall = mockClaudeClient.sendMessageJSON.mock.calls[0][0];
      expect(promptCall).toContain('components/auth.md');
      expect(promptCall).toContain('concepts/security.md');
    });

    it('should handle empty concepts and pages', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: [],
        newPagesNeeded: [],
        gaps: [],
        reorganization: []
      });

      const result = await agent.analyzeProgress([], []);

      expect(result).toBeDefined();
      expect(result.themes).toEqual([]);
    });

    it('should use appropriate model and token limits', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: [],
        newPagesNeeded: [],
        gaps: [],
        reorganization: []
      });

      await agent.analyzeProgress(['Test'], ['Page']);

      const options = mockClaudeClient.sendMessageJSON.mock.calls[0][1];
      expect(options.model).toBe('claude-sonnet-4-20250514');
      expect(options.maxTokens).toBe(2000);
    });

    it('should handle API errors gracefully', async () => {
      mockClaudeClient.sendMessageJSON.mockRejectedValue(new Error('API Error'));

      await expect(
        agent.analyzeProgress(['Test'], ['Page'])
      ).rejects.toThrow('API Error');
    });

    it('should validate response structure', async () => {
      // Partial response
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: ['Theme 1']
        // Missing other fields
      });

      const result = await agent.analyzeProgress(['Test'], ['Page']);

      // Should have all required fields even if some were missing
      expect(result).toHaveProperty('themes');
      expect(result).toHaveProperty('newPagesNeeded');
      expect(result).toHaveProperty('gaps');
      expect(result).toHaveProperty('reorganization');
    });
  });

  describe('shouldRunMetaAnalysis', () => {
    it('should return true at meta-analysis frequency', () => {
      // Every 5 commits by default
      expect(agent.shouldRunMetaAnalysis(5, 0)).toBe(true);
      expect(agent.shouldRunMetaAnalysis(10, 5)).toBe(true);
      expect(agent.shouldRunMetaAnalysis(15, 10)).toBe(true);
    });

    it('should return false between meta-analysis intervals', () => {
      expect(agent.shouldRunMetaAnalysis(1, 0)).toBe(false);
      expect(agent.shouldRunMetaAnalysis(3, 0)).toBe(false);
      expect(agent.shouldRunMetaAnalysis(7, 5)).toBe(false);
    });

    it('should handle custom frequency', () => {
      agent.frequency = 10; // Every 10 commits

      expect(agent.shouldRunMetaAnalysis(10, 0)).toBe(true);
      expect(agent.shouldRunMetaAnalysis(5, 0)).toBe(false);
      expect(agent.shouldRunMetaAnalysis(20, 10)).toBe(true);
    });

    it('should return false if already analyzed at this commit', () => {
      expect(agent.shouldRunMetaAnalysis(5, 5)).toBe(false);
      expect(agent.shouldRunMetaAnalysis(10, 10)).toBe(false);
    });
  });

  describe('response validation', () => {
    it('should ensure all arrays exist', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({});

      const result = await agent.analyzeProgress([], []);

      expect(Array.isArray(result.themes)).toBe(true);
      expect(Array.isArray(result.newPagesNeeded)).toBe(true);
      expect(Array.isArray(result.gaps)).toBe(true);
      expect(Array.isArray(result.reorganization)).toBe(true);
    });

    it('should validate newPagesNeeded structure', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: [],
        newPagesNeeded: [{ title: 'Test', reason: 'Because', category: 'concepts' }],
        gaps: [],
        reorganization: []
      });

      const result = await agent.analyzeProgress([], []);

      expect(result.newPagesNeeded[0]).toHaveProperty('title');
      expect(result.newPagesNeeded[0]).toHaveProperty('reason');
      expect(result.newPagesNeeded[0]).toHaveProperty('category');
    });

    it('should validate reorganization structure', async () => {
      mockClaudeClient.sendMessageJSON.mockResolvedValue({
        themes: [],
        newPagesNeeded: [],
        gaps: [],
        reorganization: [{ action: 'split', target: 'LargePage', reason: 'Too long' }]
      });

      const result = await agent.analyzeProgress([], []);

      expect(result.reorganization[0]).toHaveProperty('action');
      expect(result.reorganization[0]).toHaveProperty('target');
      expect(result.reorganization[0]).toHaveProperty('reason');
    });
  });
});
