// Performance monitoring utilities
export class PerformanceMonitor {
  static measurePageLoad(pageName) {
    if (typeof window === 'undefined') return;

    // Measure navigation timing
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const metrics = {
        page: pageName,
        timestamp: new Date().toISOString(),
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
        domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.navigationStart,
        fcp: this.getFCP(),
        lcp: this.getLCP(),
      };

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metrics for ${pageName}:`, metrics);
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        this.sendMetrics(metrics);
      }

      return metrics;
    }
  }

  static getFCP() {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? fcpEntry.startTime : null;
  }

  static getLCP() {
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
    return lcpEntry ? lcpEntry.startTime : null;
  }

  static sendMetrics(metrics) {
    // Send to your analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_performance', {
        page_name: metrics.page,
        total_load_time: metrics.total,
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        custom_parameter: {
          dns_time: metrics.dns,
          tcp_time: metrics.tcp,
          ttfb: metrics.ttfb,
        }
      });
    }
  }

  static measureComponentRender(componentName) {
    return (WrappedComponent) => {
      return function ComponentWithPerformance(props) {
        useEffect(() => {
          const startTime = performance.now();
          
          return () => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            if (process.env.NODE_ENV === 'development') {
              console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
            }
          };
        }, []);

        return WrappedComponent({ ...props });
      };
    };
  }
}

// Hook for measuring component performance
export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Measure page load on mount
  window.addEventListener('load', () => {
    setTimeout(() => {
      const pageName = window.location.pathname.replace(/\//g, '') || 'home';
      PerformanceMonitor.measurePageLoad(pageName);
    }, 0);
  });

  // Monitor Core Web Vitals
  if ('web-vitals' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}
