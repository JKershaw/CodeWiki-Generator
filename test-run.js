/**
 * Test script to run CodeWiki Generator on itself
 * Outputs to generated-wiki/ to avoid overwriting dev-wiki/
 */

const Processor = require('./lib/processor');

async function main() {
  console.log('Starting CodeWiki Generator test run...\n');

  const processor = new Processor('./generated-wiki');

  try {
    // Process this repository
    const stats = await processor.processRepository(
      'https://github.com/JKershaw/CodeWiki-Generator',
      {
        maxCost: 2.00,  // $2 limit for testing
        metaAnalysisFrequency: 5
      }
    );

    console.log('\n=== Processing Complete ===');
    console.log(`Commits processed: ${stats.commitsProcessed}`);
    console.log(`Total files: ${stats.totalFiles}`);
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Files skipped: ${stats.filesSkipped}`);
    console.log(`Pages created: ${stats.pagesCreated}`);
    console.log(`Pages updated: ${stats.pagesUpdated}`);
    console.log(`Meta-analysis runs: ${stats.metaAnalysisRuns}`);
    console.log(`Total cost: $${stats.totalCost.toFixed(4)}`);

    if (stats.stopped) {
      console.log(`\nStopped: ${stats.stopReason}`);
    }

    console.log('\n=== Generated Wiki ===');
    console.log('Output directory: ./generated-wiki/');
    console.log('\nYou can now compare generated-wiki/ with dev-wiki/');

  } catch (error) {
    console.error('\n=== Error ===');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
