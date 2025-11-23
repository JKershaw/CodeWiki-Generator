const config = require('./config');

// Lazy load Octokit only when needed (not in test mode)
let Octokit = null;

/**
 * GitHubClient wraps the Octokit library for repository access
 */
class GitHubClient {
  constructor(token = null) {
    const authToken = token || config.githubToken;

    // In test mode, don't create real Octokit instance
    if (config.isTestMode()) {
      this.octokit = null; // Will be mocked in tests
    } else {
      // Lazy load Octokit only when actually needed
      if (!Octokit) {
        Octokit = require('@octokit/rest').Octokit;
      }
      this.octokit = new Octokit({
        auth: authToken || undefined
      });
    }

    this.retryDelay = 2000; // Start with 2 seconds
    this.maxRetries = 4;
  }

  /**
   * Parse GitHub repository URL into owner and repo
   * @param {string} repoUrl - GitHub repository URL
   * @returns {Object} { owner, repo }
   */
  parseRepoUrl(repoUrl) {
    // Remove trailing slashes and .git suffix
    let url = repoUrl.trim().replace(/\/$/, '').replace(/\.git$/, '');

    // Match https://github.com/owner/repo
    let match = url.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }

    // Match git@github.com:owner/repo
    match = url.match(/^git@github\.com:([^\/]+)\/(.+)/);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }

    throw new Error(`Invalid GitHub repository URL: ${repoUrl}`);
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Object} Repository information
   */
  async getRepoInfo(owner, repo) {
    const response = await this._retryRequest(async () => {
      return await this.octokit.rest.repos.get({
        owner,
        repo
      });
    });

    return {
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      defaultBranch: response.data.default_branch,
      isPrivate: response.data.private
    };
  }

  /**
   * Get commits in chronological order (oldest first)
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {Object} options - Options (since, until, perPage)
   * @returns {Array} Commits in chronological order
   */
  async getCommits(owner, repo, options = {}) {
    const { since, until, perPage = 100 } = options;

    const allCommits = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this._retryRequest(async () => {
        const params = {
          owner,
          repo,
          per_page: perPage,
          page
        };

        if (since) params.since = since;
        if (until) params.until = until;

        return await this.octokit.rest.repos.listCommits(params);
      });

      if (response.data.length === 0) {
        hasMore = false;
      } else {
        allCommits.push(...response.data);
        page++;

        // Stop if we got fewer results than requested (last page)
        if (response.data.length < perPage) {
          hasMore = false;
        }
      }
    }

    // Reverse to get chronological order (oldest first)
    return allCommits.reverse().map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author,
      date: commit.commit.author.date
    }));
  }

  /**
   * Get detailed commit information with diff
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} sha - Commit SHA
   * @returns {Object} Commit details with files and patches
   */
  async getCommit(owner, repo, sha) {
    const response = await this._retryRequest(async () => {
      return await this.octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: sha
      });
    });

    return {
      sha: response.data.sha,
      message: response.data.commit.message,
      author: response.data.commit.author,
      date: response.data.commit.author.date,
      files: (response.data.files || []).map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch
      }))
    };
  }

  /**
   * Get file content at specific commit
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - File path
   * @param {string} ref - Git ref (commit SHA, branch, tag)
   * @returns {string|null} File content or null if not found
   */
  async getFileContent(owner, repo, path, ref) {
    try {
      const response = await this._retryRequest(async () => {
        return await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path,
          ref
        });
      });

      // Decode base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return content;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Retry a request with exponential backoff
   * @private
   */
  async _retryRequest(requestFn, attempt = 1) {
    try {
      return await requestFn();
    } catch (error) {
      const errorMessage = error.message || '';

      // Don't retry authentication errors
      if (error.status === 401) {
        throw error;
      }

      // Don't retry 403 unless it's a rate limit
      if (error.status === 403 && !errorMessage.includes('rate limit')) {
        throw error;
      }

      // Retry on rate limits or network errors
      if (attempt < this.maxRetries) {
        const isRateLimit = error.status === 403 && errorMessage.includes('rate limit');
        const isNetworkError = errorMessage.includes('ECONNRESET') ||
                               errorMessage.includes('ETIMEDOUT') ||
                               errorMessage.includes('ENOTFOUND');

        if (isRateLimit || isNetworkError) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this._sleep(delay);
          return await this._retryRequest(requestFn, attempt + 1);
        }
      }

      throw error;
    }
  }

  /**
   * Sleep for specified milliseconds
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = GitHubClient;
