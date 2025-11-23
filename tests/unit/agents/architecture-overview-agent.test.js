const ArchitectureOverviewAgent = require('../../../lib/agents/architecture-overview-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('ArchitectureOverviewAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    mockClaudeClient = {
      sendMessage: jest.fn()
    };

    agent = new ArchitectureOverviewAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('generateArchitectureOverview', () => {
    it('should generate architecture overview from wiki data', async () => {
      const mockOverview = '# System Architecture\n\nThis is a comprehensive overview...';
      mockClaudeClient.sendMessage.mockResolvedValue(mockOverview);

      const wikiData = {
        repositoryName: 'CodeWiki-Generator',
        concepts: [
          { title: 'Agent-based Architecture', content: 'Agent pattern...' },
          { title: 'Cost-aware Processing', content: 'Cost tracking...' }
        ],
        components: [
          { title: 'WikiManager', content: 'Manages wiki files...' },
          { title: 'Processor', content: 'Main processing engine...' }
        ],
        guides: [
          { title: 'Getting Started', content: 'Installation...' }
        ]
      };

      const result = await agent.generateArchitectureOverview(wikiData);

      expect(result).toContain('System Architecture');
      expect(mockClaudeClient.sendMessage).toHaveBeenCalled();
    });

    it('should format concepts correctly', () => {
      const concepts = [
        { title: 'Concept 1', content: 'content 1' },
        { title: 'Concept 2', content: 'content 2' }
      ];

      const formatted = agent._formatConcepts(concepts);

      expect(formatted).toContain('Concept 1');
      expect(formatted).toContain('Concept 2');
      expect(formatted).toMatch(/^- /m); // Should have bullet points
    });

    it('should format components correctly', () => {
      const components = [
        { title: 'Component 1', content: 'content 1' }
      ];

      const formatted = agent._formatComponents(components);

      expect(formatted).toContain('Component 1');
    });

    it('should format guides correctly', () => {
      const guides = [
        { title: 'Guide 1', content: 'content 1' }
      ];

      const formatted = agent._formatGuides(guides);

      expect(formatted).toContain('Guide 1');
    });

    it('should use correct model and token limits', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Architecture');

      const wikiData = {
        repositoryName: 'Test',
        concepts: [],
        components: [],
        guides: []
      };

      await agent.generateArchitectureOverview(wikiData);

      expect(mockClaudeClient.sendMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          model: 'claude-sonnet-4-20250514',
          maxTokens: 4000
        })
      );
    });

    it('should clean markdown output', async () => {
      const mockMarkdownWrapped = '```markdown\n# Architecture\nContent\n```';
      mockClaudeClient.sendMessage.mockResolvedValue(mockMarkdownWrapped);

      const wikiData = {
        repositoryName: 'Test',
        concepts: [],
        components: [],
        guides: []
      };

      const result = await agent.generateArchitectureOverview(wikiData);

      expect(result).not.toContain('```markdown');
      expect(result).not.toContain('```');
      expect(result).toContain('# Architecture');
    });

    it('should handle empty sections gracefully', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Architecture\n\nOverview');

      const wikiData = {
        repositoryName: 'Empty Project',
        concepts: [],
        components: [],
        guides: []
      };

      const result = await agent.generateArchitectureOverview(wikiData);

      expect(result).toContain('Architecture');
      expect(mockClaudeClient.sendMessage).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockClaudeClient.sendMessage.mockRejectedValue(new Error('API Error'));

      const wikiData = {
        repositoryName: 'Test',
        concepts: [],
        components: [],
        guides: []
      };

      await expect(agent.generateArchitectureOverview(wikiData)).rejects.toThrow('API Error');
    });
  });
});
