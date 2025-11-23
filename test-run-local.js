/**
 * Test script to run CodeWiki Generator on itself using local git
 * Outputs to generated-wiki/ to avoid overwriting dev-wiki/
 */

const Processor = require('./lib/processor');
const { execSync } = require('child_process');

/**
 * Get commits from local git repository
 * @param {number} limit - Maximum number of commits to process
 * @returns {Array} Array of commit objects
 */
function getLocalCommits(limit = 20) {
  console.log(`Fetching last ${limit} commits from local git...`);

  // Get commit SHAs and messages
  const logOutput = execSync(
    `git log -${limit} --pretty=format:"%H|%s"`,
    { encoding: 'utf-8' }
  ).trim();

  const commits = [];
  const lines = logOutput.split('\n');

  for (const line of lines) {
    const [sha, message] = line.split('|');

    // Get files changed in this commit
    let diffOutput;
    try {
      diffOutput = execSync(
        `git show --pretty="" --name-status ${sha}`,
        { encoding: 'utf-8' }
      ).trim();
    } catch (error) {
      // First commit might not have a parent
      diffOutput = execSync(
        `git show --pretty="" --name-status --root ${sha}`,
        { encoding: 'utf-8' }
      ).trim();
    }

    const files = [];
    if (diffOutput) {
      const fileLines = diffOutput.split('\n');
      for (const fileLine of fileLines) {
        const parts = fileLine.trim().split(/\s+/);
        if (parts.length >= 2) {
          const status = parts[0];
          const filename = parts[1];

          // Get the diff for this file
          let patch = '';
          try {
            patch = execSync(
              `git show ${sha} -- "${filename}"`,
              { encoding: 'utf-8' }
            );
            // Extract just the diff part (skip commit message)
            const diffStart = patch.indexOf('diff --git');
            if (diffStart !== -1) {
              patch = patch.substring(diffStart);
            }
          } catch (error) {
            // File might be deleted or binary
            patch = '';
          }

          files.push({
            filename,
            status: status === 'A' ? 'added' : status === 'M' ? 'modified' : 'removed',
            patch: patch || undefined
          });
        }
      }
    }

    commits.push({
      sha,
      message,
      files
    });
  }

  console.log(`Found ${commits.length} commits\n`);
  return commits;
}

async function main() {
  console.log('=== CodeWiki Generator Test Run ===\n');
  console.log('Processing this repository using local git history...\n');

  const processor = new Processor('./generated-wiki');

  // Mock the GitHub client to return local commits
  const commits = getLocalCommits(15); // Process last 15 commits

  // Mock GitHub client
  processor.githubClient = {
    parseRepoUrl: (url) => ({ owner: 'JKershaw', repo: 'CodeWiki-Generator' }),
    getCommits: async () => commits
  };

  try {
    const stats = await processor.processRepository(
      'https://github.com/JKershaw/CodeWiki-Generator',
      {
        maxCost: 2.00,  // $2 limit for testing
        metaAnalysisFrequency: 5
      }
    );

    console.log('\n=== Processing Complete ===');
    console.log(`Commits processed: ${stats.commitsProcessed}`);
    console.log(`Total files: ${stats.totalFiles}`);
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Files skipped: ${stats.filesSkipped}`);
    console.log(`Pages created: ${stats.pagesCreated}`);
    console.log(`Pages updated: ${stats.pagesUpdated}`);
    console.log(`Meta-analysis runs: ${stats.metaAnalysisRuns}`);
    console.log(`Total cost: $${stats.totalCost.toFixed(4)}`);

    if (stats.stopped) {
      console.log(`\n⚠️  Stopped: ${stats.stopReason}`);
    } else {
      console.log('\n✓ Processing completed successfully');
    }

    console.log('\n=== Output ===');
    console.log('Generated wiki: ./generated-wiki/');
    console.log('\nNext steps:');
    console.log('1. Review generated documentation in ./generated-wiki/');
    console.log('2. Compare with hand-written docs in ./dev-wiki/');
    console.log('3. Identify any bugs or improvements needed');

  } catch (error) {
    console.error('\n=== Error ===');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
