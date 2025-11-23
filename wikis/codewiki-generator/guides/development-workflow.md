---
related: [components/test-coverage-analyzer-class.md, concepts/step-wise-processing-control.md, components/dashboard-controller.md, components/dashboard-control-interface.md, components/source-file-metadata-tracking.md]
updated: 2025-11-23
---

# Development Workflow

This guide outlines the recommended development process for contributing to CodeWiki-Generator.

## Development Setup

1. **Initial Setup**:
   ```bash
   npm install
   npm start
   ```

2. **Start Development Mode**:
   - Server runs with hot reload
   - Test coverage monitoring active
   - Real-time Status Monitoring enabled

## Feature Development Process

### 1. Planning Phase
- Review existing **Components** and **Concepts**
- Check **[Web Dashboard Architecture](../concepts/web-dashboard-architecture.md)** for integration points
- Plan test coverage using **[TestCoverageAnalyzer class](../components/test-coverage-analyzer-class.md)**

### 2. Development Phase

**[Step-wise Processing Control](../concepts/step-wise-processing-control.md)** approach:

1. **Write Tests First**:
   ```bash
   npm test -- --watch
   ```

2. **Implement Feature**:
   - Follow existing patterns from **[DashboardController](../components/dashboard-controller.md)**
   - Integrate with **[Dashboard Control Interface](../components/dashboard-control-interface.md)**
   - Use **[Source file metadata tracking](../components/source-file-metadata-tracking.md)**

3. **Test Integration**:
   ```bash
   npm test
   npm run test:coverage
   ```

### 3. Documentation Phase

**[Test-driven Documentation Enrichment](../concepts/test-driven-documentation-enrichment.md)**:

1. **Generate Documentation**:
   - Use the web interface at `http://localhost:3000`
   - Leverage **[Context-enriched documentation generation](../concepts/context-enriched-documentation-generation.md)**
   - Update relevant **concepts/architecture.md**

2. **Validate Documentation**:
   - Ensure **[Test-aware documentation generation](../concepts/test-aware-documentation-generation.md)** passes
   - Check **[Test Coverage Integration](../concepts/test-coverage-integration.md)** reports
   - Update **index.md** if needed

## Development Tools

### Web Dashboard
- Access at `http://localhost:3000`
- Monitor development progress
- Generate documentation in real-time
- View test coverage metrics

### Command Line Tools
```bash
# Development server
npm run dev

# Test with coverage
npm run test:coverage

# Generate documentation
npm run docs:generate

# Check system status
npm run status:check
```

## Production Deployment

**[Production-ready Server Configuration](../concepts/production-ready-server-configuration.md)**:

1. **Environment Setup**:
   ```bash
   NODE_ENV=production npm start
   ```

2. **Verification**:
   - **[Real-time Status Monitoring](../concepts/real-time-status-monitoring.md)** shows healthy status
   - All tests pass with `npm test`
   - Documentation generation works via **Express web interface**

## Code Quality Standards

### Before Committing
1. Run full test suite: `npm test`
2. Check test coverage: `npm run test:coverage`
3. Validate documentation generation
4. Ensure **[Real-time Status Monitoring](../concepts/real-time-status-monitoring.md)** reports no issues

### Review Checklist
- Tests cover new functionality
- Documentation updated via **[Wiki Integration](../components/wiki-integration.md)**
- **[DashboardController](../components/dashboard-controller.md)** integration tested
- **[TestCoverageAnalyzer class](../components/test-coverage-analyzer-class.md)** metrics acceptable
- No breaking changes to **[Web dashboard control interface](../components/web-dashboard-control-interface.md)**

## Debugging

### Development Issues
1. Check server logs in terminal
2. Use **[Dashboard Control Interface](../components/dashboard-control-interface.md)** for diagnostics
3. Review **[Source file metadata tracking](../components/source-file-metadata-tracking.md)** for data issues
4. Verify **[Test Coverage Documentation system](../concepts/test-coverage-documentation-system.md)** functionality

### Documentation Issues
1. Use **[Context-enriched documentation generation](../concepts/context-enriched-documentation-generation.md)** debug mode
2. Check **[Step-wise processing control](../concepts/step-wise-processing-control.md)** logs
3. Validate test coverage with **[TestCoverageAnalyzer class](../components/test-coverage-analyzer-class.md)**