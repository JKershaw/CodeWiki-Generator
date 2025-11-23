#!/usr/bin/env node

/**
 * Verification script for wiki expansion implementation
 * Checks that all components are properly integrated
 */

const fs = require('fs').promises;
const path = require('path');
const WikiManager = require('./lib/wiki-manager');
const WikiResearcher = require('./lib/wiki-researcher');

async function verifyWikiExpansion() {
  console.log('🔍 Wiki Expansion Verification\n');
  console.log('='.repeat(70));

  const wikiPath = path.join(__dirname, 'wikis/codewiki-generator');
  const wikiManager = new WikiManager(wikiPath);
  const researcher = new WikiResearcher(wikiPath);

  let passed = 0;
  let failed = 0;

  // Test 1: Check directory structure
  console.log('\n📁 Test 1: Directory Structure');
  console.log('-'.repeat(70));

  const requiredDirs = ['meta', 'history', 'quality'];
  for (const dir of requiredDirs) {
    try {
      const dirPath = path.join(wikiPath, dir);
      await fs.access(dirPath);
      console.log(`  ✅ ${dir}/ directory exists`);
      passed++;
    } catch (error) {
      console.log(`  ❌ ${dir}/ directory missing`);
      failed++;
    }
  }

  // Test 2: Check meta documents
  console.log('\n📄 Test 2: Meta Documents Ingested');
  console.log('-'.repeat(70));

  const metaDocs = [
    { path: 'meta/philosophy.md', title: 'Core Philosophy & Vision' },
    { path: 'meta/specification.md', title: 'Technical Specification' }
  ];

  for (const doc of metaDocs) {
    try {
      const page = await wikiManager.getPage(doc.path);
      if (page && page.metadata.title === doc.title) {
        console.log(`  ✅ ${doc.path} - ${doc.title}`);
        console.log(`     Layer: ${page.metadata.layer}`);
        console.log(`     Source: ${page.metadata.sourceFile}`);
        passed++;
      } else {
        console.log(`  ❌ ${doc.path} - incorrect metadata`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ ${doc.path} - ${error.message}`);
      failed++;
    }
  }

  // Test 3: Check history documents
  console.log('\n📜 Test 3: History Documents');
  console.log('-'.repeat(70));

  const historyDocs = [
    { path: 'history/progress-report.md', title: 'Project History and Achievement Analysis' }
  ];

  for (const doc of historyDocs) {
    try {
      const page = await wikiManager.getPage(doc.path);
      if (page && page.metadata.title === doc.title) {
        console.log(`  ✅ ${doc.path} - ${doc.title}`);
        console.log(`     Layer: ${page.metadata.layer}`);
        console.log(`     Themes: ${page.metadata.themes?.join(', ') || 'none'}`);
        passed++;
      } else {
        console.log(`  ❌ ${doc.path} - incorrect metadata`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ ${doc.path} - ${error.message}`);
      failed++;
    }
  }

  // Test 4: Check cross-layer relationships
  console.log('\n🔗 Test 4: Cross-Layer Relationships');
  console.log('-'.repeat(70));

  try {
    const philosophyPage = await wikiManager.getPage('meta/philosophy.md');
    if (philosophyPage.metadata.related && philosophyPage.metadata.related.length > 0) {
      console.log(`  ✅ Philosophy page has ${philosophyPage.metadata.related.length} related pages`);
      console.log(`     Related: ${philosophyPage.metadata.related.join(', ')}`);
      passed++;
    } else {
      console.log(`  ⚠️  Philosophy page has no related pages (optional)`);
    }

    if (philosophyPage.metadata.mentions && philosophyPage.metadata.mentions.length > 0) {
      console.log(`  ✅ Philosophy page mentions ${philosophyPage.metadata.mentions.length} concepts`);
      console.log(`     Mentions: ${philosophyPage.metadata.mentions.join(', ')}`);
      passed++;
    }
  } catch (error) {
    console.log(`  ❌ Cross-layer relationships check failed: ${error.message}`);
    failed++;
  }

  // Test 5: WikiResearcher functionality
  console.log('\n🔍 Test 5: WikiResearcher Context Gathering');
  console.log('-'.repeat(70));

  try {
    const context = await researcher.gatherContext('implement MCP server');

    if (context.highLevelContext && context.highLevelContext.length > 0) {
      console.log(`  ✅ Found ${context.highLevelContext.length} high-level context pages`);
      passed++;
    } else {
      console.log(`  ⚠️  No high-level context found`);
    }

    const totalPages =
      context.highLevelContext.length +
      context.codeContext.length +
      context.guides.length +
      context.historicalContext.length +
      context.qualityContext.length;

    if (totalPages > 0) {
      console.log(`  ✅ Total context pages found: ${totalPages}`);
      passed++;
    } else {
      console.log(`  ❌ No context pages found`);
      failed++;
    }

  } catch (error) {
    console.log(`  ❌ WikiResearcher failed: ${error.message}`);
    failed++;
  }

  // Test 6: Index page updated
  console.log('\n📇 Test 6: Wiki Index Updated');
  console.log('-'.repeat(70));

  try {
    const indexContent = await fs.readFile(path.join(wikiPath, 'index.md'), 'utf-8');

    const checks = [
      { text: '## Meta (Philosophy & Vision)', name: 'Meta section' },
      { text: '## History (Project Evolution)', name: 'History section' },
      { text: '## Using the /context Command', name: 'Context command documentation' },
      { text: '[Core Philosophy & Vision](meta/philosophy.md)', name: 'Philosophy link' },
      { text: '[Technical Specification](meta/specification.md)', name: 'Specification link' }
    ];

    for (const check of checks) {
      if (indexContent.includes(check.text)) {
        console.log(`  ✅ ${check.name} present`);
        passed++;
      } else {
        console.log(`  ❌ ${check.name} missing`);
        failed++;
      }
    }

  } catch (error) {
    console.log(`  ❌ Index check failed: ${error.message}`);
    failed++;
  }

  // Test 7: Slash command exists
  console.log('\n⚡ Test 7: Slash Command Created');
  console.log('-'.repeat(70));

  try {
    const commandPath = path.join(__dirname, '.claude/commands/context.md');
    await fs.access(commandPath);
    const commandContent = await fs.readFile(commandPath, 'utf-8');

    if (commandContent.includes('WikiResearcher')) {
      console.log(`  ✅ /context command file exists`);
      console.log(`  ✅ Command references WikiResearcher`);
      passed += 2;
    } else {
      console.log(`  ⚠️  Command exists but may not be configured correctly`);
      passed++;
    }

  } catch (error) {
    console.log(`  ❌ Slash command not found: ${error.message}`);
    failed++;
  }

  // Test 8: Page count verification
  console.log('\n📊 Test 8: Page Count Verification');
  console.log('-'.repeat(70));

  try {
    const allPages = await wikiManager.getAllPages();
    const metaPages = allPages.filter(p => p.path.startsWith('meta/'));
    const historyPages = allPages.filter(p => p.path.startsWith('history/'));
    const qualityPages = allPages.filter(p => p.path.startsWith('quality/'));

    console.log(`  ✅ Total pages: ${allPages.length}`);
    console.log(`     Meta: ${metaPages.length}`);
    console.log(`     History: ${historyPages.length}`);
    console.log(`     Quality: ${qualityPages.length}`);
    passed++;

    if (metaPages.length >= 2 && historyPages.length >= 1) {
      console.log(`  ✅ Minimum meta and history pages present`);
      passed++;
    }

  } catch (error) {
    console.log(`  ❌ Page count verification failed: ${error.message}`);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📈 VERIFICATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All verifications passed! Wiki expansion is complete.\n');
    return true;
  } else {
    console.log('\n⚠️  Some verifications failed. Review the output above.\n');
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  verifyWikiExpansion()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { verifyWikiExpansion };
