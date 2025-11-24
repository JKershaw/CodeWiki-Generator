const WikiManager = require('../../lib/wiki-manager');
const fs = require('fs').promises;
const path = require('path');

describe('WikiManager - Write Operations', () => {
  let wikiManager;
  let testDir;

  beforeEach(async () => {
    // Use a temporary directory for write tests
    testDir = path.join(__dirname, '../fixtures/temp-wiki');
    wikiManager = new WikiManager(testDir);

    // Clean up and recreate test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore if doesn't exist
    }
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up after tests
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore errors
    }
  });

  describe('createPage', () => {
    it('should create a new page with frontmatter', async () => {
      const metadata = {
        title: 'New Page',
        created: '2025-11-22',
        related: ['Other Page']
      };
      const content = 'This is new content.';

      await wikiManager.createPage('new-page.md', content, metadata);

      const page = await wikiManager.getPage('new-page.md');
      expect(page).toBeDefined();
      expect(page.metadata.title).toBe('New Page');
      // Content is HTML from marked.parse mock
      expect(page.content.trim()).toBe('<p>This is new content.</p>');
    });

    it('should auto-generate timestamps if not provided', async () => {
      const metadata = { title: 'Test Page' };
      const content = 'Content';

      await wikiManager.createPage('test.md', content, metadata);

      const page = await wikiManager.getPage('test.md');
      expect(page.metadata.created).toBeDefined();
      expect(page.metadata.updated).toBeDefined();
    });

    it('should create subdirectories if needed', async () => {
      const metadata = { title: 'Concept Page' };
      const content = 'Concept content';

      await wikiManager.createPage('concepts/new-concept.md', content, metadata);

      const page = await wikiManager.getPage('concepts/new-concept.md');
      expect(page).toBeDefined();
      expect(page.metadata.title).toBe('Concept Page');
    });

    it('should handle deeply nested paths', async () => {
      const metadata = { title: 'Deep Page' };
      const content = 'Deep content';

      await wikiManager.createPage('a/b/c/deep.md', content, metadata);

      const page = await wikiManager.getPage('a/b/c/deep.md');
      expect(page).toBeDefined();
    });

    it('should throw error if file already exists', async () => {
      const metadata = { title: 'Test' };
      const content = 'Content';

      await wikiManager.createPage('duplicate.md', content, metadata);

      await expect(
        wikiManager.createPage('duplicate.md', content, metadata)
      ).rejects.toThrow();
    });
  });

  describe('updatePage', () => {
    beforeEach(async () => {
      // Create an initial page to update
      const metadata = {
        title: 'Original Title',
        created: '2025-11-22',
        related: ['Page A']
      };
      await wikiManager.createPage('update-test.md', 'Original content', metadata);
    });

    it('should update existing page content', async () => {
      const newContent = 'Updated content';

      await wikiManager.updatePage('update-test.md', newContent);

      const page = await wikiManager.getPage('update-test.md');
      // Content is HTML from marked.parse mock
      expect(page.content.trim()).toBe('<p>Updated content</p>');
    });

    it('should preserve existing frontmatter when updating content', async () => {
      await wikiManager.updatePage('update-test.md', 'New content');

      const page = await wikiManager.getPage('update-test.md');
      expect(page.metadata.title).toBe('Original Title');
      expect(page.metadata.created).toBe('2025-11-22');
    });

    it('should update the updated timestamp', async () => {
      await wikiManager.updatePage('update-test.md', 'Newer content');

      const updatedPage = await wikiManager.getPage('update-test.md');
      expect(updatedPage.metadata.updated).toBeDefined();
      expect(updatedPage.metadata.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should allow updating metadata along with content', async () => {
      const newMetadata = {
        related: ['Page A', 'Page B', 'Page C']
      };

      await wikiManager.updatePage('update-test.md', 'Content', newMetadata);

      const page = await wikiManager.getPage('update-test.md');
      expect(page.metadata.related).toEqual(['Page A', 'Page B', 'Page C']);
    });

    it('should create file if it does not exist', async () => {
      await wikiManager.updatePage('new-file.md', 'Content', { title: 'New' });

      const page = await wikiManager.getPage('new-file.md');
      expect(page).toBeDefined();
    });
  });

  describe('updateMetadata', () => {
    beforeEach(async () => {
      const metadata = {
        title: 'Test Page',
        created: '2025-11-22',
        related: ['Page A']
      };
      await wikiManager.createPage('meta-test.md', 'Content', metadata);
    });

    it('should update only metadata without changing content', async () => {
      const originalPage = await wikiManager.getPage('meta-test.md');

      await wikiManager.updateMetadata('meta-test.md', { related: ['Page B'] });

      const updatedPage = await wikiManager.getPage('meta-test.md');
      expect(updatedPage.content).toBe(originalPage.content);
      expect(updatedPage.metadata.related).toEqual(['Page B']);
    });

    it('should merge new metadata with existing', async () => {
      await wikiManager.updateMetadata('meta-test.md', { tags: ['important'] });

      const page = await wikiManager.getPage('meta-test.md');
      expect(page.metadata.title).toBe('Test Page');
      expect(page.metadata.tags).toEqual(['important']);
    });

    it('should update the updated timestamp', async () => {
      await wikiManager.updateMetadata('meta-test.md', { tags: ['new'] });

      const page = await wikiManager.getPage('meta-test.md');
      expect(page.metadata.updated).toBeDefined();
    });
  });

  describe('deletePage', () => {
    beforeEach(async () => {
      await wikiManager.createPage('delete-test.md', 'Content', { title: 'Delete Me' });
    });

    it('should delete an existing page', async () => {
      await wikiManager.deletePage('delete-test.md');

      const page = await wikiManager.getPage('delete-test.md');
      expect(page).toBeNull();
    });

    it('should not throw error if file does not exist', async () => {
      await expect(
        wikiManager.deletePage('non-existent.md')
      ).resolves.not.toThrow();
    });
  });

  describe('concurrent writes', () => {
    it('should handle multiple writes to different files in parallel', async () => {
      const writes = [];
      for (let i = 0; i < 5; i++) {
        writes.push(
          wikiManager.createPage(`page-${i}.md`, `Content ${i}`, { title: `Page ${i}` })
        );
      }

      await Promise.all(writes);

      const pages = await wikiManager.getAllPages();
      expect(pages.length).toBe(5);
    });

    it('should handle sequential writes to same file correctly', async () => {
      await wikiManager.createPage('concurrent.md', 'Content 1', { title: 'Test' });
      await wikiManager.updatePage('concurrent.md', 'Content 2');
      await wikiManager.updatePage('concurrent.md', 'Content 3');

      const page = await wikiManager.getPage('concurrent.md');
      // Content is HTML from marked.parse mock
      expect(page.content.trim()).toBe('<p>Content 3</p>');
    });
  });

  describe('archivePageVersion', () => {
    it('should archive existing page before update', async () => {
      // Create initial page
      await wikiManager.createPage('test.md', 'Original content', { title: 'Test' });

      // Update with commit info - should archive old version
      await wikiManager.updatePage('test.md', 'Updated content', {}, {
        sha: 'abc1234',
        timestamp: '2025-11-24T10:30:00Z'
      });

      // Check archive was created
      const archiveDir = path.join(testDir, '_history/test');
      const files = await fs.readdir(archiveDir);
      expect(files.length).toBe(1);
      expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-abc1234\.md$/);

      // Check archive contains original content
      const archiveContent = await fs.readFile(path.join(archiveDir, files[0]), 'utf-8');
      expect(archiveContent).toContain('Original content');
    });

    it('should create nested archive directories for nested pages', async () => {
      // Create a nested page
      await wikiManager.createPage('concepts/architecture.md', 'Architecture v1', { title: 'Architecture' });

      // Update it
      await wikiManager.updatePage('concepts/architecture.md', 'Architecture v2', {}, {
        sha: 'def5678',
        timestamp: '2025-11-24T11:00:00Z'
      });

      // Check archive structure
      const archiveDir = path.join(testDir, '_history/concepts/architecture');
      const files = await fs.readdir(archiveDir);
      expect(files.length).toBe(1);
      expect(files[0]).toMatch(/def5678\.md$/);
    });

    it('should not create archive when creating new page', async () => {
      // Create a new page (no previous version to archive)
      await wikiManager.createPage('new-page.md', 'First version', { title: 'New' });

      // Archive directory should not exist
      const archiveDir = path.join(testDir, '_history/new-page');
      try {
        await fs.access(archiveDir);
        fail('Archive directory should not exist for new pages');
      } catch (error) {
        expect(error.code).toBe('ENOENT');
      }
    });

    it('should not create archive when page does not exist yet (updatePage creates it)', async () => {
      // Update a non-existent page (updatePage will create it)
      await wikiManager.updatePage('brand-new.md', 'Content', { title: 'New' });

      // Archive directory should not exist
      const archiveDir = path.join(testDir, '_history/brand-new');
      try {
        await fs.access(archiveDir);
        fail('Archive directory should not exist when no previous version exists');
      } catch (error) {
        expect(error.code).toBe('ENOENT');
      }
    });

    it('should create multiple archives when page is updated multiple times', async () => {
      // Create initial page
      await wikiManager.createPage('multi.md', 'Version 1', { title: 'Multi' });

      // Update multiple times
      await wikiManager.updatePage('multi.md', 'Version 2', {}, {
        sha: 'commit1',
        timestamp: '2025-11-24T10:00:00Z'
      });

      await wikiManager.updatePage('multi.md', 'Version 3', {}, {
        sha: 'commit2',
        timestamp: '2025-11-24T11:00:00Z'
      });

      await wikiManager.updatePage('multi.md', 'Version 4', {}, {
        sha: 'commit3',
        timestamp: '2025-11-24T12:00:00Z'
      });

      // Check all archives exist
      const archiveDir = path.join(testDir, '_history/multi');
      const files = await fs.readdir(archiveDir);
      expect(files.length).toBe(3);

      // Verify they're sorted chronologically by filename
      const sortedFiles = files.sort();
      expect(sortedFiles[0]).toContain('commit1');
      expect(sortedFiles[1]).toContain('commit2');
      expect(sortedFiles[2]).toContain('commit3');
    });

    it('should work without commit info (backward compatibility)', async () => {
      // Create initial page
      await wikiManager.createPage('no-commit.md', 'Original', { title: 'No Commit' });

      // Update without commit info
      await wikiManager.updatePage('no-commit.md', 'Updated');

      // Archive should still be created with timestamp-only filename
      const archiveDir = path.join(testDir, '_history/no-commit');
      const files = await fs.readdir(archiveDir);
      expect(files.length).toBe(1);
      expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.md$/);
    });

    it('should preserve frontmatter in archived version', async () => {
      // Create page with metadata
      await wikiManager.createPage('meta.md', 'Content', {
        title: 'Meta Test',
        created: '2025-11-20',
        category: 'concept'
      });

      // Update it
      await wikiManager.updatePage('meta.md', 'New content', {}, {
        sha: 'xyz9999',
        timestamp: '2025-11-24T13:00:00Z'
      });

      // Read archive and check frontmatter is preserved
      const archiveDir = path.join(testDir, '_history/meta');
      const files = await fs.readdir(archiveDir);
      const archiveContent = await fs.readFile(path.join(archiveDir, files[0]), 'utf-8');

      expect(archiveContent).toContain('---');
      expect(archiveContent).toContain('title: Meta Test');
      expect(archiveContent).toContain('created: 2025-11-20');
      expect(archiveContent).toContain('category: concept');
    });
  });
});
