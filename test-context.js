#!/usr/bin/env node

/**
 * Test script for WikiResearcher context gathering
 */

const WikiResearcher = require('./lib/wiki-researcher');
const path = require('path');

async function testContextGathering() {
  console.log('🔍 Testing WikiResearcher Context Gathering\n');
  console.log('='.repeat(60));

  const wikiPath = path.join(__dirname, 'wikis/codewiki-generator');
  const researcher = new WikiResearcher(wikiPath);

  // Test cases
  const testCases = [
    {
      name: 'Feature Implementation',
      description: 'implement MCP server for Claude Code integration'
    },
    {
      name: 'Understanding Philosophy',
      description: 'what is the core philosophy of this project?'
    },
    {
      name: 'Bug Investigation',
      description: 'fix failing tests in the processor'
    },
    {
      name: 'Onboarding',
      description: 'how do I get started with this project?'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Test Case: ${testCase.name}`);
    console.log(`Task: "${testCase.description}"`);
    console.log('-'.repeat(60));

    try {
      const context = await researcher.gatherContext(testCase.description);
      const report = researcher.formatContextReport(context);

      console.log('\nContext Report:\n');
      console.log(report);
      console.log('\n' + '='.repeat(60));

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      console.error(error.stack);
    }
  }

  console.log('\n✅ Testing complete!\n');
}

// Run if called directly
if (require.main === module) {
  testContextGathering().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testContextGathering };
