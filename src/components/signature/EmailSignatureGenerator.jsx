"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Linkedin, 
  Facebook, 
  Instagram,
  Download,
  Copy,
  Eye,
  Palette,
  Settings
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SIGNATURE_TEMPLATES = {
  modern: {
    name: "Modern",
    description: "Clean and contemporary design",
    colors: {
      primary: "#0a1628",
      secondary: "#0d4f4f", 
      accent: "#00c4cc"
    }
  },
  pacific: {
    name: "Pacific",
    description: "Inspired by Pacific heritage",
    colors: {
      primary: "#0a1628",
      secondary: "#c9a84c",
      accent: "#00c4cc"
    }
  },
  minimal: {
    name: "Minimal",
    description: "Simple and elegant",
    colors: {
      primary: "#333333",
      secondary: "#666666",
      accent: "#0d4f4f"
    }
  }
};

export default function EmailSignatureGenerator({ businessId, userId }) {
  const [business, setBusiness] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [signatureData, setSignatureData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    includeLogo: true,
    includeBadge: true
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [businessId, userId]);

  const loadData = async () => {
    try {
      // Load business data
      if (businessId) {
        const { data: businessData } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();
        
        if (businessData) {
          setBusiness(businessData);
          setSignatureData(prev => ({
            ...prev,
            name: businessData.contact_name || '',
            email: businessData.contact_email || '',
            phone: businessData.contact_phone || '',
            website: businessData.contact_website || '',
            address: formatAddress(businessData)
          }));
        }
      }

      // Load user data
      if (userId) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (business) => {
    const parts = [];
    if (business.address) parts.push(business.address);
    if (business.suburb) parts.push(business.suburb);
    if (business.city) parts.push(business.city);
    if (business.state_region) parts.push(business.state_region);
    if (business.country) parts.push(business.country);
    return parts.join(', ');
  };

  const generateSignatureHTML = () => {
    const template = SIGNATURE_TEMPLATES[selectedTemplate];
    const colors = template.colors;

    const socialLinks = [];
    if (signatureData.linkedin) socialLinks.push({ icon: 'linkedin', url: signatureData.linkedin });
    if (signatureData.facebook) socialLinks.push({ icon: 'facebook', url: signatureData.facebook });
    if (signatureData.instagram) socialLinks.push({ icon: 'instagram', url: signatureData.instagram });

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0; padding: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            ${signatureData.includeLogo && business?.logo_url ? `
              <td style="vertical-align: top; padding-right: 20px;">
                <img src="${business.logo_url}" alt="${business.name}" style="width: 80px; height: auto; max-height: 80px; object-fit: contain;" />
              </td>
            ` : ''}
            <td style="vertical-align: top;">
              <div style="margin-bottom: 15px;">
                <h2 style="margin: 0; color: ${colors.primary}; font-size: 18px; font-weight: bold;">
                  ${signatureData.name || 'Your Name'}
                </h2>
                ${signatureData.title ? `
                  <p style="margin: 2px 0; color: ${colors.secondary}; font-size: 14px;">
                    ${signatureData.title}
                  </p>
                ` : ''}
                ${business ? `
                  <p style="margin: 2px 0; color: ${colors.secondary}; font-size: 14px; font-weight: 500;">
                    ${business.name}
                  </p>
                ` : ''}
              </div>
              
              <div style="margin-bottom: 15px;">
                ${signatureData.email ? `
                  <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                    <span style="color: ${colors.accent};">📧</span> 
                    <a href="mailto:${signatureData.email}" style="color: ${colors.primary}; text-decoration: none;">${signatureData.email}</a>
                  </div>
                ` : ''}
                ${signatureData.phone ? `
                  <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                    <span style="color: ${colors.accent};">📱</span> 
                    <a href="tel:${signatureData.phone}" style="color: ${colors.primary}; text-decoration: none;">${signatureData.phone}</a>
                  </div>
                ` : ''}
                ${signatureData.website ? `
                  <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                    <span style="color: ${colors.accent};">🌐</span> 
                    <a href="${signatureData.website}" style="color: ${colors.primary}; text-decoration: none;" target="_blank">${signatureData.website}</a>
                  </div>
                ` : ''}
                ${signatureData.address ? `
                  <div style="margin: 3px 0; color: ${colors.primary}; font-size: 13px;">
                    <span style="color: ${colors.accent};">📍</span> 
                    ${signatureData.address}
                  </div>
                ` : ''}
              </div>
              
              ${socialLinks.length > 0 ? `
                <div style="margin-top: 10px;">
                  ${socialLinks.map(link => `
                    <a href="${link.url}" style="display: inline-block; margin-right: 8px; width: 20px; height: 20px;" target="_blank">
                      ${link.icon === 'linkedin' ? '💼' : link.icon === 'facebook' ? '📘' : '📷'}
                    </a>
                  `).join('')}
                </div>
              ` : ''}
              
              ${signatureData.includeBadge ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                  <div style="display: inline-block; background: ${colors.accent}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 10px; font-weight: bold;">
                    PACIFIC MARKET VERIFIED
                  </div>
                  <div style="margin-top: 5px; font-size: 10px; color: #666;">
                    <a href="https://pacificmarket.com" style="color: #666; text-decoration: none;" target="_blank">
                      Listed on Pacific Market
                    </a>
                  </div>
                </div>
              ` : ''}
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const copyToClipboard = async () => {
    const html = generateSignatureHTML();
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadHTML = () => {
    const html = generateSignatureHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${business?.name || 'email-signature'}-${selectedTemplate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPlainText = () => {
    const template = SIGNATURE_TEMPLATES[selectedTemplate];
    let text = `${signatureData.name || 'Your Name'}\n`;
    if (signatureData.title) text += `${signatureData.title}\n`;
    if (business) text += `${business.name}\n`;
    text += '\n';
    if (signatureData.email) text += `📧 ${signatureData.email}\n`;
    if (signatureData.phone) text += `📱 ${signatureData.phone}\n`;
    if (signatureData.website) text += `🌐 ${signatureData.website}\n`;
    if (signatureData.address) text += `📍 ${signatureData.address}\n`;
    if (signatureData.includeBadge) {
      text += '\nPACIFIC MARKET VERIFIED\n';
      text += 'Listed on https://pacificmarket.com\n';
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${business?.name || 'email-signature'}-${selectedTemplate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4f4f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_18px_50px_rgba(10,22,40,0.08)]">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-[#00c4cc]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a1628] mb-2">
                Email Signature Generator
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Create a professional email signature for your business. Choose from templates and download in multiple formats.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration */}
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <h3 className="text-lg font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Choose Template
                </h3>
                <div className="grid gap-3">
                  {Object.entries(SIGNATURE_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTemplate === key
                          ? 'border-[#0d4f4f] bg-[#0d4f4f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-[#0a1628]">{template.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Details */}
              <div>
                <h3 className="text-lg font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Signature Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={signatureData.name}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={signatureData.title}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                      placeholder="Managing Director"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={signatureData.email}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                        placeholder="john@business.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={signatureData.phone}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                        placeholder="+64 21 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={signatureData.website}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                      placeholder="https://business.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={signatureData.address}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                      placeholder="123 Queen St, Auckland, New Zealand"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                      <input
                        type="url"
                        value={signatureData.linkedin}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                      <input
                        type="url"
                        value={signatureData.facebook}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, facebook: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                      <input
                        type="url"
                        value={signatureData.instagram}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, instagram: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d4f4f]"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={signatureData.includeLogo}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, includeLogo: e.target.checked }))}
                        className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                      />
                      <span className="text-sm text-gray-700">Include business logo</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={signatureData.includeBadge}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, includeBadge: e.target.checked }))}
                        className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                      />
                      <span className="text-sm text-gray-700">Include Pacific Market badge</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview
                </h3>
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }} />
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Export Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy HTML'}
                  </button>
                  
                  <button
                    onClick={downloadHTML}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download HTML
                  </button>
                  
                  <button
                    onClick={downloadPlainText}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Text
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
