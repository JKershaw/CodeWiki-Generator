const TestCoverageAnalyzer = require('../../lib/test-coverage-analyzer');
const fs = require('fs').promises;
const path = require('path');

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    access: jest.fn()
  }
}));

describe('TestCoverageAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    jest.clearAllMocks();
    analyzer = new TestCoverageAnalyzer('/test/project');
  });

  describe('analyzeFile', () => {
    it('should return empty result when source file path is not specified', async () => {
      const result = await analyzer.analyzeFile('Not specified');

      expect(result).toEqual({
        hasTests: false,
        testFile: null,
        totalTests: 0,
        describeBlocks: 0,
        testCategories: []
      });
    });

    it('should return empty result when test file not found', async () => {
      fs.access.mockRejectedValue(new Error('ENOENT'));

      const result = await analyzer.analyzeFile('lib/processor.js');

      expect(result.hasTests).toBe(false);
    });

    it('should find test file in tests/unit/ directory', async () => {
      fs.access.mockImplementation((filePath) => {
        if (filePath.includes('tests/unit/processor.test.js')) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('ENOENT'));
      });

      fs.readFile.mockResolvedValue(`
        describe('Processor', () => {
          it('should process commits', () => {});
          it('should handle errors', () => {});
        });
      `);

      const result = await analyzer.analyzeFile('lib/processor.js');

      expect(result.hasTests).toBe(true);
      expect(result.testFile).toContain('tests/unit/processor.test.js');
      expect(result.totalTests).toBe(2);
      expect(result.describeBlocks).toBe(1);
    });

    it('should extract test statistics from test content', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(`
        describe('Component', () => {
          describe('method1', () => {
            it('should work', () => {});
            it('should handle errors', () => {});
          });

          describe('method2', () => {
            it('should work', () => {});
          });
        });
      `);

      const result = await analyzer.analyzeFile('lib/component.js');

      expect(result.totalTests).toBe(3);
      expect(result.describeBlocks).toBe(3);
    });

    it('should extract test categories from describe blocks', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(`
        describe('Component', () => {
          describe('Creation', () => {
            it('should create instance', () => {});
          });

          describe('Usage', () => {
            it('should work', () => {});
          });
        });
      `);

      const result = await analyzer.analyzeFile('lib/component.js');

      expect(result.testCategories).toContain('Component');
      expect(result.testCategories).toContain('Creation');
      expect(result.testCategories).toContain('Usage');
      expect(result.testCategories.length).toBe(3);
    });

    it('should count test() function calls as tests', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(`
        test('first test', () => {});
        test('second test', () => {});
        it('third test', () => {});
      `);

      const result = await analyzer.analyzeFile('lib/component.js');

      expect(result.totalTests).toBe(3);
    });

    it('should handle test files with no describe blocks', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(`
        it('standalone test 1', () => {});
        it('standalone test 2', () => {});
      `);

      const result = await analyzer.analyzeFile('lib/component.js');

      expect(result.totalTests).toBe(2);
      expect(result.describeBlocks).toBe(0);
    });

    it('should return empty result on file read error', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockRejectedValue(new Error('Permission denied'));

      const result = await analyzer.analyzeFile('lib/component.js');

      expect(result.hasTests).toBe(false);
    });
  });

  describe('generateSummary', () => {
    it('should return "No tests" message when no tests found', async () => {
      fs.access.mockRejectedValue(new Error('ENOENT'));

      const summary = await analyzer.generateSummary('lib/component.js');

      expect(summary).toBe('No automated tests found.');
    });

    it('should generate formatted summary with test counts', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(`
        describe('Component', () => {
          it('test 1', () => {});
          it('test 2', () => {});
          it('test 3', () => {});
        });
      `);

      const summary = await analyzer.generateSummary('lib/component.js');

      expect(summary).toContain('Test Coverage');
      expect(summary).toContain('3 test cases');
      expect(summary).toContain('1 test suite');
    });

    it('should use singular form for single test', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(`
        describe('Component', () => {
          it('test 1', () => {});
        });
      `);

      const summary = await analyzer.generateSummary('lib/component.js');

      expect(summary).toContain('1 test case');
      expect(summary).toContain('1 test suite');
    });

    it('should include test categories when available', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(`
        describe('Component', () => {
          describe('Creation', () => {
            it('test', () => {});
          });
        });
      `);

      const summary = await analyzer.generateSummary('lib/component.js');

      expect(summary).toContain('Test categories: Component, Creation');
    });

    it('should include relative test file path', async () => {
      analyzer = new TestCoverageAnalyzer('/test/project');
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue('it("test", () => {});');

      const summary = await analyzer.generateSummary('lib/component.js');

      expect(summary).toContain('tests/unit/component.test.js');
    });
  });

  describe('_findTestFile', () => {
    it('should try multiple test file patterns', async () => {
      const accessCalls = [];
      fs.access.mockImplementation((filePath) => {
        accessCalls.push(filePath);
        return Promise.reject(new Error('ENOENT'));
      });

      await analyzer._findTestFile('lib/processor.js');

      // Should have tried multiple patterns
      expect(accessCalls.length).toBeGreaterThan(3);
      expect(accessCalls.some(p => p.includes('tests/unit'))).toBe(true);
      expect(accessCalls.some(p => p.includes('tests/integration'))).toBe(true);
    });

    it('should return first matching test file', async () => {
      fs.access.mockImplementation((filePath) => {
        if (filePath.includes('tests/unit/processor.test.js')) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('ENOENT'));
      });

      const testFile = await analyzer._findTestFile('lib/processor.js');

      expect(testFile).toContain('tests/unit/processor.test.js');
    });

    it('should return null when no test file found', async () => {
      fs.access.mockRejectedValue(new Error('ENOENT'));

      const testFile = await analyzer._findTestFile('lib/processor.js');

      expect(testFile).toBeNull();
    });
  });

  describe('_extractTestStats', () => {
    it('should handle empty test content', () => {
      const stats = analyzer._extractTestStats('');

      expect(stats).toEqual({
        totalTests: 0,
        describeBlocks: 0,
        testTypes: [],
        testCategories: []
      });
    });

    it('should extract stats from complex test file', () => {
      const testContent = `
        describe('Component', () => {
          describe('Method 1', () => {
            it('should work', () => {});
            it('should handle edge cases', () => {});
          });

          describe('Method 2', () => {
            test('basic test', () => {});
            test('advanced test', () => {});
          });

          it('standalone test', () => {});
        });
      `;

      const stats = analyzer._extractTestStats(testContent);

      expect(stats.totalTests).toBe(5);
      expect(stats.describeBlocks).toBe(3);
      expect(stats.testCategories).toContain('Component');
      expect(stats.testCategories).toContain('Method 1');
      expect(stats.testCategories).toContain('Method 2');
    });
  });
});
