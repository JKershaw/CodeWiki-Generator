/**
 * Debug script to check related pages discovery
 */

const WikiManager = require('./lib/wiki-manager');
const LinkDiscoveryAgent = require('./lib/agents/link-discovery-agent');

async function main() {
  console.log('=== Debugging Related Pages Discovery ===\n');

  const wikiManager = new WikiManager('./wiki');
  const linkDiscovery = new LinkDiscoveryAgent();

  try {
    const allPagesMetadata = await wikiManager.getAllPages();

    // Load full page data
    const allPages = [];
    for (const pageMetadata of allPagesMetadata) {
      const fullPage = await wikiManager.getPage(pageMetadata.path);
      if (fullPage) {
        allPages.push(fullPage);
      }
    }

    console.log(`Total pages loaded: ${allPages.length}\n`);

    // Test on architecture.md
    const archPage = allPages.find(p => p.path && p.path.includes('architecture.md'));
    if (archPage) {
      console.log('=== Testing architecture.md ===');
      console.log('Path:', archPage.path);
      console.log('Title:', archPage.metadata?.title || 'NO TITLE');
      console.log('Content length:', archPage.content?.length || 0);

      const mentions = linkDiscovery.findMentions(archPage.content, allPages);
      console.log(`\nMentions found: ${mentions.length}`);

      const related = linkDiscovery.findRelatedPages(
        archPage.content,
        archPage.path,
        allPages
      );
      console.log(`\nRelated pages found: ${related.length}`);
      if (related.length > 0) {
        console.log('Related pages:');
        related.forEach(r => console.log(`  - ${r}`));
      }
    }

  } catch (error) {
    console.error('\n=== Error ===');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
