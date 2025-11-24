---
title: Asynchronous API communication with error handling
category: component
sourceFile: public/app.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Asynchronous API Communication with Error Handling

## Purpose and Overview

This component establishes a consistent pattern for client-side communication with backend API endpoints, enabling the dashboard to control repository analysis workflows. It handles fetch requests to multiple backend endpoints with built-in error handling and user feedback through alerts, ensuring reliable asynchronous operations even when network issues or server errors occur.

## Key Functionality

The component implements several core patterns:

- **Form Submission Handling**: Captures repository URL input from the start form and initiates backend processing via the `/process/start` endpoint
- **Control Operations**: Sends control requests to pause (`/process/pause`) or step through (`/process/step`) the commit analysis workflow
- **Error Management**: Wraps all fetch requests with try-catch blocks and alert-based error reporting to inform users of failures
- **Status Polling**: Automatically queries the `/api/status` endpoint at 5-second intervals to detect when long-running asynchronous processes complete, triggering page reloads when status changes

## Relationships

The component integrates with:

- **Backend Endpoints**: `/process/start`, `/process/pause`, `/process/step`, `/api/status`
- **HTML Elements**: References specific DOM elements including `start-form`, `repoUrl`, `pauseBtn`, `stepBtn`, and `status-badge` for UI interactions
- **Phase 4 Workflow**: Enables user control over the repository analysis workflow within the web dashboard implementation

## Usage Example

```javascript
// Form submission - initiates repository processing
document.getElementById('start-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const repoUrl = document.getElementById('repoUrl').value;
  
  try {
    const response = await fetch('/process/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: repoUrl })
    });
    if (!response.ok) throw new Error('Failed to start processing');
    // Handle success - status polling begins automatically
  } catch (error) {
    alert(error.message);
  }
});

// Button click - advances processing by one step
document.getElementById('stepBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('/process/step', { method: 'POST' });
    if (!response.ok) throw new Error('Step failed');
    const data = await response.json();
    // Update UI with processed commit SHA
  } catch (error) {
    alert(error.message);
  }
});

// Status polling - runs every 5 seconds when processing is active
setInterval(async () => {
  try {
    const response = await fetch('/api/status');
    if (!response.ok) throw new Error('Status check failed');
    const data = await response.json();
    if (data.statusChanged) location.reload();
  } catch (error) {
    console.error(error.message);
  }
}, 5000);
```

## Testing

No automated tests are currently available for this component. Testing should cover:

- Successful form submission and API response handling
- Error scenarios (network failures, invalid responses, server errors)
- Status polling behavior and page reload triggering
- UI element state changes following API operations