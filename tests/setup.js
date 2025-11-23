/**
 * Test setup file - runs before all tests
 * Ensures tests always use mocks and never call real APIs
 */

// Force TEST_MODE to true during test runs
process.env.TEST_MODE = 'true';

// Prevent accidental API calls during tests
process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
process.env.GITHUB_TOKEN = 'test-token-not-real';

// Set test-friendly defaults
process.env.WIKI_PATH = './test-wiki';
process.env.MAX_DAILY_COST = '100';

// Mock marked (ES module) to avoid import issues in CommonJS tests
jest.mock('marked', () => ({
  marked: {
    parse: jest.fn(async (content) => `<p>${content}</p>`),
    parseInline: jest.fn((content) => content)
  }
}));
