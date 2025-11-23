const fs = require('fs');
const path = require('path');

/**
 * PromptManager handles loading and rendering prompt templates
 */
class PromptManager {
  constructor(templatesDir = path.join(__dirname, 'prompts')) {
    this.templatesDir = templatesDir;
    this.templateCache = {};
  }

  /**
   * Render a template with variables
   * @param {string} template - Template string with {{variable}} placeholders
   * @param {Object} variables - Variables to substitute
   * @returns {string} Rendered template
   */
  renderTemplate(template, variables) {
    // Find all {{variable}} placeholders
    const placeholders = template.match(/\{\{(\w+)\}\}/g) || [];

    // Extract variable names
    const requiredVars = placeholders.map(p => p.replace(/\{\{|\}\}/g, ''));

    // Check for missing variables
    for (const varName of requiredVars) {
      if (!(varName in variables)) {
        throw new Error(`Missing required variable: ${varName}`);
      }
    }

    // Replace all placeholders
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(placeholder, value);
    }

    return result;
  }

  /**
   * Load a template by name
   * @param {string} templateName - Name of the template (without extension)
   * @returns {string} Template content
   */
  getTemplate(templateName) {
    // Check cache first
    if (this.templateCache[templateName]) {
      return this.templateCache[templateName];
    }

    // Load from file
    const templatePath = path.join(this.templatesDir, `${templateName}.txt`);

    try {
      const template = fs.readFileSync(templatePath, 'utf-8');
      this.templateCache[templateName] = template;
      return template;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Template not found: ${templateName}`);
      }
      throw error;
    }
  }

  /**
   * Load template and render in one call
   * @param {string} templateName - Name of the template
   * @param {Object} variables - Variables to substitute
   * @returns {string} Rendered template
   */
  render(templateName, variables) {
    const template = this.getTemplate(templateName);
    return this.renderTemplate(template, variables);
  }
}

module.exports = PromptManager;
