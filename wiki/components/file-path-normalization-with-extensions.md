---
title: File path normalization with extensions
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# File Path Normalization with Extensions

## Purpose and Overview

File path normalization ensures consistent file handling across the wiki system by automatically appending `.md` extensions to page paths. This prevents path resolution issues and maintains uniform file naming conventions throughout the codebase.

## Key Functionality

The normalization process standardizes how wiki page paths are handled by the file system:

- **Extension Addition**: Automatically appends `.md` to page paths that don't already have file extensions
- **Path Consistency**: Ensures all wiki pages follow the same naming pattern regardless of how they're created or referenced
- **Ambiguity Prevention**: Eliminates confusion between directory names and file names by making file extensions explicit

### How It Works

The `determinePagePath` function processes incoming page identifiers and returns fully qualified paths with proper extensions. This happens transparently during page creation and updates, ensuring the file system always receives properly formatted paths.

## Relationships

**WikiManager Integration**: Works directly with the WikiManager's `createPage` and `updatePage` methods to normalize paths before file operations.

**File System Operations**: Provides consistent input to all file system interactions, preventing issues with path resolution and file creation.

**UI Components**: Ensures that page references in the user interface map correctly to actual files on disk.

## Usage Examples

```javascript
// Input paths without extensions are automatically normalized
determinePagePath("user-guide")          // Returns: "user-guide.md"
determinePagePath("api/authentication")  // Returns: "api/authentication.md" 
determinePagePath("readme.md")           // Returns: "readme.md" (unchanged)
```

The normalization happens automatically during wiki operations:

```javascript
// Both approaches result in the same normalized file path
wikiManager.createPage("content", { title: "Getting Started" })
wikiManager.updatePage("content.md", updatedContent, { title: "Getting Started" })
```

This ensures that regardless of whether developers specify extensions in their code, the underlying file system operations remain consistent and predictable.