---
title: Real-time Status Polling
category: component
sourceFile: public/app.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Real-time Status Polling

## Purpose and Overview

The Real-time Status Polling component provides automatic status synchronization between the client dashboard and backend processing state. It implements a 5-second polling interval during active processing to deliver live feedback and keep users informed of operation progress.

## Key Functionality

- **Automatic Polling**: Initiates status checks every 5 seconds when processing is active
- **Backend Synchronization**: Maintains real-time connection with server-side processing state
- **Live User Feedback**: Updates dashboard interface with current operation status
- **Processing State Tracking**: Monitors and reflects changes in repository analysis workflow
- **Interval Management**: Handles start/stop timing for polling cycles based on processing state

The polling mechanism runs continuously during active operations, querying the backend API at regular intervals to fetch the latest processing status and update the user interface accordingly.

## Relationships

- **Interactive Dashboard Client**: Integrates with the main dashboard component to provide real-time status updates
- **Process Control Interface**: Works alongside process control operations (start, pause, step) to reflect state changes
- **Backend API**: Communicates with server endpoints to retrieve current processing status
- **Async Form Submission Pattern**: Utilizes the same asynchronous communication patterns for status requests

## Usage Example

```javascript
// Status polling is automatically managed by the dashboard client
// Polling starts when processing begins and updates every 5 seconds

// Example of the polling pattern used internally:
setInterval(async () => {
  const response = await fetch('/api/status');
  const status = await response.json();
  updateDashboard(status);
}, 5000);
```

## Testing

No automated tests found for this component. Manual testing should verify polling behavior during processing operations and proper cleanup when operations complete.