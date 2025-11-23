---
related: [concepts/resilient-llm-response-parsing.md]
updated: 2025-11-23
---

# Troubleshooting

## Introduction

This guide helps you diagnose and resolve common issues when working with CodeWiki-Generator. The system's resilient design handles many edge cases automatically.

## Prerequisites

- Basic understanding of the system (see Getting Started)
- Access to system logs and error messages

## Common Issues

### LLM API Response Problems

**Problem**: Malformed JSON responses from LLM APIs
**Solution**: 
- The system uses [progressive JSON repair strategy](../components/progressive-json-repair-strategy.md) automatically
- Check if the [resilient LLM response parsing](../concepts/resilient-llm-response-parsing.md) is working correctly
- Verify JSON response cleaning is applied

**Debugging Steps**:
1. Check raw LLM response in logs
2. Verify JSON repair attempts
3. Test with simpler prompts if needed

### Repository Analysis Failures

**Problem**: [Repository fingerprinting](../concepts/repository-fingerprinting.md) fails or returns incomplete data
**Solutions**:
- Ensure repository structure is accessible
- Check file permissions
- Verify repository isn't corrupted

**Debugging Steps**:
1. Run [Repository Structure Analysis](../components/repository-structure-analysis.md) manually
2. Check for hidden files or unusual structure
3. Verify supported file types are present

### Documentation Generation Issues

**Problem**: [ArchitectureOverviewAgent](../components/architecture-overview-agent.md) or [GuideGenerationAgent](../components/guide-generation-agent.md) produces incomplete output
**Solutions**:
- Check repository context quality
- Verify agent configuration
- Review LLM response handling

**Debugging Steps**:
1. Test with smaller repository samples
2. Check agent prompt effectiveness
3. Validate category-based content organization

### Wiki Index Problems

**Problem**: Wiki index generation creates broken navigation
**Solutions**:
- Verify all referenced files exist
- Check markdown link formatting
- Ensure auto-navigation logic is working

**Debugging Steps**:
1. Manually validate generated links
2. Check file path consistency
3. Verify index.md structure

## Error Patterns

### JSON Parsing Errors
```
SyntaxError: Unexpected token in JSON
```
- Indicates [progressive JSON repair strategy](../components/progressive-json-repair-strategy.md) didn't succeed
- Check original LLM response format
- May need to adjust repair patterns

### Repository Access Errors
```
Error: ENOENT: no such file or directory
```
- Repository path incorrect
- File permissions issue
- Repository structure changed during analysis

### Agent Timeout Errors
```
Timeout: Agent did not respond within expected time
```
- LLM API latency issues
- Repository too large for single analysis
- Network connectivity problems

## Performance Issues

### Slow Documentation Generation
**Causes**:
- Large repository size
- Complex repository structure
- LLM API rate limits

**Solutions**:
- Break analysis into smaller chunks
- Optimize [repository fingerprinting](../concepts/repository-fingerprinting.md)
- Implement caching for repeated analyses

### Memory Usage Problems
**Causes**:
- Large file processing
- Inefficient LLM response handling

**Solutions**:
- Stream large file analysis
- Implement response size limits
- Clear intermediate data structures

## Diagnostic Tools

### Test Suite
```bash
npm test
```
Run full test suite to identify system-level issues

### Manual Agent Testing
```javascript
// Test individual agents
const agent = new ArchitectureOverviewAgent(config);
const result = await agent.generateDocumentation(context);
```

### Repository Analysis Validation
Manually verify repository structure analysis accuracy

## Prevention Strategies

1. **Regular Testing**
   - Run tests before major changes
   - Test with diverse repository types
   - Validate LLM response handling

2. **Monitoring**
   - Track LLM API response quality
   - Monitor generation success rates
   - Check documentation completeness

3. **Graceful Degradation**
   - System should handle partial failures
   - Provide useful output even with incomplete data
   - Clear error messages for manual intervention

## Getting Help

1. Check system logs for specific error details
2. Run tests to isolate the problem
3. Review generated documentation for patterns
4. Test with minimal repository samples

## Next Steps

- Review Testing Approach for validation strategies
- See Extension Patterns for customizing error handling
- Check Configuration guide for system tuning options