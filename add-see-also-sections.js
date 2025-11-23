#!/usr/bin/env node

/**
 * Add "See Also" sections to wiki pages with related content
 * Uses WikiResearcher to find semantically related pages
 */

const WikiManager = require('./lib/wiki-manager');
const path = require('path');
const fs = require('fs').promises;

async function addSeeAlsoSections() {
  console.log('📚 Adding "See Also" Sections to Wiki Pages\n');
  console.log('='.repeat(70));

  const wikiPath = path.join(__dirname, 'wikis/codewiki-generator');
  const wikiManager = new WikiManager(wikiPath);

  // Get all pages
  console.log('\n📖 Loading all wiki pages...');
  const allPages = await wikiManager.getAllPages();
  console.log(`   Found ${allPages.length} pages`);

  console.log('\n📝 Adding "See Also" sections...\n');

  let pagesUpdated = 0;

  for (const pageInfo of allPages) {
    const pagePath = pageInfo.path;

    // Skip index
    if (pagePath === 'index.md') {
      continue;
    }

    // Read raw markdown
    const fullPath = path.join(wikiPath, pagePath);
    let rawContent = await fs.readFile(fullPath, 'utf-8');

    // Skip if already has "See Also"
    if (rawContent.includes('## See Also')) {
      console.log(`  • ${pagePath} - already has See Also section`);
      continue;
    }

    // Parse frontmatter
    const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      console.log(`  ⚠️  Skipping ${pagePath} (no frontmatter)`);
      continue;
    }

    const frontmatter = frontmatterMatch[1];
    const markdownContent = frontmatterMatch[2];

    // Extract metadata
    const metadata = parseFrontmatter(frontmatter);

    // Find related pages
    const relatedPages = findRelatedPages(pageInfo, allPages, metadata);

    if (relatedPages.length === 0) {
      console.log(`  • ${pagePath} - no related pages found`);
      continue;
    }

    // Build "See Also" section
    const seeAlsoSection = buildSeeAlsoSection(relatedPages, pagePath, metadata);

    // Add section before last line (if content exists)
    const updatedContent = `---\n${frontmatter}\n---\n${markdownContent.trim()}\n\n${seeAlsoSection}\n`;

    // Write back
    await fs.writeFile(fullPath, updatedContent, 'utf-8');

    console.log(`  ✅ ${pagePath} - added ${relatedPages.length} related links`);
    pagesUpdated++;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Summary:');
  console.log('='.repeat(70));
  console.log(`Pages updated: ${pagesUpdated}`);
  console.log(`\n✨ "See Also" sections complete!\n`);
}

/**
 * Parse YAML frontmatter into object
 */
function parseFrontmatter(frontmatter) {
  const metadata = {};
  const lines = frontmatter.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      if (value.startsWith('[')) {
        // Array
        metadata[key] = value.slice(1, -1).split(',').map(v => v.trim());
      } else {
        metadata[key] = value;
      }
    }
  }

  return metadata;
}

/**
 * Find related pages based on metadata and category
 */
function findRelatedPages(currentPage, allPages, metadata) {
  const related = [];
  const currentPath = currentPage.path;
  const currentCategory = path.dirname(currentPath);

  // 1. Pages explicitly listed in 'related' field
  if (metadata.related && Array.isArray(metadata.related)) {
    for (const relPath of metadata.related) {
      const page = allPages.find(p => p.path === relPath || p.path.endsWith(relPath));
      if (page && page.path !== currentPath) {
        related.push({
          title: page.metadata?.title || path.basename(page.path, '.md'),
          path: page.path,
          reason: 'related'
        });
      }
    }
  }

  // 2. For meta pages, link to code implementations
  if (currentPath.startsWith('meta/')) {
    const codePages = allPages.filter(p =>
      p.path.startsWith('concepts/') ||
      p.path.startsWith('components/') ||
      p.path.startsWith('guides/')
    ).slice(0, 3);

    codePages.forEach(p => {
      if (!related.find(r => r.path === p.path)) {
        related.push({
          title: p.metadata?.title || path.basename(p.path, '.md'),
          path: p.path,
          reason: 'implementation'
        });
      }
    });
  }

  // 3. For code pages, link to meta/history
  if (currentPath.startsWith('concepts/') || currentPath.startsWith('components/')) {
    const metaPages = allPages.filter(p => p.path.startsWith('meta/'));
    const historyPages = allPages.filter(p => p.path.startsWith('history/'));

    [...metaPages, ...historyPages].forEach(p => {
      if (!related.find(r => r.path === p.path)) {
        related.push({
          title: p.metadata?.title || path.basename(p.path, '.md'),
          path: p.path,
          reason: 'context'
        });
      }
    });
  }

  // 4. Pages in same category
  const sameCategoryPages = allPages
    .filter(p => path.dirname(p.path) === currentCategory && p.path !== currentPath)
    .slice(0, 2);

  sameCategoryPages.forEach(p => {
    if (!related.find(r => r.path === p.path)) {
      related.push({
        title: p.metadata?.title || path.basename(p.path, '.md'),
        path: p.path,
        reason: 'sameCategory'
      });
    }
  });

  // Limit to 5 related pages
  return related.slice(0, 5);
}

/**
 * Build "See Also" section markdown
 */
function buildSeeAlsoSection(relatedPages, currentPath, metadata) {
  const currentDir = path.dirname(currentPath);

  let section = '## See Also\n\n';

  // Group by reason
  const byReason = {
    related: [],
    context: [],
    implementation: [],
    sameCategory: []
  };

  relatedPages.forEach(p => {
    byReason[p.reason].push(p);
  });

  // Add context pages first (meta/history)
  if (byReason.context.length > 0) {
    section += '**Project Context:**\n';
    byReason.context.forEach(p => {
      const relativePath = calculateRelativePath(currentPath, p.path);
      section += `- [${p.title}](${relativePath})\n`;
    });
    section += '\n';
  }

  // Add implementation pages
  if (byReason.implementation.length > 0) {
    section += '**Implementation:**\n';
    byReason.implementation.forEach(p => {
      const relativePath = calculateRelativePath(currentPath, p.path);
      section += `- [${p.title}](${relativePath})\n`;
    });
    section += '\n';
  }

  // Add related pages
  if (byReason.related.length > 0 || byReason.sameCategory.length > 0) {
    section += '**Related Topics:**\n';
    [...byReason.related, ...byReason.sameCategory].forEach(p => {
      const relativePath = calculateRelativePath(currentPath, p.path);
      section += `- [${p.title}](${relativePath})\n`;
    });
  }

  return section.trim();
}

/**
 * Calculate relative path between two wiki pages
 */
function calculateRelativePath(fromPath, toPath) {
  const fromDir = path.dirname(fromPath);

  if (fromDir === '.') {
    return toPath;
  }

  const levels = fromDir.split('/').length;
  const prefix = '../'.repeat(levels);
  return prefix + toPath;
}

// Run if called directly
if (require.main === module) {
  addSeeAlsoSections().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { addSeeAlsoSections };
