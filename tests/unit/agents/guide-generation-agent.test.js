const GuideGenerationAgent = require('../../../lib/agents/guide-generation-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('GuideGenerationAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    mockClaudeClient = {
      sendMessage: jest.fn()
    };

    agent = new GuideGenerationAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('generateGuides', () => {
    it('should generate guides from wiki data', async () => {
      const mockGuidesMarkdown = `---GUIDE: Getting Started---
# Getting Started

Install dependencies...

---GUIDE: Testing Approach---
# Testing Approach

Run tests with jest...`;

      mockClaudeClient.sendMessage.mockResolvedValue(mockGuidesMarkdown);

      const wikiData = {
        repositoryName: 'My Repository',
        components: [
          { title: 'UserService', content: 'class UserService...' }
        ],
        concepts: [
          { title: 'Architecture', content: 'Agent-based architecture...' }
        ],
        repositoryInfo: {
          hasTests: true,
          testFramework: 'jest',
          hasCI: false,
          packageManager: 'npm'
        }
      };

      const result = await agent.generateGuides(wikiData);

      expect(result.guides).toHaveLength(2);
      expect(result.guides[0].title).toBe('Getting Started');
      expect(result.guides[0].content).toContain('Getting Started');
      expect(result.guides[1].title).toBe('Testing Approach');
      expect(mockClaudeClient.sendMessage).toHaveBeenCalled();
    });

    it('should detect repository info correctly', () => {
      const repoStructure = {
        files: [
          'package.json',
          'tests/unit/foo.test.js',
          '.github/workflows/ci.yml',
          'README.md'
        ]
      };

      const repoInfo = agent.detectRepositoryInfo(repoStructure);

      expect(repoInfo.hasTests).toBe(true);
      expect(repoInfo.testFramework).toBe('jest');
      expect(repoInfo.hasCI).toBe(true);
      expect(repoInfo.packageManager).toBe('npm');
    });

    it('should handle invalid JSON gracefully', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('not json');

      const wikiData = {
        repositoryName: 'Test',
        components: [],
        concepts: [],
        repositoryInfo: {}
      };

      // Should return empty guides instead of throwing
      const result = await agent.generateGuides(wikiData);
      expect(result).toEqual({ guides: [] });
    });

    it('should validate guide structure', async () => {
      const mockGuidesMarkdown = `---GUIDE: Getting Started---
# Getting Started

Content here`;

      mockClaudeClient.sendMessage.mockResolvedValue(mockGuidesMarkdown);

      const wikiData = {
        repositoryName: 'Test',
        components: [],
        concepts: [],
        repositoryInfo: {}
      };

      const result = await agent.generateGuides(wikiData);

      expect(result.guides[0]).toHaveProperty('title');
      expect(result.guides[0]).toHaveProperty('content');
      expect(typeof result.guides[0].title).toBe('string');
      expect(typeof result.guides[0].content).toBe('string');
    });

    it('should use correct model and token limits', async () => {
      const mockGuidesMarkdown = ''; // Empty response
      mockClaudeClient.sendMessage.mockResolvedValue(mockGuidesMarkdown);

      const wikiData = {
        repositoryName: 'Test',
        components: [],
        concepts: [],
        repositoryInfo: {}
      };

      await agent.generateGuides(wikiData);

      expect(mockClaudeClient.sendMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          maxTokens: 8000
        })
      );
    });

    it('should handle empty components and concepts', async () => {
      const mockGuidesMarkdown = ''; // Empty response
      mockClaudeClient.sendMessage.mockResolvedValue(mockGuidesMarkdown);

      const wikiData = {
        repositoryName: 'Empty',
        components: [],
        concepts: [],
        repositoryInfo: {}
      };

      const result = await agent.generateGuides(wikiData);

      expect(result.guides).toEqual([]);
      expect(mockClaudeClient.sendMessage).toHaveBeenCalled();
    });

    it('should format wiki structure for prompt', () => {
      const wikiData = {
        components: [
          { title: 'Component 1', content: 'content 1' },
          { title: 'Component 2', content: 'content 2' }
        ],
        concepts: [
          { title: 'Concept 1', content: 'concept content 1' }
        ]
      };

      const formatted = agent._formatWikiStructure(wikiData);

      expect(formatted).toContain('Component 1');
      expect(formatted).toContain('Component 2');
      expect(formatted).toContain('Concept 1');
    });
  });
});
