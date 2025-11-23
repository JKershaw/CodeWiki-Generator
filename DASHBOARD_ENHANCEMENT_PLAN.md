# Dashboard Enhancement Implementation Plan

## Overview
This document outlines the implementation plan for 10 dashboard enhancement features organized into three priority tiers.

**Current Architecture:**
- Express.js server with EJS templating
- Dashboard controller managing routes and state
- WikiManager for markdown file operations
- Client-side JavaScript for interactivity
- Basic status monitoring with auto-refresh

## Implementation Strategy

### Phase 1: Tier 1 Features (Must Have - Core Experience)
Critical features that significantly improve the user experience and must be implemented first.

---

## Feature #1: Interactive Context Research Panel (Tier 1)

### Description
An integrated panel that allows users to query the wiki using natural language, similar to the `wiki-context.js` CLI tool but embedded in the dashboard.

### Requirements
- Text input for research queries
- Real-time search and analysis of wiki content
- Display relevant pages with summaries
- Show related components and file paths
- Provide implementation guidance
- Support for switching between wiki projects

### Implementation Details

#### Backend (lib/wiki-context-service.js)
- Port wiki-context logic into a service class
- Create API endpoint: `POST /api/context/research`
- Accept query parameter and project name
- Return structured response with:
  - Summary
  - Relevant pages (with excerpts)
  - Key components
  - Key concepts
  - Implementation guidance
  - Related files

#### Frontend (views/dashboard.ejs + public/app.js)
- Add collapsible panel in dashboard
- Text area for research query
- "Research" button to trigger search
- Loading indicator during search
- Results display with sections for:
  - Summary
  - Relevant pages (expandable)
  - Components
  - Concepts
  - Implementation steps
  - File links

#### Testing
- Unit tests for wiki-context-service
- Integration tests for API endpoint
- E2E tests for panel interaction

---

## Feature #2: In-Browser Wiki Editor (Tier 1)

### Description
Edit wiki markdown files directly in the browser without switching to a text editor.

### Requirements
- View markdown source and preview side-by-side
- Syntax highlighting for markdown
- Real-time preview
- Save changes with validation
- Preserve frontmatter
- Track edit history
- Support for creating new pages

### Implementation Details

#### Backend
- New route: `GET /wiki/edit/:project/:page`
- New route: `POST /wiki/save/:project/:page`
- New route: `POST /wiki/create/:project`
- Validation for markdown syntax
- Backup before saving
- Update metadata timestamps

#### Frontend (views/wiki-editor.ejs)
- Split-pane layout (source | preview)
- Markdown textarea with syntax highlighting (use CodeMirror or similar)
- Live preview using marked.js
- Save button with keyboard shortcut (Ctrl+S)
- Frontmatter editor (separate form fields)
- Create new page modal
- Discard changes confirmation

#### Testing
- Test markdown parsing and rendering
- Test save functionality
- Test frontmatter preservation
- Test concurrent edit detection

---

## Feature #3: Rich Wiki Browser (Tier 1)

### Description
Enhanced wiki viewing experience with better navigation, search, and visual elements.

### Requirements
- Table of contents for long pages
- Breadcrumb navigation
- Full-text search across all pages
- Tag-based filtering
- Related pages sidebar
- Page metadata display (tags, dates, relationships)
- Syntax highlighting for code blocks
- Responsive design for mobile

### Implementation Details

#### Backend
- New route: `GET /api/wiki/:project/search?q=query`
- New route: `GET /api/wiki/:project/toc/:page`
- Enhanced WikiManager methods:
  - `searchContent(query, project)` - full-text search
  - `getTableOfContents(page)` - extract headings
  - `getRelatedPages(page)` - based on links and tags

#### Frontend (views/wiki-page.ejs)
- Enhanced layout with sidebar
- Search bar at top
- Auto-generated table of contents
- Breadcrumb trail
- Related pages panel
- Tag pills (clickable to filter)
- Improved code block styling
- Mobile-responsive layout

#### Testing
- Test search functionality
- Test TOC generation
- Test related pages algorithm
- Test responsive design

---

### Phase 2: Tier 2 Features (Should Have - Major Value)
Features that add significant value but aren't critical for initial launch.

---

## Feature #4: Live Activity Feed (Tier 2)

### Description
Real-time feed showing processing activities, file changes, and wiki updates.

### Requirements
- Stream of processing events
- Commit processing notifications
- File analysis notifications
- Wiki page updates
- Error notifications
- Filterable by event type
- Persistent history (last 100 events)
- Export activity log

### Implementation Details

#### Backend
- Create EventEmitter for processing events
- New route: `GET /api/activity/feed` (SSE or WebSocket)
- New route: `GET /api/activity/history?limit=100`
- Integrate event emission in processor:
  - On commit start
  - On file analysis
  - On wiki update
  - On error
  - On completion

#### Frontend
- Activity panel in dashboard
- Event list with icons and timestamps
- Filter dropdowns (event type, severity)
- Auto-scroll to latest
- Clear history button
- Export to JSON

#### Testing
- Test event emission
- Test WebSocket/SSE connection
- Test filtering
- Test history persistence

---

## Feature #5: Planning & Roadmap Section (Tier 2)

### Description
Tool for planning documentation work, tracking progress, and managing roadmaps.

### Requirements
- Create documentation tasks
- Prioritize tasks
- Assign pages to tasks
- Track completion status
- View roadmap timeline
- Link to specific commits or features
- Notes and comments

### Implementation Details

#### Backend
- New data file: `<project>/planning.json`
- New routes:
  - `GET /api/planning/:project` - get all tasks
  - `POST /api/planning/:project/tasks` - create task
  - `PUT /api/planning/:project/tasks/:id` - update task
  - `DELETE /api/planning/:project/tasks/:id` - delete task
- Task schema:
  ```json
  {
    "id": "uuid",
    "title": "Task title",
    "description": "Details",
    "priority": "high|medium|low",
    "status": "todo|in-progress|done",
    "assignedPages": ["page1.md", "page2.md"],
    "createdAt": "timestamp",
    "completedAt": "timestamp",
    "notes": "Additional notes"
  }
  ```

#### Frontend (views/planning.ejs)
- Kanban board view (Todo | In Progress | Done)
- Task cards with drag-and-drop
- Create task modal
- Edit task modal
- Filter by priority
- Timeline view (roadmap)
- Progress statistics

#### Testing
- Test CRUD operations
- Test task state transitions
- Test data persistence

---

## Feature #6: Smart Suggestions (Tier 2)

### Description
AI-powered suggestions for improving documentation based on code analysis and wiki content.

### Requirements
- Identify missing documentation
- Suggest page improvements
- Detect outdated content
- Recommend linking opportunities
- Identify inconsistencies
- Generate documentation drafts

### Implementation Details

#### Backend
- New service: `lib/suggestion-engine.js`
- New routes:
  - `GET /api/suggestions/:project` - get all suggestions
  - `POST /api/suggestions/:project/generate` - run analysis
  - `POST /api/suggestions/:project/:id/apply` - apply suggestion
  - `DELETE /api/suggestions/:project/:id` - dismiss suggestion
- Analysis types:
  - Undocumented components (via code analysis)
  - Short pages (<200 words)
  - Pages without links
  - Broken cross-references
  - Missing related pages

#### Frontend
- Suggestions panel in dashboard
- Suggestion cards with:
  - Type indicator
  - Description
  - Affected pages
  - "Apply" and "Dismiss" buttons
- Generate suggestions button
- Filter by type

#### Testing
- Test suggestion generation
- Test suggestion application
- Test dismiss functionality

---

### Phase 3: Tier 3 Features (Nice to Have - Polish)
Features that polish the experience but aren't essential.

---

## Feature #7: Wiki Metadata Dashboard (Tier 3)

### Description
Visualization and analytics for wiki health and coverage.

### Requirements
- Page count statistics
- Coverage metrics
- Link graph visualization
- Tag cloud
- Recent activity timeline
- Page size distribution
- Orphaned pages detection
- Most/least linked pages

### Implementation Details

#### Backend
- New route: `GET /api/metadata/:project/stats`
- Analytics service: `lib/wiki-analytics.js`
- Calculate metrics:
  - Total pages, categories
  - Average page length
  - Link density
  - Tag distribution
  - Update frequency
  - Orphaned pages
  - Dead links

#### Frontend (views/metadata-dashboard.ejs)
- Dashboard with cards for metrics
- Charts using Chart.js:
  - Page count by category (bar chart)
  - Link graph (force-directed graph)
  - Tag cloud
  - Activity heatmap
- Tables for top/bottom pages
- Export data as CSV

#### Testing
- Test metric calculations
- Test chart rendering
- Test data export

---

## Feature #8: Multi-Project Workspace (Tier 3)

### Description
Manage multiple wiki projects simultaneously with easy switching and comparison.

### Requirements
- Project list with metadata
- Quick project switcher
- Create new projects
- Import existing wikis
- Compare pages across projects
- Shared templates
- Project-specific settings

### Implementation Details

#### Backend
- Enhanced project management in DashboardController
- New routes:
  - `POST /api/projects/create` - create new project
  - `POST /api/projects/import` - import existing wiki
  - `DELETE /api/projects/:project` - delete project
  - `GET /api/projects/:project/settings` - get settings
  - `PUT /api/projects/:project/settings` - update settings
- Project metadata file: `<project>/_project.json`
  ```json
  {
    "name": "Project Name",
    "description": "Description",
    "repository": "github.com/...",
    "createdAt": "timestamp",
    "settings": {
      "theme": "default",
      "maxPageSize": 5000
    }
  }
  ```

#### Frontend
- Project sidebar with thumbnails
- Create project wizard
- Import wizard
- Settings panel per project
- Project comparison view (side-by-side)

#### Testing
- Test project CRUD
- Test import functionality
- Test settings persistence

---

## Feature #9: Git History Integration (Tier 3)

### Description
View git commit history that contributed to each wiki page.

### Requirements
- Show commits that affected a page
- Display commit messages and authors
- Link to diff view
- Filter by date range
- Show page evolution timeline
- Blame view for content sections

### Implementation Details

#### Backend
- New service: `lib/git-history-service.js`
- New routes:
  - `GET /api/history/:project/:page` - get page history
  - `GET /api/history/:project/:page/timeline` - timeline view
  - `GET /api/history/:project/:page/blame` - blame view
- Integrate with GitHub API or local git
- Parse commit data affecting specific files

#### Frontend
- History tab on wiki pages
- Timeline visualization
- Commit list with:
  - Author avatar
  - Commit message
  - Timestamp
  - Diff link
- Date range filter
- Blame overlay on content

#### Testing
- Test commit fetching
- Test timeline generation
- Test blame calculation

---

## Feature #10: Collaborative Features (Tier 3)

### Description
Enable collaboration through comments, annotations, and suggestions.

### Requirements
- Comments on wiki pages
- Inline annotations
- Suggested edits (like pull requests)
- User mentions
- Activity notifications
- Review workflow
- Comment threads

### Implementation Details

#### Backend
- New data store: `<project>/comments.json`
- New routes:
  - `GET /api/comments/:project/:page` - get comments
  - `POST /api/comments/:project/:page` - add comment
  - `PUT /api/comments/:project/:page/:id` - edit comment
  - `DELETE /api/comments/:project/:page/:id` - delete comment
  - `GET /api/suggestions/:project/:page` - get edit suggestions
  - `POST /api/suggestions/:project/:page` - create suggestion
  - `POST /api/suggestions/:project/:page/:id/accept` - accept suggestion
- User authentication (basic auth or OAuth)
- Notification system

#### Frontend
- Comment panel on wiki pages
- Inline comment indicators
- Suggested edits diff view
- User avatar and name
- Reply threads
- Notification bell
- Review interface

#### Testing
- Test comment CRUD
- Test suggestion workflow
- Test notifications

---

## Technical Considerations

### Dependencies to Add
```json
{
  "marked": "^17.0.1",  // Already installed
  "codemirror": "^6.0.0",  // For wiki editor
  "chart.js": "^4.4.0",  // For metadata dashboard
  "d3": "^7.8.0",  // For link graph visualization
  "ws": "^8.18.0"  // Already installed (WebSocket)
}
```

### Database Considerations
- Currently using JSON files for state
- May need SQLite for:
  - Activity feed history
  - Comments and suggestions
  - User management
- Or keep JSON files for simplicity

### Authentication
- For Tier 3 collaborative features
- Options:
  - Basic HTTP auth
  - Session-based auth
  - OAuth (GitHub)
  - JWT tokens

### Performance
- Cache wiki content in memory
- Debounce search queries
- Lazy load activity feed
- Paginate large lists
- Use WebSocket for real-time updates

---

## Implementation Timeline

### Week 1: Tier 1 Features
- Day 1-2: Feature #1 (Interactive Context Research Panel)
- Day 3-4: Feature #2 (In-Browser Wiki Editor)
- Day 5-7: Feature #3 (Rich Wiki Browser)

### Week 2: Tier 2 Features
- Day 1-2: Feature #4 (Live Activity Feed)
- Day 3-4: Feature #5 (Planning & Roadmap Section)
- Day 5-7: Feature #6 (Smart Suggestions)

### Week 3: Tier 3 Features
- Day 1-2: Feature #7 (Wiki Metadata Dashboard)
- Day 3-4: Feature #8 (Multi-Project Workspace)
- Day 5-6: Feature #9 (Git History Integration)
- Day 7: Feature #10 (Collaborative Features - basic version)

### Week 4: Testing & Polish
- Integration testing
- E2E testing
- Bug fixes
- Documentation
- Performance optimization

---

## Success Metrics

### Tier 1 Success Criteria
- [ ] Users can research wiki context without CLI
- [ ] Users can edit wiki pages in browser
- [ ] Users can navigate wiki easily with search

### Tier 2 Success Criteria
- [ ] Users can see processing activities in real-time
- [ ] Users can plan documentation work
- [ ] System suggests documentation improvements

### Tier 3 Success Criteria
- [ ] Users can view wiki analytics
- [ ] Users can manage multiple projects
- [ ] Users can see page git history
- [ ] Users can collaborate on documentation

---

## Risk Mitigation

### Technical Risks
- **Risk**: AI API costs for suggestions
  - **Mitigation**: Cache suggestions, limit frequency, user-triggered only

- **Risk**: Performance with large wikis
  - **Mitigation**: Implement pagination, caching, lazy loading

- **Risk**: Concurrent edit conflicts
  - **Mitigation**: Last-write-wins with conflict detection, backup on save

### Scope Risks
- **Risk**: Feature creep
  - **Mitigation**: Stick to tier priorities, implement MVP first

- **Risk**: Delayed timeline
  - **Mitigation**: Ship Tier 1 first, iterate on Tier 2/3

---

## Next Steps

1. **Review this plan** - Ensure all features align with project goals
2. **Start with Tier 1** - Implement critical features first
3. **Use sub-agents** - Delegate isolated tasks (UI components, services)
4. **Test continuously** - Write tests for each feature
5. **Commit frequently** - Small, focused commits
6. **Document as you go** - Update wiki with new features

---

**Document Version**: 1.0
**Created**: 2025-11-23
**Status**: Ready for Implementation
