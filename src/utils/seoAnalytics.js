// SEO monitoring and analytics utilities

export const seoMetrics = {
  // Google Search Console metrics to track
  searchConsole: {
    totalClicks: 'Total clicks from search',
    totalImpressions: 'Total search impressions',
    averageCtr: 'Average click-through rate',
    averagePosition: 'Average search position',
    queries: 'Top performing queries',
    pages: 'Top performing pages',
    countries: 'Traffic by country',
    devices: 'Traffic by device'
  },
  
  // Google Analytics metrics
  analytics: {
    organicTraffic: 'Organic search traffic',
    bounceRate: 'Bounce rate for organic traffic',
    sessionDuration: 'Average session duration',
    pagesPerSession: 'Pages per session',
    conversionRate: 'Goal conversion rate',
    topLandingPages: 'Top organic landing pages',
    exitPages: 'Pages where users exit'
  },
  
  // Custom business metrics
  businessMetrics: {
    businessViews: 'Business profile views',
    businessInquiries: 'Business contact inquiries',
    newListings: 'New business listings',
    claimedBusinesses: 'Businesses claimed by owners',
    reviewCount: 'Customer reviews submitted',
    searchQueries: 'Internal search queries'
  }
};

// SEO performance tracking
export const trackSEOEvent = (eventName, properties) => {
  // Track SEO-related events
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'SEO',
      ...properties
    });
  }
};

// Keyword tracking
export const keywordTracking = {
  primary: [
    'Pacific businesses',
    'Pacific Island businesses',
    'Pacific business directory',
    'Aotearoa businesses',
    'Pacific entrepreneurs',
    'Island business directory'
  ],
  
  secondary: [
    'Samoa businesses',
    'Fiji businesses',
    'Tonga businesses',
    'Pacific business network',
    'Pacific marketplace',
    'Island entrepreneurs',
    'Pacific business listings'
  ],
  
  longTail: [
    'how to start business in Pacific Islands',
    'Pacific Island business directory',
    'find Pacific businesses online',
    'Pacific business success stories',
    'support Pacific Island businesses'
  ]
};

// Competitor monitoring
export const competitors = [
  {
    name: 'Pacific Business Directory',
    domain: 'pacificbusinessdirectory.com',
    strengths: ['Established brand', 'Large database'],
    weaknesses: ['Outdated design', 'Poor mobile experience']
  },
  {
    name: 'Island Business Hub',
    domain: 'islandbusinesshub.com', 
    strengths: ['Modern UI', 'Good social presence'],
    weaknesses: ['Limited coverage', 'Fewer categories']
  }
];
