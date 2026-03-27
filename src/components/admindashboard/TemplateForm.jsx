"use client";

import { useState, useEffect } from 'react';
import { FileText, X, Code } from 'lucide-react';

const TemplateForm = ({ 
  template, 
  onSave, 
  onCancel, 
  saving = false 
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    html_content: template?.html_content || ''
  });

  const [detectedVariables, setDetectedVariables] = useState([]);

  // Extract variables from HTML content
  useEffect(() => {
    const extractVariables = (html) => {
      const regex = /\{\{([^}]+)\}\}/g;
      const variables = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        const variable = match[1].trim();
        if (!variables.includes(variable)) {
          variables.push(variable);
        }
      }
      return variables;
    };

    setDetectedVariables(extractVariables(formData.html_content));
  }, [formData.html_content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()) {
      return;
    }

    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0a1628]">
                  {template ? 'Edit Template' : 'Create New Template'}
                </h3>
                <p className="text-sm text-gray-600">
                  {template ? 'Update template details' : 'Create a reusable email template'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Welcome Email, Monthly Newsletter"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Welcome to Pacific Discovery Network!"
              required
            />
          </div>

          {/* HTML Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Content (HTML)
            </label>
            <textarea
              value={formData.html_content}
              onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-64 font-mono text-sm"
              placeholder="<h1>Hello {{first_name}}</h1><p>Thank you for joining us!</p>"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {{variable_name}} for personalization (e.g., {{first_name}}, {{business_name}})
            </p>
          </div>

          {/* Detected Variables */}
          {detectedVariables.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-blue-800">Detected Variables</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {detectedVariables.map((variable) => (
                  <span
                    key={variable}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 font-mono"
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                These variables will be available when using this template in campaigns
              </p>
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
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {template ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    {template ? 'Update Template' : 'Create Template'}
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

export default TemplateForm;
