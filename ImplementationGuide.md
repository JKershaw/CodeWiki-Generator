# CodeWiki Generator - Implementation Guide for AI Coding Agent

## For the AI Agent: How to Use This Guide

This document guides you through building the CodeWiki Generator using test-driven development. You will be building a system that generates wikis from git history - and you will use that system on itself as you build it.

**Critical Practice**: After implementing each feature, run the wiki generator on this codebase, then consult the generated wiki before proceeding. If you can't understand your own architecture from the wiki, improve the documentation system before continuing.

**Commit Cadence**: Commit after completing each numbered step. This allows the human to monitor progress through the wiki.

**Sub-Agent Usage**: Spawn sub-agents for isolated tasks like writing test fixtures, researching API details, or implementing utility functions. Main agent orchestrates and integrates.

## Development Philosophy

**Test-First Always**: Write failing tests before implementation. No exceptions.

**Wiki-Driven Development**: 
1. Build feature
2. Run wiki generator on codebase
3. Read generated documentation
4. If unclear, fix documentation generation
5. Proceed to next feature

**Incremental Commits**: Every test passing, every feature working = one commit. Minimum 20 commits for this project.

**Self-Validation**: The system documents itself. Poor documentation reveals flaws in the system.

## Project Initialization

### Step 1: Repository Setup
**Task**: Initialize project structure and dependencies

**Actions**:
1. Create repository with `.gitignore` (node_modules, .env, state.json, wiki/)
2. Initialize `package.json` with Node.js 24.x requirement
3. Install dependencies: express@5.1.0, ejs@3.1.10, @anthropic-ai/sdk@0.70.0, octokit@5.0.5, ws@8.18.0, dotenv@16.4.5
4. Add dev dependencies: jest or mocha for testing
5. Create directory structure: lib/, views/, views/partials/, public/, wiki/, tests/
6. Create `.env.example` with ANTHROPIC_API_KEY, GITHUB_TOKEN, PORT placeholders
7. Create basic README.md explaining what this will become

**Test**: Run `npm install` successfully, verify all directories exist

**Commit**: "Initialize project structure and dependencies"

**Wiki Check**: Not applicable yet - no code to document

---

### Step 2: Development Wiki Initialization
**Task**: Create initial wiki structure for this project

**Actions**:
1. Create `dev-wiki/index.md` with project overview
2. Create `dev-wiki/concepts/` directory
3. Create `dev-wiki/components/` directory  
4. Create `dev-wiki/guides/getting-started.md` with setup instructions
5. Document your intended architecture in `dev-wiki/concepts/architecture.md`
6. Create `dev-wiki/_metadata.json` with empty structure

**Test**: All wiki directories exist, index.md is valid markdown

**Commit**: "Initialize development wiki structure"

**Wiki Check**: Manually verify you can read the architecture documentation you just wrote

---

## Phase 1: Core Infrastructure (TDD)

### Step 3: Wiki Manager - Read Operations
**Task**: Implement wiki file reading with tests

**Sub-Agent Opportunity**: Spawn sub-agent to research markdown parsing libraries and frontmatter extraction

**Test First** (write these tests):
- Test reading a markdown file with frontmatter
- Test parsing frontmatter into JSON
- Test reading file without frontmatter (should handle gracefully)
- Test reading non-existent file (should return null or throw appropriate error)
- Test listing all pages in a directory
- Test searching pages by keyword

**Implementation**:
1. Create `lib/wiki-manager.js`
2. Implement `getPage(filePath)`
3. Implement `getAllPages(directory)`
4. Implement `searchPages(keywords, directory)`
5. Add frontmatter parsing (use library or implement simple parser)

**Test**: All tests pass

**Commit**: "Implement wiki manager read operations with tests"

**Wiki Check**: Not applicable yet

---

### Step 4: Wiki Manager - Write Operations
**Task**: Implement wiki file writing with tests

**Test First**:
- Test creating new page with frontmatter
- Test updating existing page (should preserve frontmatter, update content)
- Test updating page metadata (related pages, timestamps)
- Test creating page in subdirectory (should create directory if needed)
- Test handling concurrent writes (should queue or lock)

**Implementation**:
1. Implement `createPage(title, content, metadata, directory)`
2. Implement `updatePage(title, content, metadata)`
3. Implement `updateMetadata(title, metadata)`
4. Add automatic timestamp management
5. Handle directory creation
6. Implement simple file locking or write queue

**Test**: All tests pass

**Commit**: "Implement wiki manager write operations with tests"

**Wiki Check**: Not applicable yet

---

### Step 5: State Management
**Task**: Implement processing state persistence

**Test First**:
- Test saving state to JSON file
- Test loading state from JSON file
- Test loading non-existent state (should return default state)
- Test incremental state updates
- Test state validation (reject invalid state)

**Implementation**:
1. Create `lib/state-manager.js`
2. Define state schema
3. Implement `saveState(state)`
4. Implement `loadState()`
5. Implement `updateState(updates)` for incremental changes
6. Add validation

**Test**: All tests pass

**Commit**: "Implement state management with tests"

**Wiki Check**: Not applicable yet

---

### Step 6: GitHub Integration
**Task**: Implement GitHub API wrapper with tests

**Sub-Agent Opportunity**: Spawn sub-agent to research Octokit API patterns and create test fixtures

**Test First**:
- Test fetching repository info (mock Octokit response)
- Test fetching commit list chronologically
- Test fetching single commit with diff
- Test fetching file content at specific commit
- Test handling API errors (rate limits, invalid repo, network failure)
- Test authentication with token vs without

**Implementation**:
1. Create `lib/github.js`
2. Initialize Octokit client with authentication
3. Implement `getRepoInfo(owner, repo)`
4. Implement `getCommits(owner, repo, options)` - returns chronological list
5. Implement `getCommit(owner, repo, sha)` - returns full commit with diff
6. Implement `getFileContent(owner, repo, path, ref)`
7. Add error handling and retries

**Test**: All tests pass with mocked Octokit

**Commit**: "Implement GitHub integration with tests"

**Wiki Check**: Not applicable yet

---

### Step 7: First Self-Documentation Run
**Task**: Run manual wiki generation on codebase so far

**Actions**:
1. Manually create wiki pages for what you've built:
   - `dev-wiki/components/wiki-manager.md` - describe the WikiManager
   - `dev-wiki/components/state-manager.md` - describe StateManager  
   - `dev-wiki/components/github-integration.md` - describe GitHub wrapper
   - `dev-wiki/guides/testing-approach.md` - describe your TDD approach
2. Update `dev-wiki/_metadata.json` with page relationships
3. Update `dev-wiki/concepts/architecture.md` with actual architecture

**Test**: All wiki pages are readable and accurate

**Commit**: "Add initial self-documentation"

**Wiki Check**: Read `dev-wiki/components/wiki-manager.md` - does it accurately explain what WikiManager does? If not, improve it. This is your first validation that documentation quality matters.

---

## Phase 2: AI Agent System (TDD)

### Step 8: Anthropic SDK Wrapper
**Task**: Implement Claude API wrapper with tests

**Sub-Agent Opportunity**: Spawn sub-agent to research Anthropic SDK best practices and streaming

**Test First**:
- Test creating client with API key
- Test sending message and receiving response
- Test handling API errors (rate limit, invalid key, timeout)
- Test token counting/estimation
- Test cost tracking
- Test handling JSON responses from Claude
- Test handling malformed JSON from Claude

**Implementation**:
1. Create `lib/claude.js`
2. Initialize Anthropic client
3. Implement `sendMessage(prompt, options)` with retry logic
4. Implement `estimateTokens(text)` for cost projection
5. Implement `trackCost(tokens)` 
6. Add JSON parsing with error handling
7. Add response validation

**Test**: All tests pass with mocked Anthropic SDK

**Commit**: "Implement Anthropic SDK wrapper with tests"

**Wiki Check**: Read `dev-wiki/concepts/architecture.md` - does it mention the Claude integration? Add if missing.

---

### Step 9: Agent Prompt Templates
**Task**: Create and test prompt template system

**Test First**:
- Test rendering template with variables
- Test template validation (all variables provided)
- Test loading template from file
- Test template includes system instructions
- Test template output sanitization

**Implementation**:
1. Create `lib/prompts.js`
2. Define template format (use template literals or simple {{variable}} replacement)
3. Implement `renderTemplate(templateName, variables)`
4. Create initial templates:
   - `code-analysis-template`
   - `documentation-writer-template`
   - `meta-analysis-template`
5. Store templates in `lib/prompts/` directory
6. Add validation for required variables

**Test**: All tests pass

**Commit**: "Implement agent prompt template system with tests"

**Wiki Check**: Before proceeding, consult `dev-wiki/components/wiki-manager.md` to verify how to save prompt templates. This validates your wiki is useful for development.

---

### Step 10: Code Analysis Agent
**Task**: Implement first AI agent with tests

**Test First**:
- Test agent accepts file diff and returns structured JSON
- Test agent handles small file changes
- Test agent handles large diffs (should truncate appropriately)
- Test agent handles various file types (JS, TS, JSON, etc.)
- Test agent returns consistent schema
- Test agent handles Claude API errors gracefully

**Implementation**:
1. Create `lib/agents/code-analysis-agent.js`
2. Implement `analyzeCode(fileDiff, commitMessage, relatedPages)`
3. Use prompt template from Step 9
4. Parse and validate JSON response
5. Handle truncation of large diffs (>2000 lines)
6. Add retry logic for API failures
7. Track costs

**Test**: All tests pass with mocked Claude responses

**Commit**: "Implement code analysis agent with tests"

**Wiki Check**: Read `dev-wiki/concepts/architecture.md` - understand how agents fit in. Update if unclear.

---

### Step 11: Documentation Writer Agent
**Task**: Implement documentation generation agent

**Test First**:
- Test agent generates markdown from code analysis
- Test agent updates existing page (preserves structure, updates content)
- Test agent creates new page from scratch
- Test agent handles various content types (classes, functions, concepts)
- Test markdown is well-formed
- Test output is under reasonable length (unless complexity demands more)

**Implementation**:
1. Create `lib/agents/documentation-writer-agent.js`
2. Implement `writeDocumentation(conceptName, codeAnalysis, existingContent)`
3. Use documentation prompt template
4. Validate markdown output
5. Handle both new and update scenarios
6. Add length guidelines to prompt
7. Track costs

**Test**: All tests pass with mocked responses

**Commit**: "Implement documentation writer agent with tests"

**Wiki Check**: Consult `dev-wiki/components/wiki-manager.md` for updatePage API before implementing updates.

---

### Step 12: Meta-Analysis Agent
**Task**: Implement higher-level analysis agent

**Test First**:
- Test agent identifies themes from multiple commits
- Test agent suggests new pages
- Test agent identifies gaps in documentation
- Test agent suggests reorganization
- Test output is valid JSON with expected schema
- Test handles insufficient data gracefully

**Implementation**:
1. Create `lib/agents/meta-analysis-agent.js`
2. Implement `analyzeProgress(concepts, pages, commitRange)`
3. Use meta-analysis prompt template
4. Parse and validate JSON response
5. Return structured recommendations
6. Track costs

**Test**: All tests pass with mocked responses

**Commit**: "Implement meta-analysis agent with tests"

**Wiki Check**: Update `dev-wiki/components/` with new agent documentation

---

### Step 13: Second Self-Documentation Run
**Task**: Document the AI agent system you've built

**Actions**:
1. Create `dev-wiki/concepts/agent-system.md` explaining the three agents
2. Update existing component pages with agent integration details
3. Create `dev-wiki/guides/prompt-engineering.md` documenting prompt templates
4. Update `dev-wiki/_metadata.json` with new relationships

**Test**: Read through all wiki pages - can you understand the system from them alone?

**Commit**: "Document AI agent architecture"

**Wiki Check**: Read `dev-wiki/concepts/agent-system.md`. If you can't explain the agent system to a new developer from this page, rewrite it.

---

## Phase 3: Processing Engine (TDD)

### Step 14: Commit Processor
**Task**: Implement single commit processing logic

**Test First**:
- Test processing commit with single file change
- Test processing commit with multiple file changes
- Test determining file significance (config files vs core logic)
- Test retrieving relevant wiki context for file
- Test calling appropriate agents
- Test updating wiki based on agent output
- Test handling processing errors
- Test skipping insignificant files

**Implementation**:
1. Create `lib/processor.js`
2. Implement `processCommit(commit, state)`
3. Implement `isSignificantFile(filePath)` heuristic
4. Implement `getRelevantContext(filePath, wiki)` - returns ≤3 related pages
5. Route to code analysis agent
6. Route to documentation writer agent
7. Update wiki via WikiManager
8. Update state
9. Return processing summary

**Test**: All tests pass with mocked agents

**Commit**: "Implement commit processor with tests"

**Wiki Check**: Consult `dev-wiki/components/state-manager.md` for proper state updates.

---

### Step 15: Repository Processor
**Task**: Implement main processing loop

**Test First**:
- Test processing multiple commits in sequence
- Test triggering meta-analysis every N commits
- Test pausing and resuming
- Test state persistence between runs
- Test handling GitHub API rate limits
- Test cost tracking and limits
- Test processing statistics

**Implementation**:
1. Extend `lib/processor.js`
2. Implement `processRepository(repoUrl, options)`
3. Implement main processing loop
4. Implement pause/resume mechanism
5. Trigger meta-analysis every 5 commits
6. Save state after each commit
7. Enforce cost limits
8. Generate processing summary

**Test**: All tests pass with mocked GitHub and agents

**Commit**: "Implement repository processor with tests"

**Wiki Check**: Read `dev-wiki/concepts/architecture.md` - trace through the complete processing flow.

---

### Step 16: Third Self-Documentation Run
**Task**: Document the processing engine

**Actions**:
1. Create `dev-wiki/components/processor.md` with detailed processing flow
2. Create `dev-wiki/guides/processing-logic.md` explaining decision trees
3. Update `dev-wiki/concepts/architecture.md` with complete system overview
4. Create visual flow in markdown (ASCII or description)

**Test**: Can you understand the processing flow from wiki alone?

**Commit**: "Document processing engine"

**Wiki Check**: Read the processor documentation. If processing logic is unclear, improve documentation before continuing.

---

## Phase 4: Web Interface (TDD)

### Step 17: Express Server Setup
**Task**: Create basic Express application

**Test First**:
- Test server starts on configured port
- Test health check endpoint returns 200
- Test static file serving works
- Test EJS view engine configured
- Test environment variable loading

**Implementation**:
1. Create `server.js`
2. Initialize Express app
3. Configure EJS as view engine
4. Set up static file serving from public/
5. Load environment variables
6. Add health check route
7. Add basic error handling middleware

**Test**: All tests pass, server starts successfully

**Commit**: "Implement Express server setup with tests"

**Wiki Check**: Not blocking, but consider documenting server structure.

---

### Step 18: Dashboard Routes
**Task**: Implement dashboard HTTP routes

**Test First**:
- Test GET / returns dashboard view
- Test POST /process/start initiates processing
- Test POST /process/pause pauses processing
- Test POST /process/step processes one commit
- Test GET /api/status returns current state JSON
- Test error handling for invalid requests

**Implementation**:
1. Create routes in `server.js`
2. Implement dashboard route (renders dashboard.ejs)
3. Implement control routes (start, pause, step)
4. Implement status API endpoint
5. Connect routes to processor
6. Add request validation
7. Add error responses

**Test**: All routes return expected responses

**Commit**: "Implement dashboard routes with tests"

**Wiki Check**: Consult `dev-wiki/components/processor.md` for processor API.

---

### Step 19: WebSocket Integration
**Task**: Add real-time updates via WebSocket

**Test First**:
- Test WebSocket connection established
- Test progress events broadcast to clients
- Test multiple clients can connect
- Test clients receive updates during processing
- Test connection cleanup on disconnect

**Implementation**:
1. Create `lib/websocket.js`
2. Initialize WebSocket server
3. Handle client connections
4. Implement `broadcast(event, data)` function
5. Integrate with processor to emit events
6. Handle connection lifecycle

**Test**: WebSocket connections and broadcasts work

**Commit**: "Implement WebSocket integration with tests"

**Wiki Check**: Read `dev-wiki/components/processor.md` to understand what events to broadcast.

---

### Step 20: Dashboard View
**Task**: Create dashboard EJS template

**Sub-Agent Opportunity**: Spawn sub-agent to create CSS styling

**Test First**:
- Test template renders with state data
- Test all UI elements present
- Test JavaScript client code loads
- Test WebSocket connection from client

**Implementation**:
1. Create `views/dashboard.ejs`
2. Create header section with repository input
3. Create control buttons (start, pause, step)
4. Create status display panel
5. Create processing log panel (live updates)
6. Create wiki sidebar with page list
7. Add client-side JavaScript for WebSocket
8. Create `public/style.css` for styling
9. Create `public/app.js` for client interaction

**Test**: Template renders correctly, all interactions work

**Commit**: "Implement dashboard view with styling"

**Wiki Check**: Optional but recommended to document UI structure.

---

### Step 21: Wiki Viewer Routes and Views
**Task**: Implement wiki page viewing

**Test First**:
- Test GET /wiki/:page returns rendered markdown
- Test navigation between wiki pages works
- Test non-existent page returns 404
- Test markdown rendering works correctly
- Test frontmatter displays properly

**Implementation**:
1. Add wiki route to `server.js`
2. Create `views/wiki-page.ejs` template
3. Integrate markdown parser
4. Render page with navigation
5. Display frontmatter metadata
6. Add links to related pages
7. Create sidebar partial for navigation
8. Add edit button (opens file in system)

**Test**: Wiki pages display correctly

**Commit**: "Implement wiki viewer with tests"

**Wiki Check**: Consult `dev-wiki/components/wiki-manager.md` for page retrieval API.

---

### Step 22: Fourth Self-Documentation Run
**Task**: Document the web interface

**Actions**:
1. Create `dev-wiki/components/dashboard.md` describing UI components
2. Create `dev-wiki/components/websocket.md` describing real-time updates
3. Create `dev-wiki/guides/user-interface.md` for end users
4. Update `dev-wiki/concepts/architecture.md` with UI layer

**Test**: UI documentation is clear and complete

**Commit**: "Document web interface components"

**Wiki Check**: Read UI documentation - can you understand how the dashboard works?

---

## Phase 5: Integration & Polish

### Step 23: End-to-End Integration Test
**Task**: Create integration test for complete flow

**Test Scenario**: Process 5-commit test repository and verify results

**Test Setup**:
1. Create test repository with known commits
2. Create expected wiki structure
3. Mock GitHub API to return test data
4. Mock Anthropic API with deterministic responses

**Test Assertions**:
- State file updated correctly
- Wiki pages created with expected content
- Meta-analysis triggered after 5 commits
- Dashboard displays correct status
- WebSocket events fired

**Implementation**:
1. Create `tests/integration/full-flow.test.js`
2. Set up test fixtures
3. Initialize all components
4. Run processing
5. Verify outputs
6. Cleanup

**Test**: Full integration test passes

**Commit**: "Add end-to-end integration test"

**Wiki Check**: Read `dev-wiki/guides/testing-approach.md` - does it cover integration testing now?

---

### Step 24: Error Recovery System
**Task**: Implement robust error handling

**Test First**:
- Test recovery from Claude API failure mid-processing
- Test recovery from GitHub API rate limit
- Test recovery from disk space issues
- Test recovery from malformed agent responses
- Test state restoration after crash

**Implementation**:
1. Add error recovery to processor
2. Implement exponential backoff for API retries
3. Add state checkpointing every N commits
4. Add error logging system
5. Add graceful degradation for non-critical failures
6. Add manual recovery controls in UI

**Test**: All error scenarios handled gracefully

**Commit**: "Implement error recovery system with tests"

**Wiki Check**: Update `dev-wiki/guides/error-handling.md` with recovery procedures.

---

### Step 25: Cost Tracking and Limits
**Task**: Implement comprehensive cost management

**Test First**:
- Test accurate token counting
- Test cost calculation
- Test daily budget enforcement
- Test cost projection before processing
- Test cost alerts to user

**Implementation**:
1. Extend `lib/claude.js` with precise token counting
2. Implement `lib/cost-tracker.js`
3. Add cost estimates before processing
4. Add budget checks during processing
5. Add cost breakdown in UI
6. Add cost history tracking
7. Pause processing when approaching limit

**Test**: Cost tracking is accurate, limits enforced

**Commit**: "Implement cost tracking and budget limits with tests"

**Wiki Check**: Consult `dev-wiki/components/` for integration points.

---

### Step 26: First Real Self-Documentation Run
**Task**: Run the actual system on this codebase

**Actions**:
1. Ensure all code is committed to git
2. Configure system to process its own repository
3. Run processor in stepped mode
4. Review generated wiki after each commit
5. Compare generated wiki to hand-written `dev-wiki/`
6. Identify gaps or inaccuracies
7. Adjust prompts and regenerate

**Validation**:
- Generated wiki should be roughly similar to hand-written wiki
- Generated wiki should be internally consistent
- Key concepts should be documented
- Relationships should be captured

**Iterations**:
- If generated wiki is poor, tune prompts
- If generated wiki misses concepts, adjust code analysis agent
- If generated wiki is too verbose, adjust writer agent
- Repeat until quality is acceptable

**Test**: Generated wiki is useful and accurate

**Commit**: "Initial self-documentation run and prompt tuning"

**Wiki Check**: Compare generated wiki to hand-written wiki. This is the critical validation.

---

### Step 27: Configuration System
**Task**: Make system configurable

**Test First**:
- Test loading configuration from file
- Test environment variable overrides
- Test configuration validation
- Test default values work
- Test invalid configuration rejected

**Implementation**:
1. Create `lib/config.js`
2. Define configuration schema
3. Implement loading from multiple sources (env, file, defaults)
4. Add validation
5. Make processor configurable (meta-analysis frequency, cost limits, etc.)
6. Make agents configurable (model, max tokens, prompts)
7. Add configuration UI in dashboard

**Test**: Configuration system works correctly

**Commit**: "Implement configuration system with tests"

**Wiki Check**: Document configuration options in `dev-wiki/guides/configuration.md`.

---

### Step 28: Manual Fallback System
**Task**: Implement manual mode for testing without API keys

**Test First**:
- Test system detects missing API key
- Test UI switches to manual mode
- Test user can review agent suggestions
- Test user can edit before applying
- Test user can act as agent (write docs directly)

**Implementation**:
1. Detect missing API keys on startup
2. Add "Manual Mode" UI
3. Allow user to review/edit agent outputs before applying
4. Add manual documentation editor
5. Allow manual commit data entry for GitHub
6. Track manual interventions in state

**Test**: Manual mode works without API keys

**Commit**: "Implement manual fallback mode with tests"

**Wiki Check**: Document manual mode in `dev-wiki/guides/manual-mode.md`.

---

### Step 29: Fifth Self-Documentation Run
**Task**: Full documentation with tuned system

**Actions**:
1. Delete generated wiki from Step 26
2. Run processor on entire codebase from start
3. Let it complete fully automated
4. Review final wiki
5. Manually add polish where needed
6. Commit both code and generated wiki

**Validation**:
- Can new developer understand system from wiki?
- Are all major components documented?
- Are relationships clear?
- Is navigation intuitive?

**Test**: Generated wiki meets quality standards

**Commit**: "Complete self-documentation with production-ready wiki"

**Wiki Check**: This IS the wiki check - the generated wiki should now be the primary documentation.

---

### Step 30: README and Documentation
**Task**: Create external documentation

**Actions**:
1. Write comprehensive README.md
2. Include installation instructions
3. Include quick start guide
4. Link to generated wiki for architecture
5. Document API key setup
6. Add troubleshooting section
7. Add contribution guidelines
8. Create LICENSE file

**Test**: Follow README yourself to verify completeness

**Commit**: "Add README and external documentation"

**Wiki Check**: N/A - this is user-facing documentation.

---

## Phase 6: MCP Server (Optional Enhancement)

### Step 31: MCP Server Implementation
**Task**: Create MCP server for Claude Code integration

**Test First**:
- Test MCP server starts and accepts connections
- Test query handling returns wiki content
- Test search functionality
- Test request queue management
- Test error handling

**Implementation**:
1. Research MCP protocol specification
2. Create `mcp-server.js`
3. Implement MCP protocol handlers
4. Implement wiki query endpoint
5. Implement search endpoint
6. Implement request queue endpoint
7. Add authentication if needed

**Test**: MCP server responds correctly to queries

**Commit**: "Implement MCP server with tests"

**Wiki Check**: Document MCP server in `dev-wiki/components/mcp-server.md`.

---

### Step 32: Request Queue System
**Task**: Implement documentation request queue

**Test First**:
- Test adding request to queue
- Test prioritizing requests
- Test processing queue during meta-analysis
- Test marking requests as fulfilled
- Test UI for viewing queue

**Implementation**:
1. Extend `lib/wiki-manager.js` with queue management
2. Add queue storage in `_metadata.json`
3. Implement request prioritization
4. Integrate with meta-analysis agent
5. Add queue display to dashboard
6. Add manual request submission UI

**Test**: Request queue works correctly

**Commit**: "Implement documentation request queue with tests"

**Wiki Check**: Update MCP documentation with request queue feature.

---

### Step 33: Claude Code Integration Testing
**Task**: Test with actual Claude Code usage

**Actions**:
1. Configure Claude Code to connect to MCP server
2. Test querying wiki from Claude Code
3. Test that responses are helpful
4. Test requesting missing documentation
5. Test that requests appear in queue
6. Verify workflow improvement

**Validation**:
- Claude Code gets useful context from wiki
- Missing documentation gets queued and generated
- Development speed improves with wiki access

**Test**: Manual validation that integration works

**Commit**: "Validate Claude Code integration"

**Wiki Check**: Document integration workflow in `dev-wiki/guides/claude-code-integration.md`.

---

## Final Steps

### Step 34: Performance Optimization
**Task**: Optimize processing speed and resource usage

**Sub-Agent Opportunity**: Spawn sub-agent to profile code and identify bottlenecks

**Areas to Optimize**:
- Parallel processing of independent files
- Caching frequently accessed wiki pages
- Batching GitHub API calls
- Efficient token counting
- Lazy loading in UI

**Test**: Processing speed improves without breaking functionality

**Commit**: "Performance optimizations"

**Wiki Check**: Update architecture documentation with optimization strategies.

---

### Step 35: Security Review
**Task**: Security hardening

**Review Checklist**:
- API keys never logged or committed
- Input validation on all user inputs
- Secure WebSocket connections
- Safe markdown rendering (XSS prevention)
- File path traversal prevention
- Rate limiting on API endpoints

**Test**: Security tests pass

**Commit**: "Security hardening"

**Wiki Check**: Create `dev-wiki/guides/security.md`.

---

### Step 36: Final Polish
**Task**: Bug fixes, UI improvements, error messages

**Actions**:
1. Test entire system end-to-end
2. Fix any remaining bugs
3. Improve error messages
4. Polish UI styling
5. Add loading indicators
6. Add success/failure notifications
7. Improve logging

**Test**: System is production-ready

**Commit**: "Final polish and bug fixes"

**Wiki Check**: Final review of all wiki documentation.

---

### Step 37: Release Preparation
**Task**: Prepare for release

**Actions**:
1. Run full test suite - all tests pass
2. Generate final wiki for this project
3. Verify README is accurate
4. Tag release v1.0.0
5. Create release notes
6. Document known limitations
7. Plan future enhancements

**Test**: Can clone repo and run system following README alone

**Commit**: "Release v1.0.0"

**Wiki Check**: Generated wiki is the authoritative source for understanding this system.

---

## Continuous Development Practices

### Before Starting Each Step
1. Read relevant wiki pages for components you'll interact with
2. Review test files for related components
3. Check state of existing tests

### During Implementation
1. Write tests first (red)
2. Implement minimum code to pass (green)
3. Refactor if needed
4. Commit when tests pass

### After Completing Each Step
1. Run full test suite
2. Commit with descriptive message
3. Update wiki if architecture changed
4. Note any technical debt or future improvements

### Every 5 Steps
1. Run wiki generator on codebase
2. Read generated documentation
3. Validate it's accurate and useful
4. Tune prompts if documentation is poor
5. Commit updated wiki

### Using Sub-Agents
**When to Spawn**:
- Research tasks (library evaluation, API exploration)
- Isolated implementations (utility functions, test fixtures)
- Documentation writing (complex explanations)
- Design tasks (UI mockups, data schema design)

**Main Agent Responsibility**:
- Integration of sub-agent work
- Architectural decisions
- Test orchestration
- Progress tracking

---

## Success Criteria Checklist

**Functional Requirements**:
- [ ] Can process git repository and generate wiki
- [ ] Wiki is accurate and useful
- [ ] Manual stepping mode works
- [ ] Batch processing works
- [ ] Meta-analysis identifies themes
- [ ] Dashboard provides visibility
- [ ] WebSocket updates work
- [ ] Cost tracking enforced
- [ ] Error recovery works
- [ ] MCP server integrates with Claude Code

**Quality Requirements**:
- [ ] 80%+ test coverage
- [ ] All tests passing
- [ ] Generated wiki for this project is comprehensive
- [ ] README allows new user to get started
- [ ] Manual mode works without API keys
- [ ] No security vulnerabilities

**Self-Validation Requirements**:
- [ ] You used the generated wiki during development
- [ ] Generated wiki accurately describes the system
- [ ] Documentation quality improved through iterations
- [ ] Can explain architecture from wiki alone

---

## Key Decision Points Requiring Human Review

**After Step 7**: Human reviews initial hand-written wiki to ensure documentation standards are clear

**After Step 26**: Human reviews first self-generated wiki to validate quality before continuing

**After Step 29**: Human reviews final self-generated wiki for production readiness

**After Step 33**: Human validates Claude Code integration provides real value

---

## Expected Timeline

**Phase 1** (Steps 1-7): Infrastructure foundation - 6-8 hours
**Phase 2** (Steps 8-13): AI agent system - 6-8 hours  
**Phase 3** (Steps 14-16): Processing engine - 4-6 hours
**Phase 4** (Steps 17-22): Web interface - 6-8 hours
**Phase 5** (Steps 23-30): Integration & polish - 8-10 hours
**Phase 6** (Steps 31-33): MCP server - 4-6 hours
**Final** (Steps 34-37): Optimization & release - 4-6 hours

**Total**: 38-52 hours of development time

With frequent commits (37+ commits), the human can monitor progress continuously through the evolving codebase and self-generated wiki.

---

**Version**: 2.0 - AI Coding Agent Implementation Guide  
**Last Updated**: November 22, 2025  
**Status**: Ready for AI-Driven Development  
**Expected Outcome**: Production-ready CodeWiki Generator with comprehensive self-documentation
