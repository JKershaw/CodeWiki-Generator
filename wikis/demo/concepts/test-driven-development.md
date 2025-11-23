---
title: Test-Driven Development
type: concept
created: 2025-11-23
updated: 2025-11-23
related:
  - concepts/continuous-integration.md
  - components/calculator.md
  - components/validator.md
---

# Test-Driven Development (TDD)

## Purpose and Overview

Test-Driven Development (TDD) is a software development methodology where tests are written before the actual implementation code. This approach ensures code quality, prevents regressions, and guides design decisions through a "red-green-refactor" cycle.

## Key Functionality

### The Red-Green-Refactor Cycle

**Red Phase**: Write a failing test
- Define the expected behavior before implementation
- Test should fail because feature doesn't exist yet
- Clarifies requirements and API design

**Green Phase**: Write minimal code to pass the test
- Implement just enough to make the test pass
- Don't optimize prematurely
- Focus on making it work, not making it perfect

**Refactor Phase**: Improve the code
- Clean up implementation while keeping tests green
- Remove duplication
- Improve readability and structure
- Tests ensure refactoring doesn't break functionality

### Benefits in Practice

**Design Guidance**: Writing tests first forces you to think about:
- How the code will be used (API design)
- What inputs and outputs make sense
- Edge cases and error conditions

**Living Documentation**: Tests serve as executable documentation:
- Show how components are intended to be used
- Provide concrete examples of expected behavior
- Stay up-to-date as they must pass for code to work

**Regression Prevention**: Test suite catches:
- Breaking changes when refactoring
- Unintended side effects of new features
- Edge cases that manual testing might miss

## Relationships

**Applied In**:
- [Calculator Component](/wiki/demo/components/calculator) - All operations test-first
- [Validator Component](/wiki/demo/components/validator) - Comprehensive test coverage
- All core utilities and services

**Integrates With**:
- [Continuous Integration](/wiki/demo/concepts/continuous-integration) - Automated test running
- Code review processes
- Deployment pipelines

## Usage Example

### TDD Workflow Example

```javascript
// Step 1: RED - Write failing test
describe('Calculator', () => {
  test('should add two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);  // Test fails - add() doesn't exist
  });
});

// Step 2: GREEN - Minimal implementation
class Calculator {
  add(a, b) {
    return a + b;  // Simplest code to pass
  }
}
// Test now passes

// Step 3: REFACTOR - Improve code
class Calculator {
  add(a, b) {
    // Add validation
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Arguments must be numbers');
    }
    return a + b;
  }
}

// Step 4: Add test for validation
test('should throw error for non-numeric inputs', () => {
  const calc = new Calculator();
  expect(() => calc.add('2', 3)).toThrow(TypeError);
});
```

### Best Practices

**Test Naming**: Be descriptive
```javascript
// Good
test('should throw RangeError when dividing by zero')

// Bad
test('division test')
```

**One Assertion Per Test**: Keep tests focused
```javascript
// Good
test('should return sum of two positive numbers', () => {
  expect(calc.add(2, 3)).toBe(5);
});

test('should return sum of two negative numbers', () => {
  expect(calc.add(-2, -3)).toBe(-5);
});

// Bad
test('addition works', () => {
  expect(calc.add(2, 3)).toBe(5);
  expect(calc.add(-2, -3)).toBe(-5);
  expect(calc.add(0, 5)).toBe(5);
});
```

## Implementation in This Project

**Testing Framework**: Jest 29.7.0
**Coverage Target**: 90%+ for critical components
**Test Organization**:
- Unit tests in `tests/unit/`
- Integration tests in `tests/integration/`
- E2E tests in `tests/e2e/`

**Running Tests**:
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode for TDD
npm run test:coverage   # Generate coverage report
```

## Common Pitfalls

**Over-testing**: Don't test framework code or trivial getters/setters
**Under-testing**: Always test edge cases and error conditions
**Test Coupling**: Tests should be independent and runnable in any order
**Slow Tests**: Keep unit tests fast (< 50ms each); use mocks for external dependencies
