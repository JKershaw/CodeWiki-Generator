---
title: Calculator Component
type: component
sourceFile: src/calculator.js
created: 2025-11-23
updated: 2025-11-23
related:
  - concepts/test-driven-development.md
  - components/validator.md
---

# Calculator Component

## Purpose and Overview

The Calculator component provides basic arithmetic operations (addition, subtraction, multiplication, division) with built-in error handling. It serves as a foundational utility for mathematical computations throughout the application.

## Key Functionality

### Core Operations

**Addition**: Adds two numbers with overflow protection
- Validates numeric inputs
- Handles floating-point precision
- Returns sum or throws error for invalid inputs

**Subtraction**: Subtracts second number from first
- Supports negative results
- Validates operands are numbers

**Multiplication**: Multiplies two numbers
- Handles zero multiplication
- Prevents overflow errors

**Division**: Divides first number by second
- Prevents division by zero
- Returns precise decimal results

### Error Handling

The calculator includes comprehensive error handling:
- Throws `TypeError` for non-numeric inputs
- Throws `RangeError` for division by zero
- Throws `RangeError` for overflow scenarios

## Relationships

**Dependencies**:
- Uses [Validator](/wiki/demo/components/validator) for input validation
- Implements patterns from [Test-Driven Development](/wiki/demo/concepts/test-driven-development)

**Used By**:
- Financial calculation modules
- Statistics aggregation services
- User interface calculation displays

## Usage Example

```javascript
const Calculator = require('./src/calculator');

// Create calculator instance
const calc = new Calculator();

// Basic operations
const sum = calc.add(5, 3);           // Returns 8
const difference = calc.subtract(10, 4); // Returns 6
const product = calc.multiply(7, 6);   // Returns 42
const quotient = calc.divide(20, 5);   // Returns 4

// Error handling
try {
  calc.divide(10, 0);  // Throws RangeError: Division by zero
} catch (error) {
  console.error('Calculation failed:', error.message);
}

// Chaining operations
const result = calc.add(
  calc.multiply(5, 3),
  calc.subtract(10, 2)
);  // Returns 15 + 8 = 23
```

## Testing

**Test Coverage**: tests/unit/calculator.test.js
- 24 test cases across 5 test suites
- Edge cases: division by zero, overflow, floating-point precision
- Error handling: invalid inputs, type checking
- All operations tested with positive, negative, and zero values

**Coverage**: 100% - All code paths tested
