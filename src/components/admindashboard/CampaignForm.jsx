"use client";

import { useState, useEffect } from 'react';
import { Mail, Send, X, Users, Globe, CreditCard, MessageSquare } from 'lucide-react';
import { SUBSCRIPTION_TIER, COUNTRIES, LANGUAGES } from '@/constants/unifiedConstants';

const CampaignForm = ({ 
  campaign, 
  onSave, 
  onCancel, 
  saving = false,
  onTestEmail = null,
  testingEmail = false
}) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    html_content: campaign?.html_content || '',
    audience_type: campaign?.audience_type || 'all_businesses',
    audience_value: campaign?.audience_value || null,
    testEmail: ''
  });

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [loadingAudienceData, setLoadingAudienceData] = useState(false);

  // Load available languages and countries from actual business data
  useEffect(() => {
    const loadAudienceData = async () => {
      setLoadingAudienceData(true);
      try {
        // Get authentication token
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          console.error('No authentication token available');
          // Fallback to constants
          setAvailableLanguages(Object.keys(LANGUAGES));
          setAvailableCountries(Object.keys(COUNTRIES));
          return;
        }

        const response = await fetch('/api/admin/email/campaigns/audience-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setAvailableLanguages(data.languages || []);
          setAvailableCountries(data.countries || []);
        }
      } catch (error) {
        console.error('Failed to load audience data:', error);
        // Fallback to constants
        setAvailableLanguages(Object.keys(LANGUAGES));
        setAvailableCountries(Object.keys(COUNTRIES));
      } finally {
        setLoadingAudienceData(false);
      }
    };

    loadAudienceData();
  }, []);

  const [showTestSection, setShowTestSection] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()) {
      return;
    }

    // Prepare save data with new audience structure
    const saveData = {
      name: formData.name,
      subject: formData.subject,
      html_content: formData.html_content,
      audience_type: formData.audience_type,
      audience_value: formData.audience_value
    };

    // Exclude testEmail from save payload
    await onSave(saveData);
  };

  // Handle audience type change
  const handleAudienceTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      audience_type: newType,
      audience_value: newType === 'all_businesses' ? null : ''
    }));
  };

  const handleTestEmail = async () => {
    if (!formData.testEmail.trim() || !onTestEmail) return;
    await onTestEmail(formData.testEmail, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0d4f4f]/10 rounded-lg">
                <Mail className="w-5 h-5 text-[#0d4f4f]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0a1628]">
                  {campaign ? 'Edit Campaign' : 'Create New Campaign'}
                </h3>
                <p className="text-sm text-gray-600">
                  {campaign ? 'Update campaign details' : 'Set up a new email campaign'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
              placeholder="e.g., Monthly Newsletter, Product Launch"
              required
            />
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
              placeholder="e.g., Exciting Updates from Pacific Discovery Network"
              required
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            
            {/* Audience Type Selection */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Audience Type</label>
                <select
                  value={formData.audience_type}
                  onChange={(e) => handleAudienceTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
                >
                  <option value="all_businesses">All Businesses</option>
                  <option value="plan">By Subscription Plan</option>
                  <option value="language">By Language</option>
                  <option value="country">By Country</option>
                </select>
              </div>

              {/* Audience Value Selection */}
              {formData.audience_type === 'plan' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Subscription Plan</label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <select
                      value={formData.audience_value || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, audience_value: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
                      required
                    >
                      <option value="">Select a plan...</option>
                      <option value="vaka">Vaka Plan</option>
                      <option value="mana">Mana Plan</option>
                      <option value="moana">Moana Plan</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.audience_type === 'language' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    {loadingAudienceData ? (
                      <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-500">
                        Loading languages...
                      </div>
                    ) : (
                      <select
                        value={formData.audience_value || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, audience_value: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
                        required
                      >
                        <option value="">Select a language...</option>
                        {availableLanguages.map(lang => {
                          const langInfo = LANGUAGES.find(l => l.value === lang);
                          return (
                            <option key={lang} value={lang}>
                              {langInfo?.label || lang}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Businesses that speak this language
                  </p>
                </div>
              )}

              {formData.audience_type === 'country' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    {loadingAudienceData ? (
                      <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-500">
                        Loading countries...
                      </div>
                    ) : (
                      <select
                        value={formData.audience_value || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, audience_value: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
                        required
                      >
                        <option value="">Select a country...</option>
                        {availableCountries.map(country => {
                          const countryInfo = COUNTRIES.find(c => c.value === country);
                          return (
                            <option key={country} value={country}>
                              {countryInfo?.label || country}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Businesses based in this country
                  </p>
                </div>
              )}

              {formData.audience_type === 'all_businesses' && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">All Active Businesses</p>
                      <p className="text-xs text-gray-500">All businesses with active subscriptions</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HTML Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Content (HTML)
            </label>
            <textarea
              value={formData.html_content}
              onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent h-64 font-mono text-sm"
              placeholder="<h1>Hello {{first_name}}</h1><p>Your email content here...</p>"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {{variable_name}} for personalization (e.g., {{first_name}}, {{business_name}})
            </p>
          </div>

          {/* Test Email Section */}
          {onTestEmail && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">Test Email</h4>
                <button
                  type="button"
                  onClick={() => setShowTestSection(!showTestSection)}
                  className="text-sm text-[#0d4f4f] hover:text-[#1a6b6b]"
                >
                  {showTestSection ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showTestSection && (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={formData.testEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, testEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={!formData.testEmail.trim() || testingEmail}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {testingEmail ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Test Email'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || !formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()}
                className="px-6 py-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {campaign ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {campaign ? 'Update Campaign' : 'Create Campaign'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;
