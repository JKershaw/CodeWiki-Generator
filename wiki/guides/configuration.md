---
related: [components/dashboard-control-interface.md, concepts/production-ready-server-configuration.md, concepts/test-coverage-documentation-system.md, components/web-dashboard-control-interface.md, concepts/test-aware-documentation-generation.md]
updated: 2025-11-23
---

# Configuration Guide

This guide covers how to configure CodeWiki-Generator for different environments and use cases.

## Server Configuration

### Basic Configuration

The **[Production-ready server configuration](../concepts/production-ready-server-configuration.md)** supports multiple environments:

```javascript
// Default configuration
{
  port: 3000,
  host: 'localhost',
  environment: 'development'
}
```

### Environment Variables

```bash
# Server settings
PORT=3000
HOST=localhost
NODE_ENV=production

# Documentation settings
DOCS_OUTPUT_DIR=./wiki
DOCS_TEMPLATE_DIR=./templates

# Test coverage settings
COVERAGE_THRESHOLD=80
COVERAGE_REPORTS=true
```

## Dashboard Configuration

### Web Dashboard Architecture Settings

**[Dashboard Control Interface](../components/dashboard-control-interface.md)** options:

```javascript
{
  dashboard: {
    enabled: true,
    theme: 'default',
    realTimeUpdates: true,
    statusMonitoring: true
  }
}
```

### DashboardController Configuration

```javascript
{
  controller: {
    autoGenerate: false,
    batchSize: 10,
    processingMode: 'stepwise',
    errorHandling: 'graceful'
  }
}
```

## Documentation Generation Settings

### Context-enriched Documentation Generation

```javascript
{
  documentation: {
    contextLevel: 'detailed',    // basic, detailed, comprehensive
    includeTests: true,
    includeMetadata: true,
    outputFormat: 'markdown'
  }
}
```

### Wiki Integration Options

```javascript
{
  wiki: {
    structure: {
      concepts: './concepts/',
      components: './components/',
      index: './index.md'
    },
    autoUpdate: true,
    versionTracking: true
  }
}
```

## Test Configuration

### TestCoverageAnalyzer Settings

```javascript
{
  testCoverage: {
    threshold: 80,
    reportFormat: ['html', 'json'],
    includeUntested: true,
    realTimeAnalysis: true
  }
}
```

### Test Coverage Integration

```javascript
{
  coverage: {
    integration: {
      documentationSync: true,
      badgeGeneration: true,
      metadataTracking: true
    }
  }
}
```

## Monitoring Configuration

### Real-time Status Monitoring

```javascript
{
  monitoring: {
    enabled: true,
    interval: 5000,        // 5 seconds
    endpoints: ['health', 'coverage', 'docs'],
    alerting: {
      enabled: true,
      thresholds: {
        coverage: 80,
        errors: 5
      }
    }
  }
}
```

### Source File Metadata Tracking

```javascript
{
  metadata: {
    tracking: {
      fileChanges: true,
      testAssociation: true,
      coverageMapping: true,
      lastModified: true
    }
  }
}
```

## Processing Configuration

### Step-wise Processing Control

```javascript
{
  processing: {
    mode: 'stepwise',     // batch, stepwise, realtime
    steps: [
      'analyze',
      'generate',
      'test',
      'document'
    ],
    errorHandling: 'continue',  // stop, continue, retry
    parallelism: 4
  }
}
```

## Configuration File Locations

### Default Configuration Files

- `config/default.json` - Base configuration
- `config/development.json` - Development overrides
- `config/production.json` - Production settings
- `config/test.json` - Test environment settings

### Express Web Interface Configuration

```javascript
{
  express: {
    middleware: {
      cors: true,
      compression: true,
      logging: 'combined'
    },
    static: {
      path: './public',
      maxAge: '1d'
    }
  }
}
```

## Configuration Validation

### Startup Validation

The system validates configuration on startup:

1. **[Test Coverage Documentation System](../concepts/test-coverage-documentation-system.md)** checks coverage thresholds
2. **[Web Dashboard Control Interface](../components/web-dashboard-control-interface.md)** validates dashboard settings
3. **[Test-aware Documentation Generation](../concepts/test-aware-documentation-generation.md)** verifies test integration

### Runtime Configuration Updates

Some settings can be updated via the **[Dashboard Control Interface](../components/dashboard-control-interface.md)**:

- Documentation generation frequency
- Test coverage thresholds
- Monitoring intervals
- Processing batch sizes

## Environment-Specific Examples

### Development
```bash
NODE_ENV=development
PORT=3000
COVERAGE_THRESHOLD=70
REAL_TIME_UPDATES=true
```

### Production
```bash
NODE_ENV=production
PORT=8080
COVERAGE_THRESHOLD=85
ERROR_LOGGING=detailed
```