const WikiManager = require('../../lib/wiki-manager');
const fs = require('fs').promises;
const path = require('path');

describe('WikiManager', () => {
  let wikiManager;
  let testDir;

  beforeEach(() => {
    testDir = path.join(__dirname, '../fixtures/test-wiki');
    wikiManager = new WikiManager(testDir);
  });

  describe('getPage', () => {
    it('should read a markdown file with frontmatter', async () => {
      const page = await wikiManager.getPage('test-page.md');

      expect(page).toBeDefined();
      expect(page.metadata).toBeDefined();
      expect(page.content).toBeDefined();
      expect(page.metadata.title).toBe('Test Page');
      expect(page.content).toContain('This is test content');
    });

    it('should parse frontmatter into JSON object', async () => {
      const page = await wikiManager.getPage('test-page.md');

      expect(page.metadata).toEqual({
        title: 'Test Page',
        created: '2025-11-22',
        updated: '2025-11-22',
        related: ['Another Page', 'Third Page']
      });
    });

    it('should handle pages without frontmatter gracefully', async () => {
      const page = await wikiManager.getPage('no-frontmatter.md');

      expect(page).toBeDefined();
      expect(page.metadata).toEqual({});
      // Content should be HTML (mocked marked.parse wraps in <p> tags)
      expect(page.content).toBe('<p>Just content without frontmatter.\n</p>');
    });

    it('should return null for non-existent file', async () => {
      const page = await wikiManager.getPage('does-not-exist.md');

      expect(page).toBeNull();
    });

    it('should handle subdirectories in path', async () => {
      const page = await wikiManager.getPage('concepts/architecture.md');

      expect(page).toBeDefined();
      expect(page.metadata.title).toBe('Architecture Overview');
    });
  });

  describe('getAllPages', () => {
    it('should list all markdown files in directory', async () => {
      const pages = await wikiManager.getAllPages();

      expect(Array.isArray(pages)).toBe(true);
      expect(pages.length).toBeGreaterThan(0);
    });

    it('should include files from subdirectories', async () => {
      const pages = await wikiManager.getAllPages();

      const architecturePage = pages.find(p => p.path.includes('concepts/architecture.md'));
      expect(architecturePage).toBeDefined();
    });

    it('should return page metadata for each file', async () => {
      const pages = await wikiManager.getAllPages();

      pages.forEach(page => {
        expect(page).toHaveProperty('path');
        expect(page).toHaveProperty('metadata');
        expect(page.path).toMatch(/\.md$/);
      });
    });

    it('should return empty array for empty directory', async () => {
      const emptyManager = new WikiManager(path.join(__dirname, '../fixtures/empty-wiki'));
      const pages = await emptyManager.getAllPages();

      expect(pages).toEqual([]);
    });
  });

  describe('searchPages', () => {
    it('should find pages containing keyword in content', async () => {
      const results = await wikiManager.searchPages('architecture');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('path');
      expect(results[0]).toHaveProperty('matches');
    });

    it('should find pages containing keyword in title', async () => {
      const results = await wikiManager.searchPages('Test Page');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].path).toContain('test-page.md');
    });

    it('should be case-insensitive', async () => {
      const results1 = await wikiManager.searchPages('ARCHITECTURE');
      const results2 = await wikiManager.searchPages('architecture');

      expect(results1.length).toBe(results2.length);
    });

    it('should return empty array when no matches found', async () => {
      const results = await wikiManager.searchPages('nonexistentterm12345');

      expect(results).toEqual([]);
    });

    it('should include snippet of matching content', async () => {
      const results = await wikiManager.searchPages('architecture');

      expect(results[0].matches).toBeDefined();
      expect(typeof results[0].matches).toBe('string');
      expect(results[0].matches.toLowerCase()).toContain('architecture');
    });
  });

  describe('getRelatedPages', () => {
    it('should return related pages from frontmatter', async () => {
      const related = await wikiManager.getRelatedPages('test-page.md');

      expect(Array.isArray(related)).toBe(true);
      expect(related.length).toBeLessThanOrEqual(3);
    });

    it('should limit results to 3 pages maximum', async () => {
      const related = await wikiManager.getRelatedPages('test-page.md');

      expect(related.length).toBeLessThanOrEqual(3);
    });

    it('should return empty array if no related pages exist', async () => {
      const related = await wikiManager.getRelatedPages('isolated-page.md');

      expect(related).toEqual([]);
    });
  });
});
