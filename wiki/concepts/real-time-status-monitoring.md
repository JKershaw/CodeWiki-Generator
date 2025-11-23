---
title: Real-time Status Monitoring
category: concept
sourceFile: public/app.js
related: [components/dashboard-control-interface.md]
created: 2025-11-23
updated: 2025-11-23
---

# Real-time Status Monitoring

## Purpose and Overview

Real-time Status Monitoring implements an automatic refresh pattern to keep the dashboard synchronized with server-side processing state. It continuously polls the server status during repository processing operations and updates the user interface to reflect current processing state.

## Key Functionality

- **Automatic Status Polling**: Establishes a 5-second interval to check server status via `/api/status` endpoint during active processing
- **UI State Synchronization**: Updates dashboard elements to reflect current processing phase, progress, and system state
- **Processing State Awareness**: Monitors whether repository processing is active, paused, or completed to control polling behavior
- **Real-time Feedback**: Provides immediate visual feedback to users about processing progress and system status

The monitoring system activates automatically when processing begins and continues until the operation completes or is manually stopped.

## Relationships

- **Process Control Integration**: Works alongside [Dashboard Control Interface](../components/dashboard-control-interface.md) to provide complete process management
- **API Communication**: Connects to `/api/status` endpoint for status retrieval
- **UI Updates**: Synchronizes with HTML dashboard elements to display current state
- **Event-Driven Architecture**: Responds to processing lifecycle events (start, pause, step, complete)

## Usage Example

The monitoring system initializes automatically when the dashboard loads:

```javascript
// Auto-refresh status every 5 seconds during processing
document.addEventListener('DOMContentLoaded', function() {
    // Status monitoring interval is established
    setInterval(async () => {
        const response = await fetch('/api/status');
        const status = await response.json();
        // UI elements updated based on status response
    }, 5000);
});
```

The monitoring integrates with process control actions:

```javascript
// Status polling activates when processing starts
document.getElementById('start-form').addEventListener('submit', async function(e) {
    await fetch('/process/start', { method: 'POST' });
    // Real-time monitoring begins automatically
});
```

## Testing

No automated tests found for this component. Testing would benefit from verifying polling behavior, status update accuracy, and UI synchronization during different processing states.