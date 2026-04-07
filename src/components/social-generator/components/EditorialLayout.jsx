import PdnBrandHeader from './PdnBrandHeader';

/**
 * Shared editorial layout system for slides 2-4
 * Provides consistent micro-labels, branding, and spacing
 */
export default function EditorialLayout({
  children,
  microLabel,
  format = 'square',
  theme = 'clean',
  showFooter = false,
  footerContent = null,
  className = '',
}) {
  const _isPortrait = format === 'portrait';
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Top micro-label area */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-8 py-4">
          {microLabel && (
            <div className="text-xs font-semibold tracking-wider uppercase opacity-70">
              {microLabel}
            </div>
          )}
          <PdnBrandHeader format={format} theme={theme} />
        </div>
      </div>

      {/* Main content area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {children}
      </div>

      {/* Optional footer area */}
      {showFooter && footerContent && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="px-8 py-4">
            {footerContent}
          </div>
        </div>
      )}
    </div>
  );
}
