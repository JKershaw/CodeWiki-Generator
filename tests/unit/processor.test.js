const Processor = require('../../lib/processor');
const WikiManager = require('../../lib/wiki-manager');
const StateManager = require('../../lib/state-manager');
const GitHubClient = require('../../lib/github');
const CodeAnalysisAgent = require('../../lib/agents/code-analysis-agent');
const DocumentationWriterAgent = require('../../lib/agents/documentation-writer-agent');
const MetaAnalysisAgent = require('../../lib/agents/meta-analysis-agent');

describe('Processor', () => {
  let processor;
  let mockWikiManager;
  let mockStateManager;
  let mockCodeAnalysisAgent;
  let mockDocWriterAgent;

  beforeEach(() => {
    // Create mock managers and agents
    mockWikiManager = {
      getPage: jest.fn(),
      createPage: jest.fn(),
      updatePage: jest.fn(),
      searchPages: jest.fn(),
      getRelatedPages: jest.fn()
    };

    mockStateManager = {
      loadState: jest.fn(),
      saveState: jest.fn(),
      updateState: jest.fn(),
      getState: jest.fn()
    };

    mockCodeAnalysisAgent = {
      analyzeCode: jest.fn(),
      isSignificantFile: jest.fn()
    };

    mockDocWriterAgent = {
      writeDocumentation: jest.fn()
    };

    processor = new Processor();
    processor.wikiManager = mockWikiManager;
    processor.stateManager = mockStateManager;
    processor.codeAnalysisAgent = mockCodeAnalysisAgent;
    processor.documentationWriterAgent = mockDocWriterAgent;
  });

  describe('processCommit', () => {
    it('should process commit with single file change', async () => {
      const commit = {
        sha: 'abc123',
        message: 'Add auth service',
        files: [
          {
            filename: 'src/auth.js',
            status: 'added',
            patch: '+ class AuthService {}'
          }
        ]
      };

      const state = {
        currentCommit: 0,
        totalCommits: 10
      };

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);
      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['Authentication'],
        codeElements: [{ name: 'AuthService', type: 'class', purpose: 'Handles auth' }],
        relationships: []
      });
      mockWikiManager.getRelatedPages.mockReturnValue([]);
      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# AuthService\n\nDocumentation...');
      mockWikiManager.createPage.mockResolvedValue();

      const result = await processor.processCommit(commit, state);

      expect(result.filesProcessed).toBe(1);
      expect(result.pagesCreated).toBe(1);
      expect(result.pagesUpdated).toBe(0);
      expect(mockCodeAnalysisAgent.analyzeCode).toHaveBeenCalledWith(
        'src/auth.js',
        '+ class AuthService {}',
        'Add auth service',
        []
      );
    });

    it('should process commit with multiple file changes', async () => {
      const commit = {
        sha: 'def456',
        message: 'Refactor authentication',
        files: [
          { filename: 'src/auth.js', status: 'modified', patch: '+ updates' },
          { filename: 'src/session.js', status: 'added', patch: '+ new file' }
        ]
      };

      const state = { currentCommit: 1, totalCommits: 10 };

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);
      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['Auth'],
        codeElements: [],
        relationships: []
      });
      mockWikiManager.getRelatedPages.mockReturnValue([]);
      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# Documentation');
      mockWikiManager.createPage.mockResolvedValue();

      const result = await processor.processCommit(commit, state);

      expect(result.filesProcessed).toBe(2);
      expect(mockCodeAnalysisAgent.analyzeCode).toHaveBeenCalledTimes(2);
    });

    it('should skip insignificant files', async () => {
      const commit = {
        sha: 'ghi789',
        message: 'Update package.json',
        files: [
          { filename: 'package.json', status: 'modified', patch: '+ dependency' }
        ]
      };

      const state = { currentCommit: 2, totalCommits: 10 };

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(false);

      const result = await processor.processCommit(commit, state);

      expect(result.filesProcessed).toBe(0);
      expect(result.filesSkipped).toBe(1);
      expect(mockCodeAnalysisAgent.analyzeCode).not.toHaveBeenCalled();
    });

    it('should handle file with no patch gracefully', async () => {
      const commit = {
        sha: 'jkl012',
        message: 'Delete file',
        files: [
          { filename: 'src/old.js', status: 'removed' } // No patch for deletions
        ]
      };

      const state = { currentCommit: 3, totalCommits: 10 };

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);

      const result = await processor.processCommit(commit, state);

      // Should skip files without patches
      expect(result.filesProcessed).toBe(0);
      expect(result.filesSkipped).toBe(1);
    });

    it('should retrieve relevant wiki context for file', async () => {
      const commit = {
        sha: 'mno345',
        message: 'Update auth',
        files: [
          { filename: 'src/auth/service.js', status: 'modified', patch: '+ updates' }
        ]
      };

      const state = { currentCommit: 4, totalCommits: 10 };

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);
      mockWikiManager.getRelatedPages.mockReturnValue([
        'components/auth-middleware.md',
        'concepts/security.md'
      ]);
      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['Auth'],
        codeElements: [],
        relationships: []
      });
      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# Docs');
      mockWikiManager.createPage.mockResolvedValue();

      await processor.processCommit(commit, state);

      expect(mockCodeAnalysisAgent.analyzeCode).toHaveBeenCalledWith(
        'src/auth/service.js',
        '+ updates',
        'Update auth',
        ['components/auth-middleware.md', 'concepts/security.md']
      );
    });

    it('should update existing pages when concept already documented', async () => {
      const commit = {
        sha: 'pqr678',
        message: 'Enhance auth',
        files: [
          { filename: 'src/auth.js', status: 'modified', patch: '+ enhancements' }
        ]
      };

      const state = { currentCommit: 5, totalCommits: 10 };

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);
      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['AuthService'],
        codeElements: [{ name: 'AuthService', type: 'class', purpose: 'Enhanced' }],
        relationships: []
      });
      mockWikiManager.getRelatedPages.mockReturnValue([]);

      // Mock that page already exists
      mockWikiManager.getPage.mockResolvedValue({
        frontmatter: { title: 'AuthService' },
        content: '# AuthService\n\nOld documentation...'
      });

      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# AuthService\n\nUpdated...');
      mockWikiManager.updatePage.mockResolvedValue();

      const result = await processor.processCommit(commit, state);

      expect(result.pagesUpdated).toBe(1);
      expect(result.pagesCreated).toBe(0);
      expect(mockWikiManager.updatePage).toHaveBeenCalledWith(
        'components/auth-service.md',
        expect.stringContaining('Updated'),
        {
          title: 'AuthService',
          category: 'components'
        }
      );
    });

    it('should handle processing errors gracefully', async () => {
      const commit = {
        sha: 'stu901',
        message: 'Add feature',
        files: [
          { filename: 'src/feature.js', status: 'added', patch: '+ code' }
        ]
      };

      const state = { currentCommit: 6, totalCommits: 10 };

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);
      mockWikiManager.getRelatedPages.mockReturnValue([]);
      mockCodeAnalysisAgent.analyzeCode.mockRejectedValue(new Error('API Error'));

      await expect(
        processor.processCommit(commit, state)
      ).rejects.toThrow('API Error');
    });

    it('should return processing summary', async () => {
      const commit = {
        sha: 'vwx234',
        message: 'Mixed changes',
        files: [
          { filename: 'src/code.js', status: 'added', patch: '+ code' },
          { filename: 'package.json', status: 'modified', patch: '+ dep' }
        ]
      };

      const state = { currentCommit: 7, totalCommits: 10 };

      mockCodeAnalysisAgent.isSignificantFile
        .mockReturnValueOnce(true)  // src/code.js
        .mockReturnValueOnce(false); // package.json

      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['Feature'],
        codeElements: [],
        relationships: []
      });
      mockWikiManager.getRelatedPages.mockReturnValue([]);
      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# Feature');
      mockWikiManager.createPage.mockResolvedValue();

      const result = await processor.processCommit(commit, state);

      expect(result).toMatchObject({
        commitSha: 'vwx234',
        filesProcessed: 1,
        filesSkipped: 1,
        pagesCreated: 1,
        pagesUpdated: 0,
        concepts: ['Feature']
      });
    });
  });

  describe('isSignificantFile', () => {
    // Use a real processor (not mocked) for these tests
    // since we're testing the delegation to CodeAnalysisAgent
    let realProcessor;

    beforeEach(() => {
      realProcessor = new Processor();
    });

    it('should identify significant JavaScript files', () => {
      expect(realProcessor.isSignificantFile('src/index.js')).toBe(true);
      expect(realProcessor.isSignificantFile('lib/utils.js')).toBe(true);
    });

    it('should skip configuration files', () => {
      expect(realProcessor.isSignificantFile('package.json')).toBe(false);
      expect(realProcessor.isSignificantFile('tsconfig.json')).toBe(false);
      expect(realProcessor.isSignificantFile('.eslintrc.js')).toBe(false);
    });

    it('should skip test files', () => {
      expect(realProcessor.isSignificantFile('src/test.spec.js')).toBe(false);
      expect(realProcessor.isSignificantFile('lib/component.test.ts')).toBe(false);
    });

    it('should skip documentation', () => {
      expect(realProcessor.isSignificantFile('README.md')).toBe(false);
      expect(realProcessor.isSignificantFile('docs/guide.md')).toBe(false);
    });

    it('should skip lock files', () => {
      expect(realProcessor.isSignificantFile('package-lock.json')).toBe(false);
      expect(realProcessor.isSignificantFile('yarn.lock')).toBe(false);
    });
  });

  describe('getRelevantContext', () => {
    it('should return up to 3 related pages', () => {
      mockWikiManager.getRelatedPages.mockReturnValue([
        'page1.md',
        'page2.md',
        'page3.md',
        'page4.md',
        'page5.md'
      ]);

      const context = processor.getRelevantContext('src/auth.js');

      expect(context).toHaveLength(3);
      expect(context).toEqual(['page1.md', 'page2.md', 'page3.md']);
    });

    it('should handle fewer than 3 pages', () => {
      mockWikiManager.getRelatedPages.mockReturnValue(['page1.md']);

      const context = processor.getRelevantContext('src/utils.js');

      expect(context).toHaveLength(1);
      expect(context).toEqual(['page1.md']);
    });

    it('should return empty array when no related pages', () => {
      mockWikiManager.getRelatedPages.mockReturnValue([]);

      const context = processor.getRelevantContext('src/new.js');

      expect(context).toEqual([]);
    });
  });

  describe('determinePagePath', () => {
    it('should convert concept name to page path', () => {
      const path = processor.determinePagePath('AuthService');
      expect(path).toBe('components/auth-service.md');
    });

    it('should handle multi-word concepts', () => {
      const path = processor.determinePagePath('UserAuthenticationManager');
      expect(path).toBe('components/user-authentication-manager.md');
    });

    it('should handle concepts with spaces', () => {
      const path = processor.determinePagePath('Session Manager');
      expect(path).toBe('components/session-manager.md');
    });
  });

  describe('processRepository', () => {
    let mockGithubClient;
    let mockMetaAnalysisAgent;
    let mockClaudeClient;

    beforeEach(() => {
      // Add GitHub client and meta-analysis agent mocks
      mockGithubClient = {
        parseRepoUrl: jest.fn(),
        getCommits: jest.fn()
      };

      mockMetaAnalysisAgent = {
        shouldRunMetaAnalysis: jest.fn(),
        analyzeProgress: jest.fn()
      };

      mockClaudeClient = {
        getCostSummary: jest.fn().mockReturnValue({
          totalCost: 0,
          inputTokens: 0,
          outputTokens: 0
        })
      };

      processor.githubClient = mockGithubClient;
      processor.metaAnalysisAgent = mockMetaAnalysisAgent;
      processor.claudeClient = mockClaudeClient;
    });

    it('should process multiple commits in sequence', async () => {
      const commits = [
        { sha: 'abc', message: 'Commit 1', files: [{ filename: 'src/a.js', patch: '+ code' }] },
        { sha: 'def', message: 'Commit 2', files: [{ filename: 'src/b.js', patch: '+ code' }] }
      ];

      mockGithubClient.parseRepoUrl.mockReturnValue({ owner: 'user', repo: 'test' });
      mockGithubClient.getCommits.mockResolvedValue(commits);

      mockStateManager.loadState.mockResolvedValue({
        repoUrl: '',
        currentCommit: 0,
        totalCommits: 0,
        status: 'idle'
      });

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);
      mockWikiManager.getRelatedPages.mockReturnValue([]);
      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['Test'],
        codeElements: [],
        relationships: []
      });
      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# Test');
      mockWikiManager.createPage.mockResolvedValue();
      mockMetaAnalysisAgent.shouldRunMetaAnalysis.mockReturnValue(false);

      const result = await processor.processRepository('https://github.com/user/test');

      expect(result.commitsProcessed).toBe(2);
      expect(mockStateManager.saveState).toHaveBeenCalled();
    });

    it('should trigger meta-analysis every N commits', async () => {
      const commits = [
        { sha: '1', message: 'C1', files: [] },
        { sha: '2', message: 'C2', files: [] },
        { sha: '3', message: 'C3', files: [] },
        { sha: '4', message: 'C4', files: [] },
        { sha: '5', message: 'C5', files: [] }
      ];

      mockGithubClient.parseRepoUrl.mockReturnValue({ owner: 'user', repo: 'test' });
      mockGithubClient.getCommits.mockResolvedValue(commits);

      mockStateManager.loadState.mockResolvedValue({
        repoUrl: '',
        currentCommit: 0,
        totalCommits: 0,
        status: 'idle',
        lastMetaAnalysis: 0
      });

      mockMetaAnalysisAgent.shouldRunMetaAnalysis
        .mockReturnValueOnce(false)  // Commit 1
        .mockReturnValueOnce(false)  // Commit 2
        .mockReturnValueOnce(false)  // Commit 3
        .mockReturnValueOnce(false)  // Commit 4
        .mockReturnValueOnce(true);  // Commit 5

      mockMetaAnalysisAgent.analyzeProgress.mockResolvedValue({
        themes: ['Pattern emerging'],
        newPagesNeeded: [],
        gaps: [],
        reorganization: []
      });

      const result = await processor.processRepository('https://github.com/user/test');

      expect(mockMetaAnalysisAgent.analyzeProgress).toHaveBeenCalledTimes(1);
      expect(result.metaAnalysisRuns).toBe(1);
    });

    it('should save state after each commit', async () => {
      const commits = [
        { sha: 'abc', message: 'Commit 1', files: [] },
        { sha: 'def', message: 'Commit 2', files: [] }
      ];

      mockGithubClient.parseRepoUrl.mockReturnValue({ owner: 'user', repo: 'test' });
      mockGithubClient.getCommits.mockResolvedValue(commits);

      mockStateManager.loadState.mockResolvedValue({
        repoUrl: '',
        currentCommit: 0,
        totalCommits: 0,
        status: 'idle'
      });

      mockMetaAnalysisAgent.shouldRunMetaAnalysis.mockReturnValue(false);

      await processor.processRepository('https://github.com/user/test');

      // Should save after each commit + once on completion
      // (2 commits + 1 completion = 3 total saves)
      expect(mockStateManager.saveState).toHaveBeenCalledTimes(3);
    });

    it('should resume from saved state', async () => {
      const commits = [
        { sha: 'abc', message: 'C1', files: [] },
        { sha: 'def', message: 'C2', files: [] },
        { sha: 'ghi', message: 'C3', files: [] }
      ];

      mockGithubClient.parseRepoUrl.mockReturnValue({ owner: 'user', repo: 'test' });
      mockGithubClient.getCommits.mockResolvedValue(commits);

      // State indicates we already processed 2 commits
      mockStateManager.loadState.mockResolvedValue({
        repoUrl: 'https://github.com/user/test',
        currentCommit: 2,
        totalCommits: 3,
        status: 'running'
      });

      mockMetaAnalysisAgent.shouldRunMetaAnalysis.mockReturnValue(false);

      const result = await processor.processRepository('https://github.com/user/test');

      // Should only process the remaining commit (commit 3)
      expect(result.commitsProcessed).toBe(1);
    });

    it('should enforce cost limits', async () => {
      const commits = Array(10).fill(null).map((_, i) => ({
        sha: `commit${i}`,
        message: `Commit ${i}`,
        files: [{ filename: 'src/code.js', patch: '+ code' }]
      }));

      mockGithubClient.parseRepoUrl.mockReturnValue({ owner: 'user', repo: 'test' });
      mockGithubClient.getCommits.mockResolvedValue(commits);

      mockStateManager.loadState.mockResolvedValue({
        repoUrl: '',
        currentCommit: 0,
        totalCommits: 0,
        status: 'idle'
      });

      mockCodeAnalysisAgent.isSignificantFile.mockReturnValue(true);
      mockWikiManager.getRelatedPages.mockReturnValue([]);
      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['Test'],
        codeElements: [],
        relationships: []
      });
      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# Test');
      mockWikiManager.createPage.mockResolvedValue();
      mockMetaAnalysisAgent.shouldRunMetaAnalysis.mockReturnValue(false);

      // Mock increasing costs - hit limit on 3rd check
      mockClaudeClient.getCostSummary
        .mockReturnValueOnce({ totalCost: 0.0 })     // Initial check
        .mockReturnValueOnce({ totalCost: 0.0005 })  // After commit 1
        .mockReturnValueOnce({ totalCost: 0.002 })   // After commit 2 - exceeds limit
        .mockReturnValue({ totalCost: 0.002 });      // Subsequent calls

      // Set a low cost limit
      const result = await processor.processRepository(
        'https://github.com/user/test',
        { maxCost: 0.001 } // Very low limit
      );

      // Should stop before processing all commits
      expect(result.stopped).toBe(true);
      expect(result.stopReason).toBe('cost_limit');
      expect(result.commitsProcessed).toBeLessThan(10);
    });

    it('should track processing statistics', async () => {
      const commits = [
        { sha: 'abc', message: 'Add feature', files: [
          { filename: 'src/feature.js', patch: '+ code' },
          { filename: 'package.json', patch: '+ dep' }
        ]}
      ];

      mockGithubClient.parseRepoUrl.mockReturnValue({ owner: 'user', repo: 'test' });
      mockGithubClient.getCommits.mockResolvedValue(commits);

      mockStateManager.loadState.mockResolvedValue({
        repoUrl: '',
        currentCommit: 0,
        totalCommits: 0,
        status: 'idle'
      });

      mockCodeAnalysisAgent.isSignificantFile
        .mockReturnValueOnce(true)   // feature.js
        .mockReturnValueOnce(false); // package.json

      mockWikiManager.getRelatedPages.mockReturnValue([]);
      mockCodeAnalysisAgent.analyzeCode.mockResolvedValue({
        concepts: ['Feature'],
        codeElements: [],
        relationships: []
      });
      mockDocWriterAgent.writeDocumentation.mockResolvedValue('# Feature');
      mockWikiManager.createPage.mockResolvedValue();
      mockMetaAnalysisAgent.shouldRunMetaAnalysis.mockReturnValue(false);

      const result = await processor.processRepository('https://github.com/user/test');

      expect(result).toMatchObject({
        commitsProcessed: 1,
        totalFiles: 2,
        filesProcessed: 1,
        filesSkipped: 1,
        pagesCreated: 1,
        pagesUpdated: 0
      });
    });

    it('should handle GitHub API rate limits', async () => {
      mockGithubClient.parseRepoUrl.mockReturnValue({ owner: 'user', repo: 'test' });

      // GitHub client will retry internally, but if it fails we should handle it
      const rateLimitError = new Error('API rate limit exceeded');
      rateLimitError.status = 403;
      mockGithubClient.getCommits.mockRejectedValue(rateLimitError);

      mockStateManager.loadState.mockResolvedValue({
        repoUrl: '',
        currentCommit: 0,
        totalCommits: 0,
        status: 'idle'
      });

      await expect(
        processor.processRepository('https://github.com/user/test')
      ).rejects.toThrow('API rate limit exceeded');
    });
  });
});
