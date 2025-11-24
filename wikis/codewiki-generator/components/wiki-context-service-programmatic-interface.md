---
title: WikiContextService programmatic interface
category: component
sourceFile: examples/wiki-context-service-example.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiContextService Programmatic Interface

## Purpose and Overview

The WikiContextService provides a programmatic interface for researching and analyzing wiki content with AI-powered insights. It enables applications to query wiki documentation and receive structured results including summaries, relevant pages, key components, and implementation guidance.

## Key Functionality

The service offers comprehensive wiki research capabilities through its core API:

- **Research Operations**: Performs AI-powered analysis of wiki content based on natural language queries
- **Structured Results**: Returns comprehensive data including summaries, relevant pages, key components, key concepts, implementation guidance, related files, and metadata
- **Usage Tracking**: Monitors API consumption with token usage statistics, cost calculation, and request counting
- **Flexible Integration**: Supports both CLI applications and web service implementations

The service operates on configurable wiki base paths, allowing for project-based wiki organization and research scoping.

## Relationships

- Imports from `../lib/wiki-context-service` as the core service implementation
- Integrates with Express.js for REST API endpoints in web applications  
- Provides patterns for both command-line tools and web service architectures
- Operates on wiki content organized under configurable base directory structures

## Usage Example

### Basic CLI Usage

```javascript
const WikiContextService = require('../lib/wiki-context-service');

async function main() {
    const service = new WikiContextService('./wiki');
    
    const results = await service.research('How do I implement authentication?');
    
    console.log('Summary:', results.summary);
    console.log('Relevant Pages:', results.relevantPages);
    console.log('Key Components:', results.keyComponents);
    console.log('Implementation Guidance:', results.implementationGuidance);
    
    console.log('Usage Stats:', service.getStats());
}

main().catch(console.error);
```

### Web Application Integration

```javascript
const express = require('express');
const WikiContextService = require('../lib/wiki-context-service');

const app = express();
const wikiService = new WikiContextService('./wiki');

app.get('/api/research', async (req, res) => {
    const query = req.query.q;
    const results = await wikiService.research(query);
    res.json(results);
});
```

## Testing

No automated tests are currently available for this component.