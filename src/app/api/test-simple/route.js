import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('=== SIMPLE TEST API CALLED ===');
    console.log('Timestamp:', new Date().toISOString());
    
    // Test basic functionality
    const testData = {
      message: 'Simple test successful',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasFirecrawlKey: !!process.env.FIRECRAWL_API_KEY,
        firecrawlKeyLength: process.env.FIRECRAWL_API_KEY?.length || 0
      }
    };
    
    console.log('Test data:', testData);
    console.log('=== SIMPLE TEST COMPLETE ===');
    
    return NextResponse.json({
      success: true,
      data: testData
    });
    
  } catch (error) {
    console.error('=== SIMPLE TEST ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('=== END ERROR ===');
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        stack: error.stack
      }
    }, { status: 500 });
  }
}
