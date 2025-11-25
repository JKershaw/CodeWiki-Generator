# Extension Patterns

## Overview

CodeWiki-Generator is designed for extensibility through its agent-based architecture. This guide explains how to add new agents, processors, and capabilities while maintaining consistency with existing patterns.

## Architecture Overview

The system uses a multi-agent architecture where each agent specializes in a specific documentation task:

- **ArchitectureOverviewAgent**: Analyzes repository structure and architecture
- **GuideGenerationAgent**: Creates operational documentation
- **CodeAnalysisAgent**: Extracts code patterns and examples
- **MetaAnalysisAgent**: Performs cross-page analysis
- **WikiIndexAgent**: Manages index and aggregation

New agents should follow the same patterns and interfaces.

## Creating a Custom Agent

### Step 1: Define Agent Structure

Create a new agent file following the naming convention:

```typescript
// src/agents/MyCustomAgent.ts

import { ClaudeClient } from '../clients/ClaudeClient';
import { GitHubClient } from '../clients/GitHubClient';

export class MyCustomAgent {
  private claudeClient: ClaudeClient;
  private githubClient: GitHubClient;

  constructor(
    claudeClient: ClaudeClient,
    githubClient: GitHubClient
  ) {
    this.claudeClient = claudeClient;
    this.githubClient = githubClient;
  }

  async analyze(): Promise<AnalysisResult> {
    // Implementation
    return {
      status: 'complete',
      content: [],
      errors: []
    };
  }
}
```

### Step 2: Implement Core Methods

All agents should implement these core methods:

```typescript
export interface Agent {
  // Main processing method
  analyze(): Promise<AnalysisResult>;
  
  // Get current state (for resumability)
  getState(): ProcessingState;
  
  // Validate content
  validateContent(content: any): boolean;
}
```

Example implementation:

```typescript
export class MyCustomAgent implements Agent {
  private state: ProcessingState = {
    status: 'pending',
    pagesProcessed: 0,
    errors: []
  };

  async analyze(): Promise<AnalysisResult> {
    this.state.status = 'processing';
    
    try {
      const repositories = await this.githubClient.getRepositories();
      const results = [];

      for (const repo of repositories) {
        const analysis = await this.analyzeRepository(repo);
        results.push(analysis);
        this.state.pagesProcessed++;
      }

      this.state.status = 'complete';
      return {
        status: 'complete',
        content: results,
        errors: this.state.errors
      };
    } catch (error) {
      this.state.status = 'error';
      this.state.errors.push(error.message);
      return {
        status: 'partial',
        content: [],
        errors: this.state.errors
      };
    }
  }

  private async analyzeRepository(repo: Repository) {
    // Cost-aware API usage
    const prompt = this.buildPrompt(repo);
    const result = await this.claudeClient.generateContent(prompt);
    
    return this.processResponse(result);
  }

  getState(): ProcessingState {
    return { ...this.state };
  }

  validateContent(content: any): boolean {
    return content && typeof content === 'object' && 'status' in content;
  }
}
```

### Step 3: Follow Cost-Aware Pattern

Always track API usage in agents:

```typescript
async analyze(): Promise<AnalysisResult> {
  const startCost = this.claudeClient.getTotalCost();
  
  // Processing...
  
  const endCost = this.claudeClient.getTotalCost();
  console.log(`Agent processing cost: $${(endCost - startCost).toFixed(4)}`);
  
  return result;
}
```

### Step 4: Implement Resilient Error Handling

Use exponential backoff for API calls:

```typescript
private async callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### Step 5: Add Tests

Create a test file following the pattern:

```typescript
// src/agents/__tests__/MyCustomAgent.test.ts

import { MyCustomAgent } from '../MyCustomAgent';
import { createMockClaudeClient, createMockGitHubClient } from '../__mocks__';

describe('MyCustomAgent', () => {
  let agent: MyCustomAgent;
  let mockClaude: ReturnType<typeof createMockClaudeClient>;
  let mockGitHub: ReturnType<typeof createMockGitHubClient>;

  beforeEach(() => {
    mockClaude = createMockClaudeClient();
    mockGitHub = createMockGitHubClient();
    agent = new MyCustomAgent(mockClaude, mockGitHub);
  });

  it('should analyze with cost tracking', async () => {
    const result = await agent.analyze();
    expect(result.status).toBe('complete');
    expect(mockClaude.getTotalCost()).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', async () => {
    mockGitHub.getRepositories.mockRejectedValueOnce(new Error('API Error'));
    const result = await agent.analyze();
    expect(result.errors).toContain('API Error');
  });
});
```

## Adding Custom Processors

Processors handle page-specific operations. Create custom processors by extending the base pattern:

```typescript
// src/processors/MyCustomProcessor.ts

import { Processor } from './Processor';
import { WikiPage } from '../types';

export class MyCustomProcessor extends Processor {
  async process(page: WikiPage): Promise<WikiPage> {
    // Custom processing logic
    page = await this.enrichContent(page);
    page = await this.validateStructure(page);
    
    return page;
  }

  private async enrichContent(page: WikiPage): Promise<WikiPage> {
    // Your custom enrichment
    return page;
  }
}
```

## Extending Existing Agents

### Modifying GuideGenerationAgent for Custom Guides

The GuideGenerationAgent can be extended to generate custom guide types:

```typescript
export class CustomGuideAgent extends GuideGenerationAgent {
  protected async generateCustomSection(topic: string): Promise<string> {
    const prompt = `Generate custom documentation for: ${topic}`;
    return this.claudeClient.generateContent(prompt);
  }
}
```

### Adding Category-Based Organization

Use the category-aware pattern for new documentation types:

```typescript
export interface CategorizedContent {
  category: string;
  subcategory?: string;
  content: string;
  metadata: {
    createdAt: number;
    updatedAt: number;
    relatedPages: string[];
  };
}

// In your agent:
const categorizedContent: CategorizedContent = {
  category: 'guides',
  subcategory: 'advanced',
  content: generatedContent,
  metadata: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    relatedPages: []
  }
};
```

## Integrating with the Pipeline

Register your agent in the main pipeline:

```typescript
// src/index.ts

import { MyCustomAgent } from './agents/MyCustomAgent';

async function runPipeline() {
  const claudeClient = new ClaudeClient();
  const githubClient = new GitHubClient();
  
  // Standard agents
  const architectureAgent = new ArchitectureOverviewAgent(claudeClient, githubClient);
  const guideAgent = new GuideGenerationAgent(claudeClient, githubClient);
  
  // Your custom agent
  const customAgent = new MyCustomAgent(claudeClient, githubClient);
  
  // Run all agents
  const results = await Promise.all([
    architectureAgent.analyze(),
    guideAgent.analyze(),
    customAgent.analyze() // Add your agent to the pipeline
  ]);
  
  // Process results...
}
```

## Best Practices for Extensions

1. **Always implement cost tracking** - Use `claudeClient.getTotalCost()` to monitor API usage
2. **Handle state persistence** - Implement `getState()` for resumable processing
3. **Use resilient retry logic** - Wrap API calls with exponential backoff
4. **Validate content** - Always sanitize and validate responses from external APIs
5. **Write comprehensive tests** - Test success, failure, and edge cases
6. **Follow naming conventions** - Use descriptive names (AgentName, ProcessorName)
7. **Document metadata** - Include source tracking and timestamps
8. **Support graceful degradation** - Return partial results rather than failing completely

## Example: Adding a Security Analysis Agent

Here's a complete example of a custom agent:

```typescript
// src/agents/SecurityAnalysisAgent.ts

import { ClaudeClient } from '../clients/ClaudeClient';
import { GitHubClient } from '../clients/GitHubClient';

export class SecurityAnalysisAgent {
  constructor(
    private claudeClient: ClaudeClient,
    private githubClient: GitHubClient
  ) {}

  async analyze() {
    try {
      const files = await this.githubClient.getSecurityRelatedFiles();
      const analysis = [];

      for (const file of files) {
        const content = await this.githubClient.getFileContent(file.path);
        const securityAnalysis = await this.analyzeForVulnerabilities(content);
        analysis.push({
          file: file.path,
          issues: securityAnalysis,
          severity: this.calculateSeverity(securityAnalysis)
        });
      }

      return {
        status: 'complete',
        content: analysis,
        errors: []
      };
    } catch (error) {
      return {
        status: 'partial',
        content: [],
        errors: [error.message]
      };
    }
  }

  private async analyzeForVulnerabilities(content: string) {
    const prompt = `Analyze this code for security vulnerabilities:\n${content}`;
    return this.claudeClient.generateContent(prompt);
  }

  private calculateSeverity(analysis: any): 'low' | 'medium' | 'high' {
    // Implementation
    return 'low';
  }
}
```

## Next Steps

- Review [Agent-based Architecture](./concepts/architecture.md) for deeper architectural understanding
- Check [Testing Approach](./guides/testing-approach.md) for comprehensive testing patterns
- Explore existing agents in `src/agents/` for implementation examples