const MCPServer = require('../../mcp-server');
const WikiContextAgent = require('../../lib/agents/wiki-context-agent');

// Mock WikiContextAgent
jest.mock('../../lib/agents/wiki-context-agent');

describe('MCPServer with WikiContextAgent', () => {
  let server;
  let mockAgent;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock agent instance
    mockAgent = {
      research: jest.fn()
    };
    WikiContextAgent.mockImplementation(() => mockAgent);

    // Create server instance
    server = new MCPServer('./wikis/codewiki-generator');
  });

  describe('initialization', () => {
    it('should create WikiContextAgent with correct wiki path', () => {
      const path = require('path');
      const expectedPath = path.resolve('./wikis/codewiki-generator');
      expect(WikiContextAgent).toHaveBeenCalledWith(expectedPath);
    });

    it('should have contextAgent property', () => {
      expect(server.contextAgent).toBe(mockAgent);
    });
  });

  describe('queryWiki', () => {
    it('should call WikiContextAgent.research with query', async () => {
      // Setup mock response
      mockAgent.research.mockResolvedValue({
        finalContext: 'This is synthesized guidance for implementing a feature.',
        pagesRead: [
          { title: 'Architecture', path: 'concepts/architecture.md' },
          { title: 'Getting Started', path: 'guides/getting-started.md' }
        ],
        iterationCount: 2,
        cost: 0.015
      });

      // Call queryWiki
      const result = await server.queryWiki({
        query: 'How do I implement a new feature?',
        maxResults: 5
      });

      // Verify WikiContextAgent.research was called correctly
      expect(mockAgent.research).toHaveBeenCalledWith(
        'How do I implement a new feature?',
        { maxIterations: 3 }
      );

      // Verify result structure
      expect(result).toHaveProperty('content');
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.isError).toBe(false);
    });

    it('should format agentic response with guidance section', async () => {
      mockAgent.research.mockResolvedValue({
        finalContext: 'Step 1: Read the architecture guide.\nStep 2: Follow the pattern.',
        pagesRead: [
          { title: 'Architecture', path: 'concepts/architecture.md' }
        ],
        iterationCount: 2,
        cost: 0.012
      });

      const result = await server.queryWiki({
        query: 'test query'
      });

      const responseText = result.content[0].text;

      // Should include guidance section
      expect(responseText).toContain('## Guidance');
      expect(responseText).toContain('Step 1: Read the architecture guide.');
      expect(responseText).toContain('Step 2: Follow the pattern.');
    });

    it('should include pages analyzed section', async () => {
      mockAgent.research.mockResolvedValue({
        finalContext: 'Guidance text',
        pagesRead: [
          { title: 'Architecture', path: 'concepts/architecture.md' },
          { title: 'Getting Started', path: 'guides/getting-started.md' }
        ],
        iterationCount: 2,
        cost: 0.015
      });

      const result = await server.queryWiki({
        query: 'test query'
      });

      const responseText = result.content[0].text;

      // Should include pages analyzed section
      expect(responseText).toContain('## Pages Analyzed');
      expect(responseText).toContain('**Architecture**');
      expect(responseText).toContain('`concepts/architecture.md`');
      expect(responseText).toContain('**Getting Started**');
      expect(responseText).toContain('`guides/getting-started.md`');
    });

    it('should include research stats section', async () => {
      mockAgent.research.mockResolvedValue({
        finalContext: 'Guidance text',
        pagesRead: [
          { title: 'Architecture', path: 'concepts/architecture.md' }
        ],
        iterationCount: 3,
        cost: 0.0125
      });

      const result = await server.queryWiki({
        query: 'test query'
      });

      const responseText = result.content[0].text;

      // Should include stats section
      expect(responseText).toContain('## Research Stats');
      expect(responseText).toContain('Iterations: 3');
      expect(responseText).toContain('Pages read: 1');
      expect(responseText).toContain('Cost: $0.0125');
    });

    it('should handle empty pagesRead array', async () => {
      mockAgent.research.mockResolvedValue({
        finalContext: 'Guidance text',
        pagesRead: [],
        iterationCount: 1,
        cost: 0.005
      });

      const result = await server.queryWiki({
        query: 'test query'
      });

      const responseText = result.content[0].text;

      // Should show 0 pages read
      expect(responseText).toContain('Pages read: 0');
      // Should not have pages analyzed section
      expect(responseText).not.toContain('## Pages Analyzed');
    });

    it('should pass maxIterations: 3 for quick MCP responses', async () => {
      mockAgent.research.mockResolvedValue({
        finalContext: 'Quick guidance',
        pagesRead: [],
        iterationCount: 1,
        cost: 0.005
      });

      await server.queryWiki({
        query: 'test query',
        maxResults: 10
      });

      // Verify maxIterations is set to 3 (not 10, which is maxResults)
      expect(mockAgent.research).toHaveBeenCalledWith(
        'test query',
        { maxIterations: 3 }
      );
    });

    it('should handle missing cost gracefully', async () => {
      mockAgent.research.mockResolvedValue({
        finalContext: 'Guidance text',
        pagesRead: [],
        iterationCount: 1
        // cost is undefined
      });

      const result = await server.queryWiki({
        query: 'test query'
      });

      const responseText = result.content[0].text;

      // Should show $0.0000 instead of crashing
      expect(responseText).toContain('Cost: $0.0000');
    });
  });

  describe('formatAgenticResponse', () => {
    it('should format response with all sections', () => {
      const results = {
        finalContext: 'This is the guidance.',
        pagesRead: [
          { title: 'Page 1', path: 'concepts/page1.md' },
          { title: 'Page 2', path: 'guides/page2.md' }
        ],
        iterationCount: 2,
        cost: 0.015
      };

      const formatted = server.formatAgenticResponse('test query', results);

      expect(formatted).toContain('# Wiki Context for: "test query"');
      expect(formatted).toContain('## Guidance');
      expect(formatted).toContain('This is the guidance.');
      expect(formatted).toContain('## Pages Analyzed');
      expect(formatted).toContain('**Page 1**');
      expect(formatted).toContain('**Page 2**');
      expect(formatted).toContain('## Research Stats');
      expect(formatted).toContain('Iterations: 2');
      expect(formatted).toContain('Pages read: 2');
      expect(formatted).toContain('Cost: $0.0150');
    });

    it('should handle minimal results', () => {
      const results = {
        finalContext: 'Minimal guidance',
        pagesRead: [],
        iterationCount: 1,
        cost: 0
      };

      const formatted = server.formatAgenticResponse('query', results);

      expect(formatted).toContain('# Wiki Context for: "query"');
      expect(formatted).toContain('Minimal guidance');
      expect(formatted).toContain('Iterations: 1');
      expect(formatted).toContain('Pages read: 0');
    });
  });
});
