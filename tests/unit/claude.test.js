const ClaudeClient = require('../../lib/claude');
const config = require('../../lib/config');

describe('ClaudeClient', () => {
  let claudeClient;
  let mockAnthropic;

  beforeEach(() => {
    // Create mock Anthropic instance
    mockAnthropic = {
      messages: {
        create: jest.fn()
      }
    };

    // In test mode, ClaudeClient should use mocks
    claudeClient = new ClaudeClient();
    // Inject mock for testing
    claudeClient.client = mockAnthropic;
  });

  describe('constructor', () => {
    it('should initialize with API key from config', () => {
      const client = new ClaudeClient();
      expect(client).toBeDefined();
    });

    it('should accept custom API key', () => {
      const client = new ClaudeClient('custom-api-key');
      expect(client).toBeDefined();
    });

    it('should initialize cost tracking', () => {
      expect(claudeClient.totalCost).toBe(0);
      expect(claudeClient.totalTokens).toBe(0);
    });
  });

  describe('sendMessage', () => {
    it('should send message and return response', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'This is the response' }],
        usage: { input_tokens: 100, output_tokens: 50 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      const response = await claudeClient.sendMessage('Test prompt');

      expect(response).toBe('This is the response');
      expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: expect.any(String),
          messages: [{ role: 'user', content: 'Test prompt' }]
        })
      );
    });

    it('should use specified model', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
        usage: { input_tokens: 10, output_tokens: 10 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      await claudeClient.sendMessage('Prompt', { model: 'claude-3-haiku-20240307' });

      expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-3-haiku-20240307'
        })
      );
    });

    it('should respect max_tokens option', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
        usage: { input_tokens: 10, output_tokens: 10 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      await claudeClient.sendMessage('Prompt', { maxTokens: 1000 });

      expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          max_tokens: 1000
        })
      );
    });

    it('should track tokens and cost', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
        usage: { input_tokens: 100, output_tokens: 50 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      await claudeClient.sendMessage('Prompt');

      expect(claudeClient.totalTokens).toBe(150);
      expect(claudeClient.totalCost).toBeGreaterThan(0);
    });

    it('should handle API rate limit errors with retry', async () => {
      const rateLimitError = new Error('rate_limit_error');
      rateLimitError.status = 429;

      const successResponse = {
        content: [{ type: 'text', text: 'Success after retry' }],
        usage: { input_tokens: 10, output_tokens: 10 }
      };

      mockAnthropic.messages.create
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce(successResponse);

      const response = await claudeClient.sendMessage('Prompt');

      expect(response).toBe('Success after retry');
      expect(mockAnthropic.messages.create).toHaveBeenCalledTimes(2);
    });

    it('should throw on authentication errors without retry', async () => {
      const authError = new Error('invalid_api_key');
      authError.status = 401;

      mockAnthropic.messages.create.mockRejectedValue(authError);

      await expect(claudeClient.sendMessage('Prompt')).rejects.toThrow('invalid_api_key');
      expect(mockAnthropic.messages.create).toHaveBeenCalledTimes(1);
    });

    it('should retry timeout errors', async () => {
      const timeoutError = new Error('timeout');
      timeoutError.status = 408;

      const successResponse = {
        content: [{ type: 'text', text: 'Success after retry' }],
        usage: { input_tokens: 10, output_tokens: 10 }
      };

      mockAnthropic.messages.create
        .mockRejectedValueOnce(timeoutError)
        .mockResolvedValueOnce(successResponse);

      const response = await claudeClient.sendMessage('Prompt');

      expect(response).toBe('Success after retry');
      expect(mockAnthropic.messages.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendMessageJSON', () => {
    it('should parse valid JSON response', async () => {
      const jsonData = { concepts: ['Auth', 'Database'], codeElements: [] };
      const mockResponse = {
        content: [{ type: 'text', text: JSON.stringify(jsonData) }],
        usage: { input_tokens: 50, output_tokens: 30 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      const result = await claudeClient.sendMessageJSON('Analyze this code');

      expect(result).toEqual(jsonData);
    });

    it('should handle malformed JSON gracefully', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Not valid JSON {{{' }],
        usage: { input_tokens: 50, output_tokens: 10 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      await expect(claudeClient.sendMessageJSON('Prompt')).rejects.toThrow();
    });

    it('should extract JSON from markdown code blocks', async () => {
      const jsonData = { test: 'value' };
      const mockResponse = {
        content: [{
          type: 'text',
          text: '```json\n' + JSON.stringify(jsonData) + '\n```'
        }],
        usage: { input_tokens: 50, output_tokens: 20 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      const result = await claudeClient.sendMessageJSON('Prompt');

      expect(result).toEqual(jsonData);
    });
  });

  describe('estimateTokens', () => {
    it('should estimate token count for text', () => {
      const text = 'This is a test sentence with several words.';
      const estimate = claudeClient.estimateTokens(text);

      expect(estimate).toBeGreaterThan(0);
      expect(typeof estimate).toBe('number');
    });

    it('should return 0 for empty text', () => {
      expect(claudeClient.estimateTokens('')).toBe(0);
    });

    it('should handle large text', () => {
      const largeText = 'word '.repeat(1000);
      const estimate = claudeClient.estimateTokens(largeText);

      expect(estimate).toBeGreaterThan(1000);
    });
  });

  describe('calculateCost', () => {
    it('should calculate cost for input and output tokens', () => {
      const cost = claudeClient.calculateCost(1000, 500);

      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('should handle zero tokens', () => {
      expect(claudeClient.calculateCost(0, 0)).toBe(0);
    });

    it('should track cumulative cost', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
        usage: { input_tokens: 100, output_tokens: 50 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      await claudeClient.sendMessage('Prompt 1');
      const cost1 = claudeClient.totalCost;

      await claudeClient.sendMessage('Prompt 2');
      const cost2 = claudeClient.totalCost;

      expect(cost2).toBeGreaterThan(cost1);
      expect(cost2).toBe(cost1 * 2); // Same token usage both times
    });
  });

  describe('getCostSummary', () => {
    it('should return cost summary', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
        usage: { input_tokens: 1000, output_tokens: 500 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      await claudeClient.sendMessage('Prompt');

      const summary = claudeClient.getCostSummary();

      expect(summary).toHaveProperty('totalTokens');
      expect(summary).toHaveProperty('totalCost');
      expect(summary).toHaveProperty('requestCount');
      expect(summary.totalTokens).toBe(1500);
      expect(summary.requestCount).toBe(1);
    });
  });

  describe('resetCost', () => {
    it('should reset cost tracking', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
        usage: { input_tokens: 100, output_tokens: 50 }
      };

      mockAnthropic.messages.create.mockResolvedValue(mockResponse);

      await claudeClient.sendMessage('Prompt');

      expect(claudeClient.totalCost).toBeGreaterThan(0);

      claudeClient.resetCost();

      expect(claudeClient.totalCost).toBe(0);
      expect(claudeClient.totalTokens).toBe(0);
      expect(claudeClient.requestCount).toBe(0);
    });
  });
});
