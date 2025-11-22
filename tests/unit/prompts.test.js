const PromptManager = require('../../lib/prompts');

describe('PromptManager', () => {
  let promptManager;

  beforeEach(() => {
    promptManager = new PromptManager();
  });

  describe('renderTemplate', () => {
    it('should render template with variables', () => {
      const template = 'Hello {{name}}, you are {{age}} years old.';
      const variables = { name: 'Alice', age: 30 };

      const result = promptManager.renderTemplate(template, variables);

      expect(result).toBe('Hello Alice, you are 30 years old.');
    });

    it('should handle multiple occurrences of same variable', () => {
      const template = '{{name}} said "{{name}} is here!"';
      const variables = { name: 'Bob' };

      const result = promptManager.renderTemplate(template, variables);

      expect(result).toBe('Bob said "Bob is here!"');
    });

    it('should handle templates with no variables', () => {
      const template = 'This is a static template.';
      const variables = {};

      const result = promptManager.renderTemplate(template, variables);

      expect(result).toBe('This is a static template.');
    });

    it('should throw error if required variable is missing', () => {
      const template = 'Hello {{name}}!';
      const variables = {};

      expect(() => promptManager.renderTemplate(template, variables)).toThrow(/missing.*name/i);
    });

    it('should handle multiline templates', () => {
      const template = `Name: {{name}}
Age: {{age}}
City: {{city}}`;
      const variables = { name: 'Charlie', age: 25, city: 'NYC' };

      const result = promptManager.renderTemplate(template, variables);

      expect(result).toContain('Name: Charlie');
      expect(result).toContain('Age: 25');
      expect(result).toContain('City: NYC');
    });
  });

  describe('getTemplate', () => {
    it('should load code-analysis template', () => {
      const template = promptManager.getTemplate('code-analysis');

      expect(template).toBeDefined();
      expect(typeof template).toBe('string');
      expect(template.length).toBeGreaterThan(0);
    });

    it('should load documentation-writer template', () => {
      const template = promptManager.getTemplate('documentation-writer');

      expect(template).toBeDefined();
      expect(typeof template).toBe('string');
      expect(template.length).toBeGreaterThan(0);
    });

    it('should load meta-analysis template', () => {
      const template = promptManager.getTemplate('meta-analysis');

      expect(template).toBeDefined();
      expect(typeof template).toBe('string');
      expect(template.length).toBeGreaterThan(0);
    });

    it('should throw error for non-existent template', () => {
      expect(() => promptManager.getTemplate('non-existent')).toThrow(/template.*not found/i);
    });

    it('should cache loaded templates', () => {
      const template1 = promptManager.getTemplate('code-analysis');
      const template2 = promptManager.getTemplate('code-analysis');

      expect(template1).toBe(template2); // Same reference (cached)
    });
  });

  describe('render', () => {
    it('should load and render template in one call', () => {
      const variables = {
        filePath: 'src/index.js',
        commitMessage: 'Add feature',
        diff: '+ new code',
        relatedPages: 'None'
      };

      const result = promptManager.render('code-analysis', variables);

      expect(result).toContain('src/index.js');
      expect(result).toContain('Add feature');
      expect(result).toContain('+ new code');
    });

    it('should validate required variables for template', () => {
      const variables = {
        filePath: 'src/test.js'
        // Missing other required variables
      };

      expect(() => promptManager.render('code-analysis', variables)).toThrow();
    });
  });

  describe('code-analysis template', () => {
    it('should include all required variables', () => {
      const template = promptManager.getTemplate('code-analysis');

      expect(template).toContain('{{filePath}}');
      expect(template).toContain('{{commitMessage}}');
      expect(template).toContain('{{diff}}');
      expect(template).toContain('{{relatedPages}}');
    });

    it('should request JSON output', () => {
      const template = promptManager.getTemplate('code-analysis');

      expect(template.toLowerCase()).toContain('json');
    });

    it('should mention concepts and code elements', () => {
      const template = promptManager.getTemplate('code-analysis');

      expect(template.toLowerCase()).toContain('concept');
      expect(template.toLowerCase()).toContain('element');
    });
  });

  describe('documentation-writer template', () => {
    it('should include all required variables', () => {
      const template = promptManager.getTemplate('documentation-writer');

      expect(template).toContain('{{conceptName}}');
      expect(template).toContain('{{codeAnalysis}}');
      expect(template).toContain('{{existingContent}}');
    });

    it('should request markdown output', () => {
      const template = promptManager.getTemplate('documentation-writer');

      expect(template.toLowerCase()).toContain('markdown');
    });
  });

  describe('meta-analysis template', () => {
    it('should include all required variables', () => {
      const template = promptManager.getTemplate('meta-analysis');

      expect(template).toContain('{{concepts}}');
      expect(template).toContain('{{pageList}}');
    });

    it('should request JSON output', () => {
      const template = promptManager.getTemplate('meta-analysis');

      expect(template.toLowerCase()).toContain('json');
    });

    it('should mention themes and patterns', () => {
      const template = promptManager.getTemplate('meta-analysis');

      expect(template.toLowerCase()).toContain('theme');
    });
  });
});
