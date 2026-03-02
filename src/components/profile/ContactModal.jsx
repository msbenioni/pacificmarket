import { useState } from "react";
import { X, Mail, Phone, CheckCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">
          <h3 className="text-lg font-bold text-[#0a1628] mb-1">Contact {business.name}</h3>

          {!submitted ? (
            <>
              <p className="text-sm text-gray-500 mb-5">
                Enter your email address to reveal this business's contact details.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Your Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                  />
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0d4f4f] hover:bg-[#0a3d3d] text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  Show Contact Details
                </button>
              </form>
            </>
          ) : (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-green-600 mb-5">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Contact details unlocked</span>
              </div>
              <div className="space-y-3">
                {business.contact_email && (
                  <a
                    href={`mailto:${business.contact_email}`}
                    className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#0d4f4f]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-[#0a1628]">{business.contact_email}</p>
                    </div>
                  </a>
                )}
                {business.contact_phone && (
                  <a
                    href={`tel:${business.contact_phone}`}
                    className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#0d4f4f]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-[#0a1628]">{business.contact_phone}</p>
                    </div>
                  </a>
                )}
                {!business.contact_email && !business.contact_phone && (
                  <p className="text-sm text-gray-400 text-center py-4">No contact details listed yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}