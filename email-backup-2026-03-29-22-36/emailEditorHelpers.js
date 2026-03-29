/**
 * Email Editor Helper Functions
 * Unified insertion logic for images and templates in email campaign editor
 */

/**
 * Insert HTML into raw email content with placement strategy
 */
export function insertIntoRawHtml(currentHtml, html, placement = 'append') {
  if (!currentHtml) return html;
  
  switch (placement) {
    case 'prepend':
      // Insert after <body> tag
      const bodyMatch = currentHtml.match(/<body[^>]*>/i);
      if (bodyMatch) {
        return currentHtml.replace(bodyMatch[0], bodyMatch[0] + html);
      }
      return html + currentHtml;
      
    case 'append':
      // Insert before </body> tag or at end
      const closingBodyMatch = currentHtml.match(/<\/body>/i);
      if (closingBodyMatch) {
        return currentHtml.replace(closingBodyMatch[0], html + closingBodyMatch[0]);
      }
      return currentHtml + html;
      
    case 'insert-body-content':
      // Insert into email body content slot
      const bodySlotMatch = currentHtml.match(/<!-- email-body-slot -->/);
      if (bodySlotMatch) {
        return currentHtml.replace(bodySlotMatch[0], html + '\n' + bodySlotMatch[0]);
      }
      // Fallback to append
      return insertIntoRawHtml(currentHtml, html, 'append');
      
    case 'insert-after-greeting':
      // Insert after "Hello {{first_name}}" heading
      const greetingMatch = currentHtml.match(/(<h1[^>]*>.*?Hello\s*\{\{first_name\}\}.*?<\/h1>)/is);
      if (greetingMatch) {
        return currentHtml.replace(greetingMatch[0], greetingMatch[0] + '\n' + html);
      }
      // Fallback to body-content insertion
      return insertIntoRawHtml(currentHtml, html, 'insert-body-content');
      
    case 'replace-header':
      return replaceOrInsertTemplate(currentHtml, html, 'email-header');
      
    case 'replace-signature':
      return replaceOrInsertTemplate(currentHtml, html, 'email-signature');
      
    case 'replace-logo':
      return replaceOrInsertTemplate(currentHtml, html, 'email-logo');
      
    default:
      return currentHtml + html;
  }
}

/**
 * Replace existing template or insert new one
 */
function replaceOrInsertTemplate(currentHtml, templateHtml, templateId) {
  const startMarker = `<!-- ${templateId}:start -->`;
  const endMarker = `<!-- ${templateId}:end -->`;
  
  const startIndex = currentHtml.indexOf(startMarker);
  const endIndex = currentHtml.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    // Replace existing template
    const before = currentHtml.substring(0, startIndex);
    const after = currentHtml.substring(endIndex + endMarker.length);
    return before + templateHtml + after;
  } else {
    // Insert new template at appropriate slot
    const slotMarker = `<!-- ${templateId}-slot -->`;
    const slotIndex = currentHtml.indexOf(slotMarker);
    
    if (slotIndex !== -1) {
      // Replace slot marker with template
      return currentHtml.replace(slotMarker, templateHtml);
    } else {
      // Fallback to body placement
      if (templateId === 'email-header') {
        return insertIntoRawHtml(currentHtml, templateHtml, 'prepend');
      } else if (templateId === 'email-signature') {
        return insertIntoRawHtml(currentHtml, templateHtml, 'append');
      } else {
        return insertIntoRawHtml(currentHtml, templateHtml, 'append');
      }
    }
  }
}

/**
 * Insert HTML into iframe editor (cursor-based for uploaded images only)
 */
export function insertIntoIframe(doc, html, placement = 'append') {
  if (!doc || !doc.body) return false;
  
  try {
    const selection = doc.getSelection();
    if (selection && selection.rangeCount > 0) {
      // Insert at cursor position using DocumentFragment
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Create DocumentFragment to preserve node order
      const fragment = doc.createDocumentFragment();
      const tempDiv = doc.createElement('div');
      tempDiv.innerHTML = html;
      
      // Move nodes into fragment
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      
      // Insert fragment at cursor
      range.insertNode(fragment);
      
      // Collapse cursor to end of inserted content
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      
      return true;
    } else {
      // No cursor - return false to force slot-aware fallback
      return false;
    }
  } catch (error) {
    console.error('[emailEditorHelpers] iframe insertion failed:', error);
    return false;
  }
}

/**
 * Create email-safe image wrapper
 */
export function createImageHtml(imageUrl, alt = 'Campaign image') {
  return `<!-- email-image:start -->
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
  <tr>
    <td style="text-align: center; padding: 10px 0;">
      <img src="${imageUrl}" alt="${alt}" style="max-width: 100%; height: auto; border: 0; display: block;" width="600" />
    </td>
  </tr>
</table>
<!-- email-image:end -->`;
}

/**
 * Sync iframe content back to HTML string
 */
export function syncIframeToHtml(iframe) {
  if (!iframe?.contentDocument?.body) return null;
  
  const doc = iframe.contentDocument;
  const html = `<!DOCTYPE html><html><head>${doc.head.innerHTML}</head><body>${doc.body.innerHTML}</body></html>`;
  return html;
}

/**
 * Remove iframe input listener
 */
export function removeIframeListener(iframe, handler) {
  if (!iframe?.contentDocument?.body || !handler) return;
  
  const doc = iframe.contentDocument;
  doc.body.removeEventListener('input', handler);
}
