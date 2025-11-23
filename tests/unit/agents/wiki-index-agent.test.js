const WikiIndexAgent = require('../../../lib/agents/wiki-index-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('WikiIndexAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    mockClaudeClient = {
      sendMessage: jest.fn()
    };

    agent = new WikiIndexAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('generateIndex', () => {
    it('should generate index page from wiki data', async () => {
      const mockIndexContent = `# My Repository Wiki

## Overview
This wiki documents the My Repository codebase.

## Concepts
- [Architecture](concepts/architecture.md) - System architecture
- [Design Patterns](concepts/patterns.md) - Design patterns used

## Components
- [UserService](components/user-service.md) - User management
`;

      mockClaudeClient.sendMessage.mockResolvedValue(mockIndexContent);

      const wikiData = {
        repositoryName: 'My Repository',
        pages: [
          { title: 'Architecture', path: 'concepts/architecture.md', category: 'concept' },
          { title: 'Design Patterns', path: 'concepts/patterns.md', category: 'concept' },
          { title: 'UserService', path: 'components/user-service.md', category: 'component' }
        ]
      };

      const result = await agent.generateIndex(wikiData);

      expect(result).toContain('# My Repository Wiki');
      expect(result).toContain('Concepts');
      expect(result).toContain('Components');
      expect(mockClaudeClient.sendMessage).toHaveBeenCalled();
    });

    it('should format wiki structure correctly', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Index\n');

      const wikiData = {
        repositoryName: 'Test',
        pages: [
          { title: 'Concept 1', path: 'concepts/concept-1.md', category: 'concept' },
          { title: 'Component 1', path: 'components/component-1.md', category: 'component' },
          { title: 'Guide 1', path: 'guides/guide-1.md', category: 'guide' }
        ]
      };

      await agent.generateIndex(wikiData);

      const promptCall = mockClaudeClient.sendMessage.mock.calls[0][0];
      expect(promptCall).toContain('Concepts:');
      expect(promptCall).toContain('Concept 1');
      expect(promptCall).toContain('Components:');
      expect(promptCall).toContain('Component 1');
      expect(promptCall).toContain('Guides:');
      expect(promptCall).toContain('Guide 1');
    });

    it('should handle pages with different category formats', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Index\n');

      const wikiData = {
        repositoryName: 'Test',
        pages: [
          { title: 'Page 1', path: 'components/page-1.md', category: 'components' }, // plural
          { title: 'Page 2', path: 'components/page-2.md', category: 'component' }  // singular
        ]
      };

      await agent.generateIndex(wikiData);

      const promptCall = mockClaudeClient.sendMessage.mock.calls[0][0];
      expect(promptCall).toContain('Page 1');
      expect(promptCall).toContain('Page 2');
    });

    it('should clean markdown code blocks', async () => {
      const wrappedContent = '```markdown\n# Index\nContent here\n```';
      mockClaudeClient.sendMessage.mockResolvedValue(wrappedContent);

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      expect(result).not.toContain('```markdown');
      expect(result).not.toContain('```');
      expect(result).toContain('# Index');
    });

    it('should remove frontmatter if present', async () => {
      const contentWithFrontmatter = `---
title: Index
---

# Index
Content`;
      mockClaudeClient.sendMessage.mockResolvedValue(contentWithFrontmatter);

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      expect(result).not.toContain('---');
      expect(result).not.toContain('title: Index');
      expect(result).toContain('# Index');
    });

    it('should use correct model and token limits', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Index\n');

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      await agent.generateIndex(wikiData);

      expect(mockClaudeClient.sendMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          model: 'claude-sonnet-4-20250514',
          maxTokens: 2000
        })
      );
    });

    it('should handle empty page lists', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Empty Wiki\n');

      const wikiData = {
        repositoryName: 'Empty',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      expect(result).toBeTruthy();
      expect(mockClaudeClient.sendMessage).toHaveBeenCalled();
    });
  });
});
