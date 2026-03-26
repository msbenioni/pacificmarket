# Cache Clearing Instructions

If you're experiencing module loading issues after the flag consolidation:

## 1. Clear Next.js Cache (Already Done)
✅ Removed `.next` directory

## 2. Clear Browser Cache
- **Chrome**: Ctrl+Shift+Delete → Select "Cached images and files" → Clear data
- **Firefox**: Ctrl+Shift+Delete → Select "Cache" → Clear data
- **Or**: Hard refresh with Ctrl+F5

## 3. Clear Service Workers (if any)
- Open Developer Tools (F12)
- Go to Application tab → Service Workers
- Click "Unregister" for any active service workers
- Refresh the page

## 4. Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 5. If Issues Persist
- Close all browser tabs
- Open a new browser window
- Navigate to the application

The module factory error should be resolved after these steps.
