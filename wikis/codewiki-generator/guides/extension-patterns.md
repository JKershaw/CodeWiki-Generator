# Extension Patterns

## Introduction

This guide teaches you how to extend CodeWiki-Generator by adding new features. The codebase follows established patterns that make it easy to add functionality consistently. Understanding these patterns ensures your code integrates seamlessly with the existing system.

## Core Patterns

### 1. Singleton Configuration Module Pattern

Configuration is managed through a singleton module that validates and provides application settings.

**When to use:** When you need to add new configurable options.

**Example - Adding a new configuration option:**

```javascript
// In src/config/index.js (existing pattern)
class ConfigManager {
  constructor() {
    this.config = {
      wikiPath: process.env.WIKI_PATH || './wiki',
      port: process.env.PORT || 3000,
      maxFileSize: process.env.MAX_FILE_SIZE || 5000000,
      // NEW: Add your option here
      newFeatureEnabled: process.env.NEW_FEATURE || false
    };
    this.validate();
  }

  validate() {
    // Add validation for your new option
    if (typeof this.config.newFeatureEnabled !== 'boolean') {
      throw new Error('NEW_FEATURE must be boolean');
    }
  }
}
```

**Then create tests:**

```javascript
// tests/newFeature.test.js
describe('New Feature Configuration', () => {
  it('should read NEW_FEATURE from environment', () => {
    process.env.NEW_FEATURE = 'true';
    const config = new ConfigManager();
    expect(config.config.newFeatureEnabled).toBe(true);
  });

  it('should validate NEW_FEATURE is boolean', () => {
    process.env.NEW_FEATURE = 'not-boolean';
    expect(() => new ConfigManager()).toThrow();
  });
});
```

### 2. File-based State Persistence Pattern

State is persisted to disk in structured directories with validation.

**When to use:** When you need to add new state that must be saved between runs.

**Example - Adding a new state type:**

```javascript
// src/state/userPreferences.js
const fs = require('fs');
const path = require('path');

class UserPreferencesState {
  constructor(stateDir) {
    this.stateDir = stateDir;
    this.preferencesFile = path.join(stateDir, 'preferences.json');
    this.ensureDirectory();
  }

  ensureDirectory() {
    if (!fs.existsSync(this.stateDir)) {
      fs.mkdirSync(this.stateDir, { recursive: true });
    }
  }

  save(preferences) {
    // Validate schema
    this.validatePreferencesSchema(preferences);
    
    // Persist to file
    fs.writeFileSync(
      this.preferencesFile,
      JSON.stringify(preferences, null, 2)
    );
  }

  load() {
    if (!fs.existsSync(this.preferencesFile)) {
      return this.getDefaults();
    }
    
    const data = fs.readFileSync(this.preferencesFile, 'utf8');
    return JSON.parse(data);
  }

  validatePreferencesSchema(preferences) {
    // Implement State Schema Validation Pattern
    const required = ['theme', 'language'];
    for (const field of required) {
      if (!(field in preferences)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  getDefaults() {
    return {
      theme: 'light',
      language: 'en'
    };
  }
}

module.exports = UserPreferencesState;
```

**Then add tests:**

```javascript
// tests/userPreferences.test.js
describe('User Preferences State', () => {
  let prefs;
  const testDir = './test-state';

  beforeEach(() => {
    prefs = new UserPreferencesState(testDir);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it('should persist preferences to file', () => {
    const testPrefs = { theme: 'dark', language: 'es' };
    prefs.save(testPrefs);
    
    const loaded = prefs.load();
    expect(loaded).toEqual(testPrefs);
  });

  it('should validate schema', () => {
    expect(() => {
      prefs.save({ theme: 'dark' }); // missing language
    }).toThrow('Missing required field');
  });
});
```

### 3. Frontmatter-based Page Serialization Pattern

Wiki pages use YAML frontmatter for metadata and markdown for content.

**When to use:** When adding new page types or metadata fields.

**Example - Adding page metadata:**

```javascript
// src/wiki/pageParser.js
const yaml = require('js-yaml');

class PageParser {
  static parse(markdown) {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!match) {
      return { frontmatter: {}, content: markdown };
    }

    const frontmatter = yaml.load(match[1]);
    const content = match[2];

    return { frontmatter, content };
  }

  static serialize(frontmatter, content) {
    // Validate frontmatter has required fields
    if (!frontmatter.title) {
      throw new Error('Page title is required');
    }

    const frontmatterYaml = yaml.dump(frontmatter);
    return `---\n${frontmatterYaml}---\n${content}`;
  }
}

module.exports = PageParser;
```

**Test new frontmatter fields:**

```javascript
// tests/pageParser.test.js
describe('Page Parser', () => {
  it('should parse frontmatter with custom fields', () => {
    const markdown = `---
title: My Page
author: John Doe
tags: [wiki, tutorial]
---
# Content`;

    const { frontmatter } = PageParser.parse(markdown);
    
    expect(frontmatter.title).toBe('My Page');
    expect(frontmatter.author).toBe('John Doe');
    expect(frontmatter.tags).toEqual(['wiki', 'tutorial']);
  });

  it('should require title on serialize', () => {
    expect(() => {
      PageParser.serialize({ author: 'John' }, 'content');
    }).toThrow('Page title is required');
  });
});
```

### 4. Environment-based Configuration Pattern

Different configurations for test and production environments.

**When to use:** When behavior should differ between environments.

**Example - Test mode separation:**

```javascript
// src/config/environment.js
class EnvironmentConfig {
  static getConfig() {
    const isTest = process.env.NODE_ENV === 'test';

    return {
      // Shared config
      logLevel: process.env.LOG_LEVEL || 'info',

      // Environment-specific
      database: {
        path: isTest ? ':memory:' : process.env.DB_PATH || './data/db'
      },
      cache: {
        enabled: isTest ? false : true
      },
      wikiPath: isTest ? './test-wiki' : process.env.WIKI_PATH || './wiki'
    };
  }
}

module.exports = EnvironmentConfig;
```

**Test with environment variables:**

```javascript
describe('Environment Config', () => {
  it('should use in-memory database in test mode', () => {
    process.env.NODE_ENV = 'test';
    const config = EnvironmentConfig.getConfig();
    expect(config.database.path).toBe(':memory:');
  });

  it('should use file database in production', () => {
    process.env.NODE_ENV = 'production';
    const config = EnvironmentConfig.getConfig();
    expect(config.database.path).toContain('./data/db');
  });
});
```

### 5. Content Search with Context Extraction Pattern

Searching wiki content and returning relevant context.

**When to use:** When adding search features or filtering content.

**Example - Adding a search feature:**

```javascript
// src/wiki/search.js
class WikiSearch {
  constructor(pages) {
    this.pages = pages;
  }

  search(query, contextLines = 2) {
    const results = [];

    for (const page of this.pages) {
      const matches = this.findMatches(page.content, query);
      
      for (const match of matches) {
        results.push({
          pageTitle: page.frontmatter.title,
          pageId: page.frontmatter.id,
          matchText: match.text,
          context: this.extractContext(page.content, match.index, contextLines),
          lineNumber: match.lineNumber
        });
      }
    }

    return results;
  }

  findMatches(content, query) {
    const matches = [];
    const regex = new RegExp(query, 'gi');
    let match;

    let lineNumber = 1;
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      while ((match = regex.exec(lines[i])) !== null) {
        matches.push({
          text: match[0],
          index: i,
          lineNumber
        });
      }
      lineNumber++;
    }

    return matches;
  }

  extractContext(content, matchIndex, contextLines) {
    const lines = content.split('\n');
    const start = Math.max(0, matchIndex - contextLines);
    const end = Math.min(lines.length, matchIndex + contextLines + 1);
    
    return lines.slice(start, end).join('\n');
  }
}

module.exports = WikiSearch;
```

**Test search functionality:**

```javascript
describe('Wiki Search', () => {
  let search;

  beforeEach(() => {
    const pages = [
      {
        frontmatter: { title: 'Page 1', id: 1 },
        content: 'This is a test page\nWith multiple lines\nSearchable content'
      }
    ];
    search = new WikiSearch(pages);
  });

  it('should find matching content', () => {
    const results = search.search('test');
    expect(results).toHaveLength(1);
    expect(results[0].matchText).toBe('test');
  });

  it('should extract context around match', () => {
    const results = search.search('multiple');
    expect(results[0].context).toContain('is a test page');
    expect(results[0].context).toContain('Searchable content');
  });
});
```

## Adding a Complete Feature

Here's a complete example of adding a new feature following all patterns:

**Scenario: Add page ratings system**

1. **Update Configuration** (Singleton pattern):
```javascript
// In src/config/index.js
this.config.ratingsEnabled = process.env.RATINGS_ENABLED || true;
```

2. **Create State Management** (File-based persistence pattern):
```javascript
// src/state/ratings.js
class RatingsState {
  constructor(stateDir) {
    this.ratingsFile = path.join(stateDir, 'ratings.json');
  }

  saveRating(pageId, rating) {
    // Validate 1-5 range
    // Save to file
  }

  getPageRating(pageId) {
    // Load from file
  }
}
```

3. **Add to Page Serialization** (Frontmatter pattern):
```javascript
// Frontmatter now includes:
// ---
// title: Page Title
// rating: 4.5
// ---
```

4. **Implement Rating Operations** (Wiki operations pattern):
```javascript
// src/wiki/ratingManager.js
class RatingManager {
  rate(pageId, rating) {
    this.validateRating(rating);
    this.state.saveRating(pageId, rating);
  }
}
```

5. **Test Everything:**
```javascript
// tests/ratings.test.js
describe('Ratings Feature', () => {
  // Test config
  // Test state persistence
  // Test serialization
  // Test rating operations
});
```

## Directory Structure for New Features

When adding a complete feature, organize like this:

```
src/
├── [featureName]/
│   ├── index.js           # Main module export
│   ├── manager.js         # Core logic
│   ├── validator.js       # Validation rules
│   └── parser.js          # Parsing/serialization
│
state/
├── [featureName].js       # State persistence
│
tests/
├── [featureName].test.js  # Tests
```

## Next Steps

1. Review existing components in the wiki structure
2. Choose which patterns apply to your feature
3. Follow the patterns exactly to maintain consistency
4. Write tests as you develop
5. Submit changes for code review