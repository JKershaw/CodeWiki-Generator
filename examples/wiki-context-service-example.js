#!/usr/bin/env node

/**
 * Example usage of WikiContextService
 *
 * This demonstrates how to use the WikiContextService programmatically
 * to research wiki content and get structured results.
 */

const WikiContextService = require('../lib/wiki-context-service');

async function main() {
  // Create service instance
  const service = new WikiContextService({
    wikiBasePath: './wikis' // Base path where project wikis are stored
  });

  try {
    // Research a specific task
    const results = await service.research(
      'add test coverage tracking to the dashboard',
      'codewiki-generator' // Project name (subdirectory under wikiBasePath)
    );

    // Display results
    console.log('='.repeat(80));
    console.log('WIKI CONTEXT RESEARCH RESULTS');
    console.log('='.repeat(80));
    console.log();

    // Summary
    console.log('SUMMARY');
    console.log('-'.repeat(80));
    console.log(results.summary);
    console.log();

    // Relevant pages
    console.log('RELEVANT PAGES (' + results.relevantPages.length + ')');
    console.log('-'.repeat(80));
    results.relevantPages.forEach((page, i) => {
      console.log(`${i + 1}. ${page.title} (${page.path})`);
      console.log(`   Relevance: ${page.relevance}`);
      if (page.excerpt) {
        console.log(`   Excerpt: ${page.excerpt}`);
      }
      console.log();
    });

    // Key components
    if (results.keyComponents.length > 0) {
      console.log('KEY COMPONENTS');
      console.log('-'.repeat(80));
      results.keyComponents.forEach(comp => {
        console.log(`• ${comp.name}`);
        console.log(`  Purpose: ${comp.purpose}`);
        console.log(`  Location: ${comp.location}`);
        console.log();
      });
    }

    // Key concepts
    if (results.keyConcepts.length > 0) {
      console.log('KEY CONCEPTS');
      console.log('-'.repeat(80));
      results.keyConcepts.forEach(concept => {
        console.log(`• ${concept.concept}`);
        console.log(`  ${concept.description}`);
        console.log(`  Application: ${concept.application}`);
        console.log();
      });
    }

    // Implementation guidance
    if (results.implementationGuidance.length > 0) {
      console.log('IMPLEMENTATION GUIDANCE');
      console.log('-'.repeat(80));
      results.implementationGuidance.forEach((step, i) => {
        console.log(`${i + 1}. ${step}`);
      });
      console.log();
    }

    // Related files
    if (results.relatedFiles.length > 0) {
      console.log('RELATED FILES');
      console.log('-'.repeat(80));
      results.relatedFiles.forEach(file => {
        console.log(`• ${file}`);
      });
      console.log();
    }

    // Metadata
    console.log('METADATA');
    console.log('-'.repeat(80));
    console.log(`Pages analyzed: ${results.metadata.pageCount}`);
    console.log(`Timestamp: ${results.metadata.timestamp}`);
    console.log();

    // Service statistics
    const stats = service.getStatistics();
    console.log('API USAGE');
    console.log('-'.repeat(80));
    console.log(`Total tokens: ${stats.totalTokens}`);
    console.log(`Total cost: $${stats.totalCost.toFixed(4)}`);
    console.log(`Requests: ${stats.requestCount}`);
    console.log();

  } catch (error) {
    console.error('Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Integration example for web applications
async function webAppExample() {
  const service = new WikiContextService();

  // Express.js route example
  app.post('/api/wiki/research', async (req, res) => {
    try {
      const { query, projectName } = req.body;

      // Validate input
      if (!query || !projectName) {
        return res.status(400).json({
          error: 'Query and projectName are required'
        });
      }

      // Research wiki
      const results = await service.research(query, projectName);

      // Return structured JSON
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Research error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, webAppExample };
