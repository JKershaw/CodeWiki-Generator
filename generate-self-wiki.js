/**
 * Generate wiki documentation for this repository
 * Outputs to wiki/ directory for inclusion in repo
 */

const Processor = require('./lib/processor');
const { execSync } = require('child_process');

/**
 * Get commits from local git repository
 */
function getLocalCommits(limit = 10) {
  console.log(`Fetching last ${limit} commits from local git...`);

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

          let patch = '';
          try {
            patch = execSync(
              `git show ${sha} -- "${filename}"`,
              { encoding: 'utf-8' }
            );
            const diffStart = patch.indexOf('diff --git');
            if (diffStart !== -1) {
              patch = patch.substring(diffStart);
            }
          } catch (error) {
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
  console.log('=== CodeWiki Generator - Self Documentation ===\n');
  console.log('Generating wiki from recent git history...\n');

  const processor = new Processor('./wiki');

  // Get recent commits (limit to 10 to keep costs reasonable)
  const commits = getLocalCommits(10);

  // Mock GitHub client to use local commits
  processor.githubClient = {
    parseRepoUrl: (url) => ({ owner: 'JKershaw', repo: 'CodeWiki-Generator' }),
    getCommits: async () => commits
  };

  try {
    const stats = await processor.processRepository(
      'https://github.com/JKershaw/CodeWiki-Generator',
      {
        maxCost: 1.00,  // $1 limit
        metaAnalysisFrequency: 5
      }
    );

    console.log('\n=== Generation Complete ===');
    console.log(`Commits processed: ${stats.commitsProcessed}`);
    console.log(`Files processed: ${stats.filesProcessed} (skipped: ${stats.filesSkipped})`);
    console.log(`Pages created: ${stats.pagesCreated}`);
    console.log(`Pages updated: ${stats.pagesUpdated}`);
    console.log(`Meta-analysis runs: ${stats.metaAnalysisRuns}`);
    console.log(`Total cost: $${stats.totalCost.toFixed(4)}`);

    if (stats.stopped) {
      console.log(`\n⚠️  Stopped: ${stats.stopReason}`);
    } else {
      console.log('\n✓ Successfully generated wiki documentation');
    }

    console.log('\nGenerated documentation is in ./wiki/');
    console.log('Review and commit to repository.');

  } catch (error) {
    console.error('\n=== Error ===');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
