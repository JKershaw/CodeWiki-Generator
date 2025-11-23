# WikiContextService API Documentation

## Overview

`WikiContextService` is a backend service that provides intelligent context research for development tasks by analyzing wiki pages. It uses AI (Claude) to understand relevance and extract meaningful information, going beyond simple keyword matching.

## Installation

```javascript
const WikiContextService = require('./lib/wiki-context-service');
```

## Constructor

### `new WikiContextService(options)`

Creates a new WikiContextService instance.

**Parameters:**
- `options` (Object, optional):
  - `wikiBasePath` (string): Base path where all wikis are stored. Default: `'./wikis'`
  - `claudeClient` (ClaudeClient): Optional ClaudeClient instance (useful for testing)

**Example:**
```javascript
const service = new WikiContextService({
  wikiBasePath: './my-wikis'
});
```

## Methods

### `research(query, projectName)`

Research wiki content to find relevant context for a task.

**Parameters:**
- `query` (string, required): The task or question to research
- `projectName` (string, required): Name of the project (wiki subdirectory)

**Returns:** `Promise<Object>` - Research results with structured context

**Throws:**
- Error if query or projectName is invalid
- Error if no wiki pages are found
- Error if API call fails

**Example:**
```javascript
const results = await service.research(
  'implement dark mode toggle',
  'my-app'
);
```

### `getStatistics()`

Get service statistics for monitoring API usage.

**Returns:** `Object` with:
- `totalTokens` (number): Total tokens used
- `totalCost` (number): Total cost in USD
- `requestCount` (number): Number of API requests made

**Example:**
```javascript
const stats = service.getStatistics();
console.log(`Cost: $${stats.totalCost.toFixed(4)}`);
```

### `resetStatistics()`

Reset statistics counters.

**Example:**
```javascript
service.resetStatistics();
```

## Response Format

The `research()` method returns an object with the following structure:

```javascript
{
  // High-level summary (2-3 sentences)
  summary: "Overview of what the developer needs to know",

  // Top 5 relevant pages with excerpts
  relevantPages: [
    {
      path: "path/to/page.md",
      title: "Page Title",
      relevance: "Why this page is relevant",
      excerpt: "Brief excerpt from the page"
    }
  ],

  // Key components with locations
  keyComponents: [
    {
      name: "Component Name",
      purpose: "What it does",
      location: "lib/component.js"
    }
  ],

  // Key concepts with explanations
  keyConcepts: [
    {
      concept: "Concept Name",
      description: "Brief explanation",
      application: "How it applies to this task"
    }
  ],

  // Step-by-step implementation guidance
  implementationGuidance: [
    "Step 1: Clear, actionable step",
    "Step 2: Another step"
  ],

  // Related file paths
  relatedFiles: [
    "path/to/file.js",
    "path/to/another.js"
  ],

  // Metadata
  metadata: {
    pageCount: 5,
    timestamp: "2025-11-23T10:30:00.000Z"
  }
}
```

## Usage Examples

### Basic Usage

```javascript
const WikiContextService = require('./lib/wiki-context-service');

async function example() {
  const service = new WikiContextService();

  const results = await service.research(
    'add authentication system',
    'my-project'
  );

  console.log('Summary:', results.summary);
  console.log('Relevant pages:', results.relevantPages.length);
  console.log('Implementation steps:', results.implementationGuidance);
}
```

### Express.js Integration

```javascript
const express = require('express');
const WikiContextService = require('./lib/wiki-context-service');

const app = express();
const wikiService = new WikiContextService();

app.post('/api/wiki/research', async (req, res) => {
  try {
    const { query, projectName } = req.body;

    if (!query || !projectName) {
      return res.status(400).json({
        error: 'Query and projectName are required'
      });
    }

    const results = await wikiService.research(query, projectName);

    res.json({
      success: true,
      data: results,
      statistics: wikiService.getStatistics()
    });
  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### React Frontend Integration

```javascript
async function researchWiki(query, projectName) {
  try {
    const response = await fetch('/api/wiki/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, projectName })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return data.data;
  } catch (error) {
    console.error('Failed to research wiki:', error);
    throw error;
  }
}

// Usage in component
const results = await researchWiki('implement user settings', 'my-app');
```

### Custom Claude Client (for Testing)

```javascript
const WikiContextService = require('./lib/wiki-context-service');

// Create mock Claude client for testing
const mockClaudeClient = {
  sendMessage: jest.fn().mockResolvedValue(mockResponse),
  getCostSummary: jest.fn().mockReturnValue({ totalCost: 0 }),
  resetCost: jest.fn()
};

const service = new WikiContextService({
  claudeClient: mockClaudeClient
});
```

## Error Handling

The service provides clear error messages for common issues:

### Invalid Parameters
```javascript
// Throws: "Query must be a non-empty string"
await service.research('', 'project');

// Throws: "Project name must be a non-empty string"
await service.research('query', null);
```

### No Wiki Pages Found
```javascript
// Throws: "No wiki pages found in /path/to/wiki/project"
await service.research('query', 'non-existent-project');
```

### API Failures
```javascript
try {
  const results = await service.research('query', 'project');
} catch (error) {
  if (error.message.includes('Failed to analyze wiki content')) {
    // Handle API error (rate limit, network issue, etc.)
  } else if (error.message.includes('Could not parse research results')) {
    // Handle malformed response
  }
}
```

## Performance Considerations

### Token Usage

The service sends all wiki pages to the AI for analysis. For large wikis:
- Estimated tokens: ~4 characters per token
- Typical request: 2,000-4,000 tokens
- Cost: ~$0.01-0.02 per request (with Claude Sonnet 4)

### Caching Recommendations

For production use, consider implementing caching:

```javascript
const cache = new Map();

async function cachedResearch(query, projectName) {
  const cacheKey = `${projectName}:${query}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const results = await service.research(query, projectName);
  cache.set(cacheKey, results);

  // Expire cache after 1 hour
  setTimeout(() => cache.delete(cacheKey), 3600000);

  return results;
}
```

## Testing

The service includes comprehensive unit tests. Run with:

```bash
npm test -- tests/unit/wiki-context-service.test.js
```

### Test Coverage

- ✅ Constructor initialization
- ✅ Parameter validation
- ✅ Wiki page reading and parsing
- ✅ Frontmatter parsing
- ✅ Category inference
- ✅ Title extraction
- ✅ Claude API integration
- ✅ Response parsing and formatting
- ✅ Error handling
- ✅ Statistics tracking

## Comparison with CLI Tool

| Feature | CLI (`wiki-context.js`) | Service (`WikiContextService`) |
|---------|------------------------|--------------------------------|
| Usage | Command-line interface | Programmatic API |
| Output | Formatted console text | Structured JSON objects |
| Integration | Scripts and shells | Web apps, APIs, other code |
| Customization | Limited | Full control |
| Testing | Difficult | Easy with mocks |

## Internal Methods

The following private methods are available but not intended for external use:

- `_getAllPagesWithContent(wikiManager)` - Reads all wiki pages
- `_parseFrontmatter(content)` - Extracts metadata from markdown
- `_getTitleFromPath(filePath)` - Generates title from filename
- `_inferCategory(filePath)` - Determines page category
- `_buildResearchPrompt(query, wikiIndex, allPages)` - Creates AI prompt
- `_parseResponse(response)` - Validates AI response
- `_formatResults(results)` - Structures final output

## Dependencies

- `WikiManager` - For reading wiki files
- `ClaudeClient` - For AI analysis
- `fs.promises` - For file operations
- `path` - For path manipulation

## Future Enhancements

Potential improvements:

1. **Incremental Updates**: Cache wiki content and only re-analyze changed pages
2. **Relevance Scoring**: Add numerical scores to rank results
3. **Multi-language Support**: Handle wikis in different languages
4. **Embeddings**: Use vector embeddings for semantic search
5. **Streaming**: Stream results as they're generated
6. **Pagination**: Support for very large wikis with pagination

## Support

For issues or questions:
1. Check the example code in `/examples/wiki-context-service-example.js`
2. Review unit tests in `/tests/unit/wiki-context-service.test.js`
3. Consult the main project README

## License

Part of the CodeWiki-Generator project.
