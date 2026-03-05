import { useState } from "react";
import { X, Mail, Phone, CheckCircle } from "lucide-react";
import { ModalWrapper, ModalHeader, ModalContent, ModalFooter, MODAL_SIZES } from "@/components/shared/ModalWrapper";

export default function ContactModal({ business, onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <ModalWrapper 
      isOpen={true} 
      onClose={onClose}
      className={MODAL_SIZES.md}
    >
      <ModalHeader 
        title={`Contact ${business.name}`}
        onClose={onClose}
      />
      
      <ModalContent>
        {!submitted ? (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Enter your email address to reveal this business's contact details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0d4f4f] text-white py-2 px-4 rounded-lg hover:bg-[#0a1628] transition-colors"
              >
                Reveal Contact Details
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact Details Revealed!</h4>
            <p className="text-sm text-gray-600 mb-4">
              Thank you for your interest. Here's how to contact {business.name}:
            </p>

            <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
              {business.contact_email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{business.contact_email}</span>
                </div>
              )}
              {business.contact_phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{business.contact_phone}</span>
                </div>
              )}
              {!business.contact_email && !business.contact_phone && (
                <p className="text-sm text-gray-400 text-center py-4">No contact details listed yet.</p>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </ModalWrapper>
  );
}