#!/usr/bin/env node

/**
 * Wiki Context Research CLI
 *
 * Uses Claude Haiku 4.5 with interleaved thinking to iteratively research
 * wiki content and provide relevant context for development tasks.
 */

const WikiContextAgent = require('./lib/agents/wiki-context-agent');

/**
 * Format results for display
 */
function formatResults(results) {
  let output = '';

  output += '═'.repeat(80) + '\n';
  output += '  WIKI CONTEXT RESEARCH RESULTS\n';
  output += '═'.repeat(80) + '\n\n';

  // Summary
  output += '📝 SUMMARY\n';
  output += '─'.repeat(80) + '\n';
  output += results.summary + '\n\n';

  // Relevant Pages
  if (results.relevantPages && results.relevantPages.length > 0) {
    output += '📄 RELEVANT PAGES\n';
    output += '─'.repeat(80) + '\n';
    for (const page of results.relevantPages) {
      output += `• ${page.title} (${page.path})\n`;
      output += `  → ${page.relevance}\n\n`;
    }
  }

  // Key Components
  if (results.keyComponents && results.keyComponents.length > 0) {
    output += '🔧 KEY COMPONENTS\n';
    output += '─'.repeat(80) + '\n';
    for (const comp of results.keyComponents) {
      output += `• ${comp.name}\n`;
      output += `  Purpose: ${comp.purpose}\n`;
      output += `  Location: ${comp.location}\n\n`;
    }
  }

  // Key Concepts
  if (results.keyConcepts && results.keyConcepts.length > 0) {
    output += '💡 KEY CONCEPTS\n';
    output += '─'.repeat(80) + '\n';
    for (const concept of results.keyConcepts) {
      output += `• ${concept.concept}\n`;
      output += `  ${concept.description}\n`;
      output += `  Application: ${concept.application}\n\n`;
    }
  }

  // Implementation Guidance
  if (results.implementationGuidance && results.implementationGuidance.length > 0) {
    output += '🎯 IMPLEMENTATION GUIDANCE\n';
    output += '─'.repeat(80) + '\n';
    for (let i = 0; i < results.implementationGuidance.length; i++) {
      output += `${i + 1}. ${results.implementationGuidance[i]}\n`;
    }
    output += '\n';
  }

  // Related Files
  if (results.relatedFiles && results.relatedFiles.length > 0) {
    output += '📁 RELATED FILES\n';
    output += '─'.repeat(80) + '\n';
    for (const file of results.relatedFiles) {
      output += `• ${file}\n`;
    }
    output += '\n';
  }

  output += '═'.repeat(80) + '\n';

  return output;
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let wikiPath = './wikis/codewiki-generator';
  let taskDescription = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--wiki' && i + 1 < args.length) {
      wikiPath = args[i + 1];
      i++;
    } else {
      taskDescription = args[i];
    }
  }

  // Validate input
  if (!taskDescription) {
    console.error('Usage: wiki-context [--wiki <path>] "<task description>"');
    console.error('');
    console.error('Examples:');
    console.error('  ./wiki-context.js "add test coverage tracking"');
    console.error('  ./wiki-context.js --wiki ./wikis/demo "implement a calculator"');
    process.exit(1);
  }

  try {
    const agent = new WikiContextAgent(wikiPath);
    const results = await agent.research(taskDescription);
    const formatted = formatResults(results);

    console.log(formatted);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { formatResults };
