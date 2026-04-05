import Firecrawl from '@mendable/firecrawl-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('=== FIRECRAWL SEARCH TEST ===');

    if (!process.env.FIRECRAWL_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'No FIRECRAWL_API_KEY'
      });
    }

    const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

    // Test with a single scrape (1 credit)
    const testUrl = 'https://www.pacificbusiness.co.nz';
    console.log(`Testing scrape on: ${testUrl}`);

    const response = await firecrawl.scrape(testUrl, {
      formats: ['markdown']
    });

    console.log('Response type:', typeof response);
    console.log('Response keys:', response ? Object.keys(response) : 'null');
    console.log('Response.success:', response?.success);
    console.log('Markdown length:', response?.markdown?.length || 0);
    console.log('Metadata:', response?.metadata ? Object.keys(response.metadata) : 'none');

    return NextResponse.json({
      success: true,
      data: {
        url: testUrl,
        responseKeys: response ? Object.keys(response) : [],
        scrapeSuccess: response?.success,
        markdownLength: response?.markdown?.length || 0,
        markdownPreview: response?.markdown?.substring(0, 500) || '',
        title: response?.metadata?.title || '',
        description: response?.metadata?.description || '',
        creditsUsed: 1
      }
    });

  } catch (error) {
    console.error('=== SEARCH TEST ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);

    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
