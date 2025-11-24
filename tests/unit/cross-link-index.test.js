const CrossLinkIndex = require('../../lib/cross-link-index');

describe('CrossLinkIndex', () => {
  let index;

  beforeEach(() => {
    index = new CrossLinkIndex();
  });

  describe('addPage', () => {
    it('should extract bold mentions from content', () => {
      const content = 'This page mentions **Page A** and **Page B** in the content.';
      index.addPage('test.md', content, 'Test Page');

      expect(index.getPagesToUpdate('Page A')).toContain('test.md');
      expect(index.getPagesToUpdate('Page B')).toContain('test.md');
    });

    it('should not extract short mentions (< 3 chars)', () => {
      const content = 'This has **Hi** and **AB** which are too short.';
      index.addPage('test.md', content, 'Test Page');

      expect(index.getPagesToUpdate('Hi').size).toBe(0);
      expect(index.getPagesToUpdate('AB').size).toBe(0);
    });

    it('should handle multiple pages mentioning the same page', () => {
      index.addPage('page1.md', '**Target Page** is mentioned here', 'Page 1');
      index.addPage('page2.md', 'Also mentions **Target Page** here', 'Page 2');

      const mentioners = index.getPagesToUpdate('Target Page');
      expect(mentioners.size).toBe(2);
      expect(mentioners).toContain('page1.md');
      expect(mentioners).toContain('page2.md');
    });

    it('should track reverse index (pages mentioned by a page)', () => {
      index.addPage('test.md', '**Page A** and **Page B**', 'Test');

      const stats = index.getStats();
      expect(stats.totalPages).toBe(1);
      expect(stats.totalMentions).toBe(2);
    });
  });

  describe('removePage', () => {
    it('should remove page from index', () => {
      index.addPage('test.md', '**Page A**', 'Test');
      index.removePage('test.md');

      expect(index.getPagesToUpdate('Page A').size).toBe(0);
      expect(index.getStats().totalPages).toBe(0);
    });

    it('should clean up empty sets', () => {
      index.addPage('test.md', '**Page A**', 'Test');
      index.removePage('test.md');

      const stats = index.getStats();
      expect(stats.totalMentions).toBe(0);
    });
  });

  describe('updatePage', () => {
    it('should update page mentions', () => {
      index.addPage('test.md', '**Page A**', 'Test');
      index.updatePage('test.md', '**Page B**', 'Test');

      expect(index.getPagesToUpdate('Page A').size).toBe(0);
      expect(index.getPagesToUpdate('Page B')).toContain('test.md');
    });

    it('should handle adding new mentions', () => {
      index.addPage('test.md', '**Page A**', 'Test');
      index.updatePage('test.md', '**Page A** and **Page B**', 'Test');

      expect(index.getPagesToUpdate('Page A')).toContain('test.md');
      expect(index.getPagesToUpdate('Page B')).toContain('test.md');
    });
  });

  describe('getPagesToUpdate', () => {
    it('should return empty set for non-existent page', () => {
      const result = index.getPagesToUpdate('Non Existent');
      expect(result.size).toBe(0);
    });

    it('should return set of pages that mention the title', () => {
      index.addPage('page1.md', '**Target**', 'Page 1');
      index.addPage('page2.md', '**Target**', 'Page 2');
      index.addPage('page3.md', '**Other**', 'Page 3');

      const result = index.getPagesToUpdate('Target');
      expect(result.size).toBe(2);
      expect(result).toContain('page1.md');
      expect(result).toContain('page2.md');
      expect(result).not.toContain('page3.md');
    });
  });

  describe('getPagesToUpdateForMultiple', () => {
    it('should return union of all mentioning pages', () => {
      index.addPage('page1.md', '**Page A**', 'Page 1');
      index.addPage('page2.md', '**Page B**', 'Page 2');
      index.addPage('page3.md', '**Page A** and **Page B**', 'Page 3');

      const result = index.getPagesToUpdateForMultiple(['Page A', 'Page B']);
      expect(result.size).toBe(3);
      expect(result).toContain('page1.md');
      expect(result).toContain('page2.md');
      expect(result).toContain('page3.md');
    });

    it('should return empty set for non-existent pages', () => {
      const result = index.getPagesToUpdateForMultiple(['Non', 'Existent']);
      expect(result.size).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      index.addPage('page1.md', '**Page A** **Page B** **Page C**', 'Page 1');
      index.addPage('page2.md', '**Page A** **Page D**', 'Page 2');

      const stats = index.getStats();
      expect(stats.totalPages).toBe(2);
      expect(stats.totalMentions).toBe(4); // Page A, Page B, Page C, Page D
      expect(stats.avgMentionsPerPage).toBe(2.5); // (3 + 2) / 2
    });

    it('should handle empty index', () => {
      const stats = index.getStats();
      expect(stats.totalPages).toBe(0);
      expect(stats.totalMentions).toBe(0);
      expect(stats.avgMentionsPerPage).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all data', () => {
      index.addPage('page1.md', '**Page A**', 'Page 1');
      index.addPage('page2.md', '**Page B**', 'Page 2');

      index.clear();

      const stats = index.getStats();
      expect(stats.totalPages).toBe(0);
      expect(stats.totalMentions).toBe(0);
    });
  });

  describe('_extractBoldMentions', () => {
    it('should extract multiple bold mentions', () => {
      const content = '**First** and **Second** and **Third**';
      const mentions = index._extractBoldMentions(content);

      expect(mentions.size).toBe(3);
      expect(mentions.has('First')).toBe(true);
      expect(mentions.has('Second')).toBe(true);
      expect(mentions.has('Third')).toBe(true);
    });

    it('should trim whitespace', () => {
      const content = '**  Spaced  **';
      const mentions = index._extractBoldMentions(content);

      expect(mentions.has('Spaced')).toBe(true);
    });

    it('should not extract mentions that are already links', () => {
      // Bold mentions inside links should be skipped by not matching the pattern
      const content = 'Regular **Mention** here';
      const mentions = index._extractBoldMentions(content);

      expect(mentions.has('Mention')).toBe(true);
    });

    it('should handle multi-word mentions', () => {
      const content = '**User Authentication System** is important';
      const mentions = index._extractBoldMentions(content);

      expect(mentions.has('User Authentication System')).toBe(true);
    });
  });
});
