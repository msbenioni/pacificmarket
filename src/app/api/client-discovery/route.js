/**
 * API Endpoint for Client Discovery (App Router)
 * 
 * Integrates with PDN Daily Scheduler to:
 * - Run discovery workflows using Firecrawl
 * - Process and store client data
 */

import Firecrawl from '@mendable/firecrawl-js';
import { NextResponse } from 'next/server';

// Search queries for Pacific businesses
const PACIFIC_SEARCH_QUERIES = [
  { region: 'NZ Pasifika', query: 'Pacific-owned business New Zealand' },
  { region: 'NZ Pasifika', query: 'Pasifika-owned business NZ' },
  { region: 'NZ Pasifika', query: 'Pacific business trust New Zealand' },
  { region: 'NZ Pasifika', query: 'Pasifika supplier directory NZ' },
  { region: 'NZ Māori', query: 'Māori-owned business New Zealand' },
  { region: 'NZ Māori', query: 'pakihi Māori directory' },
  { region: 'NZ Māori', query: 'kaupapa Māori business' },
  { region: 'NZ Māori', query: 'Māori supplier Amotai' },
  { region: 'Hawaiʻi', query: 'Native Hawaiian chamber of commerce business directory' },
  { region: 'Hawaiʻi', query: 'Native Hawaiian-owned business' },
  { region: 'Pacific Islands', query: 'Samoa business directory' },
  { region: 'Pacific Islands', query: 'Tonga business directory' },
  { region: 'Pacific Islands', query: 'Cook Islands business directory' },
  { region: 'Pacific Islands', query: 'Fiji business directory' },
  { region: 'PNG', query: 'Papua New Guinea business directory' },
  { region: 'PNG', query: 'PNG chamber of commerce' },
];

// POST handler
export async function POST(request) {
  console.log('=== CLIENT DISCOVERY API CALLED ===');

  try {
    const body = await request.json();
    console.log('Action:', body.action, '| Region:', body.region || 'Global');

    if (body.action === 'run_discovery') {
      const region = body.region || 'Global';
      const result = await runDiscovery(region);
      return result;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('=== CLIENT DISCOVERY API ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Main discovery workflow
async function runDiscovery(region) {
  const startTime = Date.now();
  console.log(`Starting discovery for region: ${region}`);

  // Step 1: Verify Firecrawl API key
  if (!process.env.FIRECRAWL_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'FIRECRAWL_API_KEY not found in environment variables'
    }, { status: 500 });
  }

  try {
    // Step 2: Initialize Firecrawl (default export per docs)
    console.log('Initializing Firecrawl...');
    const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

    // Step 3: Select queries based on region
    let searchQueries;
    if (region === 'Global') {
      searchQueries = PACIFIC_SEARCH_QUERIES.slice(0, 10);
    } else {
      searchQueries = PACIFIC_SEARCH_QUERIES.filter(q => q.region === region);
    }

    if (searchQueries.length === 0) {
      searchQueries = PACIFIC_SEARCH_QUERIES.slice(0, 5);
    }

    console.log(`Running ${searchQueries.length} queries for ${region}...`);

    // Step 4: Run searches
    const allResults = [];
    for (let i = 0; i < searchQueries.length; i++) {
      const searchConfig = searchQueries[i];
      try {
        console.log(`[${i + 1}/${searchQueries.length}] Searching: "${searchConfig.query}"`);

        const response = await firecrawl.search(searchConfig.query, {
          limit: 5
        });

        // Per Firecrawl docs: response has { success, data } where data is array
        console.log(`  Response success: ${response?.success}, results: ${response?.data?.length || 0}`);

        if (response?.success && response?.data?.length > 0) {
          const enrichedResults = response.data.map(result => ({
            url: result.url || '',
            title: result.metadata?.title || result.title || '',
            description: result.metadata?.description || result.description || '',
            markdown: result.markdown || '',
            search_region: searchConfig.region,
            search_query: searchConfig.query
          }));
          allResults.push(...enrichedResults);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (searchError) {
        console.error(`  Search failed: ${searchError.message}`);
        continue;
      }
    }

    console.log(`Total raw results: ${allResults.length}`);

    // Step 5: Deduplicate by URL
    const seen = new Set();
    const deduplicated = allResults.filter(r => {
      if (!r.url || seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });

    console.log(`After dedup: ${deduplicated.length}`);

    // Step 6: Convert to business format
    const businesses = deduplicated.map((result, index) => ({
      id: `biz-${Date.now()}-${index}`,
      name: result.title || 'Unknown Business',
      website: result.url || '',
      email: '',
      phone: '',
      category: 'Other',
      region: result.search_region || region,
      city: '',
      description: result.description || '',
      confidence: 60,
      discovered: new Date().toISOString().split('T')[0],
      status: 'pending',
      editedBy: null,
      editedAt: null,
      notes: `Found via: ${result.search_query}`,
      tags: [result.search_region?.toLowerCase() || 'pacific'],
      socialMedia: {}
    }));

    const duration = Date.now() - startTime;
    console.log(`Discovery completed in ${duration}ms. Found ${businesses.length} businesses.`);

    return NextResponse.json({
      success: true,
      data: {
        schedule: { region, cities: [region] },
        discovered: allResults.length,
        enriched: businesses.length,
        deduplicated: deduplicated.length,
        stored: businesses,
        duration: `${duration}ms`
      }
    });

  } catch (error) {
    console.error('Discovery workflow failed:', error.message);
    console.error('Stack:', error.stack);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
