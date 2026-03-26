# 🔧 AGGRESSIVE CACHE CLEARING INSTRUCTIONS

The browser is still referencing the deleted `IdentityFlagRow.jsx` file. Follow these steps exactly:

## 1. Stop Development Server
```bash
# Press Ctrl+C in your terminal to stop the current dev server
```

## 2. Clear All Caches
```bash
# Clear Next.js cache
Remove-Item -Path ".next" -Recurse -Force

# Clear Node modules cache (if needed)
# Remove-Item -Path "node_modules\.cache" -Recurse -Force
```

## 3. Clear Browser Cache (Chrome)
1. **Open Developer Tools**: F12
2. **Go to Application tab**
3. **Storage section → Clear storage**
4. **Check all boxes** (Cache storage, Local storage, Session storage, etc.)
5. **Click "Clear site data"**

## 4. Clear Browser Cache (Firefox)
1. **Open Developer Tools**: F12
2. **Go to Storage tab**
3. **Clear site data**
4. **Check all boxes**
5. **Click "Clear"

## 5. Clear Service Workers
1. **Open Developer Tools**: F12
2. **Go to Application tab → Service Workers**
3. **Click "Unregister" for any workers**
4. **Clear "Unregister"**

## 6. Hard Refresh Browser
- **Chrome**: Ctrl+Shift+R
- **Firefox**: Ctrl+Shift+R
- **Edge**: Ctrl+Shift+R

## 7. Restart Development Server
```bash
npm run dev
```

## 8. If Still Issues
- **Close all browser tabs**
- **Open new browser window**
- **Navigate to application**
- **Check for any remaining errors**

## ⚠️ Important
- Don't skip any step
- Clear ALL browser data, not just cache
- Restart browser completely if needed

This should resolve the module factory error for the deleted IdentityFlagRow.jsx file.
