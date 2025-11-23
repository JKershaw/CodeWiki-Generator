const CommentsManager = require('../../lib/comments-manager');
const fs = require('fs').promises;
const path = require('path');

// Mock fs promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn()
  }
}));

describe('CommentsManager', () => {
  let commentsManager;
  const testProject = 'test-project';
  const testPageId = 'concepts/architecture.md';

  beforeEach(() => {
    commentsManager = new CommentsManager('./wikis');
    jest.clearAllMocks();
  });

  describe('getComments', () => {
    it('should return comments for a specific page', async () => {
      const mockData = {
        comments: [
          {
            id: 'comment_1',
            pageId: testPageId,
            author: 'Alice',
            content: 'Great explanation!',
            timestamp: '2025-01-01T10:00:00.000Z',
            resolved: false
          },
          {
            id: 'comment_2',
            pageId: 'other-page.md',
            author: 'Bob',
            content: 'Thanks!',
            timestamp: '2025-01-01T11:00:00.000Z',
            resolved: false
          }
        ]
      };

      fs.readFile.mockResolvedValue(JSON.stringify(mockData));

      const comments = await commentsManager.getComments(testProject, testPageId);

      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBe('comment_1');
      expect(comments[0].author).toBe('Alice');
    });

    it('should return empty array when no comments file exists', async () => {
      fs.readFile.mockRejectedValue({ code: 'ENOENT' });

      const comments = await commentsManager.getComments(testProject, testPageId);

      expect(comments).toEqual([]);
    });

    it('should sort comments by timestamp (newest first)', async () => {
      const mockData = {
        comments: [
          {
            id: 'comment_1',
            pageId: testPageId,
            timestamp: '2025-01-01T10:00:00.000Z',
            resolved: false
          },
          {
            id: 'comment_2',
            pageId: testPageId,
            timestamp: '2025-01-01T12:00:00.000Z',
            resolved: false
          },
          {
            id: 'comment_3',
            pageId: testPageId,
            timestamp: '2025-01-01T11:00:00.000Z',
            resolved: false
          }
        ]
      };

      fs.readFile.mockResolvedValue(JSON.stringify(mockData));

      const comments = await commentsManager.getComments(testProject, testPageId);

      expect(comments[0].id).toBe('comment_2'); // Newest
      expect(comments[1].id).toBe('comment_3');
      expect(comments[2].id).toBe('comment_1'); // Oldest
    });
  });

  describe('addComment', () => {
    it('should add a new comment to the page', async () => {
      const mockData = { comments: [] };
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      fs.writeFile.mockResolvedValue();
      fs.mkdir.mockResolvedValue();

      const commentData = {
        author: 'Alice',
        content: 'Great article!'
      };

      const comment = await commentsManager.addComment(testProject, testPageId, commentData);

      expect(comment.id).toBeDefined();
      expect(comment.pageId).toBe(testPageId);
      expect(comment.author).toBe('Alice');
      expect(comment.content).toBe('Great article!');
      expect(comment.resolved).toBe(false);
      expect(comment.timestamp).toBeDefined();

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Great article!'),
        'utf-8'
      );
    });

    it('should use "Anonymous" as default author', async () => {
      const mockData = { comments: [] };
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      fs.writeFile.mockResolvedValue();
      fs.mkdir.mockResolvedValue();

      const comment = await commentsManager.addComment(testProject, testPageId, {
        content: 'Test comment'
      });

      expect(comment.author).toBe('Anonymous');
    });
  });

  describe('updateComment', () => {
    it('should update comment content', async () => {
      const mockData = {
        comments: [
          {
            id: 'comment_1',
            pageId: testPageId,
            author: 'Alice',
            content: 'Old content',
            timestamp: '2025-01-01T10:00:00.000Z',
            resolved: false
          }
        ]
      };

      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      fs.writeFile.mockResolvedValue();
      fs.mkdir.mockResolvedValue();

      const updated = await commentsManager.updateComment(testProject, 'comment_1', {
        content: 'New content'
      });

      expect(updated.content).toBe('New content');
      expect(updated.lastModified).toBeDefined();
    });

    it('should throw error for non-existent comment', async () => {
      const mockData = { comments: [] };
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));

      await expect(
        commentsManager.updateComment(testProject, 'nonexistent', { content: 'Test' })
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const mockData = {
        comments: [
          {
            id: 'comment_1',
            pageId: testPageId,
            author: 'Alice',
            content: 'Test',
            timestamp: '2025-01-01T10:00:00.000Z',
            resolved: false
          }
        ]
      };

      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      fs.writeFile.mockResolvedValue();
      fs.mkdir.mockResolvedValue();

      await commentsManager.deleteComment(testProject, 'comment_1');

      const savedData = JSON.parse(fs.writeFile.mock.calls[0][1]);
      expect(savedData.comments).toHaveLength(0);
    });

    it('should throw error for non-existent comment', async () => {
      const mockData = { comments: [] };
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));

      await expect(
        commentsManager.deleteComment(testProject, 'nonexistent')
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('resolveComment', () => {
    it('should toggle resolved status from false to true', async () => {
      const mockData = {
        comments: [
          {
            id: 'comment_1',
            pageId: testPageId,
            author: 'Alice',
            content: 'Test',
            timestamp: '2025-01-01T10:00:00.000Z',
            resolved: false
          }
        ]
      };

      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      fs.writeFile.mockResolvedValue();
      fs.mkdir.mockResolvedValue();

      const comment = await commentsManager.resolveComment(testProject, 'comment_1');

      expect(comment.resolved).toBe(true);
      expect(comment.resolvedAt).toBeDefined();
    });

    it('should toggle resolved status from true to false', async () => {
      const mockData = {
        comments: [
          {
            id: 'comment_1',
            pageId: testPageId,
            author: 'Alice',
            content: 'Test',
            timestamp: '2025-01-01T10:00:00.000Z',
            resolved: true,
            resolvedAt: '2025-01-01T11:00:00.000Z'
          }
        ]
      };

      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      fs.writeFile.mockResolvedValue();
      fs.mkdir.mockResolvedValue();

      const comment = await commentsManager.resolveComment(testProject, 'comment_1');

      expect(comment.resolved).toBe(false);
      expect(comment.resolvedAt).toBeNull();
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      const mockData = {
        comments: [
          {
            id: 'comment_1',
            pageId: 'page1.md',
            resolved: true
          },
          {
            id: 'comment_2',
            pageId: 'page1.md',
            resolved: false
          },
          {
            id: 'comment_3',
            pageId: 'page2.md',
            resolved: false
          }
        ]
      };

      fs.readFile.mockResolvedValue(JSON.stringify(mockData));

      const stats = await commentsManager.getStatistics(testProject);

      expect(stats.total).toBe(3);
      expect(stats.resolved).toBe(1);
      expect(stats.unresolved).toBe(2);
      expect(stats.byPage['page1.md']).toBe(2);
      expect(stats.byPage['page2.md']).toBe(1);
    });
  });
});
