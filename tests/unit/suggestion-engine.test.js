const SuggestionEngine = require('../../lib/suggestion-engine');
const WikiManager = require('../../lib/wiki-manager');
const fs = require('fs').promises;
const path = require('path');

jest.mock('../../lib/wiki-manager');

describe('SuggestionEngine', () => {
  let engine;
  let mockWikiManager;

  beforeEach(() => {
    jest.clearAllMocks();
    engine = new SuggestionEngine('./wikis');
    mockWikiManager = new WikiManager();
  });

  describe('generateSuggestions', () => {
    it('should detect short pages', async () => {
      const mockPages = [
        { path: 'concepts/short.md' }
      ];

      const mockPage = {
        path: 'concepts/short.md',
        metadata: { title: 'Short Page', tags: ['test'] },
        content: '<p>This is a very short page with less than 200 words.</p>'
      };

      mockWikiManager.getAllPages.mockResolvedValue(mockPages);
      mockWikiManager.getPage.mockResolvedValue(mockPage);

      engine.getProjectWikiManager = jest.fn().mockReturnValue(mockWikiManager);
      jest.spyOn(fs, 'mkdir').mockResolvedValue();
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      const result = await engine.generateSuggestions('test-project');

      expect(result.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'short-page',
            affectedPages: ['concepts/short.md']
          })
        ])
      );
    });

    it('should detect pages without related pages', async () => {
      const mockPages = [
        { path: 'concepts/page.md' }
      ];

      const mockPage = {
        path: 'concepts/page.md',
        metadata: { title: 'Page Without Related', tags: ['test'] },
        content: '<p>' + 'word '.repeat(250) + '</p>' // More than 200 words
      };

      mockWikiManager.getAllPages.mockResolvedValue(mockPages);
      mockWikiManager.getPage.mockResolvedValue(mockPage);

      engine.getProjectWikiManager = jest.fn().mockReturnValue(mockWikiManager);
      jest.spyOn(fs, 'mkdir').mockResolvedValue();
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      const result = await engine.generateSuggestions('test-project');

      expect(result.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'missing-related',
            affectedPages: ['concepts/page.md']
          })
        ])
      );
    });

    it('should detect pages without tags', async () => {
      const mockPages = [
        { path: 'concepts/page.md' }
      ];

      const mockPage = {
        path: 'concepts/page.md',
        metadata: { title: 'Page Without Tags', related: ['other.md'] },
        content: '<p>' + 'word '.repeat(250) + '</p>'
      };

      mockWikiManager.getAllPages.mockResolvedValue(mockPages);
      mockWikiManager.getPage.mockResolvedValue(mockPage);

      engine.getProjectWikiManager = jest.fn().mockReturnValue(mockWikiManager);
      jest.spyOn(fs, 'mkdir').mockResolvedValue();
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      const result = await engine.generateSuggestions('test-project');

      expect(result.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'missing-tags',
            affectedPages: ['concepts/page.md']
          })
        ])
      );
    });

    it('should calculate statistics correctly', async () => {
      const mockPages = [
        { path: 'concepts/short.md' },
        { path: 'concepts/normal.md' }
      ];

      const shortPage = {
        path: 'concepts/short.md',
        metadata: { title: 'Short Page' },
        content: '<p>Short content.</p>'
      };

      const normalPage = {
        path: 'concepts/normal.md',
        metadata: { title: 'Normal Page', tags: ['test'], related: ['other.md'] },
        content: '<p>' + 'word '.repeat(250) + '</p>'
      };

      mockWikiManager.getAllPages.mockResolvedValue(mockPages);
      mockWikiManager.getPage.mockImplementation((path) => {
        if (path === 'concepts/short.md') return Promise.resolve(shortPage);
        if (path === 'concepts/normal.md') return Promise.resolve(normalPage);
        return Promise.resolve(null);
      });

      engine.getProjectWikiManager = jest.fn().mockReturnValue(mockWikiManager);
      jest.spyOn(fs, 'mkdir').mockResolvedValue();
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      const result = await engine.generateSuggestions('test-project');

      expect(result.statistics).toBeDefined();
      expect(result.statistics.total).toBeGreaterThan(0);
      expect(result.statistics.byStatus.pending).toBe(result.statistics.total);
      expect(result.statistics.byType).toBeDefined();
    });
  });

  describe('getSuggestions', () => {
    it('should return empty array if no suggestions file exists', async () => {
      jest.spyOn(fs, 'readFile').mockRejectedValue({ code: 'ENOENT' });

      const result = await engine.getSuggestions('test-project');

      expect(result.suggestions).toEqual([]);
      expect(result.statistics.total).toBe(0);
    });

    it('should load suggestions from file', async () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          type: 'short-page',
          title: 'Short Page',
          status: 'pending',
          priority: 'medium'
        }
      ];

      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockSuggestions));

      const result = await engine.getSuggestions('test-project');

      expect(result.suggestions).toEqual(mockSuggestions);
      expect(result.statistics.total).toBe(1);
    });
  });

  describe('applySuggestion', () => {
    it('should mark suggestion as applied', async () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          type: 'short-page',
          status: 'pending'
        }
      ];

      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockSuggestions));
      fs.mkdir = jest.fn().mockResolvedValue();
      fs.writeFile = jest.fn().mockResolvedValue();

      const result = await engine.applySuggestion('test-project', 'suggestion-1');

      expect(result.status).toBe('applied');
      expect(result.appliedAt).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw error if suggestion not found', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([]));

      await expect(engine.applySuggestion('test-project', 'non-existent'))
        .rejects.toThrow('Suggestion non-existent not found');
    });
  });

  describe('dismissSuggestion', () => {
    it('should mark suggestion as dismissed', async () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          type: 'short-page',
          status: 'pending'
        }
      ];

      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockSuggestions));
      jest.spyOn(fs, 'mkdir').mockResolvedValue();
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      const result = await engine.dismissSuggestion('test-project', 'suggestion-1');

      expect(result.status).toBe('dismissed');
      expect(result.dismissedAt).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw error if suggestion not found', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([]));

      await expect(engine.dismissSuggestion('test-project', 'non-existent'))
        .rejects.toThrow('Suggestion non-existent not found');
    });
  });

  describe('findOrphanedPages', () => {
    it('should identify pages with no incoming links', async () => {
      const allPages = [
        { path: 'index.md' },
        { path: 'concepts/linked.md' },
        { path: 'concepts/orphan.md' }
      ];

      const indexPage = {
        path: 'index.md',
        metadata: {},
        content: '[Linked Page](concepts/linked.md)'
      };

      const linkedPage = {
        path: 'concepts/linked.md',
        metadata: {},
        content: 'This is linked from index'
      };

      const orphanPage = {
        path: 'concepts/orphan.md',
        metadata: {},
        content: 'No one links to me'
      };

      mockWikiManager.getPage.mockImplementation((path) => {
        if (path === 'index.md') return Promise.resolve(indexPage);
        if (path === 'concepts/linked.md') return Promise.resolve(linkedPage);
        if (path === 'concepts/orphan.md') return Promise.resolve(orphanPage);
        return Promise.resolve(null);
      });

      const orphans = await engine.findOrphanedPages(allPages, mockWikiManager);

      expect(orphans).toContainEqual({ path: 'concepts/orphan.md' });
      expect(orphans).not.toContainEqual({ path: 'concepts/linked.md' });
    });
  });

  describe('findBrokenLinks', () => {
    it('should identify broken internal links', async () => {
      const allPages = [
        { path: 'concepts/page1.md' },
        { path: 'concepts/page2.md' }
      ];

      const page1 = {
        path: 'concepts/page1.md',
        metadata: {},
        content: '[Valid Link](concepts/page2.md) [Broken Link](concepts/missing.md)'
      };

      const page2 = {
        path: 'concepts/page2.md',
        metadata: {},
        content: 'Valid page'
      };

      mockWikiManager.getPage.mockImplementation((path) => {
        if (path === 'concepts/page1.md') return Promise.resolve(page1);
        if (path === 'concepts/page2.md') return Promise.resolve(page2);
        return Promise.resolve(null);
      });

      const brokenLinks = await engine.findBrokenLinks(allPages, mockWikiManager);

      expect(brokenLinks).toContainEqual(
        expect.objectContaining({
          sourcePage: 'concepts/page1.md',
          targetPath: 'concepts/missing.md'
        })
      );
    });

    it('should skip external links', async () => {
      const allPages = [
        { path: 'concepts/page.md' }
      ];

      const page = {
        path: 'concepts/page.md',
        metadata: {},
        content: '[External Link](https://example.com)'
      };

      mockWikiManager.getPage.mockResolvedValue(page);

      const brokenLinks = await engine.findBrokenLinks(allPages, mockWikiManager);

      expect(brokenLinks).toEqual([]);
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate statistics for empty suggestions', () => {
      const stats = engine.calculateStatistics([]);

      expect(stats.total).toBe(0);
      expect(stats.byStatus.pending).toBe(0);
      expect(stats.byPriority.high).toBe(0);
    });

    it('should calculate statistics for multiple suggestions', () => {
      const suggestions = [
        { type: 'short-page', status: 'pending', priority: 'high' },
        { type: 'short-page', status: 'applied', priority: 'medium' },
        { type: 'orphaned-page', status: 'pending', priority: 'low' }
      ];

      const stats = engine.calculateStatistics(suggestions);

      expect(stats.total).toBe(3);
      expect(stats.byStatus.pending).toBe(2);
      expect(stats.byStatus.applied).toBe(1);
      expect(stats.byType['short-page']).toBe(2);
      expect(stats.byType['orphaned-page']).toBe(1);
      expect(stats.byPriority.high).toBe(1);
      expect(stats.byPriority.medium).toBe(1);
      expect(stats.byPriority.low).toBe(1);
    });
  });
});
