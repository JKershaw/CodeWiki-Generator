/**
 * Standalone script to add cross-page links to existing wiki
 */

const Processor = require('./lib/processor');

async function main() {
  console.log('=== Adding Cross-Page Links to Existing Wiki ===\n');

  const processor = new Processor('./wiki');

  try {
    await processor.addCrossLinksToAllPages();
    console.log('\n✓ Successfully added cross-page links');
  } catch (error) {
    console.error('\n=== Error ===');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
