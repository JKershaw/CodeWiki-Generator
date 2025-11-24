const DocumentationWriterAgent = require('../../../lib/agents/documentation-writer-agent');
const ClaudeClient = require('../../../lib/claude');
const PromptManager = require('../../../lib/prompts');

describe('DocumentationWriterAgent', () => {
  let agent;
  let mockClaudeClient;

  beforeEach(() => {
    // Create mock Claude client
    mockClaudeClient = {
      sendMessage: jest.fn()
    };

    agent = new DocumentationWriterAgent();
    agent.claudeClient = mockClaudeClient;
  });

  describe('writeDocumentation', () => {
    it('should generate markdown documentation from analysis', async () => {
      const mockDoc = `## Overview
This is a test component.

## Key Functionality
- Feature 1
- Feature 2`;

      mockClaudeClient.sendMessage.mockResolvedValue(mockDoc);

      const conceptName = 'Authentication System';
      const codeAnalysis = {
        concepts: ['Auth', 'Security'],
        codeElements: [{ name: 'AuthService', type: 'class', purpose: 'Handle auth' }]
      };

      const result = await agent.writeDocumentation(conceptName, codeAnalysis);

      expect(result).toBe(mockDoc);
      expect(result).toContain('## Overview');
    });

    it('should pass concept name and code analysis to prompt', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Documentation');

      const conceptName = 'TestConcept';
      const codeAnalysis = { concepts: ['A', 'B'] };

      await agent.writeDocumentation(conceptName, codeAnalysis);

      const promptCall = mockClaudeClient.sendMessage.mock.calls[0][0];
      expect(promptCall).toContain('TestConcept');
      expect(promptCall).toContain('"concepts"');
    });

    it('should handle existing content for updates', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Updated Docs');

      const conceptName = 'Existing';
      const codeAnalysis = { concepts: [] };
      const existingContent = '# Old Documentation\nOld content here.';

      await agent.writeDocumentation(conceptName, codeAnalysis, existingContent);

      const promptCall = mockClaudeClient.sendMessage.mock.calls[0][0];
      expect(promptCall).toContain('Old content');
    });

    it('should handle empty existing content', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# New Docs');

      await agent.writeDocumentation('New', { concepts: [] }, '');

      const promptCall = mockClaudeClient.sendMessage.mock.calls[0][0];
      expect(promptCall).toBeDefined();
    });

    it('should stringify code analysis object', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Docs');

      const analysis = {
        concepts: ['Auth'],
        codeElements: [{ name: 'Service', type: 'class' }],
        relationships: ['uses Database']
      };

      await agent.writeDocumentation('Test', analysis);

      const promptCall = mockClaudeClient.sendMessage.mock.calls[0][0];
      // Should include the analysis data
      expect(promptCall).toContain('Auth');
      expect(promptCall).toContain('Service');
    });

    it('should use appropriate model and token limits', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('# Docs');

      await agent.writeDocumentation('Test', { concepts: [] });

      const options = mockClaudeClient.sendMessage.mock.calls[0][1];
      // Model is now set by config, not hardcoded by agent
      expect(options.maxTokens).toBe(3000);
    });

    it('should handle API errors gracefully', async () => {
      mockClaudeClient.sendMessage.mockRejectedValue(new Error('API Error'));

      await expect(
        agent.writeDocumentation('Test', { concepts: [] })
      ).rejects.toThrow('API Error');
    });

    it('should return markdown without code block wrappers', async () => {
      // Claude might wrap markdown in ```markdown blocks
      const wrappedDoc = '```markdown\n## Header\nContent\n```';
      mockClaudeClient.sendMessage.mockResolvedValue(wrappedDoc);

      const result = await agent.writeDocumentation('Test', { concepts: [] });

      expect(result).not.toContain('```markdown');
      expect(result).toContain('## Header');
      expect(result).toContain('Content');
    });
  });

  describe('sanitizeMarkdown', () => {
    it('should remove markdown code block wrappers', () => {
      const wrapped = '```markdown\n# Title\nContent\n```';
      const result = agent.sanitizeMarkdown(wrapped);

      expect(result).toBe('# Title\nContent');
    });

    it('should remove plain code block wrappers', () => {
      const wrapped = '```\n# Title\nContent\n```';
      const result = agent.sanitizeMarkdown(wrapped);

      expect(result).toBe('# Title\nContent');
    });

    it('should handle content without wrappers', () => {
      const plain = '# Title\nContent';
      const result = agent.sanitizeMarkdown(plain);

      expect(result).toBe('# Title\nContent');
    });

    it('should trim whitespace', () => {
      const content = '  \n# Title\n\n\n  ';
      const result = agent.sanitizeMarkdown(content);

      expect(result).toBe('# Title');
    });

    it('should preserve code blocks within content', () => {
      const content = '# Docs\n\nExample:\n```js\ncode here\n```';
      const result = agent.sanitizeMarkdown(content);

      expect(result).toContain('```js');
      expect(result).toContain('code here');
    });
  });
});
