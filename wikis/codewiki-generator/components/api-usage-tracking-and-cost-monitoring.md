---
title: API usage tracking and cost monitoring
category: component
sourceFile: examples/wiki-context-service-example.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# API Usage Tracking and Cost Monitoring

## Purpose and Overview

The WikiContextService provides comprehensive API usage tracking and cost monitoring capabilities to help developers monitor AI API consumption during wiki research operations. This component tracks token usage, calculates costs, and counts requests to provide insights into resource utilization and associated expenses.

## Key Functionality

The API usage tracking system monitors several key metrics:

- **Token Usage Tracking**: Records input and output tokens consumed during AI API calls
- **Cost Calculation**: Computes actual costs based on token usage and API pricing models
- **Request Counting**: Maintains counters for total API requests made during research operations
- **Statistics Reporting**: Provides detailed usage statistics including cost breakdown and performance metrics

The monitoring system operates transparently during wiki research operations, collecting metrics without impacting the core functionality. Statistics are made available through the service's programmatic interface and can be accessed after research operations complete.

## Relationships

This component integrates directly with the WikiContextService as part of its core functionality:

- Embedded within WikiContextService research operations
- Provides usage data that complements wiki research results
- Supports both CLI and web application deployment patterns
- Works with configurable wiki base paths and project organization structures

## Usage Example

```javascript
const WikiContextService = require('../lib/wiki-context-service');

async function main() {
  const wikiService = new WikiContextService('./wiki');
  
  // Perform research operation
  const result = await wikiService.research('API integration patterns');
  
  // Access usage statistics and cost monitoring data
  const stats = result.metadata.statistics;
  console.log('Token usage:', stats.tokenUsage);
  console.log('Estimated cost:', stats.cost);
  console.log('Request count:', stats.requestCount);
}

// Web application integration
function webAppExample(app) {
  app.get('/api/wiki/research', async (req, res) => {
    const wikiService = new WikiContextService('./wiki');
    const result = await wikiService.research(req.query.topic);
    
    // Include usage tracking in API response
    res.json({
      research: result,
      usage: result.metadata.statistics
    });
  });
}
```

## Testing

No automated tests found for this component. Testing should focus on verifying accurate token counting, cost calculations, and statistics reporting across different usage scenarios.