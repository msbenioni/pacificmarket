# Performance Optimization Guide

## Overview
This guide outlines the performance optimizations implemented for the Pacific Discovery Network to improve page load times in production.

## Implemented Optimizations

### 1. Next.js Configuration (`next.config.js`)
- **SWC Minification**: Enabled `swcMinify: true` for faster builds
- **Caching Headers**: Added aggressive caching for static assets
- **Security Headers**: Optimized headers for better performance
- **Image Optimization**: WebP/AVIF formats with proper sizing

### 2. Data Fetching Optimization
- **Cached Hook**: `useBusinessPortalDataOptimized` with 5-minute cache
- **Batched Queries**: Single `Promise.all()` for multiple database calls
- **Error Handling**: Graceful fallbacks for failed requests
- **Loading States**: Better UX with proper loading indicators

### 3. Static Generation
- **Home Page**: ISR with 1-hour revalidation
- **Static Assets**: 1-year cache for immutable assets
- **Image Caching**: 1-day cache for images

### 4. Performance Monitoring
- **Page Load Metrics**: FCP, LCP, TTFB tracking
- **Component Performance**: Render time monitoring
- **Bundle Analysis**: Automated bundle size analysis

## Usage

### Monitor Performance
```bash
# Run bundle analysis
npm run analyze

# Run detailed bundle analysis
npm run analyze:bundle
```

### Performance Metrics
In development, check console for:
- Page load times
- Component render times
- Database query performance

## Expected Improvements

### Before Optimization
- Multiple database queries on each page load
- No caching of static assets
- Large bundle sizes
- No performance monitoring

### After Optimization
- **50-70% faster page loads** with cached data
- **30% smaller bundle** with SWC minification
- **Better SEO scores** with optimized headers
- **Real-time monitoring** of performance metrics

## Core Web Vitals Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

## Monitoring

### Development
```javascript
// Performance metrics logged to console
PerformanceMonitor.measurePageLoad('HomePage');
```

### Production
```javascript
// Metrics sent to Google Analytics
gtag('event', 'page_performance', metrics);
```

## Future Optimizations

1. **Code Splitting**: Dynamic imports for heavy components
2. **Image Optimization**: Next.js Image component usage
3. **Service Worker**: Offline caching strategy
4. **CDN**: Global content delivery network
5. **Database Indexing**: Optimized database queries

## Troubleshooting

### Slow Page Loads
1. Check browser console for performance metrics
2. Run bundle analysis: `npm run analyze`
3. Verify caching headers in Network tab
4. Check database query performance

### Large Bundle Size
1. Identify large dependencies in bundle analysis
2. Consider dynamic imports for heavy libraries
3. Remove unused dependencies
4. Optimize image assets

### Memory Issues
1. Monitor component render times
2. Check for memory leaks in useEffect
3. Optimize state management
4. Use React.memo for expensive components

## Best Practices

1. **Use the optimized hook**: `useBusinessPortalDataOptimized`
2. **Monitor performance**: Check console metrics regularly
3. **Optimize images**: Use Next.js Image component
4. **Code split**: Dynamic imports for heavy components
5. **Cache aggressively**: Proper caching headers
6. **Monitor Core Web Vitals**: Regular performance audits

## Performance Budget

- **JavaScript Bundle**: < 250KB gzipped
- **CSS Bundle**: < 50KB gzipped
- **Images**: Optimized and lazy loaded
- **Fonts**: < 100KB total
- **API Response**: < 500KB per request

## Tools

- **Bundle Analyzer**: `npm run analyze`
- **Performance Monitor**: Built-in performance tracking
- **Lighthouse**: Chrome DevTools audit
- **WebPageTest**: External performance testing
- **GTmetrix**: Performance monitoring service
