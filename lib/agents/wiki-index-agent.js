const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * WikiIndexAgent generates index.md files for wiki navigation
 */
class WikiIndexAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 2000;
  }

  /**
   * Generate an index page for the wiki
   * @param {Object} wikiData - Wiki structure and metadata
   * @param {string} wikiData.repositoryName - Name of the repository
   * @param {Object} wikiData.pages - Pages grouped by category
   * @returns {string} Generated markdown content for index.md
   */
  async generateIndex(wikiData) {
    const { repositoryName, pages } = wikiData;

    // Format wiki structure for the prompt
    const wikiStructure = this._formatWikiStructure(pages);

    // Render prompt template
    const prompt = this.promptManager.render('wiki-index', {
      repositoryName,
      wikiStructure
    });

    // Call Claude to generate the index
    const indexContent = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    return this._cleanMarkdown(indexContent);
  }

  /**
   * Format wiki structure for prompt
   * @private
   */
  _formatWikiStructure(pages) {
    const lines = [];

    // Group pages by category
    const meta = pages.filter(p => p.category === 'meta');
    const concepts = pages.filter(p => p.category === 'concept');
    const components = pages.filter(p => p.category === 'component' || p.category === 'components');
    const guides = pages.filter(p => p.category === 'guide' || p.category === 'guides');

    // Meta pages come first (philosophy, specification, etc.)
    if (meta.length > 0) {
      lines.push('Meta:');
      meta.forEach(page => {
        lines.push(`- ${page.title} (${page.path})`);
      });
      lines.push('');
    }

    if (concepts.length > 0) {
      lines.push('Concepts:');
      concepts.forEach(page => {
        lines.push(`- ${page.title} (${page.path})`);
      });
      lines.push('');
    }

    if (components.length > 0) {
      lines.push('Components:');
      components.forEach(page => {
        lines.push(`- ${page.title} (${page.path})`);
      });
      lines.push('');
    }

    if (guides.length > 0) {
      lines.push('Guides:');
      guides.forEach(page => {
        lines.push(`- ${page.title} (${page.path})`);
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Clean up generated markdown
   * @private
   */
  _cleanMarkdown(content) {
    // Remove any code block wrappers if present
    let cleaned = content.replace(/```markdown\n/g, '').replace(/\n```$/g, '');

    // Remove any frontmatter if accidentally included
    cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Convert HTML to markdown ONLY if HTML tags are detected
    // This optimizes for the common case where LLM returns clean markdown
    if (this._containsHtml(cleaned)) {
      console.warn('⚠️  WikiIndexAgent: LLM returned HTML, converting to markdown');
      cleaned = this._convertHtmlToMarkdown(cleaned);
    }

    // Ensure single trailing newline
    cleaned = cleaned.trim() + '\n';

    return cleaned;
  }

  /**
   * Check if content contains HTML tags
   * @private
   */
  _containsHtml(content) {
    // Check for common HTML tags
    const htmlPattern = /<(h[1-6]|p|div|span|a|ul|ol|li|strong|b|em|i|code|pre)\b[^>]*>/i;
    return htmlPattern.test(content);
  }

  /**
   * Convert common HTML tags to markdown
   * @private
   */
  _convertHtmlToMarkdown(html) {
    let md = html;

    // Convert headings (with newlines and whitespace)
    md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (m, content) => '# ' + content.trim() + '\n\n');
    md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (m, content) => '## ' + content.trim() + '\n\n');
    md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (m, content) => '### ' + content.trim() + '\n\n');
    md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (m, content) => '#### ' + content.trim() + '\n\n');
    md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (m, content) => '##### ' + content.trim() + '\n\n');
    md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (m, content) => '###### ' + content.trim() + '\n\n');

    // Convert links - handle both with and without nested content
    md = md.replace(/<a\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) => {
      // Extract clean href - if href contains markdown syntax [text](url), extract the url
      let cleanHref = href;
      const hrefMarkdownMatch = href.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (hrefMarkdownMatch) {
        cleanHref = hrefMarkdownMatch[2]; // Extract URL from [text](url)
      }

      // Remove double .md extensions (e.g., "file.md.md" -> "file.md")
      cleanHref = cleanHref.replace(/\.md\.md$/, '.md');

      // Extract clean text - if text contains markdown syntax [text](url), replace with just text
      let cleanText = text.trim();
      // Replace all instances of [text](url) with just text, preserving any other text
      cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

      return '[' + cleanText + '](' + cleanHref + ')';
    });

    // Convert bold and emphasis
    md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, (m, content) => '**' + content.trim() + '**');
    md = md.replace(/<b>([\s\S]*?)<\/b>/gi, (m, content) => '**' + content.trim() + '**');
    md = md.replace(/<em>([\s\S]*?)<\/em>/gi, (m, content) => '*' + content.trim() + '*');
    md = md.replace(/<i>([\s\S]*?)<\/i>/gi, (m, content) => '*' + content.trim() + '*');

    // Convert lists - handle multiline list items
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
      const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
      const mdItems = items.map(item => {
        const text = item.replace(/<\/?li[^>]*>/gi, '').trim();
        return '- ' + text;
      });
      return mdItems.join('\n') + '\n\n';
    });

    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
      const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
      const mdItems = items.map((item, index) => {
        const text = item.replace(/<\/?li[^>]*>/gi, '').trim();
        return `${index + 1}. ` + text;
      });
      return mdItems.join('\n') + '\n\n';
    });

    // Convert paragraphs - preserve content but remove tags (handle multiline)
    md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, content) => content.trim() + '\n\n');

    // Convert code blocks
    md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (m, code) => {
      return '```\n' + code.trim() + '\n```\n\n';
    });
    md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (m, code) => '`' + code.trim() + '`');

    // Clean up any remaining simple HTML entities
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&quot;/g, '"');
    md = md.replace(/&#39;/g, "'");

    // Clean up excessive newlines (more than 2 in a row)
    md = md.replace(/\n{3,}/g, '\n\n');

    // Trim and ensure proper ending
    md = md.trim();

    return md;
  }
}

module.exports = WikiIndexAgent;
