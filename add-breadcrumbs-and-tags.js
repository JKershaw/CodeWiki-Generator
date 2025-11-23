#!/usr/bin/env node

/**
 * Add breadcrumb navigation and enhance frontmatter with tags
 * Makes wiki pages more navigable and discoverable
 */

const path = require('path');
const fs = require('fs').promises;

const WIKI_PATH = path.join(__dirname, 'wikis/codewiki-generator');

// Tag suggestions by category
const TAG_SUGGESTIONS = {
  'meta': ['philosophy', 'vision', 'strategy', 'planning', 'meta-documentation'],
  'concepts': ['architecture', 'design-pattern', 'theory', 'conceptual'],
  'components': ['implementation', 'code', 'module', 'technical'],
  'guides': ['tutorial', 'how-to', 'guide', 'practical', 'beginner-friendly'],
  'history': ['timeline', 'evolution', 'progress', 'retrospective'],
  'quality': ['testing', 'validation', 'metrics', 'quality-assurance']
};

async function addBreadcrumbsAndTags() {
  console.log('🗺️  Adding Breadcrumbs and Enhancing Tags\n');
  console.log('='.repeat(70));

  // Get all markdown files
  const files = await getAllMarkdownFiles(WIKI_PATH);
  console.log(`\n📖 Found ${files.length} markdown files\n`);

  let filesUpdated = 0;

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
      console.log(`  ⚠️  Skipping ${relativePath} (no frontmatter)`);
      continue;
    }

    let [, frontmatter, markdown] = match;

    // Add breadcrumb
    const breadcrumb = generateBreadcrumb(relativePath);

    // Only add if not already present
    if (!markdown.includes('[Home](') && !markdown.includes('# Home >')) {
      markdown = `${breadcrumb}\n\n${markdown}`;
    }

    // Enhance frontmatter with tags
    const enhancedFrontmatter = enhanceFrontmatter(frontmatter, relativePath);

    // Reconstruct file
    const newContent = `---\n${enhancedFrontmatter}\n---\n${markdown}`;

    // Write back
    await fs.writeFile(filePath, newContent, 'utf-8');

    console.log(`  ✅ ${relativePath}`);
    filesUpdated++;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Summary:');
  console.log('='.repeat(70));
  console.log(`Files updated: ${filesUpdated}`);
  console.log(`\n✨ Breadcrumbs and tags complete!\n`);
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
 * Generate breadcrumb navigation
 */
function generateBreadcrumb(relativePath) {
  const parts = relativePath.split('/');
  const breadcrumbs = ['[Home](../index.md)'];

  // Add category if present
  if (parts.length > 1) {
    const category = parts[0];
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    breadcrumbs.push(`[${categoryName}](../${category})`);
  }

  // Add current page name
  const fileName = path.basename(relativePath, '.md');
  const pageName = fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  breadcrumbs.push(pageName);

  return breadcrumbs.join(' > ');
}

/**
 * Enhance frontmatter with tags and additional metadata
 */
function enhanceFrontmatter(frontmatter, relativePath) {
  const lines = frontmatter.split('\n');
  const metadata = {};

  // Parse existing frontmatter
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      metadata[key] = value;
    }
  }

  // Add tags if not present
  if (!metadata.tags) {
    const category = path.dirname(relativePath);
    const baseTags = TAG_SUGGESTIONS[category] || ['documentation'];

    // Add specific tags based on title
    const title = (metadata.title || '').toLowerCase();
    const specificTags = [];

    if (title.includes('architecture')) specificTags.push('architecture');
    if (title.includes('test')) specificTags.push('testing');
    if (title.includes('dashboard')) specificTags.push('dashboard', 'ui');
    if (title.includes('agent')) specificTags.push('ai-agent');
    if (title.includes('guide') || title.includes('getting')) specificTags.push('beginner-friendly');
    if (title.includes('coverage')) specificTags.push('code-coverage');

    const allTags = [...new Set([...baseTags.slice(0, 2), ...specificTags])];
    metadata.tags = `[${allTags.join(', ')}]`;
  }

  // Add category if not present
  if (!metadata.category) {
    const category = path.dirname(relativePath);
    if (category !== '.') {
      metadata.category = category.replace('/', '-');
    }
  }

  // Add layer if not present
  if (!metadata.layer) {
    const category = path.dirname(relativePath);
    const layerMap = {
      'meta': 'meta',
      'history': 'history',
      'quality': 'quality',
      'concepts': 'code',
      'components': 'code',
      'guides': 'code'
    };
    metadata.layer = layerMap[category] || 'code';
  }

  // Rebuild frontmatter
  const orderedKeys = ['title', 'category', 'layer', 'tags', 'related', 'updated', 'created'];
  const newLines = [];

  for (const key of orderedKeys) {
    if (metadata[key]) {
      newLines.push(`${key}: ${metadata[key]}`);
      delete metadata[key];
    }
  }

  // Add any remaining keys
  for (const [key, value] of Object.entries(metadata)) {
    newLines.push(`${key}: ${value}`);
  }

  return newLines.join('\n');
}

// Run if called directly
if (require.main === module) {
  addBreadcrumbsAndTags().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { addBreadcrumbsAndTags };
