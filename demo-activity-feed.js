#!/usr/bin/env node
/**
 * Demo script for Activity Feed
 *
 * This script demonstrates the activity feed by emitting simulated events
 * Run the server in another terminal and this script to see live updates
 *
 * Usage:
 *   node demo-activity-feed.js
 */

const ActivityEventEmitter = require('./lib/activity-event-emitter');

// Create an activity emitter (in real usage, this would be shared with the dashboard controller)
const activityEmitter = new ActivityEventEmitter();

// Simulate processing workflow
async function simulateProcessing() {
  console.log('Starting activity feed demo...');
  console.log('Open http://localhost:3000 in your browser to see the activity feed\n');

  // Simulate processing a commit
  console.log('1. Starting commit processing...');
  activityEmitter.emitCommitStart('a1b2c3d', 'Add new feature: Activity feed');
  await sleep(1000);

  // Simulate file analysis
  console.log('2. Analyzing files...');
  activityEmitter.emitFileAnalysis('lib/activity-event-emitter.js', 'processing');
  await sleep(500);
  activityEmitter.emitFileAnalysis('lib/activity-event-emitter.js', 'completed');
  await sleep(500);

  activityEmitter.emitFileAnalysis('lib/dashboard-controller.js', 'processing');
  await sleep(500);
  activityEmitter.emitFileAnalysis('lib/dashboard-controller.js', 'completed');
  await sleep(500);

  activityEmitter.emitFileAnalysis('public/activity-feed.js', 'processing');
  await sleep(500);
  activityEmitter.emitFileAnalysis('public/activity-feed.js', 'completed');
  await sleep(1000);

  // Simulate wiki updates
  console.log('3. Updating wiki pages...');
  activityEmitter.emitWikiUpdate('components/activity-feed.md', 'created');
  await sleep(500);
  activityEmitter.emitWikiUpdate('concepts/event-system.md', 'created');
  await sleep(500);
  activityEmitter.emitWikiUpdate('guides/activity-monitoring.md', 'created');
  await sleep(1000);

  // Simulate completion
  console.log('4. Processing complete!');
  activityEmitter.emitCompletion({
    commitSha: 'a1b2c3d',
    filesProcessed: 3,
    filesSkipped: 0,
    pagesCreated: 3,
    pagesUpdated: 0,
    concepts: ['ActivityEventEmitter', 'Event System', 'SSE']
  });
  await sleep(1000);

  // Simulate another commit
  console.log('\n5. Processing second commit...');
  activityEmitter.emitCommitStart('e4f5g6h', 'Update documentation and add tests');
  await sleep(800);

  activityEmitter.emitFileAnalysis('tests/unit/activity-event-emitter.test.js', 'processing');
  await sleep(400);
  activityEmitter.emitFileAnalysis('tests/unit/activity-event-emitter.test.js', 'completed');
  await sleep(800);

  activityEmitter.emitWikiUpdate('components/activity-feed.md', 'updated');
  await sleep(500);

  // Simulate an error
  console.log('6. Simulating an error...');
  activityEmitter.emitError(
    new Error('Failed to parse file: invalid syntax'),
    'file analysis'
  );
  await sleep(1000);

  activityEmitter.emitCompletion({
    commitSha: 'e4f5g6h',
    filesProcessed: 1,
    filesSkipped: 0,
    pagesCreated: 0,
    pagesUpdated: 1,
    concepts: ['Testing', 'ActivityEventEmitter']
  });

  // Show statistics
  console.log('\n--- Statistics ---');
  const stats = activityEmitter.getStatistics();
  console.log(`Total events: ${stats.total}`);
  console.log('Events by type:');
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  console.log('\n--- Recent History ---');
  const history = activityEmitter.getHistory(5);
  history.forEach(event => {
    console.log(`[${event.type}] ${formatEvent(event)}`);
  });

  console.log('\n✅ Demo complete!');
  console.log('The activity feed in your browser should show all these events.');
}

function formatEvent(event) {
  switch (event.type) {
    case 'COMMIT_START':
      return `${event.commitSha}: ${event.commitMessage}`;
    case 'FILE_ANALYSIS':
      return `${event.fileName} - ${event.status}`;
    case 'WIKI_UPDATE':
      return `${event.pagePath} ${event.action}`;
    case 'ERROR':
      return `${event.error} in ${event.context}`;
    case 'COMPLETION':
      return `Processed ${event.summary.filesProcessed} files`;
    default:
      return JSON.stringify(event);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nDemo interrupted. Exiting...');
  process.exit(0);
});

// Run the demo
if (require.main === module) {
  simulateProcessing().catch(error => {
    console.error('Demo error:', error);
    process.exit(1);
  });
}

module.exports = { simulateProcessing };
