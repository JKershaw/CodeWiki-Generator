#!/usr/bin/env node

/**
 * Add bidirectional Wikipedia-style links across all wiki pages
 * Enhances cross-referencing between meta, code, and history layers
 */

const WikiManager = require('./lib/wiki-manager');
const LinkDiscoveryAgent = require('./lib/agents/link-discovery-agent');
const path = require('path');
const fs = require('fs').promises;

async function enhanceBidirectionalLinks() {
  console.log('🔗 Enhancing Wiki with Bidirectional Links\n');
  console.log('='.repeat(70));

  const wikiPath = path.join(__dirname, 'wikis/codewiki-generator');
  const wikiManager = new WikiManager(wikiPath);
  const linkDiscovery = new LinkDiscoveryAgent();

  // Step 1: Get all pages
  console.log('\n📖 Loading all wiki pages...');
  const allPages = await wikiManager.getAllPages();
  console.log(`   Found ${allPages.length} pages`);

  // Step 2: Build page title index for link discovery
  const pageIndex = allPages.map(p => ({
    title: p.metadata?.title || path.basename(p.path, '.md'),
    path: p.path
  }));

  // Step 3: Process each page to add cross-links
  console.log('\n🔍 Adding bidirectional cross-links...\n');

  let pagesUpdated = 0;
  let linksAdded = 0;

  for (const pageInfo of allPages) {
    const pagePath = pageInfo.path;

    // Read the raw markdown (not HTML)
    const fullPath = path.join(wikiPath, pagePath);
    let rawContent = await fs.readFile(fullPath, 'utf-8');

    // Parse frontmatter
    const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      console.log(`  ⚠️  Skipping ${pagePath} (no frontmatter)`);
      continue;
    }

    const frontmatter = frontmatterMatch[1];
    let markdownContent = frontmatterMatch[2];

    // Count existing links
    const existingLinks = (markdownContent.match(/\[.*?\]\(.*?\)/g) || []).length;

    // Find potential mentions of other pages
    const mentions = linkDiscovery.findMentions(markdownContent, pageIndex);

    // Filter out self-references and already-linked
    const validMentions = mentions.filter(m =>
      m.targetPath !== pagePath &&
      !isAlreadyLinked(markdownContent, m.position)
    );

    if (validMentions.length === 0) {
      console.log(`  • ${pagePath} - no new links to add`);
      continue;
    }

    // Add links (reverse order to preserve positions)
    validMentions.reverse().forEach(mention => {
      const replacement = createMarkdownLink(mention, pagePath);
      markdownContent =
        markdownContent.substring(0, mention.position) +
        replacement +
        markdownContent.substring(mention.position + mention.originalText.length);
      linksAdded++;
    });

    // Write back
    const newContent = `---\n${frontmatter}\n---\n${markdownContent}`;
    await fs.writeFile(fullPath, newContent, 'utf-8');

    const newLinks = (markdownContent.match(/\[.*?\]\(.*?\)/g) || []).length;
    console.log(`  ✅ ${pagePath} - added ${validMentions.length} links (${existingLinks} → ${newLinks})`);
    pagesUpdated++;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Summary:');
  console.log('='.repeat(70));
  console.log(`Pages updated: ${pagesUpdated}`);
  console.log(`Links added: ${linksAdded}`);
  console.log(`\n✨ Bidirectional linking complete!\n`);
}

/**
 * Check if a position is already part of a link
 */
function isAlreadyLinked(content, position) {
  const before = content.substring(Math.max(0, position - 100), position);
  const after = content.substring(position, position + 100);

  const openBracket = before.lastIndexOf('[');
  const closeBracket = before.lastIndexOf(']');
  const openParen = after.indexOf('](');

  return openBracket !== -1 && openBracket > closeBracket && openParen !== -1;
}

/**
 * Create a relative markdown link
 */
function createMarkdownLink(mention, currentPath) {
  // Calculate relative path
  const currentDir = path.dirname(currentPath);
  const targetPath = mention.targetPath;

  let relativePath;
  if (currentDir === '.') {
    relativePath = targetPath;
  } else {
    const levels = currentDir.split('/').length;
    const prefix = '../'.repeat(levels);
    relativePath = prefix + targetPath;
  }

  // Preserve bold formatting
  if (mention.originalText.startsWith('**')) {
    return `**[${mention.titleText}](${relativePath})**`;
  } else {
    return `[${mention.titleText}](${relativePath})`;
  }
}

// Run if called directly
if (require.main === module) {
  enhanceBidirectionalLinks().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { enhanceBidirectionalLinks };
