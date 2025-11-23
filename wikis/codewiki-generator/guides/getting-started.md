---
related: [concepts/web-dashboard-architecture.md, concepts/test-coverage-integration.md, concepts/real-time-status-monitoring.md, components/dashboard-controller.md, components/test-coverage-analyzer-class.md]
updated: 2025-11-23
---

# Getting Started with CodeWiki-Generator

This guide will help you set up and run the CodeWiki-Generator locally for development or usage.

## Prerequisites

- Node.js 14+ installed
- npm package manager
- Git for cloning the repository

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/CodeWiki-Generator.git
   cd CodeWiki-Generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Access the web dashboard**:
   - Open your browser and navigate to `http://localhost:3000`
   - You should see the Dashboard Control Interface

3. **Expected output**:
   ```
   Server running on http://localhost:3000
   Documentation generator initialized
   Test coverage analyzer ready
   ```

## Running Tests

1. **Run the test suite**:
   ```bash
   npm test
   ```

2. **Run tests with coverage**:
   ```bash
   npm run test:coverage
   ```

## Next Steps

- Explore the **[Web Dashboard Architecture](../concepts/web-dashboard-architecture.md)** to understand the interface
- Check out **[Test Coverage Integration](../concepts/test-coverage-integration.md)** for testing documentation
- Review **[Real-time Status Monitoring](../concepts/real-time-status-monitoring.md)** concepts for system health
- Use the **[DashboardController](../components/dashboard-controller.md)** to manage documentation generation

## Quick Verification

To verify everything is working:
1. Start the server with `npm start`
2. Visit `http://localhost:3000`
3. Run tests with `npm test`
4. Check that the [TestCoverageAnalyzer class](../components/test-coverage-analyzer-class.md) is functioning in the dashboard