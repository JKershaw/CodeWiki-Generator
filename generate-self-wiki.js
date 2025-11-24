/**
 * Generate wiki documentation for this repository
 * Outputs to wikis/codewiki-generator/ directory for inclusion in repo
 */

const Processor = require('./lib/processor');
const { execSync } = require('child_process');

/**
 * Get commits from local git repository
 */
function getLocalCommits(limit = null) {
  // If no limit specified, get all commits
  const totalCommits = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim());
  const commitCount = limit || totalCommits;

  console.log(`\n📊 Repository has ${totalCommits} total commits`);
  console.log(`📥 Fetching ${commitCount === totalCommits ? 'all' : 'last ' + commitCount} commits from local git...\n`);

  const logOutput = execSync(
    `git log -${commitCount} --pretty=format:"%H|%s"`,
    { encoding: 'utf-8' }
  ).trim();

  const commits = [];
  const lines = logOutput.split('\n');

  console.log('Processing commits:');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [sha, message] = line.split('|');

    // Show progress every 10 commits
    if (i % 10 === 0 || i === lines.length - 1) {
      console.log(`  [${i + 1}/${lines.length}] ${sha.substring(0, 7)} - ${message.substring(0, 60)}${message.length > 60 ? '...' : ''}`);
    }

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

  console.log(`\n✓ Found ${commits.length} commits\n`);
  return commits;
}

async function main() {
  console.log('=== CodeWiki Generator - Self Documentation ===\n');
  console.log('Generating wiki from full git history...\n');

  const processor = new Processor('./wikis/codewiki-generator');

  // Get all commits (no limit - process full history)
  const commits = getLocalCommits();

  // Mock GitHub client to use local commits
  processor.githubClient = {
    parseRepoUrl: (url) => ({ owner: 'JKershaw', repo: 'CodeWiki-Generator' }),
    getCommits: async () => commits
  };

  console.log('⚙️  Starting wiki generation with the following settings:');
  console.log(`   • Commits to process: ${commits.length}`);
  console.log(`   • Meta-analysis frequency: every 5 commits`);
  console.log(`   • Cost limit: $10.00`);
  console.log(`   • Output directory: ./wikis/codewiki-generator/\n`);

  try {
    const stats = await processor.processRepository(
      'https://github.com/JKershaw/CodeWiki-Generator',
      {
        maxCost: 10.00,  // $10 limit (increased for full history processing)
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

    console.log('\nGenerated documentation is in ./wikis/codewiki-generator/');
    console.log('Review and commit to repository.');

  } catch (error) {
    console.error('\n=== Error ===');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
