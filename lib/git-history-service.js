const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs').promises;

/**
 * GitHistoryService handles git history operations for wiki pages
 * Provides commit history, file blame, and diff functionality
 */
class GitHistoryService {
  constructor(wikisBasePath = './wikis') {
    this.wikisBasePath = wikisBasePath;
  }

  /**
   * Get git instance for a project
   * @private
   */
  async _getGitInstance(project) {
    const projectPath = path.join(this.wikisBasePath, project);

    // Check if directory exists
    try {
      await fs.access(projectPath);
    } catch (error) {
      throw new Error(`Project directory not found: ${projectPath}`);
    }

    // Initialize git instance
    const git = simpleGit(projectPath);

    // Check if it's a git repository
    try {
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        throw new Error('Not a git repository');
      }
    } catch (error) {
      throw new Error(`No git repository found for project: ${project}`);
    }

    return git;
  }

  /**
   * Check if a project has git repository
   * @param {string} project - Project name
   * @returns {Promise<boolean>}
   */
  async hasGitRepo(project) {
    try {
      await this._getGitInstance(project);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get commit history for a specific page
   * @param {string} pagePath - Relative path to the wiki page (e.g., 'concepts/architecture.md')
   * @param {string} project - Project name
   * @param {number} maxCount - Maximum number of commits to return
   * @returns {Promise<Array>} Array of commit objects
   */
  async getPageHistory(pagePath, project, maxCount = 50) {
    try {
      const git = await this._getGitInstance(project);

      // Get log for specific file
      const log = await git.log({
        file: pagePath,
        maxCount: maxCount
      });

      // Transform commits into a more usable format
      const commits = log.all.map(commit => ({
        sha: commit.hash,
        shortSha: commit.hash.substring(0, 7),
        author: {
          name: commit.author_name,
          email: commit.author_email
        },
        date: commit.date,
        message: commit.message,
        body: commit.body
      }));

      return commits;
    } catch (error) {
      console.error(`Error getting page history for ${pagePath}:`, error.message);
      throw new Error(`Failed to get page history: ${error.message}`);
    }
  }

  /**
   * Get detailed information about a specific commit
   * @param {string} sha - Commit SHA
   * @param {string} project - Project name
   * @returns {Promise<Object>} Commit details with diff
   */
  async getCommitDetails(sha, project) {
    try {
      const git = await this._getGitInstance(project);

      // Get commit details
      const log = await git.show([sha]);

      // Get diff for this commit
      const diff = await git.diff([`${sha}^`, sha]);

      // Parse commit info from show output
      const lines = log.split('\n');
      const commitInfo = {
        sha: sha,
        shortSha: sha.substring(0, 7),
        author: {},
        date: '',
        message: '',
        diff: diff
      };

      // Parse the show output
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('Author:')) {
          const authorMatch = line.match(/Author:\s+(.+?)\s+<(.+?)>/);
          if (authorMatch) {
            commitInfo.author.name = authorMatch[1];
            commitInfo.author.email = authorMatch[2];
          }
        } else if (line.startsWith('Date:')) {
          commitInfo.date = line.replace('Date:', '').trim();
        } else if (line && !line.startsWith('commit') && !line.startsWith('Author') && !line.startsWith('Date') && !line.startsWith('diff')) {
          // This is part of the commit message
          if (commitInfo.message) {
            commitInfo.message += '\n' + line.trim();
          } else if (line.trim()) {
            commitInfo.message = line.trim();
          }
        }
      }

      return commitInfo;
    } catch (error) {
      console.error(`Error getting commit details for ${sha}:`, error.message);
      throw new Error(`Failed to get commit details: ${error.message}`);
    }
  }

  /**
   * Get file blame (line-by-line authorship)
   * @param {string} pagePath - Relative path to the wiki page
   * @param {string} project - Project name
   * @returns {Promise<Array>} Array of blame objects with line info
   */
  async getBlame(pagePath, project) {
    try {
      const git = await this._getGitInstance(project);

      // Check if file exists
      const projectPath = path.join(this.wikisBasePath, project);
      const fullPath = path.join(projectPath, pagePath);

      try {
        await fs.access(fullPath);
      } catch (error) {
        throw new Error(`File not found: ${pagePath}`);
      }

      // Get raw blame output
      const blameResult = await git.raw(['blame', '--line-porcelain', pagePath]);

      // Parse blame output
      const lines = blameResult.split('\n');
      const blameData = [];
      let currentCommit = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.match(/^[0-9a-f]{40}/)) {
          // Start of a new blame block
          const parts = line.split(' ');
          currentCommit = {
            sha: parts[0],
            shortSha: parts[0].substring(0, 7),
            lineNumber: parseInt(parts[2]),
            author: {},
            date: ''
          };
        } else if (line.startsWith('author ')) {
          if (currentCommit) {
            currentCommit.author.name = line.replace('author ', '');
          }
        } else if (line.startsWith('author-mail ')) {
          if (currentCommit) {
            currentCommit.author.email = line.replace('author-mail ', '').replace(/[<>]/g, '');
          }
        } else if (line.startsWith('author-time ')) {
          if (currentCommit) {
            const timestamp = parseInt(line.replace('author-time ', ''));
            currentCommit.date = new Date(timestamp * 1000).toISOString();
          }
        } else if (line.startsWith('summary ')) {
          if (currentCommit) {
            currentCommit.message = line.replace('summary ', '');
          }
        } else if (line.startsWith('\t')) {
          // This is the actual line content
          if (currentCommit) {
            currentCommit.content = line.substring(1);
            blameData.push(currentCommit);
            currentCommit = null;
          }
        }
      }

      return blameData;
    } catch (error) {
      console.error(`Error getting blame for ${pagePath}:`, error.message);
      throw new Error(`Failed to get blame: ${error.message}`);
    }
  }

  /**
   * Get statistics about page history
   * @param {string} pagePath - Relative path to the wiki page
   * @param {string} project - Project name
   * @returns {Promise<Object>} Statistics object
   */
  async getPageStatistics(pagePath, project) {
    try {
      const commits = await this.getPageHistory(pagePath, project, 1000);

      // Count commits per author
      const authorStats = {};
      commits.forEach(commit => {
        const author = commit.author.name;
        if (!authorStats[author]) {
          authorStats[author] = {
            name: author,
            email: commit.author.email,
            count: 0,
            lastCommit: commit.date
          };
        }
        authorStats[author].count++;
      });

      return {
        totalCommits: commits.length,
        authors: Object.values(authorStats),
        firstCommit: commits.length > 0 ? commits[commits.length - 1] : null,
        lastCommit: commits.length > 0 ? commits[0] : null
      };
    } catch (error) {
      console.error(`Error getting page statistics for ${pagePath}:`, error.message);
      throw new Error(`Failed to get page statistics: ${error.message}`);
    }
  }

  /**
   * Get recent commits across entire repository
   * @param {string} project - Project name
   * @param {number} maxCount - Maximum number of commits
   * @returns {Promise<Array>} Array of commit objects
   */
  async getRecentCommits(project, maxCount = 20) {
    try {
      const git = await this._getGitInstance(project);

      const log = await git.log({ maxCount });

      return log.all.map(commit => ({
        sha: commit.hash,
        shortSha: commit.hash.substring(0, 7),
        author: {
          name: commit.author_name,
          email: commit.author_email
        },
        date: commit.date,
        message: commit.message
      }));
    } catch (error) {
      console.error(`Error getting recent commits:`, error.message);
      throw new Error(`Failed to get recent commits: ${error.message}`);
    }
  }
}

module.exports = GitHistoryService;
