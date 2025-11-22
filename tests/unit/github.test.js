const GitHubClient = require('../../lib/github');
const config = require('../../lib/config');

describe('GitHubClient', () => {
  let githubClient;
  let mockOctokit;

  beforeEach(() => {
    // Create mock Octokit instance
    mockOctokit = {
      rest: {
        repos: {
          get: jest.fn(),
          listCommits: jest.fn(),
          getCommit: jest.fn(),
          getContent: jest.fn()
        }
      }
    };

    // In test mode, GitHubClient should use mocks
    githubClient = new GitHubClient();
    // Inject mock for testing
    githubClient.octokit = mockOctokit;
  });

  describe('parseRepoUrl', () => {
    it('should parse https GitHub URLs', () => {
      const result = githubClient.parseRepoUrl('https://github.com/owner/repo');

      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should parse https GitHub URLs with .git suffix', () => {
      const result = githubClient.parseRepoUrl('https://github.com/owner/repo.git');

      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should parse SSH GitHub URLs', () => {
      const result = githubClient.parseRepoUrl('git@github.com:owner/repo.git');

      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should handle URLs with trailing slashes', () => {
      const result = githubClient.parseRepoUrl('https://github.com/owner/repo/');

      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should throw error for invalid URLs', () => {
      expect(() => githubClient.parseRepoUrl('not-a-url')).toThrow();
      expect(() => githubClient.parseRepoUrl('https://gitlab.com/owner/repo')).toThrow();
    });
  });

  describe('getRepoInfo', () => {
    it('should fetch repository information', async () => {
      const mockRepoData = {
        data: {
          name: 'test-repo',
          full_name: 'owner/test-repo',
          description: 'Test repository',
          default_branch: 'main'
        }
      };

      mockOctokit.rest.repos.get.mockResolvedValue(mockRepoData);

      const info = await githubClient.getRepoInfo('owner', 'test-repo');

      expect(info.name).toBe('test-repo');
      expect(info.fullName).toBe('owner/test-repo');
      expect(info.defaultBranch).toBe('main');
      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'test-repo'
      });
    });

    it('should handle API errors gracefully', async () => {
      mockOctokit.rest.repos.get.mockRejectedValue(new Error('Repository not found'));

      await expect(githubClient.getRepoInfo('owner', 'nonexistent')).rejects.toThrow();
    });
  });

  describe('getCommits', () => {
    it('should fetch commits in chronological order', async () => {
      const mockCommits = {
        data: [
          { sha: 'abc123', commit: { message: 'Third commit', author: { date: '2025-11-22' } } },
          { sha: 'def456', commit: { message: 'Second commit', author: { date: '2025-11-21' } } },
          { sha: 'ghi789', commit: { message: 'First commit', author: { date: '2025-11-20' } } }
        ]
      };

      mockOctokit.rest.repos.listCommits.mockResolvedValue(mockCommits);

      const commits = await githubClient.getCommits('owner', 'repo');

      expect(commits).toHaveLength(3);
      // Should be in chronological order (oldest first)
      expect(commits[0].sha).toBe('ghi789');
      expect(commits[2].sha).toBe('abc123');
    });

    it('should support pagination for large repositories', async () => {
      // First page
      mockOctokit.rest.repos.listCommits
        .mockResolvedValueOnce({
          data: [
            { sha: 'commit1', commit: { message: 'Commit 1', author: { date: '2025-11-22' } } }
          ]
        })
        .mockResolvedValueOnce({
          data: [] // Empty page indicates end
        });

      const commits = await githubClient.getCommits('owner', 'repo', { perPage: 1 });

      expect(commits).toHaveLength(1);
    });

    it('should filter commits by date range', async () => {
      const mockCommits = {
        data: [
          { sha: 'abc', commit: { message: 'Recent', author: { date: '2025-11-22' } } },
          { sha: 'def', commit: { message: 'Old', author: { date: '2025-01-01' } } }
        ]
      };

      mockOctokit.rest.repos.listCommits.mockResolvedValue(mockCommits);

      const commits = await githubClient.getCommits('owner', 'repo', {
        since: '2025-11-20'
      });

      expect(mockOctokit.rest.repos.listCommits).toHaveBeenCalledWith(
        expect.objectContaining({
          since: '2025-11-20'
        })
      );
    });
  });

  describe('getCommit', () => {
    it('should fetch detailed commit information with diff', async () => {
      const mockCommit = {
        data: {
          sha: 'abc123',
          commit: {
            message: 'Add feature',
            author: { name: 'Developer', email: 'dev@example.com', date: '2025-11-22' }
          },
          files: [
            {
              filename: 'src/index.js',
              status: 'modified',
              additions: 10,
              deletions: 5,
              changes: 15,
              patch: '@@ -1,5 +1,10 @@\n-old code\n+new code'
            }
          ]
        }
      };

      mockOctokit.rest.repos.getCommit.mockResolvedValue(mockCommit);

      const commit = await githubClient.getCommit('owner', 'repo', 'abc123');

      expect(commit.sha).toBe('abc123');
      expect(commit.message).toBe('Add feature');
      expect(commit.files).toHaveLength(1);
      expect(commit.files[0].filename).toBe('src/index.js');
      expect(commit.files[0].patch).toBeDefined();
    });

    it('should handle commits with no file changes', async () => {
      const mockCommit = {
        data: {
          sha: 'abc123',
          commit: { message: 'Empty commit', author: { date: '2025-11-22' } },
          files: []
        }
      };

      mockOctokit.rest.repos.getCommit.mockResolvedValue(mockCommit);

      const commit = await githubClient.getCommit('owner', 'repo', 'abc123');

      expect(commit.files).toEqual([]);
    });
  });

  describe('getFileContent', () => {
    it('should fetch file content at specific commit', async () => {
      const mockContent = {
        data: {
          content: Buffer.from('const x = 1;').toString('base64'),
          encoding: 'base64'
        }
      };

      mockOctokit.rest.repos.getContent.mockResolvedValue(mockContent);

      const content = await githubClient.getFileContent('owner', 'repo', 'src/index.js', 'abc123');

      expect(content).toBe('const x = 1;');
      expect(mockOctokit.rest.repos.getContent).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        path: 'src/index.js',
        ref: 'abc123'
      });
    });

    it('should handle binary files', async () => {
      const mockContent = {
        data: {
          content: Buffer.from([0x89, 0x50, 0x4E, 0x47]).toString('base64'), // PNG header
          encoding: 'base64'
        }
      };

      mockOctokit.rest.repos.getContent.mockResolvedValue(mockContent);

      const content = await githubClient.getFileContent('owner', 'repo', 'image.png', 'abc123');

      expect(content).toBeDefined();
      expect(typeof content).toBe('string');
    });

    it('should return null for non-existent files', async () => {
      mockOctokit.rest.repos.getContent.mockRejectedValue({ status: 404 });

      const content = await githubClient.getFileContent('owner', 'repo', 'nonexistent.js', 'abc123');

      expect(content).toBeNull();
    });
  });

  describe('error handling and retries', () => {
    it('should retry on rate limit errors', async () => {
      const rateLimitError = { status: 403, message: 'rate limit exceeded' };

      mockOctokit.rest.repos.get
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce({
          data: { name: 'test-repo', default_branch: 'main' }
        });

      // Should eventually succeed after retry
      const info = await githubClient.getRepoInfo('owner', 'test-repo');
      expect(info.name).toBe('test-repo');
    });

    it('should not retry on authentication errors', async () => {
      const authError = new Error('Bad credentials');
      authError.status = 401;

      mockOctokit.rest.repos.get.mockRejectedValue(authError);

      await expect(githubClient.getRepoInfo('owner', 'test-repo')).rejects.toThrow();
      expect(mockOctokit.rest.repos.get).toHaveBeenCalledTimes(1); // No retry
    });

    it('should retry on network errors', async () => {
      const networkError = new Error('ECONNRESET');

      mockOctokit.rest.repos.get
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({
          data: { name: 'test-repo', default_branch: 'main' }
        });

      const info = await githubClient.getRepoInfo('owner', 'test-repo');
      expect(info.name).toBe('test-repo');
    });
  });
});
