import html2canvas from 'html2canvas';

/**
 * Export a DOM element as a PNG image download
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - The download filename (without extension)
 * @param {object} options - Optional overrides for html2canvas
 * @returns {Promise<string>} The data URL of the generated image
 */
export async function exportToPng(element, filename = 'spotlight', options = {}) {
  if (!element) throw new Error('No element provided for export');

  const canvas = await html2canvas(element, {
    scale: 2, // 2x for crisp output
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    ...options,
  });

  const dataUrl = canvas.toDataURL('image/png');

  // Trigger download
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}
