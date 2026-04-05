/**
 * React Hook for Firecrawl Web Scraping
 * 
 * Provides easy-to-use React hooks for:
 * - Scraping business websites
 * - Enriching business data
 * - Browser automation
 * - AI-powered extraction
 * - Advanced search
 * - Managing scraping state and errors
 */

import { useToast } from '@/components/ui/use-toast';
import {
  crawlBusinessWebsite,
  enrichBusinessData,
  firecrawlConfig,
  scrapeBusinessWebsite
} from '@/utils/firecrawlUtils';
import { useCallback, useState } from 'react';

/**
 * Hook for scraping a single business website
 * @returns {Object} - Scraping state and functions
 */
export function useBusinessScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { toast } = useToast();

  const scrapeWebsite = useCallback(async (url, options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await scrapeBusinessWebsite(url, options);
      setData(result);
      toast({
        title: "Website Scraped Successfully",
        description: `Successfully scraped ${url}`,
      });
      return result;
    } catch (err) {
      setError(err);
      toast({
        title: "Scraping Failed",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    scrapeWebsite,
    data,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for crawling multiple pages of a business website
 * @returns {Object} - Crawling state and functions
 */
export function useBusinessCrawler() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState([]);
  const { toast } = useToast();

  const crawlWebsite = useCallback(async (url, options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await crawlBusinessWebsite(url, options);
      setPages(results);
      toast({
        title: "Website Crawled Successfully",
        description: `Crawled ${results.length} pages from ${url}`,
      });
      return results;
    } catch (err) {
      setError(err);
      toast({
        title: "Crawling Failed",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setPages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    crawlWebsite,
    pages,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for enriching existing business data
 * @returns {Object} - Enrichment state and functions
 */
export function useBusinessEnricher() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrichedBusiness, setEnrichedBusiness] = useState(null);
  const { toast } = useToast();

  const enrichBusiness = useCallback(async (business, options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return business;
    }

    setIsLoading(true);
    setError(null);

    try {
      const enriched = await enrichBusinessData(business, options);
      setEnrichedBusiness(enriched);
      toast({
        title: "Business Enriched Successfully",
        description: `Successfully enriched data for ${business.name}`,
      });
      return enriched;
    } catch (err) {
      setError(err);
      toast({
        title: "Enrichment Failed",
        description: err.message,
        variant: "destructive"
      });
      return business;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setEnrichedBusiness(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    enrichBusiness,
    enrichedBusiness,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for batch processing multiple businesses
 * @returns {Object} - Batch processing state and functions
 */
export function useBatchEnricher() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const { toast } = useToast();

  const enrichBatch = useCallback(async (businesses, options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return [];
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    const batchResults = [];

    try {
      for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i];

        try {
          const enriched = await enrichBusinessData(business, options);
          batchResults.push({
            success: true,
            business: enriched,
            index: i
          });
        } catch (err) {
          batchResults.push({
            success: false,
            business,
            error: err.message,
            index: i
          });
        }

        setProgress(Math.round(((i + 1) / businesses.length) * 100));

        // Add delay to respect rate limits
        if (i < businesses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setResults(batchResults);

      const successCount = batchResults.filter(r => r.success).length;
      toast({
        title: "Batch Enrichment Complete",
        description: `Successfully enriched ${successCount} out of ${businesses.length} businesses`,
      });

      return batchResults;
    } catch (err) {
      setError(err);
      toast({
        title: "Batch Enrichment Failed",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
    setIsLoading(false);
    setProgress(0);
  }, []);

  return {
    enrichBatch,
    results,
    progress,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for scraping with actions (dynamic content)
 * @returns {Object} - Action scraping state and functions
 */
export function useActionScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { toast } = useToast();

  const scrapeWithActions = useCallback(async (url, actions = [], options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await scrapeWithActions(url, actions, options);
      setData(result);
      toast({
        title: "Action Scrape Successful",
        description: `Successfully scraped ${url} with ${actions.length} actions`,
      });
      return result;
    } catch (err) {
      setError(err);
      toast({
        title: "Action Scrape Failed",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    scrapeWithActions,
    data,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for AI-powered structured data extraction
 * @returns {Object} - Extraction state and functions
 */
export function useStructuredExtractor() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const { toast } = useToast();

  const extractData = useCallback(async (urls, prompt, schema, options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await extractStructuredData(urls, prompt, schema, options);
      setExtractedData(result);
      toast({
        title: "Data Extracted Successfully",
        description: `Successfully extracted structured data from ${Array.isArray(urls) ? urls.length : 1} URL(s)`,
      });
      return result;
    } catch (err) {
      setError(err);
      toast({
        title: "Extraction Failed",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setExtractedData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    extractData,
    extractedData,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for browser session management
 * @returns {Object} - Browser session state and functions
 */
export function useBrowserSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  const startSession = useCallback(async (options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sessionInfo = await startBrowserSession(options);
      setSession(sessionInfo);
      toast({
        title: "Browser Session Started",
        description: `Session ID: ${sessionInfo.sessionId}`,
      });
      return sessionInfo;
    } catch (err) {
      setError(err);
      toast({
        title: "Failed to Start Session",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const executeCode = useCallback(async (code) => {
    if (!session) {
      const error = new Error('No active browser session');
      setError(error);
      toast({
        title: "No Active Session",
        description: "Please start a browser session first.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const result = await executeInBrowser(session.sessionId, code);
      toast({
        title: "Code Executed",
        description: "Successfully executed code in browser",
      });
      return result;
    } catch (err) {
      setError(err);
      toast({
        title: "Execution Failed",
        description: err.message,
        variant: "destructive"
      });
      return null;
    }
  }, [session, toast]);

  const closeSession = useCallback(async () => {
    if (!session) {
      return true;
    }

    try {
      await closeBrowserSession(session.sessionId);
      setSession(null);
      toast({
        title: "Session Closed",
        description: "Browser session has been closed",
      });
      return true;
    } catch (err) {
      setError(err);
      toast({
        title: "Failed to Close Session",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  }, [session, toast]);

  const reset = useCallback(() => {
    setSession(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    startSession,
    executeCode,
    closeSession,
    session,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for advanced web search
 * @returns {Object} - Search state and functions
 */
export function useAdvancedSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const { toast } = useToast();

  const performSearch = useCallback(async (query, options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await advancedSearch(query, options);
      setSearchResults(results);
      toast({
        title: "Search Complete",
        description: `Found results for: ${query}`,
      });
      return results;
    } catch (err) {
      setError(err);
      toast({
        title: "Search Failed",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setSearchResults(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    performSearch,
    searchResults,
    isLoading,
    error,
    reset
  };
}

/**
 * Hook for batch URL scraping
 * @returns {Object} - Batch scraping state and functions
 */
export function useBatchScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const { toast } = useToast();

  const scrapeBatch = useCallback(async (urls, options = {}) => {
    if (!firecrawlConfig.isConfigured()) {
      const error = new Error('Firecrawl API key not configured');
      setError(error);
      toast({
        title: "Configuration Error",
        description: "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await batchScrapeUrls(urls, options);
      setBatchResults(results);
      toast({
        title: "Batch Scrape Complete",
        description: `Successfully scraped ${urls.length} URLs`,
      });
      return results;
    } catch (err) {
      setError(err);
      toast({
        title: "Batch Scrape Failed",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setBatchResults(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    scrapeBatch,
    batchResults,
    isLoading,
    error,
    reset
  };
}
