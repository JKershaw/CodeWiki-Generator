const config = require('./config');

// Lazy load Anthropic SDK only when needed (not in test mode)
let Anthropic = null;

/**
 * ClaudeClient wraps the Anthropic SDK for AI processing
 */
class ClaudeClient {
  constructor(apiKey = null) {
    const key = apiKey || config.anthropicApiKey;

    // In test mode, don't create real Anthropic client
    if (config.isTestMode()) {
      this.client = null; // Will be mocked in tests
    } else {
      // Lazy load Anthropic only when actually needed
      if (!Anthropic) {
        Anthropic = require('@anthropic-ai/sdk').default;
      }
      this.client = new Anthropic({
        apiKey: key
      });
    }

    // Cost tracking
    this.totalCost = 0;
    this.totalTokens = 0;
    this.requestCount = 0;

    // Default model from spec
    this.defaultModel = 'claude-sonnet-4-20250514';
    this.defaultMaxTokens = 2000;

    // Retry configuration
    this.retryDelay = 2000;
    this.maxRetries = 3;

    // Pricing (per million tokens)
    this.pricing = {
      'claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
      'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 }
    };
  }

  /**
   * Send a message to Claude and get text response
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Options (model, maxTokens, systemPrompt)
   * @returns {string} The response text
   */
  async sendMessage(prompt, options = {}) {
    const {
      model = this.defaultModel,
      maxTokens = this.defaultMaxTokens,
      systemPrompt = null
    } = options;

    const response = await this._retryRequest(async () => {
      const params = {
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      };

      if (systemPrompt) {
        params.system = systemPrompt;
      }

      return await this.client.messages.create(params);
    });

    // Track usage
    const { input_tokens, output_tokens } = response.usage;
    this._trackUsage(input_tokens, output_tokens, model);

    // Extract text from response
    return response.content[0].text;
  }

  /**
   * Send a message expecting JSON response
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Options (model, maxTokens, systemPrompt)
   * @returns {Object} Parsed JSON response
   */
  async sendMessageJSON(prompt, options = {}) {
    const responseText = await this.sendMessage(prompt, options);

    // Try to extract JSON from markdown code blocks if present
    let jsonText = responseText.trim();

    // Check for markdown code block: ```json ... ```
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    // Parse JSON
    try {
      return JSON.parse(jsonText);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error.message}\nResponse: ${responseText.substring(0, 200)}`);
    }
  }

  /**
   * Estimate token count for text (rough approximation)
   * @param {string} text - Text to estimate
   * @returns {number} Estimated token count
   */
  estimateTokens(text) {
    if (!text) return 0;

    // Rough estimation: ~4 characters per token for English text
    // This is a conservative estimate; actual count may vary
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate cost for given token usage
   * @param {number} inputTokens - Number of input tokens
   * @param {number} outputTokens - Number of output tokens
   * @param {string} model - Model name
   * @returns {number} Cost in USD
   */
  calculateCost(inputTokens, outputTokens, model = this.defaultModel) {
    const pricing = this.pricing[model] || this.pricing[this.defaultModel];

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return inputCost + outputCost;
  }

  /**
   * Get cost summary
   * @returns {Object} Cost summary
   */
  getCostSummary() {
    return {
      totalTokens: this.totalTokens,
      totalCost: this.totalCost,
      requestCount: this.requestCount
    };
  }

  /**
   * Reset cost tracking
   */
  resetCost() {
    this.totalCost = 0;
    this.totalTokens = 0;
    this.requestCount = 0;
  }

  /**
   * Track usage from API response
   * @private
   */
  _trackUsage(inputTokens, outputTokens, model) {
    const cost = this.calculateCost(inputTokens, outputTokens, model);

    this.totalTokens += inputTokens + outputTokens;
    this.totalCost += cost;
    this.requestCount += 1;
  }

  /**
   * Retry a request with exponential backoff
   * @private
   */
  async _retryRequest(requestFn, attempt = 1) {
    try {
      return await requestFn();
    } catch (error) {
      // Don't retry on authentication errors
      if (error.status === 401) {
        throw error;
      }

      // Retry on rate limits or timeouts
      if (attempt < this.maxRetries) {
        const shouldRetry = error.status === 429 || // Rate limit
                           error.status === 408 || // Timeout
                           error.status === 529;   // Overloaded

        if (shouldRetry) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this._sleep(delay);
          return await this._retryRequest(requestFn, attempt + 1);
        }
      }

      throw error;
    }
  }

  /**
   * Sleep for specified milliseconds
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ClaudeClient;
