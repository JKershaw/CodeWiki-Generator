const LinkDiscoveryAgent = require('../../../lib/agents/link-discovery-agent');

describe('LinkDiscoveryAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new LinkDiscoveryAgent();
  });

  describe('findMentions', () => {
    it('should find bold mentions', () => {
      const content = 'The **Agent-Based Architecture** is central to the system.';
      const allPages = [
        { title: 'Agent-Based Architecture', path: 'concepts/agent-based.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      expect(mentions.length).toBe(1);
      expect(mentions[0].originalText).toBe('**Agent-Based Architecture**');
      expect(mentions[0].targetPath).toBe('concepts/agent-based.md');
      expect(mentions[0].priority).toBe(1);
    });

    it('should find plain text mentions', () => {
      const content = 'The Agent-Based Architecture is central to the system.';
      const allPages = [
        { title: 'Agent-Based Architecture', path: 'concepts/agent-based.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      expect(mentions.length).toBe(1);
      expect(mentions[0].originalText).toBe('Agent-Based Architecture');
      expect(mentions[0].priority).toBe(2);
    });

    it('should be case-insensitive', () => {
      const content = 'The **agent-based architecture** is used here.';
      const allPages = [
        { title: 'Agent-Based Architecture', path: 'concepts/agent-based.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      expect(mentions.length).toBe(1);
      expect(mentions[0].titleText).toBe('agent-based architecture');
    });

    it('should find multiple mentions of same page', () => {
      const content = 'The **Testing Framework** uses the Testing Framework extensively.';
      const allPages = [
        { title: 'Testing Framework', path: 'components/testing.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      expect(mentions.length).toBe(2);
    });

    it('should find mentions of multiple pages', () => {
      const content = 'The **CodeAnalysis** uses the **MetaAnalysis** agent.';
      const allPages = [
        { title: 'CodeAnalysis', path: 'components/code-analysis.md' },
        { title: 'MetaAnalysis', path: 'components/meta-analysis.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      expect(mentions.length).toBe(2);
      expect(mentions.map(m => m.targetPath)).toContain('components/code-analysis.md');
      expect(mentions.map(m => m.targetPath)).toContain('components/meta-analysis.md');
    });

    it('should skip very short titles', () => {
      const content = 'The API is tested.';
      const allPages = [
        { title: 'API', path: 'concepts/api.md' } // Only 3 chars
      ];

      const mentions = agent.findMentions(content, allPages);

      expect(mentions.length).toBe(0);
    });

    it('should respect word boundaries', () => {
      const content = 'The TestRunner uses Test data.';
      const allPages = [
        { title: 'Test', path: 'concepts/test.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      // Should match "Test" but not "Test" in "TestRunner"
      expect(mentions.length).toBe(1);
      expect(mentions[0].originalText).toBe('Test');
    });

    it('should handle pages with missing titles gracefully', () => {
      const content = 'Some content here.';
      const allPages = [
        { path: 'concepts/untitled.md' }, // No title
        { title: 'Valid Page', path: 'concepts/valid.md' }
      ];

      // Should not crash
      const mentions = agent.findMentions(content, allPages);
      expect(Array.isArray(mentions)).toBe(true);
    });

    it('should skip mentions inside existing links', () => {
      const content = 'See [Agent-Based Architecture](path.md) for details.';
      const allPages = [
        { title: 'Agent-Based Architecture', path: 'concepts/agent-based.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      // Should skip the mention inside the link
      expect(mentions.length).toBe(0);
    });

    it('should deduplicate overlapping mentions', () => {
      const content = 'The **Agent** system uses Agent patterns.';
      const allPages = [
        { title: 'Agent', path: 'concepts/agent.md' }
      ];

      const mentions = agent.findMentions(content, allPages);

      // Should have bold mention and plain mention, but not overlapping
      expect(mentions.length).toBe(2);
      expect(mentions[0].priority).toBe(1); // Bold first
    });
  });

  describe('findRelatedPages', () => {
    it('should find related pages based on mentions', () => {
      const content = 'The **CodeAnalysis** agent works with the **MetaAnalysis** agent.';
      const currentPath = 'concepts/architecture.md';
      const allPages = [
        { title: 'CodeAnalysis', path: 'components/code-analysis.md' },
        { title: 'MetaAnalysis', path: 'components/meta-analysis.md' },
        { title: 'Architecture', path: 'concepts/architecture.md' }
      ];

      const related = agent.findRelatedPages(content, currentPath, allPages);

      expect(related).toContain('components/code-analysis.md');
      expect(related).toContain('components/meta-analysis.md');
      expect(related).not.toContain('concepts/architecture.md'); // Self-reference excluded
    });

    it('should exclude self-references', () => {
      const content = 'The **Testing** framework uses Testing extensively.';
      const currentPath = 'components/testing.md';
      const allPages = [
        { title: 'Testing', path: 'components/testing.md' }
      ];

      const related = agent.findRelatedPages(content, currentPath, allPages);

      expect(related.length).toBe(0);
    });

    it('should limit to 5 related pages', () => {
      const content = 'Using PageA, PageB, PageC, PageD, PageE, PageF, and PageG.';
      const currentPath = 'index.md';
      const allPages = [
        { title: 'PageA', path: 'a.md' },
        { title: 'PageB', path: 'b.md' },
        { title: 'PageC', path: 'c.md' },
        { title: 'PageD', path: 'd.md' },
        { title: 'PageE', path: 'e.md' },
        { title: 'PageF', path: 'f.md' },
        { title: 'PageG', path: 'g.md' }
      ];

      const related = agent.findRelatedPages(content, currentPath, allPages);

      expect(related.length).toBe(5);
    });

    it('should prioritize most-mentioned pages', () => {
      const content = 'Agent A is used. Agent B is rarely used. Agent A is great. Agent A works well.';
      const currentPath = 'index.md';
      const allPages = [
        { title: 'Agent A', path: 'a.md' },
        { title: 'Agent B', path: 'b.md' }
      ];

      const related = agent.findRelatedPages(content, currentPath, allPages);

      expect(related[0]).toBe('a.md'); // Agent A mentioned 3 times
      expect(related[1]).toBe('b.md'); // Agent B mentioned 1 time
    });

    it('should return empty array when no related pages found', () => {
      const content = 'Some generic content with no mentions.';
      const currentPath = 'index.md';
      const allPages = [
        { title: 'Unrelated Page', path: 'unrelated.md' }
      ];

      const related = agent.findRelatedPages(content, currentPath, allPages);

      expect(related).toEqual([]);
    });
  });

  describe('_escapeRegex', () => {
    it('should escape special regex characters', () => {
      const escaped = agent._escapeRegex('Test (with) special [chars]');

      expect(escaped).toBe('Test \\(with\\) special \\[chars\\]');
    });
  });

  describe('_isInsideMarkup', () => {
    it('should detect position inside bold', () => {
      const content = 'Before **inside bold** after';
      const position = content.indexOf('inside');

      const result = agent._isInsideMarkup(content, position);

      expect(result).toBe(true);
    });

    it('should detect position inside link', () => {
      const content = 'Before [inside link](path) after';
      const position = content.indexOf('inside');

      const result = agent._isInsideMarkup(content, position);

      expect(result).toBe(true);
    });

    it('should detect position inside code', () => {
      const content = 'Before `inside code` after';
      const position = content.indexOf('inside');

      const result = agent._isInsideMarkup(content, position);

      expect(result).toBe(true);
    });

    it('should return false for position outside markup', () => {
      const content = 'Plain text here';
      const position = content.indexOf('text');

      const result = agent._isInsideMarkup(content, position);

      expect(result).toBe(false);
    });
  });
});
