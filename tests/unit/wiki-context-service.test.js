const WikiContextService = require('../../lib/wiki-context-service');
const WikiManager = require('../../lib/wiki-manager');
const ClaudeClient = require('../../lib/claude');
const path = require('path');

// Mock dependencies
jest.mock('../../lib/wiki-manager');
jest.mock('../../lib/claude');

describe('WikiContextService', () => {
  let service;
  let mockClaudeClient;
  let mockWikiManager;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock Claude client
    mockClaudeClient = {
      sendMessage: jest.fn(),
      getCostSummary: jest.fn().mockReturnValue({
        totalTokens: 0,
        totalCost: 0,
        requestCount: 0
      }),
      resetCost: jest.fn()
    };

    // Create service with mocked Claude client
    service = new WikiContextService({
      wikiBasePath: './test-wikis',
      claudeClient: mockClaudeClient
    });
  });

  describe('constructor', () => {
    it('should initialize with default wiki base path', () => {
      const defaultService = new WikiContextService();
      expect(defaultService.wikiBasePath).toBe('./wikis');
    });

    it('should accept custom wiki base path', () => {
      const customService = new WikiContextService({ wikiBasePath: '/custom/path' });
      expect(customService.wikiBasePath).toBe('/custom/path');
    });

    it('should create ClaudeClient if not provided', () => {
      const defaultService = new WikiContextService();
      expect(defaultService.claudeClient).toBeDefined();
    });

    it('should use provided ClaudeClient', () => {
      expect(service.claudeClient).toBe(mockClaudeClient);
    });
  });

  describe('research', () => {
    beforeEach(() => {
      // Mock WikiManager constructor
      WikiManager.mockImplementation(function(wikiPath) {
        this.wikiPath = wikiPath;
        this.getAllPages = jest.fn().mockResolvedValue([
          {
            path: 'concepts/architecture.md',
            metadata: {
              title: 'Architecture Overview',
              category: 'concept'
            }
          },
          {
            path: 'guides/getting-started.md',
            metadata: {
              title: 'Getting Started',
              category: 'guide'
            }
          }
        ]);
      });

      // Mock file system for reading page content
      jest.mock('fs', () => ({
        promises: {
          readFile: jest.fn()
        }
      }));

      const fs = require('fs').promises;
      jest.spyOn(fs, 'readFile').mockImplementation((filePath) => {
        if (filePath.includes('architecture.md')) {
          return Promise.resolve(`---
title: Architecture Overview
category: concept
---

# Architecture

This describes the system architecture with modular components.`);
        } else if (filePath.includes('getting-started.md')) {
          return Promise.resolve(`---
title: Getting Started
category: guide
---

# Getting Started

Follow these steps to set up the project.`);
        }
        return Promise.reject(new Error('File not found'));
      });

      // Mock Claude response
      const mockAIResponse = JSON.stringify({
        relevantPages: [
          {
            path: 'concepts/architecture.md',
            title: 'Architecture Overview',
            relevance: 'Contains information about system architecture',
            excerpt: 'This describes the system architecture with modular components.'
          }
        ],
        context: {
          summary: 'The architecture follows a modular pattern with clear separation of concerns.',
          keyComponents: [
            {
              name: 'ModuleSystem',
              purpose: 'Manages component lifecycle',
              location: 'lib/module-system.js'
            }
          ],
          keyConcepts: [
            {
              concept: 'Modularity',
              description: 'System is divided into independent modules',
              application: 'Apply this by creating separate modules for each feature'
            }
          ],
          implementationGuidance: [
            'Review the architecture document',
            'Identify the appropriate module',
            'Implement following existing patterns'
          ],
          relatedFiles: [
            'lib/module-system.js',
            'lib/core/loader.js'
          ]
        }
      });

      mockClaudeClient.sendMessage.mockResolvedValue(mockAIResponse);
    });

    it('should validate query parameter', async () => {
      await expect(service.research('', 'test-project')).rejects.toThrow('Query must be a non-empty string');
      await expect(service.research(null, 'test-project')).rejects.toThrow('Query must be a non-empty string');
      await expect(service.research(123, 'test-project')).rejects.toThrow('Query must be a non-empty string');
    });

    it('should validate project name parameter', async () => {
      await expect(service.research('test query', '')).rejects.toThrow('Project name must be a non-empty string');
      await expect(service.research('test query', null)).rejects.toThrow('Project name must be a non-empty string');
      await expect(service.research('test query', 123)).rejects.toThrow('Project name must be a non-empty string');
    });

    it('should throw error if no wiki pages found', async () => {
      WikiManager.mockImplementation(function(wikiPath) {
        this.wikiPath = wikiPath;
        this.getAllPages = jest.fn().mockResolvedValue([]);
      });

      await expect(service.research('test query', 'empty-project')).rejects.toThrow('No wiki pages found');
    });

    it('should successfully research and return structured results', async () => {
      const results = await service.research('add new module', 'test-project');

      expect(results).toBeDefined();
      expect(results.summary).toBeDefined();
      expect(results.relevantPages).toBeDefined();
      expect(results.keyComponents).toBeDefined();
      expect(results.keyConcepts).toBeDefined();
      expect(results.implementationGuidance).toBeDefined();
      expect(results.relatedFiles).toBeDefined();
    });

    it('should call Claude API with proper prompt', async () => {
      await service.research('implement authentication', 'test-project');

      expect(mockClaudeClient.sendMessage).toHaveBeenCalledTimes(1);
      expect(mockClaudeClient.sendMessage).toHaveBeenCalledWith(
        expect.stringContaining('implement authentication'),
        expect.objectContaining({
          model: 'claude-sonnet-4-20250514',
          maxTokens: 4000
        })
      );
    });

    it('should limit relevant pages to top 5', async () => {
      const mockResponseWithManyPages = JSON.stringify({
        relevantPages: Array(10).fill(null).map((_, i) => ({
          path: `page${i}.md`,
          title: `Page ${i}`,
          relevance: 'Relevant',
          excerpt: 'Content'
        })),
        context: {
          summary: 'Summary',
          keyComponents: [],
          keyConcepts: [],
          implementationGuidance: [],
          relatedFiles: []
        }
      });

      mockClaudeClient.sendMessage.mockResolvedValue(mockResponseWithManyPages);

      const results = await service.research('test query', 'test-project');

      expect(results.relevantPages).toHaveLength(5);
    });

    it('should handle Claude API errors gracefully', async () => {
      mockClaudeClient.sendMessage.mockRejectedValue(new Error('API rate limit'));

      await expect(service.research('test query', 'test-project')).rejects.toThrow('Failed to analyze wiki content');
    });

    it('should handle malformed JSON responses', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue('Not valid JSON {{{');

      await expect(service.research('test query', 'test-project')).rejects.toThrow('Could not parse research results');
    });

    it('should extract JSON from markdown code blocks', async () => {
      const jsonData = {
        relevantPages: [],
        context: {
          summary: 'Test summary',
          keyComponents: [],
          keyConcepts: [],
          implementationGuidance: [],
          relatedFiles: []
        }
      };

      mockClaudeClient.sendMessage.mockResolvedValue('```json\n' + JSON.stringify(jsonData) + '\n```');

      const results = await service.research('test query', 'test-project');

      expect(results.summary).toBe('Test summary');
    });

    it('should include metadata in results', async () => {
      const results = await service.research('test query', 'test-project');

      expect(results.metadata).toBeDefined();
      expect(results.metadata.pageCount).toBeDefined();
      expect(results.metadata.timestamp).toBeDefined();
      expect(new Date(results.metadata.timestamp)).toBeInstanceOf(Date);
    });

    it('should handle pages with missing metadata gracefully', async () => {
      WikiManager.mockImplementation(function(wikiPath) {
        this.wikiPath = wikiPath;
        this.getAllPages = jest.fn().mockResolvedValue([
          {
            path: 'no-metadata.md',
            metadata: {}
          }
        ]);
      });

      const fs = require('fs').promises;
      jest.spyOn(fs, 'readFile').mockResolvedValue('# Just content\n\nNo frontmatter here.');

      const results = await service.research('test query', 'test-project');

      expect(results).toBeDefined();
    });
  });

  describe('_parseFrontmatter', () => {
    it('should parse YAML-like frontmatter', () => {
      const content = `---
title: Test Page
category: concept
created: 2025-11-22
related: [Page 1, Page 2]
---

# Content here`;

      const result = service._parseFrontmatter(content);

      expect(result.metadata).toEqual({
        title: 'Test Page',
        category: 'concept',
        created: '2025-11-22',
        related: ['Page 1', 'Page 2']
      });
      expect(result.content).toBe('# Content here');
    });

    it('should handle content without frontmatter', () => {
      const content = '# Just content';

      const result = service._parseFrontmatter(content);

      expect(result.metadata).toEqual({});
      expect(result.content).toBe(content);
    });

    it('should parse arrays in frontmatter', () => {
      const content = `---
tags: [javascript, node, testing]
---

Content`;

      const result = service._parseFrontmatter(content);

      expect(result.metadata.tags).toEqual(['javascript', 'node', 'testing']);
    });
  });

  describe('_getTitleFromPath', () => {
    it('should extract title from kebab-case filename', () => {
      const title = service._getTitleFromPath('my-awesome-component.md');
      expect(title).toBe('My Awesome Component');
    });

    it('should handle single word filenames', () => {
      const title = service._getTitleFromPath('index.md');
      expect(title).toBe('Index');
    });

    it('should handle paths with directories', () => {
      const title = service._getTitleFromPath('concepts/architecture-overview.md');
      expect(title).toBe('Architecture Overview');
    });
  });

  describe('_inferCategory', () => {
    it('should infer category from path', () => {
      expect(service._inferCategory('concepts/architecture.md')).toBe('concept');
      expect(service._inferCategory('components/auth-module.md')).toBe('component');
      expect(service._inferCategory('guides/getting-started.md')).toBe('guide');
      expect(service._inferCategory('meta/philosophy.md')).toBe('meta');
      expect(service._inferCategory('history/changelog.md')).toBe('history');
      expect(service._inferCategory('other-file.md')).toBe('other');
    });
  });

  describe('getStatistics', () => {
    it('should return cost summary from Claude client', () => {
      mockClaudeClient.getCostSummary.mockReturnValue({
        totalTokens: 1500,
        totalCost: 0.045,
        requestCount: 3
      });

      const stats = service.getStatistics();

      expect(stats.totalTokens).toBe(1500);
      expect(stats.totalCost).toBe(0.045);
      expect(stats.requestCount).toBe(3);
    });
  });

  describe('resetStatistics', () => {
    it('should reset Claude client cost tracking', () => {
      service.resetStatistics();

      expect(mockClaudeClient.resetCost).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      WikiManager.mockImplementation(function(wikiPath) {
        this.wikiPath = wikiPath;
        this.getAllPages = jest.fn().mockResolvedValue([
          {
            path: 'test.md',
            metadata: { title: 'Test' }
          }
        ]);
      });

      const fs = require('fs').promises;
      jest.spyOn(fs, 'readFile').mockResolvedValue(`---
title: Test
---

Content`);
    });

    it('should throw error with helpful message on API failure', async () => {
      mockClaudeClient.sendMessage.mockRejectedValue(new Error('Network timeout'));

      await expect(service.research('query', 'project'))
        .rejects.toThrow('Failed to analyze wiki content: Network timeout');
    });

    it('should handle invalid response structure', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue(JSON.stringify({
        wrongStructure: true
      }));

      await expect(service.research('query', 'project'))
        .rejects.toThrow('Could not parse research results');
    });

    it('should handle missing context in response', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue(JSON.stringify({
        relevantPages: []
      }));

      await expect(service.research('query', 'project'))
        .rejects.toThrow('Missing or invalid context object');
    });

    it('should handle missing relevantPages in response', async () => {
      mockClaudeClient.sendMessage.mockResolvedValue(JSON.stringify({
        context: {
          summary: 'Test'
        }
      }));

      await expect(service.research('query', 'project'))
        .rejects.toThrow('Missing or invalid relevantPages array');
    });
  });

  describe('_formatResults', () => {
    it('should format results with all fields', () => {
      const rawResults = {
        relevantPages: [
          {
            path: 'test.md',
            title: 'Test',
            relevance: 'Very relevant',
            excerpt: 'Sample text'
          }
        ],
        context: {
          summary: 'This is a summary',
          keyComponents: [{ name: 'Comp', purpose: 'Purpose', location: 'lib/' }],
          keyConcepts: [{ concept: 'Concept', description: 'Desc', application: 'App' }],
          implementationGuidance: ['Step 1', 'Step 2'],
          relatedFiles: ['file1.js', 'file2.js']
        }
      };

      const formatted = service._formatResults(rawResults);

      expect(formatted.summary).toBe('This is a summary');
      expect(formatted.relevantPages).toHaveLength(1);
      expect(formatted.keyComponents).toHaveLength(1);
      expect(formatted.keyConcepts).toHaveLength(1);
      expect(formatted.implementationGuidance).toHaveLength(2);
      expect(formatted.relatedFiles).toHaveLength(2);
      expect(formatted.metadata).toBeDefined();
    });

    it('should handle missing optional fields', () => {
      const rawResults = {
        relevantPages: [],
        context: {
          summary: 'Summary only'
        }
      };

      const formatted = service._formatResults(rawResults);

      expect(formatted.summary).toBe('Summary only');
      expect(formatted.relevantPages).toEqual([]);
      expect(formatted.keyComponents).toEqual([]);
      expect(formatted.keyConcepts).toEqual([]);
      expect(formatted.implementationGuidance).toEqual([]);
      expect(formatted.relatedFiles).toEqual([]);
    });

    it('should provide default summary if missing', () => {
      const rawResults = {
        relevantPages: [],
        context: {}
      };

      const formatted = service._formatResults(rawResults);

      expect(formatted.summary).toBe('No summary available');
    });
  });
});
