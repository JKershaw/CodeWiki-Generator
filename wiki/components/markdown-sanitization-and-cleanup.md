---
title: Markdown sanitization and cleanup
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Markdown Sanitization and Cleanup

## Purpose and Overview

Markdown sanitization and cleanup ensures that AI-generated documentation content is properly formatted and free from unwanted artifacts. This process removes code block wrappers and extraneous whitespace that Claude AI may include in its responses, producing clean markdown ready for wiki publication.

## Key Functionality

The sanitization process handles common formatting issues in AI-generated markdown:

- **Code Block Removal**: Strips markdown code block delimiters (```markdown, ```) that Claude sometimes wraps around entire responses
- **Whitespace Cleanup**: Trims leading and trailing whitespace to ensure consistent formatting
- **Content Extraction**: Isolates the actual documentation content from response formatting artifacts

The `sanitizeMarkdown` function performs this cleanup as the final step before documentation is saved or displayed, ensuring consistent output quality regardless of how Claude formats its responses.

## Relationships

Markdown sanitization integrates into the documentation generation pipeline:

- **Input Source**: Processes raw markdown responses from Claude AI via ClaudeClient
- **Integration Point**: Called by DocumentationWriterAgent after receiving AI-generated content
- **Output Consumer**: Cleaned markdown flows to wiki storage or display systems
- **Quality Assurance**: Acts as a filter between AI generation and final documentation presentation

## Usage Examples

The sanitization handles responses like this:

**Before sanitization** (Claude response):
```
```markdown
# Component Overview
This component handles...
```
```

**After sanitization** (clean output):
```
# Component Overview
This component handles...
```

The process is transparent to end users, automatically applied during the `writeDocumentation` workflow to ensure all generated documentation maintains consistent formatting standards.