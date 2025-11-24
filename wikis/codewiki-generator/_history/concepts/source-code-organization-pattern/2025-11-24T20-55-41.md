---
title: Source code organization pattern
category: concept
sourceFile: jest.config.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Source Code Organization Pattern

## Purpose and Overview

The source code organization pattern establishes a standardized project structure that separates library code into a dedicated `lib/` directory while keeping test files alongside their corresponding source files. This pattern promotes clear separation of concerns while maintaining close proximity between implementation and test code for better maintainability.

## Key Functionality

This organizational pattern defines two key structural conventions:

- **Library code location**: All main source code resides in the `lib/` directory, creating a clean separation between implementation files and project configuration
- **Test file naming and placement**: Test files use the `.test.js` suffix and are placed alongside their corresponding source files, enabling developers to easily locate and maintain related test code

The pattern supports efficient test discovery and execution through the Jest testing framework, which automatically identifies and runs files matching the `.test.js` pattern within the project structure.

## Relationships

This organization pattern directly supports the test infrastructure configuration defined in `jest.config.js`, which relies on the standardized file naming conventions for test discovery. The pattern enables the testing framework to automatically locate test files and establish proper coverage reporting for the codebase, particularly supporting wiki manager functionality testing.

## Usage Example

When following this organization pattern, your project structure should look like:

```javascript
// Project structure example:
// lib/
//   ├── component.js           // Main implementation
//   ├── component.test.js      // Tests for component
//   ├── utils/
//   │   ├── helper.js          // Utility implementation  
//   │   └── helper.test.js     // Tests for helper
//   └── index.js               // Main entry point

// Test files automatically discovered by Jest
// No additional configuration needed for test discovery
```

To add new components following this pattern:

```javascript
// lib/newFeature.js - implementation file
module.exports = { /* your implementation */ };

// lib/newFeature.test.js - corresponding test file  
const newFeature = require('./newFeature');
// Jest will automatically discover and run this test
```

## Testing

No automated tests found for the organization pattern itself, as this is an architectural convention enforced through project structure and tooling configuration.