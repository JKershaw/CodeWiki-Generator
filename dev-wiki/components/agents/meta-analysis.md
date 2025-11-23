---
title: Meta-Analysis Agent
category: components
created: 2025-11-22
updated: 2025-11-22
related:
  - claude-client
  - prompt-manager
  - agents/overview
  - agents/code-analysis
  - agents/documentation-writer
---

# Meta-Analysis Agent

## Purpose and Overview

The `MetaAnalysisAgent` periodically reviews the documentation system's progress to identify patterns, gaps, and opportunities for improvement. Unlike the other agents which process individual commits, this agent looks at the bigger picture across multiple commits to suggest high-level documentation improvements.

## Key Functionality

### Main Method: analyzeProgress()

```javascript
async analyzeProgress(concepts, pageList)
```

**Inputs**:
- `concepts`: Array of concept names identified across recent commits
- `pageList`: Array of wiki page paths created or updated

**Output**: Structured JSON
```json
{
  "themes": [
    "Authentication system being built",
    "Database layer implementation"
  ],
  "newPagesNeeded": [
    {
      "title": "Security Architecture",
      "reason": "Multiple auth-related commits suggest need for overview",
      "category": "concepts"
    }
  ],
  "gaps": [
    "Missing documentation on error handling patterns"
  ],
  "reorganization": [
    {
      "action": "split",
      "target": "AuthenticationSystem",
      "reason": "Page covers both authentication and authorization - should be separate"
    }
  ]
}
```

### Running Frequency: shouldRunMetaAnalysis()

```javascript
shouldRunMetaAnalysis(currentCommit, lastAnalysis)
```

Determines when to run meta-analysis based on:
- **Commit count**: Runs every N commits (default: 5)
- **Last analysis**: Doesn't re-run on same commit

Example:
```javascript
agent.frequency = 5; // Every 5 commits

agent.shouldRunMetaAnalysis(5, 0);   // true (5th commit)
agent.shouldRunMetaAnalysis(10, 5);  // true (10th commit)
agent.shouldRunMetaAnalysis(7, 5);   // false (not at interval)
agent.shouldRunMetaAnalysis(10, 10); // false (already analyzed)
```

### Input Formatting

The agent formats inputs as readable lists for Claude:

**Concepts**:
```
Auth
Database
Session
```

**Pages**:
```
components/auth-service.md
components/session-manager.md
concepts/authentication.md
```

Empty inputs formatted as "None yet".

### Response Validation

The `_validateResponse()` method ensures all required fields exist:

```javascript
_validateResponse(response) {
  return {
    themes: Array.isArray(response.themes) ? response.themes : [],
    newPagesNeeded: Array.isArray(response.newPagesNeeded) ? response.newPagesNeeded : [],
    gaps: Array.isArray(response.gaps) ? response.gaps : [],
    reorganization: Array.isArray(response.reorganization) ? response.reorganization : []
  };
}
```

This handles:
- Partial responses (missing fields)
- Non-array fields
- Empty responses

## Prompt Template

Uses `meta-analysis.txt` template with variables:
- `{{concepts}}`: Formatted list of identified concepts
- `{{pageList}}`: Formatted list of wiki pages

The prompt instructs Claude to:
1. Identify overarching themes or architecture patterns
2. Suggest new high-level documentation pages
3. Flag inconsistencies or gaps
4. Recommend page reorganization (split, merge, rename)
5. Be selective - only suggest high-value additions
6. Consider what new developers would ask
7. **Return only valid JSON**

## Output Structure

### themes
Array of architectural patterns or overarching themes identified across commits.

Example: `["Microservices architecture emerging", "Event-driven communication pattern"]`

### newPagesNeeded
Array of suggested new documentation pages:
- `title`: Suggested page name
- `reason`: Why this would be useful
- `category`: Where it belongs (concepts, components, guides)

Example:
```json
{
  "title": "Service Communication",
  "reason": "Multiple services communicating via events, need overview",
  "category": "concepts"
}
```

### gaps
Array of missing or unclear documentation areas.

Example: `["Error handling strategy unclear", "Testing approach not documented"]`

### reorganization
Array of suggested structural improvements:
- `action`: Type of change (split, merge, rename)
- `target`: Page(s) affected
- `reason`: Why this would improve documentation

Example:
```json
{
  "action": "merge",
  "target": "UserAuth, UserAuthorization",
  "reason": "Both are small and closely related - better as one page"
}
```

## Configuration

- **Model**: claude-sonnet-4-20250514
- **Max tokens**: 2000
- **Default frequency**: 5 commits (configurable)

## Usage Example

```javascript
const MetaAnalysisAgent = require('./lib/agents/meta-analysis-agent');

const agent = new MetaAnalysisAgent();

// Check if we should run
if (agent.shouldRunMetaAnalysis(currentCommit, lastAnalysisCommit)) {

  // Gather data from recent commits
  const concepts = ['Auth', 'Database', 'API', 'Session'];
  const pages = [
    'components/auth-service.md',
    'components/database-connection.md',
    'components/api-router.md'
  ];

  // Run analysis
  const analysis = await agent.analyzeProgress(concepts, pages);

  // Present recommendations to user
  console.log('Emerging themes:', analysis.themes);
  console.log('Suggested pages:', analysis.newPagesNeeded);
  console.log('Documentation gaps:', analysis.gaps);
  console.log('Reorganization suggestions:', analysis.reorganization);
}
```

## Testing

The agent has 15 tests covering:

- **Happy path**: Successful analysis with all output fields
- **Prompt construction**: Concepts and pages included in prompt
- **List formatting**: Concepts formatted as readable list
- **Page list formatting**: Pages formatted properly
- **Empty inputs**: Handles empty concepts and pages
- **Configuration**: Correct model and token limits
- **Error handling**: API errors propagate
- **Response validation**: Missing fields filled with defaults
- **Frequency logic**: Runs at correct intervals
- **Custom frequency**: Configurable interval works
- **Duplicate prevention**: Doesn't re-analyze same commit
- **Output structure**: newPagesNeeded and reorganization have required fields

## Relationships

- **Uses**: ClaudeClient for API calls
- **Uses**: PromptManager for prompt rendering
- **Reviews**: Output from CodeAnalysisAgent and DocumentationWriterAgent
- **Called by**: Processor every N commits (once implemented)
- **Recommendations**: Presented to user for review

## Design Decisions

**Why periodic vs every commit?**
- Patterns emerge over multiple commits
- Expensive to run on every commit
- Most commits don't warrant meta-analysis
- User can adjust frequency based on project

**Why separate from other agents?**
- Different perspective (macro vs micro)
- Different input (aggregate vs individual)
- Different output (recommendations vs content)
- Can skip if not needed

**Why recommendations vs automatic changes?**
- Reorganization affects all documentation
- Human judgment needed for structural changes
- User knows their project best
- Avoids unwanted churn

**Why include "reason" fields?**
- User needs to understand suggestions
- Builds trust in AI recommendations
- Helps user decide what to accept
- Documents thinking for future reference

**Why configurable frequency?**
- Small projects: run more often (every 3 commits)
- Large projects: run less often (every 10 commits)
- Budget constraints: adjust to control costs
- Development pace: more active = more frequent

**Why validate response structure?**
- Claude might return partial JSON
- Downstream code expects arrays
- Prevents runtime errors
- Graceful degradation

## Integration with Workflow

The processor will use meta-analysis like this:

1. Process commits 1-4 normally
2. At commit 5: Run meta-analysis
3. Show user:
   - "I noticed an authentication theme emerging"
   - "Would you like a Security Architecture overview page?"
   - "The AuthService page is getting long - consider splitting"
4. User reviews and approves/rejects suggestions
5. Processor continues with commits 6-9
6. At commit 10: Run meta-analysis again
7. Repeat

This creates a feedback loop for continuous documentation improvement.
