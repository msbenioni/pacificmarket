/**
 * Firecrawl Utilities for Pacific Discovery Network
 * 
 * This utility provides web scraping and crawling capabilities for:
 * - Business data enrichment
 * - Website content extraction
 * - Competitor analysis
 * - Market research
 * - Browser automation
 */


// Firecrawl will be initialized on-demand with API key
import { Firecrawl } from '@mendable/firecrawl-js';

/**
 * Helper function to initialize Firecrawl with error handling
 */
function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('Firecrawl API key not found. Please ensure FIRECRAWL_API_KEY is set in your environment variables.');
  }
  return new Firecrawl({ apiKey });
}

/**
 * Scrape a single webpage for business information
 * @param {string} url - The URL to scrape
 * @param {Object} options - Scraping options
 * @returns {Promise<Object>} - Scraped data
 */
export async function scrapeBusinessWebsite(url, options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const defaultOptions = {
      formats: ['markdown', 'html'],
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'a', 'img'],
      excludeTags: ['script', 'style', 'nav', 'footer'],
      waitFor: 2000,
      screenshot: false,
      removeBase64Images: true
    };

    const scrapeOptions = { ...defaultOptions, ...options };

    const result = await firecrawl.scrape(url, scrapeOptions);

    if (result && result.markdown) {
      return {
        success: true,
        data: result,
        metadata: {
          url,
          scrapedAt: new Date().toISOString(),
          options: scrapeOptions
        }
      };
    } else {
      throw new Error(result.error || 'Failed to scrape website');
    }
  } catch (error) {
    console.error('Error scraping website:', error);
    return {
      success: false,
      error: error.message,
      url
    };
  }
}

/**
 * Crawl multiple pages from a website
 * @param {string} url - Starting URL
 * @param {Object} options - Crawling options
 * @returns {Promise<Array>} - Array of scraped pages
 */
export async function crawlBusinessWebsite(url, options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const defaultOptions = {
      limit: 10,
      scrapeOptions: {
        formats: ['markdown'],
        includeTags: ['title', 'h1', 'h2', 'h3', 'p', 'a']
      },
      ...options
    };

    const response = await firecrawl.crawlUrl(url, defaultOptions);

    if (!response.success) {
      throw new Error(`Failed to crawl ${url}: ${response.error}`);
    }

    return response.data.map(page => ({
      url: page.metadata?.sourceURL || page.url,
      title: extractTitle(page.markdown),
      content: page.markdown,
      metadata: page.metadata,
      scrapedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error crawling website:', error);
    throw error;
  }
}

/**
 * Extract business information from scraped content
 * @param {string} content - Scraped markdown content
 * @returns {Object} - Extracted business data
 */
export function extractBusinessInfo(content) {
  const businessInfo = {
    name: null,
    description: null,
    contact: {
      email: null,
      phone: null,
      address: null
    },
    services: [],
    social: {
      facebook: null,
      instagram: null,
      twitter: null,
      linkedin: null
    }
  };

  // Extract business name (usually in h1 or first strong tag)
  const nameMatch = content.match(/^#\s+(.+)$/m) || content.match(/\*\*(.+)\*\*/);
  if (nameMatch) {
    businessInfo.name = nameMatch[1].trim();
  }

  // Extract email addresses
  const emailMatch = content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    businessInfo.contact.email = emailMatch[1];
  }

  // Extract phone numbers
  const phoneMatch = content.match(/(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) {
    businessInfo.contact.phone = phoneMatch[1];
  }

  // Extract social media links
  const socialPatterns = {
    facebook: /facebook\.com\/([a-zA-Z0-9.]+)/,
    instagram: /instagram\.com\/([a-zA-Z0-9._]+)/,
    twitter: /twitter\.com\/([a-zA-Z0-9_]+)/,
    linkedin: /linkedin\.com\/company\/([a-zA-Z0-9-]+)/
  };

  Object.keys(socialPatterns).forEach(platform => {
    const match = content.match(socialPatterns[platform]);
    if (match) {
      businessInfo.social[platform] = match[0];
    }
  });

  // Extract services (look for service-related headings)
  const servicesMatch = content.match(/##\s*(Services|What We Do|Offerings)/i);
  if (servicesMatch) {
    const servicesSection = content.substring(servicesMatch.index);
    const servicesList = servicesSection.match(/- (.+)$/gm) || [];
    businessInfo.services = servicesList.slice(0, 5).map(service => service.replace('- ', '').trim());
  }

  return businessInfo;
}

/**
 * Search for businesses in a specific area/industry
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Search results
 */
export async function searchBusinesses(query, options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const defaultOptions = {
      limit: 10,
      sources: ['web'],
      scrapeOptions: {
        formats: ['markdown']
      },
      ...options
    };

    const response = await firecrawl.search(query, defaultOptions);

    if (!response.success) {
      throw new Error(`Search failed: ${response.error}`);
    }

    return response.data?.web || [];
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
}

/**
 * Scrape with actions for dynamic content
 * @param {string} url - The URL to scrape
 * @param {Array} actions - Actions to perform
 * @param {Object} options - Scraping options
 * @returns {Promise<Object>} - Scraped data
 */
export async function scrapeWithActions(url, actions, options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const defaultOptions = {
      formats: ['markdown'],
      actions,
      ...options
    };

    const response = await firecrawl.scrape(url, defaultOptions);

    if (!response.markdown) {
      throw new Error(`Failed to scrape with actions: ${response.error || 'No data returned'}`);
    }

    return {
      success: true,
      data: response,
      actionsExecuted: actions,
      metadata: {
        url,
        scrapedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error scraping with actions:', error);
    return {
      success: false,
      error: error.message,
      url
    };
  }
}

/**
 * Extract structured data using AI
 * @param {string|Array} urls - URL(s) to extract from
 * @param {string} prompt - Extraction prompt
 * @param {Object} schema - JSON schema for output
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extracted structured data
 */
export async function extractStructuredData(urls, prompt, schema, options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const defaultOptions = {
      urls,
      prompt,
      schema,
      ...options
    };

    const response = await firecrawl.extract(defaultOptions);

    if (!response.success) {
      throw new Error(`Extraction failed: ${response.error}`);
    }

    return {
      success: true,
      data: response.data,
      metadata: {
        urls,
        extractedAt: new Date().toISOString(),
        prompt
      }
    };
  } catch (error) {
    console.error('Error extracting structured data:', error);
    return {
      success: false,
      error: error.message,
      urls
    };
  }
}

/**
 * Start browser session for automation
 * @param {Object} options - Browser session options
 * @returns {Promise<Object>} - Browser session info
 */
export async function startBrowserSession(options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const response = await firecrawl.browser(options);

    if (!response.success) {
      throw new Error(`Failed to start browser session: ${response.error}`);
    }

    return {
      success: true,
      sessionId: response.data.sessionId,
      viewUrl: response.data.viewUrl,
      metadata: {
        startedAt: new Date().toISOString(),
        options
      }
    };
  } catch (error) {
    console.error('Error starting browser session:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute code in browser session
 * @param {string} sessionId - Browser session ID
 * @param {string} code - JavaScript code to execute
 * @returns {Promise<Object>} - Execution result
 */
export async function executeInBrowser(sessionId, code) {
  try {
    const firecrawl = getFirecrawlClient();

    const response = await firecrawl.execute(sessionId, { code });

    if (!response.success) {
      throw new Error(`Failed to execute browser code: ${response.error}`);
    }

    return {
      success: true,
      result: response.data,
      metadata: {
        sessionId,
        executedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error executing browser code:', error);
    return {
      success: false,
      error: error.message,
      sessionId
    };
  }
}

/**
 * Close browser session
 * @param {string} sessionId - Browser session ID
 * @returns {Promise<boolean>} - Success status
 */
export async function closeBrowserSession(sessionId) {
  try {
    const firecrawl = getFirecrawlClient();
    const response = await firecrawl.close(sessionId);

    if (!response.success) {
      throw new Error(`Failed to close browser session: ${response.error}`);
    }

    return true;
  } catch (error) {
    console.error('Error closing browser session:', error);
    throw error;
  }
}

/**
 * Batch scrape multiple URLs
 * @param {Array} urls - URLs to scrape
 * @param {Object} options - Batch scraping options
 * @returns {Promise<Array>} - Batch scraping results
 */
export async function batchScrapeUrls(urls, options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const defaultOptions = {
      urls,
      formats: ['markdown'],
      ...options
    };

    const response = await firecrawl.batchScrapeUrls(defaultOptions);

    if (!response.success) {
      throw new Error(`Batch scrape failed: ${response.error}`);
    }

    // Wait for completion and get results
    const status = await firecrawl.checkBatchScrapeStatus(response.id);

    return {
      batchId: response.id,
      status,
      results: status.data || [],
      metadata: {
        totalUrls: urls.length,
        scrapedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error batch scraping:', error);
    throw error;
  }
}

/**
 * Perform web search with advanced filtering
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} - Search results
 */
export async function advancedSearch(query, options = {}) {
  try {
    const firecrawl = getFirecrawlClient();

    const defaultOptions = {
      limit: 20,
      sources: ['web', 'news'],
      scrapeOptions: {
        formats: ['markdown']
      },
      ...options
    };

    const response = await firecrawl.search(query, defaultOptions);

    if (!response.success) {
      throw new Error(`Advanced search failed: ${response.error}`);
    }

    return {
      success: true,
      data: response.data,
      metadata: {
        query,
        searchedAt: new Date().toISOString(),
        totalResults: response.data?.web?.length || 0
      }
    };
  } catch (error) {
    console.error('Error performing advanced search:', error);
    return {
      success: false,
      error: error.message,
      query
    };
  }
}

/**
 * Crawl with custom parameters preview
 * @param {string} url - URL to crawl
 * @param {string} prompt - Natural language prompt
 * @returns {Promise<Object>} - Crawl parameters preview
 */
export async function previewCrawlParams(url, prompt) {
  try {
    const firecrawl = getFirecrawlClient();

    const response = await firecrawl.previewCrawlParams(url, prompt);

    if (!response.success) {
      throw new Error(`Failed to preview crawl params: ${response.error}`);
    }

    return {
      success: true,
      data: response.data,
      metadata: {
        url,
        previewedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error previewing crawl params:', error);
    return {
      success: false,
      error: error.message,
      url
    };
  }
}

/**
 * Enrich existing business data with web scraping
 * @param {Object} business - Existing business data
 * @returns {Promise<Object>} - Enriched business data
 */
export async function enrichBusinessData(business) {
  if (!business.website) {
    return business;
  }

  try {
    const scrapedData = await scrapeBusinessWebsite(business.website);
    const extractedInfo = extractBusinessInfo(scrapedData.content);

    return {
      ...business,
      enriched: {
        websiteData: scrapedData,
        extractedInfo,
        lastEnriched: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error enriching business data:', error);
    return business;
  }
}

// Helper functions
function extractTitle(markdown) {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : null;
}

function extractDescription(markdown) {
  // Look for the first paragraph after the title
  const lines = markdown.split('\n');
  let foundTitle = false;

  for (const line of lines) {
    if (line.startsWith('#')) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim() && !line.startsWith('#')) {
      return line.trim();
    }
  }

  return null;
}

/**
 * Firecrawl API configuration and validation
 */
export const firecrawlConfig = {
  // Check if API key is configured
  isConfigured: () => {
    return !!process.env.FIRECRAWL_API_KEY;
  },

  // Get API usage limits
  getUsageLimits: () => {
    return {
      freeTier: {
        requestsPerMonth: 500,
        concurrentRequests: 10
      },
      paidTier: {
        requestsPerMonth: 10000,
        concurrentRequests: 50
      }
    };
  }
};
