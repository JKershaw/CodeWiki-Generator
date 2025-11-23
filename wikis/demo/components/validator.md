---
title: Validator Component
type: component
sourceFile: src/validator.js
created: 2025-11-23
updated: 2025-11-23
related:
  - components/calculator.md
  - concepts/test-driven-development.md
---

# Validator Component

## Purpose and Overview

The Validator component provides a comprehensive set of validation utilities for user input, data integrity, and type checking. It ensures data quality and prevents invalid data from propagating through the application.

## Key Functionality

### Type Validation

**isNumber(value)**: Checks if value is a valid number
- Returns `true` for integers and floats
- Returns `false` for NaN, Infinity, strings
- Handles edge cases like `0`, negative numbers

**isString(value)**: Validates string type
- Returns `true` for string primitives and String objects
- Handles empty strings
- Returns `false` for null/undefined

**isArray(value)**: Checks for array type
- Uses Array.isArray() internally
- Returns `false` for array-like objects

### Data Validation

**isEmail(value)**: Validates email format
- Checks for basic email structure (user@domain.ext)
- Returns boolean, does not throw errors
- Does not verify email deliverability

**isNotEmpty(value)**: Ensures value has content
- Trims whitespace before checking
- Returns `false` for null, undefined, empty strings
- Returns `true` for any non-empty content

**isInRange(value, min, max)**: Validates numeric range
- Checks value is between min and max (inclusive)
- Requires value to be a number
- Throws TypeError for non-numeric inputs

### Validation Helpers

**validate(value, rules)**: Runs multiple validations
- Accepts array of validation functions
- Returns array of validation results
- Short-circuits on first failure (optional)

## Relationships

**Used By**:
- [Calculator](/wiki/demo/components/calculator) - For input validation
- Form processing modules
- API request handlers
- Database input sanitization

**Patterns**:
- Implements [Test-Driven Development](/wiki/demo/concepts/test-driven-development) approach
- Follows fail-fast principle

## Usage Example

```javascript
const Validator = require('./src/validator');

// Type checking
Validator.isNumber(42);        // true
Validator.isNumber('42');      // false
Validator.isString('hello');   // true

// Email validation
Validator.isEmail('user@example.com');  // true
Validator.isEmail('invalid-email');     // false

// Range validation
Validator.isInRange(5, 1, 10);   // true
Validator.isInRange(15, 1, 10);  // false

// Empty check
Validator.isNotEmpty('hello');   // true
Validator.isNotEmpty('   ');     // false
Validator.isNotEmpty(null);      // false

// Combined validation
const rules = [
  (value) => Validator.isString(value),
  (value) => Validator.isNotEmpty(value),
  (value) => Validator.isEmail(value)
];

const isValidEmail = Validator.validate('user@test.com', rules);
// Returns [true, true, true] if all validations pass
```

## Testing

**Test Coverage**: tests/unit/validator.test.js
- 32 test cases across 8 test suites
- Type validation: numbers, strings, arrays, objects
- Data validation: emails, ranges, empty values
- Edge cases: null, undefined, empty strings, whitespace
- Error handling: invalid ranges, type mismatches

**Coverage**: 98% - All primary code paths tested (edge case logging uncovered)
