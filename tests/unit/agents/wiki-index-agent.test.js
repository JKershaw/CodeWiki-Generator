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

    it('should fix HTML links with embedded markdown syntax in href', async () => {
      const htmlWithBadLinks = `
<h1>Test Wiki</h1>
<ul>
<li><a href="guides/[getting-started](guides/getting-started.md).md">Getting Started</a></li>
<li><a href="concepts/[architecture](concepts/architecture.md).md">Architecture</a></li>
</ul>`;

      mockClaudeClient.sendMessage.mockResolvedValue(htmlWithBadLinks);

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      // Should have clean markdown links without embedded markdown in href
      expect(result).toContain('[Getting Started](guides/getting-started.md)');
      expect(result).toContain('[Architecture](concepts/architecture.md)');

      // Should NOT contain the malformed HTML or double .md extensions
      expect(result).not.toContain('[getting-started](guides/getting-started.md).md');
      expect(result).not.toContain('[architecture](concepts/architecture.md).md');
      expect(result).not.toContain('<a href=');
    });

    it('should fix HTML links with embedded markdown syntax in text', async () => {
      const htmlWithBadLinks = `
<h1>Test Wiki</h1>
<ul>
<li><a href="guides/configuration.md">[Configuration](guides/configuration.md) Guide</a></li>
<li><a href="meta/specification.md">[Technical Specification](meta/specification.md)</a></li>
</ul>`;

      mockClaudeClient.sendMessage.mockResolvedValue(htmlWithBadLinks);

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      // Should extract clean text from markdown syntax in link text
      expect(result).toContain('[Configuration Guide](guides/configuration.md)');
      expect(result).toContain('[Technical Specification](meta/specification.md)');

      // Should NOT contain the markdown syntax in the text
      expect(result).not.toContain('[Configuration](guides/configuration.md) Guide');
      expect(result).not.toContain('<a href=');
    });

    it('should fix HTML links with embedded markdown in both href and text', async () => {
      const htmlWithBadLinks = `
<h1>Test Wiki</h1>
<ul>
<li><a href="concepts/[architecture](concepts/architecture.md).md">[Architecture](concepts/architecture.md) Overview</a></li>
</ul>`;

      mockClaudeClient.sendMessage.mockResolvedValue(htmlWithBadLinks);

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      // Should clean both href and text
      expect(result).toContain('[Architecture Overview](concepts/architecture.md)');

      // Should NOT contain any malformed syntax
      expect(result).not.toContain('[architecture](concepts/architecture.md).md');
      expect(result).not.toContain('.md.md');
      expect(result).not.toContain('<a href=');
    });

    it('should preserve normal HTML links without issues', async () => {
      const normalHtml = `
<h1>Test Wiki</h1>
<ul>
<li><a href="guides/getting-started.md">Getting Started</a></li>
<li><a href="concepts/architecture.md">Architecture Overview</a></li>
</ul>`;

      mockClaudeClient.sendMessage.mockResolvedValue(normalHtml);

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      // Should convert to clean markdown
      expect(result).toContain('[Getting Started](guides/getting-started.md)');
      expect(result).toContain('[Architecture Overview](concepts/architecture.md)');
      expect(result).not.toContain('<a href=');
    });

    it('should fix doubly-encoded links (HTML anchor wrapping markdown link)', async () => {
      // This is the actual pattern we saw in the generated index.md
      const doubleEncodedHtml = `
<h1>CodeWiki-Generator</h1>
<h2>Concepts</h2>
<ul>
<li><a href="concepts/activity-driven-event-system.md">[Activity-driven event system](../concepts/activity-driven-event-system.md)</a> - Event-based architecture</li>
<li><a href="concepts/architecture.md">Architecture</a> - Overall system architecture</li>
</ul>`;

      mockClaudeClient.sendMessage.mockResolvedValue(doubleEncodedHtml);

      const wikiData = {
        repositoryName: 'Test',
        pages: []
      };

      const result = await agent.generateIndex(wikiData);

      // Should produce clean markdown links without double encoding
      expect(result).toContain('[Activity-driven event system](concepts/activity-driven-event-system.md)');
      expect(result).toContain('[Architecture](concepts/architecture.md)');

      // Should NOT have HTML tags
      expect(result).not.toContain('<a href=');
      expect(result).not.toContain('<h1>');
      expect(result).not.toContain('<h2>');
      expect(result).not.toContain('<ul>');
      expect(result).not.toContain('<li>');

      // Should NOT have ../ in paths (relative to root)
      expect(result).not.toContain('../concepts/');

      // Should be proper markdown with no HTML
      expect(result).toMatch(/^# CodeWiki-Generator/m);
      expect(result).toMatch(/^## Concepts/m);
      expect(result).toMatch(/^- \[Activity-driven event system\]/m);
    });
  });
});
