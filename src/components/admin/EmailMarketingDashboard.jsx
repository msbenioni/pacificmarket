"use client";

import { useState, useEffect } from "react";
import { Mail, Users, Send, BarChart3, FileText, Plus, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

export default function EmailMarketingDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    totalCampaigns: 0,
    totalSent: 0,
    avgOpenRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [audiencePreviews, setAudiencePreviews] = useState({});

  // Per-action loading states
  const [sendingCampaignId, setSendingCampaignId] = useState(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);
  const [updatingSubscriberId, setUpdatingSubscriberId] = useState(null);

  // Derived campaign filters
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const completedCampaigns = campaigns.filter(c => c.status === 'sent' || c.status === 'sent_with_errors');

  const tabs = [
    { id: "campaigns", label: "Campaigns", icon: Mail, category: "creation" },
    { id: "ready", label: "Ready to Send", icon: Send, category: "preparation" },
    { id: "sent", label: "Completed Campaigns", icon: CheckCircle, category: "results" },
    { id: "subscribers", label: "Subscribers", icon: Users, category: "audience" },
    { id: "templates", label: "Templates", icon: FileText, category: "creation" },
    { id: "analytics", label: "Analytics", icon: BarChart3, category: "insights" }
  ];

  const getAuthToken = async () => {
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  };

  // Load audience preview for a specific campaign
  const loadAudiencePreview = async (campaignId) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error('No authentication token available for audience preview');
        return null;
      }
      
      const response = await fetch(`/api/admin/email/campaigns/${campaignId}/audience-preview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch audience preview');
      }

      return data.audience_preview;
    } catch (error) {
      console.error('Audience preview error:', error);
      return null;
    }
  };

  // Load audience previews for draft campaigns
  useEffect(() => {
    let cancelled = false;

    const loadAllPreviews = async () => {
      // Clear all previews if no campaigns
      if (campaigns.length === 0) {
        setAudiencePreviews({});
        return;
      }

      const draftCampaigns = campaigns.filter(c => c.status === 'draft');
      
      if (draftCampaigns.length === 0) {
        // Clear previews if no draft campaigns
        setAudiencePreviews({});
        return;
      }
      
      // For correctness, refresh all draft previews (data may have changed)
      const results = await Promise.all(
        draftCampaigns.map(async (campaign) => {
          const preview = await loadAudiencePreview(campaign.id);
          return {
            id: campaign.id,
            preview
          };
        })
      );
      
      // Build new previews object (fresh data)
      const newPreviews = {};
      results.forEach(({ id, preview }) => {
        if (preview) {
          newPreviews[id] = preview;
        }
      });
      
      if (!cancelled) {
        setAudiencePreviews(newPreviews);
      }
    };
    
    if (campaigns.length > 0) {
      loadAllPreviews();
    }

    return () => {
      cancelled = true;
    };
  }, [campaigns]);

  const makeApiCall = async (endpoint, options = {}, token) => {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(`/api/admin/email/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'API request failed' }));
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  };

  const loadEmailData = async () => {
    try {
      setLoading(true);
      setError("");
      setPageError("");
      
      const token = await getAuthToken();
      if (!token) {
        setPageError("Authentication failed. Please log in again.");
        return;
      }

      // Load all data in parallel
      const [campaignsData, subscribersData, templatesData] = await Promise.all([
        makeApiCall('campaigns', {}, token),
        makeApiCall('subscribers', {}, token),
        makeApiCall('templates', {}, token)
      ]);

      setCampaigns(campaignsData.campaigns || []);
      setSubscribers(subscribersData.subscribers || []);
      setTemplates(templatesData.templates || []);

      // Calculate stats from real data
      const totalSent = campaignsData.campaigns?.reduce((sum, campaign) => 
        sum + (Number(campaign.recipients) || 0), 0) || 0;
      
      const totalOpens = campaignsData.campaigns?.reduce((sum, campaign) => 
        sum + (Number(campaign.opens) || 0), 0) || 0;
      
      const avgOpenRate = totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0;

      setStats({
        totalSubscribers: subscribersData.subscribers?.length || 0,
        totalCampaigns: campaignsData.campaigns?.length || 0,
        totalSent,
        avgOpenRate
      });

    } catch (error) {
      console.error('Error loading email data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load email data';
      setPageError(errorMessage || 'Failed to load email data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmailData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "sent_with_errors":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "sending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      sent: "bg-green-100 text-green-700 border-green-200",
      sent_with_errors: "bg-amber-100 text-amber-700 border-amber-200",
      draft: "bg-gray-100 text-gray-700 border-gray-200", 
      scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      sending: "bg-yellow-100 text-yellow-700 border-yellow-200"
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.draft}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      setError(""); // Clear previous action errors
      setDeletingCampaignId(campaignId);
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await fetch(`/api/admin/email/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete campaign');
      }

      // Reload data
      await loadEmailData();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete campaign';
      setError(errorMessage || 'Failed to delete campaign');
    } finally {
      setDeletingCampaignId(null);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      setError(""); // Clear previous action errors
      setDeletingTemplateId(templateId);
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await fetch(`/api/admin/email/templates`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete template');
      }

      // Reload data
      await loadEmailData();
    } catch (error) {
      console.error('Error deleting template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete template';
      setError(errorMessage || 'Failed to delete template');
    } finally {
      setDeletingTemplateId(null);
    }
  };

  const handleUpdateSubscriber = async (subscriberId, status) => {
    try {
      setError(""); // Clear previous action errors
      setUpdatingSubscriberId(subscriberId);
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await fetch(`/api/admin/email/subscribers`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriberId, status })
      });

      if (!response.ok) {
        throw new Error('Failed to update subscriber');
      }

      // Reload data
      await loadEmailData();
    } catch (error) {
      console.error('Error updating subscriber:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subscriber';
      setError(errorMessage || 'Failed to update subscriber');
    } finally {
      setUpdatingSubscriberId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4f4f]"></div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Failed to Load Dashboard</h3>
            <p className="text-red-600">{pageError}</p>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={loadEmailData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleQuickTest = async (campaignId) => {
    alert('Quick test feature coming soon!');
  };

  const handleSendCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to send this campaign? This will queue the campaign for background sending.')) {
      return;
    }

    try {
      setError(""); // Clear previous action errors
      setSendingCampaignId(campaignId);
      const token = await getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await fetch('/api/admin/email/queue-campaign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to queue campaign');
      }

      // Reload data
      await loadEmailData();
    } catch (error) {
      console.error('Error queuing campaign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to queue campaign';
      setError(errorMessage || 'Failed to queue campaign');
    } finally {
      setSendingCampaignId(null);
    }
  };

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0a1628]">Email Campaigns</h3>
        <button className="bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No campaigns yet. Create your first campaign to get started.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-[#0a1628]">{campaign.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 capitalize">{campaign.audience?.replace(/_/g, ' ') || 'N/A'}</td>
                    <td className="px-4 py-4">{getStatusBadge(campaign.status)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {campaign.recipients > 0 ? campaign.recipients.toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {campaign.recipients > 0 ? `${campaign.open_rate || 0}%` : '-'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          disabled={deletingCampaignId === campaign.id}
                          className="text-gray-400 hover:text-red-600 disabled:text-gray-300"
                        >
                          {deletingCampaignId === campaign.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReadyToSend = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0a1628]">Ready to Send</h3>
        <span className="text-sm text-gray-500">
          {draftCampaigns.length} campaigns ready to send
        </span>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Recipients</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {draftCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No draft campaigns are ready to send.
                  </td>
                </tr>
              ) : (
                draftCampaigns.map((campaign) => {
                  const preview = audiencePreviews[campaign.id];
                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-[#0a1628]">{campaign.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border-yellow-200">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          Ready to send
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {preview ? (
                          <div>
                            <div className="font-medium">{preview.estimated_recipients.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {preview.duplicates_removed > 0 && `(${preview.duplicates_removed} duplicates removed)`}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            <span>Loading...</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          Default
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleSendCampaign(campaign.id)}
                            disabled={sendingCampaignId === campaign.id || !audiencePreviews[campaign.id]}
                            className="bg-[#0d4f4f] hover:bg-[#1a6b6b] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            title={!audiencePreviews[campaign.id] ? "Loading audience preview..." : undefined}
                          >
                            {sendingCampaignId === campaign.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Queuing...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Queue Send
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => handleQuickTest(campaign.id)}
                            disabled
                            className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-3 py-2 rounded-lg text-sm flex items-center gap-2 cursor-not-allowed"
                            title="Quick test feature coming soon"
                          >
                            <Eye className="w-4 h-4" />
                            Test (Coming Soon)
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSentCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0a1628]">Completed Campaigns</h3>
        <span className="text-sm text-gray-500">
          {completedCampaigns.length} campaigns completed
        </span>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {completedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-[#0a1628]">{campaign.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {campaign.recipients || 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {campaign.recipients > 0 ? `${campaign.open_rate || 0}%` : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSubscribers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0a1628]">Email Subscribers ({subscribers.length})</h3>
        <div className="flex items-center gap-3">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>All Sources</option>
            <option>Business Signup</option>
            <option>Referral</option>
            <option>Manual Import</option>
          </select>
          <button className="bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Import Subscribers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">{subscribers.length}</div>
              <div className="text-sm text-gray-600">Total Subscribers</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">{subscribers.filter(s => s.status === 'subscribed').length}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">{subscribers.filter(s => s.source === 'referral').length}</div>
              <div className="text-sm text-gray-600">From Referrals</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">Coming Soon</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscriber</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No subscribers yet. Import your first subscribers or they will be added automatically when businesses sign up.
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-[#0a1628]">{subscriber.first_name}</div>
                        <div className="text-sm text-gray-500">{subscriber.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm text-gray-600">{subscriber.business_name}</div>
                        {subscriber.business_count > 1 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {subscriber.business_count} businesses
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {subscriber.source?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        subscriber.status === 'subscribed' 
                          ? 'bg-green-100 text-green-700' 
                          : subscriber.status === 'unsubscribed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {subscriber.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={subscriber.status}
                        onChange={(e) => handleUpdateSubscriber(subscriber.id, e.target.value)}
                        disabled={updatingSubscriberId === subscriber.id}
                        className="text-xs border border-gray-200 rounded px-2 py-1 disabled:bg-gray-100"
                      >
                        <option value="subscribed">Subscribed</option>
                        <option value="unsubscribed">Unsubscribed</option>
                        <option value="bounced">Bounced</option>
                      </select>
                      {updatingSubscriberId === subscriber.id && (
                        <div className="text-xs text-gray-500 mt-1">Updating...</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0a1628]">Email Templates</h3>
        <button className="bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No templates yet</h3>
            <p className="text-sm text-gray-500">Create your first email template to get started.</p>
          </div>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-[#0a1628]">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.subject}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    disabled={deletingTemplateId === template.id}
                    className="text-gray-400 hover:text-red-600 disabled:text-gray-300"
                  >
                    {deletingTemplateId === template.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Variables:</div>
                <div className="flex flex-wrap gap-1">
                  {(template.variables || []).map((variable) => (
                    <span key={variable} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Use Template
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0a1628]">Email Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">{stats.totalSent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Sent</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">
              {stats.totalSent > 0 ? `${stats.avgOpenRate}%` : "Coming Soon"}
            </div>
              <div className="text-sm text-gray-600">Avg Open Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">Coming Soon</div>
              <div className="text-sm text-gray-600">Click Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">Coming Soon</div>
              <div className="text-sm text-gray-600">Unsubscribe</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h4 className="font-semibold text-[#0a1628] mb-4">Campaign Performance</h4>
        {completedCampaigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sent campaigns yet. Send your first campaign to see performance data.
          </div>
        ) : (
          <div className="space-y-4">
            {completedCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-[#0a1628]">{campaign.name}</h5>
                  <span className="text-sm text-gray-500">
                    {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-[#0a1628]">{campaign.recipients || 0}</div>
                    <div className="text-xs text-gray-600">Sent</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{campaign.opens || 0}</div>
                    <div className="text-xs text-gray-600">Opens</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{campaign.clicks || 0}</div>
                    <div className="text-xs text-gray-600">Clicks</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">
                      {campaign.open_rate || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Open Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#0d4f4f]/10 rounded-xl">
          <Mail className="w-5 h-5 text-[#0d4f4f]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0a1628]">Email Marketing</h3>
          <p className="text-sm text-gray-600">Manage campaigns and subscribers</p>
        </div>
      </div>

      {/* Action Error Banner (Non-blocking) */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-800">Action Failed</h4>
              <p className="text-yellow-600 text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError("")}
              className="ml-auto text-yellow-600 hover:text-yellow-800 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0d4f4f]/5 border border-[#0d4f4f]/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0d4f4f]/20 rounded-full">
              <Users className="w-5 h-5 text-[#0d4f4f]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">{stats.totalSubscribers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Subscribers</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">{stats.totalCampaigns}</div>
              <div className="text-sm text-gray-600">Campaigns</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-full">
              <Send className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">{stats.totalSent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Emails Sent</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-full">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0a1628]">
              {stats.totalSent > 0 ? `${stats.avgOpenRate}%` : "Coming Soon"}
            </div>
              <div className="text-sm text-gray-600">Avg Open Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0d4f4f] text-[#0d4f4f]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "campaigns" && renderCampaigns()}
        {activeTab === "ready" && renderReadyToSend()}
        {activeTab === "sent" && renderSentCampaigns()}
        {activeTab === "subscribers" && renderSubscribers()}
        {activeTab === "templates" && renderTemplates()}
        {activeTab === "analytics" && renderAnalytics()}
      </div>
    </div>
  );
}
