const config = require('../../lib/config');

describe('Config - Agent Frequency', () => {

  describe('agentFrequencies', () => {
    it('should have default frequencies configured', () => {
      expect(config.agentFrequencies).toBeDefined();
      expect(config.agentFrequencies.codeAnalysis).toBe(1);
      expect(config.agentFrequencies.documentationWriter).toBe(1);
      expect(config.agentFrequencies.wikiIndex).toBe(5);
      expect(config.agentFrequencies.crossLinking).toBe(5);
      expect(config.agentFrequencies.architectureOverview).toBe(10);
      expect(config.agentFrequencies.guideGeneration).toBe(10);
    });
  });

  describe('shouldRunAgent', () => {
    describe('core agents (frequency = 1)', () => {
      it('should run codeAnalysis on every commit', () => {
        expect(config.shouldRunAgent('codeAnalysis', 0, 20)).toBe(true);
        expect(config.shouldRunAgent('codeAnalysis', 1, 20)).toBe(true);
        expect(config.shouldRunAgent('codeAnalysis', 5, 20)).toBe(true);
        expect(config.shouldRunAgent('codeAnalysis', 19, 20)).toBe(true);
      });

      it('should run documentationWriter on every commit', () => {
        expect(config.shouldRunAgent('documentationWriter', 0, 20)).toBe(true);
        expect(config.shouldRunAgent('documentationWriter', 1, 20)).toBe(true);
        expect(config.shouldRunAgent('documentationWriter', 5, 20)).toBe(true);
        expect(config.shouldRunAgent('documentationWriter', 19, 20)).toBe(true);
      });
    });

    describe('periodic agents (frequency = 5)', () => {
      it('should run wikiIndex every 5th commit', () => {
        // Commit numbers (1-based): 5, 10, 15, 20 (last)
        expect(config.shouldRunAgent('wikiIndex', 0, 20)).toBe(false); // commit 1
        expect(config.shouldRunAgent('wikiIndex', 1, 20)).toBe(false); // commit 2
        expect(config.shouldRunAgent('wikiIndex', 4, 20)).toBe(true);  // commit 5
        expect(config.shouldRunAgent('wikiIndex', 5, 20)).toBe(false); // commit 6
        expect(config.shouldRunAgent('wikiIndex', 9, 20)).toBe(true);  // commit 10
        expect(config.shouldRunAgent('wikiIndex', 14, 20)).toBe(true); // commit 15
        expect(config.shouldRunAgent('wikiIndex', 18, 20)).toBe(false); // commit 19
      });

      it('should run crossLinking every 5th commit', () => {
        expect(config.shouldRunAgent('crossLinking', 0, 20)).toBe(false);
        expect(config.shouldRunAgent('crossLinking', 4, 20)).toBe(true);
        expect(config.shouldRunAgent('crossLinking', 9, 20)).toBe(true);
      });
    });

    describe('overview agents (frequency = 10)', () => {
      it('should run architectureOverview every 10th commit', () => {
        // Commit numbers (1-based): 10, 20 (last)
        expect(config.shouldRunAgent('architectureOverview', 0, 20)).toBe(false);  // commit 1
        expect(config.shouldRunAgent('architectureOverview', 4, 20)).toBe(false);  // commit 5
        expect(config.shouldRunAgent('architectureOverview', 9, 20)).toBe(true);   // commit 10
        expect(config.shouldRunAgent('architectureOverview', 14, 20)).toBe(false); // commit 15
        expect(config.shouldRunAgent('architectureOverview', 18, 20)).toBe(false); // commit 19
      });

      it('should run guideGeneration every 10th commit', () => {
        expect(config.shouldRunAgent('guideGeneration', 0, 20)).toBe(false);
        expect(config.shouldRunAgent('guideGeneration', 9, 20)).toBe(true);
        expect(config.shouldRunAgent('guideGeneration', 18, 20)).toBe(false);
      });
    });

    describe('last commit behavior', () => {
      it('should always run all agents on the last commit', () => {
        const totalCommits = 23; // Arbitrary number
        const lastIndex = totalCommits - 1;

        // All agents should run on last commit regardless of frequency
        expect(config.shouldRunAgent('codeAnalysis', lastIndex, totalCommits)).toBe(true);
        expect(config.shouldRunAgent('documentationWriter', lastIndex, totalCommits)).toBe(true);
        expect(config.shouldRunAgent('wikiIndex', lastIndex, totalCommits)).toBe(true);
        expect(config.shouldRunAgent('crossLinking', lastIndex, totalCommits)).toBe(true);
        expect(config.shouldRunAgent('architectureOverview', lastIndex, totalCommits)).toBe(true);
        expect(config.shouldRunAgent('guideGeneration', lastIndex, totalCommits)).toBe(true);
      });

      it('should run on last commit even if not multiple of frequency', () => {
        // 13 is not a multiple of 5 or 10
        expect(config.shouldRunAgent('wikiIndex', 12, 13)).toBe(true); // commit 13 (last)
        expect(config.shouldRunAgent('architectureOverview', 12, 13)).toBe(true); // commit 13 (last)
      });
    });

    describe('unknown agents', () => {
      it('should return true for unknown agent names (safe default)', () => {
        expect(config.shouldRunAgent('unknownAgent', 3, 20)).toBe(true);
        expect(config.shouldRunAgent('nonExistent', 7, 20)).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should handle single commit correctly', () => {
        // With only 1 commit (index 0), it's also the last commit
        expect(config.shouldRunAgent('architectureOverview', 0, 1)).toBe(true);
        expect(config.shouldRunAgent('guideGeneration', 0, 1)).toBe(true);
      });

      it('should handle first commit (index 0) correctly', () => {
        // First commit is not a multiple of frequency (commit number = 1)
        expect(config.shouldRunAgent('wikiIndex', 0, 20)).toBe(false);
        expect(config.shouldRunAgent('architectureOverview', 0, 20)).toBe(false);
      });
    });

    describe('frequency multiples', () => {
      it('should respect frequency = 5 pattern across many commits', () => {
        const totalCommits = 50;
        const expectedIndices = [4, 9, 14, 19, 24, 29, 34, 39, 44, 49]; // commits 5, 10, 15, 20, 25, 30, 35, 40, 45, 50

        for (let i = 0; i < totalCommits; i++) {
          const should = config.shouldRunAgent('wikiIndex', i, totalCommits);
          if (expectedIndices.includes(i)) {
            expect(should).toBe(true);
          } else {
            expect(should).toBe(false);
          }
        }
      });

      it('should respect frequency = 10 pattern across many commits', () => {
        const totalCommits = 50;
        const expectedIndices = [9, 19, 29, 39, 49]; // commits 10, 20, 30, 40, 50

        for (let i = 0; i < totalCommits; i++) {
          const should = config.shouldRunAgent('architectureOverview', i, totalCommits);
          if (expectedIndices.includes(i)) {
            expect(should).toBe(true);
          } else {
            expect(should).toBe(false);
          }
        }
      });
    });
  });
});
