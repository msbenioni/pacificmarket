import { useState } from "react";
import { ArrowRight, Mail, Send, CheckCircle } from "lucide-react";
import HeroStandard from "../components/shared/HeroStandard";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
    consent: false,
    marketingConsent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // GDPR consent validation
    if (!formData.consent) {
      setError("Please consent to the processing of your personal data under GDPR.");
      setLoading(false);
      return;
    }

    // Send form submission
    try {
      const response = await fetch('/api/emails/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          inquiryType: formData.inquiryType,
          marketingConsent: formData.marketingConsent
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  if (submitted) {
    return (
      <div className="bg-[#f8f9fc] min-h-screen">
        <HeroStandard
          badge="Contact"
          title="Get in Touch"
          subtitle=""
          description="Reach out to the Pacific Discovery Network team for partnerships, research inquiries, or general questions."
        />

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#0d4f4f]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#0d4f4f]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Message Sent</h2>
              <p className="text-gray-600 mb-8">
                Thank you for reaching out! We'll get back to you within 2-3 business days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#122040] transition-all"
              >
                Send Another Message <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroStandard
        badge="Contact"
        title="Get in Touch"
        subtitle=""
        description="Reach out to the Pacific Discovery Network team for partnerships, research inquiries, or general questions."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)]">
                <div className="w-11 h-11 rounded-xl bg-[#0a1628] flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-[#00c4cc]" />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">Email Us</h3>
                <p className="text-sm text-gray-600 mb-3">
                  For general inquiries, partnerships, or research requests
                </p>
                <a href="mailto:contact@pacificmarket.com" className="text-sm font-semibold text-[#0d4f4f] hover:underline">
                  contact@pacificmarket.com
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)]">
                <h3 className="font-bold text-[#0a1628] mb-3">Response Times</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• General inquiries: 2-3 business days</p>
                  <p>• Partnership requests: 3-5 business days</p>
                  <p>• Research data requests: 5-7 business days</p>
                </div>
              </div>

              <div className="bg-[#eef0f5] border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-[#0a1628] mb-3">Office Hours</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Weekend: Closed</p>
                  <p className="text-xs mt-2">Times shown in NZST (UTC+12)</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
                <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Send us a message</h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="research">Research Data Request</option>
                      <option value="support">Technical Support</option>
                      <option value="media">Media & Press</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f] resize-none"
                      required
                    />
                  </div>

                  {/* GDPR Consent Section */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-[#0a1628] mb-3">Data Processing Consent (GDPR)</h4>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            className="mt-1 rounded"
                            required
                          />
                          <span className="text-sm text-gray-600">
                            I consent to the processing of my personal data for the purpose of responding to my inquiry. 
                            I understand that my data will be processed in accordance with the 
                            <a href="/Privacy" className="text-[#0d4f4f] hover:underline"> Privacy Policy</a> and that I have 
                            the right to withdraw this consent at any time.
                          </span>
                        </label>
                        
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="marketingConsent"
                            checked={formData.marketingConsent}
                            onChange={handleChange}
                            className="mt-1 rounded"
                          />
                          <span className="text-sm text-gray-600">
                            I agree to receive marketing communications and updates about Pacific Market. 
                            (Optional - you can unsubscribe at any time)
                          </span>
                        </label>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        <p>Your rights under GDPR:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Right to access your data</li>
                          <li>Right to rectification</li>
                          <li>Right to erasure ('right to be forgotten')</li>
                          <li>Right to data portability</li>
                          <li>Right to object to processing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#0a3d3d] text-white font-semibold px-8 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
