#!/usr/bin/env node

/**
 * Add Table of Contents to long wiki pages
 * Improves navigation for complex documentation
 */

const path = require('path');
const fs = require('fs').promises;

const WIKI_PATH = path.join(__dirname, 'wikis/codewiki-generator');
const MIN_HEADINGS_FOR_TOC = 4; // Only add TOC if page has 4+ headings
const MIN_CONTENT_LENGTH = 2000; // Or if content is longer than 2000 chars

async function addTableOfContents() {
  console.log('📑 Adding Table of Contents to Long Pages\n');
  console.log('='.repeat(70));

  const files = await getAllMarkdownFiles(WIKI_PATH);
  console.log(`\n📖 Processing ${files.length} markdown files\n`);

  let pagesUpdated = 0;

  for (const filePath of files) {
    const relativePath = path.relative(WIKI_PATH, filePath);

    // Skip index
    if (relativePath === 'index.md') {
      continue;
    }

    // Read file
    let content = await fs.readFile(filePath, 'utf-8');

    // Parse frontmatter and markdown
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      continue;
    }

    let [, frontmatter, markdown] = match;

    // Skip if already has TOC
    if (markdown.includes('## Table of Contents') || markdown.includes('## Contents')) {
      console.log(`  • ${relativePath} - already has TOC`);
      continue;
    }

    // Extract headings
    const headings = extractHeadings(markdown);

    // Check if page needs TOC
    if (headings.length < MIN_HEADINGS_FOR_TOC && markdown.length < MIN_CONTENT_LENGTH) {
      console.log(`  • ${relativePath} - too short (${headings.length} headings, ${markdown.length} chars)`);
      continue;
    }

    // Generate TOC
    const toc = generateTOC(headings);

    // Insert TOC after breadcrumb and before first heading
    const firstHeadingIndex = markdown.search(/^##? /m);
    if (firstHeadingIndex === -1) {
      console.log(`  ⚠️  ${relativePath} - no headings found`);
      continue;
    }

    // Find end of breadcrumb (first blank line after breadcrumb)
    const breadcrumbEnd = markdown.indexOf('\n\n');
    const insertPosition = breadcrumbEnd !== -1 ? breadcrumbEnd + 2 : firstHeadingIndex;

    markdown =
      markdown.substring(0, insertPosition) +
      toc + '\n\n' +
      markdown.substring(insertPosition);

    // Reconstruct file
    const newContent = `---\n${frontmatter}\n---\n${markdown}`;

    // Write back
    await fs.writeFile(filePath, newContent, 'utf-8');

    console.log(`  ✅ ${relativePath} - added TOC with ${headings.length} entries`);
    pagesUpdated++;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Summary:');
  console.log('='.repeat(70));
  console.log(`Pages updated: ${pagesUpdated}`);
  console.log(`\n✨ Table of Contents complete!\n`);
}

/**
 * Get all markdown files recursively
 */
async function getAllMarkdownFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await getAllMarkdownFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract headings from markdown
 */
function extractHeadings(markdown) {
  const headings = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const [, hashes, text] = match;
      const level = hashes.length;

      // Clean up text (remove links, bold, etc.)
      const cleanText = text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/\*\*([^*]+)\*\*/g, '$1')       // Remove bold
        .replace(/\*([^*]+)\*/g, '$1')           // Remove italic
        .trim();

      // Create anchor
      const anchor = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headings.push({
        level,
        text: cleanText,
        anchor
      });
    }
  }

  return headings;
}

/**
 * Generate Table of Contents markdown
 */
function generateTOC(headings) {
  let toc = '## Table of Contents\n\n';

  for (const heading of headings) {
    const indent = '  '.repeat(heading.level - 2);
    toc += `${indent}- [${heading.text}](#${heading.anchor})\n`;
  }

  return toc.trim();
}

// Run if called directly
if (require.main === module) {
  addTableOfContents().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { addTableOfContents };
