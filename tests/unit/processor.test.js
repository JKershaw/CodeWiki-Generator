const Processor = require('../../lib/processor');
const WikiManager = require('../../lib/wiki-manager');
const StateManager = require('../../lib/state-manager');
const CodeAnalysisAgent = require('../../lib/agents/code-analysis-agent');
const DocumentationWriterAgent = require('../../lib/agents/documentation-writer-agent');

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
        'components/auth-service',
        'AuthService',
        expect.stringContaining('Updated')
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
      expect(path).toBe('components/auth-service');
    });

    it('should handle multi-word concepts', () => {
      const path = processor.determinePagePath('UserAuthenticationManager');
      expect(path).toBe('components/user-authentication-manager');
    });

    it('should handle concepts with spaces', () => {
      const path = processor.determinePagePath('Session Manager');
      expect(path).toBe('components/session-manager');
    });
  });
});
