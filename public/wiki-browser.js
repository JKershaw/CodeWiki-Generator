/**
 * Wiki Browser - Client-side JavaScript for enhanced wiki navigation
 * Handles search, table of contents, related pages, and smooth scrolling
 */

(function() {
  'use strict';

  // Get wiki data from the page
  const { project, pagePath, title } = window.wikiData || {};

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Initialize all features
    initSearch();
    initTableOfContents();
    initRelatedPages();
    initBackToTop();
    initTagFiltering();
    initSmoothScroll();
  }

  /**
   * Initialize search functionality
   */
  function initSearch() {
    const searchForm = document.getElementById('wiki-search-form');
    const searchInput = document.getElementById('wiki-search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchForm || !searchInput || !searchResults) return;

    // Handle search form submission
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();

      if (!query) {
        searchResults.style.display = 'none';
        return;
      }

      // Show loading state
      searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
      searchResults.style.display = 'block';

      try {
        const response = await fetch(`/api/wiki/${project}/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success && data.results) {
          displaySearchResults(data.results, query);
        } else {
          searchResults.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
        }
      } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
      }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchForm.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });

    // Show search results when input is focused and has content
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim() && searchResults.children.length > 0) {
        searchResults.style.display = 'block';
      }
    });
  }

  /**
   * Display search results
   */
  function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          No results found for "${escapeHtml(query)}"
        </div>
      `;
      return;
    }

    const resultsHtml = `
      <div class="search-results-header">
        <strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''} for "${escapeHtml(query)}"
      </div>
      <div class="search-results-list">
        ${results.map(result => `
          <div class="search-result-item">
            <a href="/wiki/${project}/${result.path.replace('.md', '')}" class="search-result-title">
              ${escapeHtml(result.title)}
            </a>
            <div class="search-result-meta">
              <span class="search-result-category">${escapeHtml(result.category)}</span>
              ${result.tags && result.tags.length > 0 ? `
                <span class="search-result-tags">
                  ${result.tags.map(tag => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join(' ')}
                </span>
              ` : ''}
            </div>
            <div class="search-result-snippet">${result.snippet}</div>
          </div>
        `).join('')}
      </div>
    `;

    searchResults.innerHTML = resultsHtml;
  }

  /**
   * Initialize table of contents
   */
  function initTableOfContents() {
    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;

    // Generate TOC from page headings
    generateClientSideTOC();

    // Also fetch server-side TOC for verification
    fetchTableOfContents();
  }

  /**
   * Generate TOC from page headings (client-side)
   */
  function generateClientSideTOC() {
    const tocContainer = document.getElementById('table-of-contents');
    const content = document.querySelector('.wiki-content');

    if (!content || !tocContainer) return;

    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');

    if (headings.length === 0) {
      tocContainer.innerHTML = '<div class="toc-empty">No headings found</div>';
      return;
    }

    const tocItems = [];
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent.trim();
      let anchor = heading.id;

      // Generate anchor if not present
      if (!anchor) {
        anchor = generateAnchor(text);
        heading.id = anchor;
      }

      tocItems.push({
        level,
        text,
        anchor
      });
    });

    const tocHtml = `
      <ul class="toc-list">
        ${tocItems.map(item => `
          <li class="toc-item toc-level-${item.level}">
            <a href="#${item.anchor}" class="toc-link">${escapeHtml(item.text)}</a>
          </li>
        `).join('')}
      </ul>
    `;

    tocContainer.innerHTML = tocHtml;

    // Highlight active section on scroll
    initTOCHighlight(tocItems);
  }

  /**
   * Fetch TOC from server
   */
  async function fetchTableOfContents() {
    try {
      const response = await fetch(`/api/wiki/${project}/toc/${pagePath.replace('.md', '')}`);
      const data = await response.json();

      if (data.success && data.toc && data.toc.length > 0) {
        // Server-side TOC can be used as backup or for comparison
        console.log('Server TOC:', data.toc);
      }
    } catch (error) {
      console.error('Error fetching TOC:', error);
    }
  }

  /**
   * Highlight active TOC item on scroll
   */
  function initTOCHighlight(tocItems) {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          highlightActiveTOCItem(tocItems, tocLinks);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Highlight the currently visible section in TOC
   */
  function highlightActiveTOCItem(tocItems, tocLinks) {
    const scrollPos = window.scrollY + 100; // Offset for header

    let activeIndex = -1;

    for (let i = 0; i < tocItems.length; i++) {
      const heading = document.getElementById(tocItems[i].anchor);
      if (heading && heading.offsetTop <= scrollPos) {
        activeIndex = i;
      }
    }

    tocLinks.forEach((link, index) => {
      if (index === activeIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Initialize related pages
   */
  async function initRelatedPages() {
    const relatedContainer = document.getElementById('related-pages');
    if (!relatedContainer) return;

    try {
      const response = await fetch(`/api/wiki/${project}/related/${pagePath.replace('.md', '')}`);
      const data = await response.json();

      if (data.success && data.relatedPages) {
        displayRelatedPages(data.relatedPages);
      } else {
        relatedContainer.innerHTML = '<div class="related-empty">No related pages found</div>';
      }
    } catch (error) {
      console.error('Error fetching related pages:', error);
      relatedContainer.innerHTML = '<div class="related-error">Failed to load related pages</div>';
    }
  }

  /**
   * Display related pages
   */
  function displayRelatedPages(relatedPages) {
    const relatedContainer = document.getElementById('related-pages');

    if (relatedPages.length === 0) {
      relatedContainer.innerHTML = '<div class="related-empty">No related pages found</div>';
      return;
    }

    const relatedHtml = `
      <ul class="related-list">
        ${relatedPages.slice(0, 5).map(page => `
          <li class="related-item">
            <a href="/wiki/${project}/${page.path.replace('.md', '')}" class="related-link">
              ${escapeHtml(page.title)}
            </a>
            <div class="related-meta">
              <span class="related-category">${escapeHtml(page.category)}</span>
            </div>
          </li>
        `).join('')}
      </ul>
    `;

    relatedContainer.innerHTML = relatedHtml;
  }

  /**
   * Initialize back-to-top button
   */
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Initialize tag filtering
   */
  function initTagFiltering() {
    const tagPills = document.querySelectorAll('.tag-pill');

    tagPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const tag = pill.dataset.tag;
        if (tag) {
          // Search for pages with this tag
          const searchInput = document.getElementById('wiki-search-input');
          if (searchInput) {
            searchInput.value = tag;
            searchInput.focus();
            // Trigger search
            const searchForm = document.getElementById('wiki-search-form');
            if (searchForm) {
              searchForm.dispatchEvent(new Event('submit'));
            }
          }
        }
      });

      // Add hover effect
      pill.style.cursor = 'pointer';
    });
  }

  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Generate URL-friendly anchor from text
   */
  function generateAnchor(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
