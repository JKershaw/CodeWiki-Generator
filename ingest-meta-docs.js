#!/usr/bin/env node

/**
 * CLI tool to ingest meta-documentation files into the wiki
 * Usage: node ingest-meta-docs.js [--all | --file <filename>]
 */

const path = require('path');
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent');
const WikiManager = require('./lib/wiki-manager');

// Configuration: Map source files to wiki locations
const META_DOCS = [
  {
    sourceFile: 'Idea.md',
    category: 'meta',
    documentType: 'philosophy',
    targetPath: 'meta/philosophy.md'
  },
  {
    sourceFile: 'Specification.md',
    category: 'meta',
    documentType: 'specification',
    targetPath: 'meta/specification.md'
  },
  {
    sourceFile: 'COMPREHENSIVE_PROGRESS_REPORT.md',
    category: 'history',
    documentType: 'progress',
    targetPath: 'history/progress-report.md'
  },
  {
    sourceFile: 'ImplementationGuide.md',
    category: 'history',
    documentType: 'implementation',
    targetPath: 'history/implementation-guide.md'
  },
  {
    sourceFile: 'TEST_COVERAGE_SUMMARY.md',
    category: 'quality',
    documentType: 'testing',
    targetPath: 'quality/test-coverage.md'
  }
];

async function ingestDocument(doc, agent, wikiManager, existingPages) {
  console.log(`\n📄 Ingesting: ${doc.sourceFile} → ${doc.targetPath}`);

  try {
    // Check if source file exists
    const sourceFullPath = path.join(__dirname, doc.sourceFile);

    // Ingest the document
    const result = await agent.ingestDocument(
      sourceFullPath,
      doc.category,
      doc.documentType,
      existingPages
    );

    console.log(`  ✓ Processed by Claude`);
    console.log(`  Title: ${result.title}`);
    console.log(`  Key themes: ${result.keyThemes?.join(', ') || 'none'}`);
    console.log(`  Related pages: ${result.relatedPages?.length || 0}`);
    console.log(`  Mentioned concepts: ${result.mentionedConcepts?.join(', ') || 'none'}`);

    // Generate frontmatter
    const frontmatter = agent.generateFrontmatter(result, doc.sourceFile, doc.category);

    // Write to wiki
    await wikiManager.updatePage(doc.targetPath, result.content, frontmatter);
    console.log(`  ✓ Written to: ${doc.targetPath}`);

    return {
      success: true,
      doc,
      result
    };

  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return {
      success: false,
      doc,
      error: error.message
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const wikiPath = path.join(__dirname, 'wikis/codewiki-generator');

  console.log('🚀 Meta-Document Ingestion Tool');
  console.log(`📚 Wiki path: ${wikiPath}\n`);

  const agent = new MetaDocumentIngestionAgent();
  const wikiManager = new WikiManager(wikiPath);

  // Get existing pages for cross-referencing
  console.log('📖 Loading existing wiki pages...');
  const existingPages = await wikiManager.getAllPages();
  console.log(`   Found ${existingPages.length} existing pages`);

  // Determine which documents to ingest
  let docsToIngest = META_DOCS;

  if (args.includes('--file')) {
    const fileIndex = args.indexOf('--file');
    const fileName = args[fileIndex + 1];
    docsToIngest = META_DOCS.filter(d => d.sourceFile === fileName);

    if (docsToIngest.length === 0) {
      console.error(`❌ File not found in configuration: ${fileName}`);
      console.log('\nAvailable files:');
      META_DOCS.forEach(d => console.log(`  - ${d.sourceFile}`));
      process.exit(1);
    }
  }

  // Ingest documents
  console.log(`\n📝 Ingesting ${docsToIngest.length} document(s)...\n`);

  const results = [];
  for (const doc of docsToIngest) {
    const result = await ingestDocument(doc, agent, wikiManager, existingPages);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✓ Successful: ${successful}`);
  console.log(`✗ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed documents:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.doc.sourceFile}: ${r.error}`);
    });
  }

  console.log('\n✨ Done!\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { ingestDocument, META_DOCS };
