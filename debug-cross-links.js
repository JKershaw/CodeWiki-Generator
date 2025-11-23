/**
 * Debug script to check cross-linking logic
 */

const WikiManager = require('./lib/wiki-manager');
const LinkDiscoveryAgent = require('./lib/agents/link-discovery-agent');
const DocumentationWriterAgent = require('./lib/agents/documentation-writer-agent');

async function main() {
  console.log('=== Debugging Cross-Link Logic ===\n');

  const wikiManager = new WikiManager('./wiki');
  const linkDiscovery = new LinkDiscoveryAgent();
  const docWriter = new DocumentationWriterAgent();

  try {
    const allPages = await wikiManager.getAllPages();
    console.log(`Total pages: ${allPages.length}`);
    console.log('\nPage structure sample:');
    if (allPages.length > 0) {
      console.log(JSON.stringify(allPages[0], null, 2));
    }

    // Test link discovery on architecture.md
    const archPage = allPages.find(p => p.path && p.path.includes('architecture.md'));
    if (archPage) {
      console.log('\n=== Testing architecture.md ===');
      console.log('Path:', archPage.path);
      console.log('Title:', archPage.title || archPage.metadata?.title);
      console.log('Content length:', archPage.content?.length || 0);
      console.log('Content preview (first 500 chars):', archPage.content?.substring(0, 500));

      const mentions = linkDiscovery.findMentions(archPage.content, allPages);
      console.log(`\nMentions found: ${mentions.length}`);
      if (mentions.length > 0) {
        console.log('First 5 mentions:');
        mentions.slice(0, 5).forEach(m => {
          console.log(`  - "${m.originalText}" -> ${m.targetPath}`);
        });
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
