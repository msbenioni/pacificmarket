/**
 * API Endpoint for Client Discovery (App Router)
 * 
 * Three actions:
 *   1. find_businesses — lightweight search, returns URL list with title/description (NO deep scraping)
 *   2. scrape_urls     — deep-scrape a list of URLs (homepage + /contact/), extract full details, store in DB
 *   3. scrape_url      — deep-scrape a single URL (homepage + /contact/), extract full details, store in DB
 * 
 * Workflow:  Find → user reviews/prunes list → Scrape remaining URLs
 */

import Firecrawl from '@mendable/firecrawl-js';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Countries for search ──
const COUNTRY_QUERIES = {
  'New Zealand': [
    'Pacific owned business New Zealand',
    'Pasifika business Auckland Wellington NZ',
    'Pacific Islander company New Zealand',
  ],
  'Australia': [
    'Pacific Islander business Australia',
    'Pasifika business Sydney Melbourne',
    'Pacific community business Australia',
  ],
  'Samoa': [
    'Samoa business company',
    'Samoan business Apia',
  ],
  'Fiji': [
    'Fiji business company',
    'Fijian business Suva Nadi',
  ],
  'Tonga': [
    'Tonga business company',
    'Tongan business Nuku\'alofa',
  ],
  'Hawaii': [
    'Native Hawaiian owned business',
    'Hawaii Pacific Islander business Honolulu',
  ],
  'Papua New Guinea': [
    'Papua New Guinea business company',
    'PNG business Port Moresby',
  ],
  'Cook Islands': [
    'Cook Islands business company',
    'Rarotonga business',
  ],
  'French Polynesia': [
    'French Polynesia business Tahiti',
    'Polynesian business Papeete',
  ],
  'Vanuatu': [
    'Vanuatu business company',
    'Port Vila business',
  ],
  'Solomon Islands': [
    'Solomon Islands business company',
    'Honiara business',
  ],
};

// ── URLs that are directories / social media / irrelevant ──
const SKIP_DOMAINS = [
  'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
  'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com',
  'wikipedia.org', 'google.com', 'bing.com', 'yahoo.com',
  'yelp.com', 'tripadvisor.com', 'yellowpages', 'whitepages',
  'government.nz', 'govt.nz', '.gov', 'amazon.com', 'ebay.com',
];

// ── Media file extensions to ignore ──
const MEDIA_EXTENSIONS = [
  '.gif', '.jpg', '.jpeg', '.png', '.svg', '.ico', '.webp', '.bmp', '.tiff',
  '.mp4', '.mp3', '.avi', '.mov', '.wmv', '.pdf', '.zip', '.rar',
];

// ── POST handler ──
export async function POST(request) {
  console.log('=== CLIENT DISCOVERY API CALLED ===');

  try {
    const body = await request.json();
    console.log('Action:', body.action);

    // Step 1: Find businesses (search only — no scraping)
    if (body.action === 'find_businesses') {
      return await findBusinesses(body.country || 'New Zealand', body.customQuery || '');
    }

    // Step 2: Scrape a list of URLs (deep scrape)
    if (body.action === 'scrape_urls') {
      if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
        return NextResponse.json({ success: false, error: 'urls array is required' }, { status: 400 });
      }
      return await scrapeMultipleUrls(body.urls, body.country || 'Unknown');
    }

    // Single URL scrape
    if (body.action === 'scrape_url') {
      if (!body.url) {
        return NextResponse.json({ success: false, error: 'url is required' }, { status: 400 });
      }
      return await scrapeSingleUrl(body.url, body.country || 'Unknown');
    }

    return NextResponse.json({ error: 'Invalid action. Use find_businesses, scrape_urls, or scrape_url' }, { status: 400 });

  } catch (error) {
    console.error('=== CLIENT DISCOVERY API ERROR ===');
    console.error('Error:', error.message);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// ════════════════════════════════════════════
//  Action 1: Find businesses (search only, NO scraping)
//  Returns a list of { url, title, description, domain } for the user to review
// ════════════════════════════════════════════
async function findBusinesses(country, customQuery) {
  const startTime = Date.now();
  console.log(`=== Finding businesses in: ${country} ===`);

  if (!process.env.FIRECRAWL_API_KEY) {
    return NextResponse.json({ success: false, error: 'FIRECRAWL_API_KEY not set' }, { status: 500 });
  }

  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

  // Build query list
  let queries;
  if (customQuery) {
    queries = [customQuery];
  } else if (country === 'All Countries') {
    // Take first query from each country
    queries = Object.values(COUNTRY_QUERIES).map(arr => arr[0]);
  } else {
    queries = COUNTRY_QUERIES[country] || [`Pacific business ${country}`];
  }
  console.log(`Using ${queries.length} search queries for ${country}`);

  // Search — no scraping, just get URLs + metadata
  const candidates = [];
  for (let i = 0; i < queries.length; i++) {
    try {
      console.log(`[Search ${i + 1}/${queries.length}] "${queries[i]}"`);
      const result = await firecrawl.search(queries[i], {
        limit: 10,
        scrapeOptions: { formats: ['markdown'] }
      });

      const webResults = result?.web || [];
      console.log(`  Found ${webResults.length} web results`);

      for (const item of webResults) {
        if (item.url && isBusinessUrl(item.url)) {
          candidates.push({
            url: normalizeToHomepage(item.url),
            title: cleanTitle(item.metadata?.title || ''),
            description: (item.metadata?.description || '').slice(0, 200),
            domain: getDomain(item.url),
            country,
          });
        }
      }

      await new Promise(r => setTimeout(r, 500));
    } catch (searchErr) {
      console.error(`  Search error: ${searchErr.message}`);
    }
  }

  // Deduplicate by domain
  const seenDomains = new Set();
  const unique = candidates.filter(c => {
    if (!c.domain || seenDomains.has(c.domain)) return false;
    seenDomains.add(c.domain);
    return true;
  });

  const duration = Date.now() - startTime;
  console.log(`=== Find complete: ${unique.length} unique businesses in ${duration}ms ===`);

  return NextResponse.json({
    success: true,
    data: {
      country,
      total: unique.length,
      businesses: unique,
      duration: `${duration}ms`,
    }
  });
}

// ════════════════════════════════════════════
//  Action 2: Scrape multiple URLs (deep scrape)
// ════════════════════════════════════════════
async function scrapeMultipleUrls(urls, country) {
  const startTime = Date.now();
  console.log(`=== Scraping ${urls.length} URLs for ${country} ===`);

  if (!process.env.FIRECRAWL_API_KEY) {
    return NextResponse.json({ success: false, error: 'FIRECRAWL_API_KEY not set' }, { status: 500 });
  }

  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

  const results = [];
  const errors = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[Scrape ${i + 1}/${urls.length}] ${url}`);
    try {
      const biz = await scrapeBusinessFromUrl(firecrawl, url, country);
      if (biz) {
        const stored = await storeBusiness(biz, country);
        results.push({ ...biz, storedInDb: stored });
      } else {
        errors.push({ url, error: 'Could not extract business details' });
      }
    } catch (err) {
      console.error(`  Scrape failed for ${url}: ${err.message}`);
      errors.push({ url, error: err.message });
    }
    // Rate limiting between scrapes
    if (i < urls.length - 1) await new Promise(r => setTimeout(r, 600));
  }

  const duration = Date.now() - startTime;
  console.log(`=== Scrape complete: ${results.length} scraped, ${errors.length} failed in ${duration}ms ===`);

  return NextResponse.json({
    success: true,
    data: {
      country,
      scraped: results.length,
      failed: errors.length,
      businesses: results,
      errors,
      duration: `${duration}ms`,
    }
  });
}

// ════════════════════════════════════════════
//  Action 3: Scrape a single URL
// ════════════════════════════════════════════
async function scrapeSingleUrl(url, country) {
  console.log(`=== Scraping single URL: ${url} ===`);

  if (!process.env.FIRECRAWL_API_KEY) {
    return NextResponse.json({ success: false, error: 'FIRECRAWL_API_KEY not set' }, { status: 500 });
  }

  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
  const business = await scrapeBusinessFromUrl(firecrawl, url, country);

  if (!business) {
    return NextResponse.json({ success: false, error: 'Could not extract business details from this URL' }, { status: 400 });
  }

  const stored = await storeBusiness(business, country);

  return NextResponse.json({
    success: true,
    data: {
      scraped: 1,
      businesses: [business],
      storedInDb: stored ? 1 : 0,
    }
  });
}

// ════════════════════════════════════════════
//  Core: scrape a business homepage + /contact/
// ════════════════════════════════════════════
async function scrapeBusinessFromUrl(firecrawl, url, region, fallbackDescription = '') {
  // Scrape homepage
  let homepage;
  try {
    homepage = await firecrawl.scrape(url, { formats: ['markdown'] });
  } catch (err) {
    console.error(`  Homepage scrape failed for ${url}: ${err.message}`);
    return null;
  }

  const homeMarkdown = homepage?.markdown || '';
  const homeMeta = homepage?.metadata || {};

  // Extract business name from metadata (og:title or <title>)
  let name = extractBusinessName(homeMeta, url);
  if (!name || name.length < 3) return null;

  // Extract description from meta description or og:description
  const description = homeMeta.description || homeMeta.ogDescription || fallbackDescription || '';

  // Extract contacts from homepage
  let emails = extractEmails(homeMarkdown);
  let phones = extractPhones(homeMarkdown);

  // Also try scraping /contact/ page for email and phone
  const contactUrl = buildContactUrl(url);
  if (contactUrl) {
    try {
      console.log(`  Scraping contact page: ${contactUrl}`);
      const contactPage = await firecrawl.scrape(contactUrl, { formats: ['markdown'] });
      if (contactPage?.markdown) {
        const contactEmails = extractEmails(contactPage.markdown);
        const contactPhones = extractPhones(contactPage.markdown);
        emails = [...new Set([...emails, ...contactEmails])];
        phones = [...new Set([...phones, ...contactPhones])];
      }
    } catch {
      // Contact page doesn't exist or failed — that's fine
    }
  }

  // Filter out noreply / system emails
  const validEmails = emails.filter(e =>
    !e.includes('noreply') && !e.includes('no-reply') &&
    !e.includes('example.com') && !e.includes('wixpress') &&
    !e.includes('sentry') && !e.endsWith('.png') && !e.endsWith('.jpg')
  );

  // Extract social media links
  const socialMedia = extractSocialLinks(homeMarkdown);

  // Build confidence score
  let confidence = 50;
  if (validEmails.length > 0) confidence += 15;
  if (phones.length > 0) confidence += 10;
  if (description.length > 30) confidence += 10;
  if (socialMedia && Object.keys(socialMedia).length > 0) confidence += 5;
  if (homeMeta.ogTitle || homeMeta.title) confidence += 10;

  return makeBusiness({
    name,
    website: url,
    description: description.slice(0, 500),
    email: validEmails[0] || '',
    phone: phones[0] || '',
    region,
    confidence: Math.min(confidence, 95),
    notes: `Scraped from homepage + /contact/`,
    socialMedia,
  });
}

// ════════════════════════════════════════════
//  Helpers
// ════════════════════════════════════════════

/** Clean a page title for display in search results */
function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*[|\-–—:]\s*(home|homepage|welcome|about|about us|contact|our team|meet the team|services).*$/i, '')
    .replace(/\s*[|\-–—:]\s*$/i, '')
    .trim();
}

/** Extract a clean business name from page metadata */
function extractBusinessName(meta, url) {
  // Priority: og:title > title > site_name > domain
  let raw = meta.ogTitle || meta.title || meta.siteName || '';

  // Clean common suffixes: "Business Name | Home", "Business Name - About Us", etc.
  raw = raw
    .replace(/\s*[|\-–—:]\s*(home|homepage|welcome|about|about us|contact|our team|meet the team|services).*$/i, '')
    .replace(/\s*[|\-–—:]\s*$/i, '')
    .trim();

  // If still too long or looks like a tagline, take the first segment
  if (raw.length > 60) {
    const parts = raw.split(/\s*[|\-–—]\s*/);
    raw = parts[0].trim();
  }

  // Fallback to domain name
  if (!raw || raw.length < 3) {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      raw = hostname.split('.')[0].replace(/-/g, ' ');
      raw = raw.charAt(0).toUpperCase() + raw.slice(1);
    } catch {
      return null;
    }
  }

  return raw;
}

/** Extract email addresses from text, filtering out image/file references */
function extractEmails(text) {
  if (!text) return [];
  const pattern = /[\w.-]+@[\w.-]+\.\w{2,}/g;
  const found = text.match(pattern) || [];
  return [...new Set(found)].filter(e => {
    const lower = e.toLowerCase();
    return !MEDIA_EXTENSIONS.some(ext => lower.endsWith(ext)) &&
      !lower.includes('example.com') &&
      !lower.includes('sentry.io') &&
      !lower.includes('wixpress.com');
  });
}

/** Extract phone numbers from text */
function extractPhones(text) {
  if (!text) return [];
  const pattern = /(?:\+\d{1,3}[\s-]?)?\(?\d{1,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{0,4}/g;
  const found = text.match(pattern) || [];
  return [...new Set(found.filter(p => {
    const digits = p.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }))];
}

/** Extract social media links from markdown */
function extractSocialLinks(markdown) {
  if (!markdown) return {};
  const social = {};
  const patterns = {
    facebook: /https?:\/\/(?:www\.)?facebook\.com\/[\w.-]+/gi,
    instagram: /https?:\/\/(?:www\.)?instagram\.com\/[\w.-]+/gi,
    linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[\w.-]+/gi,
    twitter: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[\w.-]+/gi,
    youtube: /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/)[\w.-]+/gi,
    tiktok: /https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+/gi,
  };
  for (const [platform, regex] of Object.entries(patterns)) {
    const match = markdown.match(regex);
    if (match) social[platform] = match[0];
  }
  return social;
}

/** Check if a URL looks like an actual business website (not a directory/social/gov site) */
function isBusinessUrl(url) {
  const lower = url.toLowerCase();
  return !SKIP_DOMAINS.some(d => lower.includes(d));
}

/** Normalize a deep URL to the homepage (e.g. /about → /) */
function normalizeToHomepage(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return url;
  }
}

/** Extract the domain from a URL */
function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return null;
  }
}

/** Build a /contact/ URL from a homepage URL */
function buildContactUrl(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}/contact`;
  } catch {
    return null;
  }
}

/** Store a business in Supabase */
async function storeBusiness(business, region) {
  try {
    const { error } = await supabase
      .from('discovered_businesses')
      .insert({
        name: business.name,
        email: business.email || null,
        phone: business.phone || null,
        website: business.website || null,
        category: business.category || 'Other',
        region: business.region || region,
        city: business.city || null,
        description: business.description || null,
        confidence: business.confidence || 50,
        status: 'pending',
        notes: business.notes || null,
        tags: business.tags || [],
        social_media: business.socialMedia || {},
        source_url: business.website || null,
        metadata: { discoveredAt: new Date().toISOString() }
      });

    if (error) {
      console.error(`  DB insert error for "${business.name}": ${error.message}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`  DB storage failed for "${business.name}": ${err.message}`);
    return false;
  }
}

/** Create a business object */
function makeBusiness({ name, website, description, email, phone, region, confidence, notes, socialMedia }) {
  return {
    id: `biz-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name,
    website: website || '',
    email: email || '',
    phone: phone || '',
    category: 'Other',
    region: region || 'Unknown',
    city: '',
    description: description || '',
    confidence: confidence || 50,
    discovered: new Date().toISOString().split('T')[0],
    status: 'pending',
    editedBy: null,
    editedAt: null,
    notes: notes || '',
    tags: [region?.toLowerCase().replace(/\s+/g, '-') || 'pacific'],
    socialMedia: socialMedia || {}
  };
}
