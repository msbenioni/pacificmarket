import { Eye, Users, Keyboard, MousePointer } from "lucide-react";
import HeroStandard from "../components/shared/HeroStandard";

export default function Accessibility() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroStandard
        badge="Legal"
        title="Accessibility"
        subtitle=""
        description="Our commitment to making Pacific Market accessible to everyone."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Our Accessibility Commitment</h2>
              <p className="text-gray-600 mb-6">
                Pacific Market is committed to ensuring digital accessibility for people with disabilities. 
                We strive to continually improve the user experience for everyone and apply the relevant 
                accessibility standards.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Accessibility Standards</h2>
              <p className="text-gray-600 mb-6">
                We aim to comply with the following accessibility standards:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines</li>
                <li><strong>Section 508:</strong> US federal accessibility requirements</li>
                <li><strong>EN 301 549:</strong> European accessibility requirements</li>
                <li><strong>ADA Compliance:</strong> Americans with Disabilities Act</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Accessibility Features</h2>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Visual Accessibility</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>High contrast color combinations with sufficient color contrast ratios</li>
                <li>Scalable text that can be enlarged up to 200% without loss of functionality</li>
                <li>Clear, readable fonts with appropriate sizing and spacing</li>
                <li>Consistent navigation and layout patterns</li>
                <li>Alternative text for all meaningful images</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Keyboard Accessibility</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Full keyboard navigation for all interactive elements</li>
                <li>Visible focus indicators for keyboard users</li>
                <li>Logical tab order following the visual layout</li>
                <li>Keyboard shortcuts for common actions</li>
                <li>No keyboard traps that prevent navigation</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Screen Reader Support</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Semantic HTML structure for proper content hierarchy</li>
                <li>ARIA labels and landmarks for better navigation</li>
                <li>Descriptive link text and button labels</li>
                <li>Form labels and error messages that are screen reader friendly</li>
                <li>Skip links to bypass navigation and go directly to content</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Cognitive Accessibility</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Clear, simple language and instructions</li>
                <li>Consistent terminology and navigation patterns</li>
                <li>Error prevention and clear error messages</li>
                <li>Sufficient time to complete tasks</li>
                <li>Help and support information readily available</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">How to Use Our Site Accessibly</h2>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Keyboard Navigation</h3>
              <p className="text-gray-600 mb-4">Use these keyboard shortcuts to navigate our site:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> - Move to next interactive element</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Tab</kbd> - Move to previous element</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> - Activate buttons and links</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> - Close modals and dropdowns</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Alt + M</kbd> - Jump to main content (skip navigation)</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Screen Readers</h3>
              <p className="text-gray-600 mb-6">
                Our site is optimized for popular screen readers including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>NVDA, JAWS, and VoiceOver for desktop</li>
                <li>TalkBack and Voice Assistant for mobile</li>
                <li>Built-in screen readers in modern browsers</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Browser Accessibility Tools</h3>
              <p className="text-gray-600 mb-6">
                Most browsers include built-in accessibility features:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Zoom controls (Ctrl + Plus/Minus or Cmd + Plus/Minus)</li>
                <li>High contrast modes and color adjustments</li>
                <li>Reading modes and text-to-speech</li>
                <li>Custom font sizes and styles</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Known Accessibility Issues</h2>
              <p className="text-gray-600 mb-6">
                We are continuously working to improve accessibility. Currently, we are aware of and addressing:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Some third-party integrations may have limited accessibility</li>
                <li>Certain dynamic content updates may not be announced to screen readers</li>
                <li>Complex forms may benefit from additional guidance</li>
                <li>Video content may need improved captioning</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Testing and Feedback</h2>
              <p className="text-gray-600 mb-6">
                We regularly test our site for accessibility using:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Automated accessibility testing tools</li>
                <li>Manual testing with keyboard and screen readers</li>
                <li>User testing with people with disabilities</li>
                <li>Accessibility audits and expert reviews</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Ongoing Improvements</h2>
              <p className="text-gray-600 mb-6">
                Our accessibility commitment includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Regular accessibility training for our development team</li>
                <li>Incorporating accessibility into our design and development processes</li>
                <li>Monitoring new accessibility standards and best practices</li>
                <li>Engaging with the accessibility community for feedback</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Contact Us About Accessibility</h2>
              <p className="text-gray-600 mb-6">
                If you encounter accessibility barriers or have suggestions for improvement, please 
                <a href="/Contact" className="text-[#0d4f4f] hover:underline"> contact us</a>. We welcome feedback 
                and will respond to accessibility concerns within 5 business days.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Third-Party Content</h2>
              <p className="text-gray-600 mb-6">
                Our site may include content from third-party providers. While we strive to ensure all 
                content is accessible, some external resources may have limitations. We are working with 
                our partners to improve accessibility across all integrated services.
              </p>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">
                  <strong>Last updated:</strong> March 2026
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Next review scheduled:</strong> September 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
