---
title: Interactive Web Dashboard
category: component
sourceFile: Not specified
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Interactive Web Dashboard

## Purpose and Overview

The Interactive Web Dashboard provides a browser-based control interface for managing the CodeWiki generation process. It allows users to start, pause, and step through repository analysis operations while providing real-time status updates through automated polling.

## Key Functionality

The dashboard implements several core features for process control:

- **Repository Processing Initiation**: Accepts repository URLs through a form submission handler to start CodeWiki generation
- **Process Control Operations**: Provides pause and step-through functionality via dedicated button handlers that communicate with REST API endpoints
- **Real-time Status Monitoring**: Automatically polls the server every 5 seconds to check processing status and refreshes the page when status changes occur
- **Step-by-step Processing**: Enables users to process individual commits and displays the current commit SHA for detailed control

The dashboard uses client-side JavaScript to make REST API calls for all process management operations, providing immediate feedback to users without requiring page reloads for most interactions.

## Relationships

The Interactive Web Dashboard serves as the primary user interface layer that connects to several backend systems:

- **Web Server Integration**: Communicates with web server endpoints for all process control operations (start, pause, step)
- **Status Monitoring System**: Integrates with the status monitoring system to provide real-time updates on processing progress
- **Process Control API**: Acts as the client-side implementation of the Process Control API, translating user interactions into REST API calls

## Usage Example

```javascript
// Form submission handler for starting repository processing
document.getElementById('start-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const repoUrl = document.getElementById('repo-url').value;
    
    const response = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repository: repoUrl })
    });
    
    if (response.ok) {
        document.getElementById('status').textContent = 'Processing started...';
    }
});

// Pause button handler
document.getElementById('pauseBtn').addEventListener('click', async function() {
    await fetch('/api/pause', { method: 'POST' });
});

// Step processing with commit display
document.getElementById('stepBtn').addEventListener('click', async function() {
    const response = await fetch('/api/step', { method: 'POST' });
    const data = await response.json();
    document.getElementById('current-commit').textContent = data.commitSha;
});
```

## Testing

No automated tests are currently available for the Interactive Web Dashboard. The component would benefit from integration tests that verify the dashboard's communication with backend APIs and unit tests for the individual event handlers.