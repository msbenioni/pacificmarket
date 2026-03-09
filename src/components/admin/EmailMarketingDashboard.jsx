"use client";

import { useState, useEffect } from "react";
import { Mail, Users, Send, BarChart3, FileText, Plus, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

export default function EmailMarketingDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    totalCampaigns: 0,
    totalSent: 0,
    avgOpenRate: 0
  });

  const tabs = [
    { id: "campaigns", label: "Campaigns", icon: Mail },
    { id: "subscribers", label: "Subscribers", icon: Users },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from API
      // For now, use mock data
      
      setCampaigns([
        {
          id: 1,
          name: "Pacific Market Relaunch",
          subject: "🌺 Pacific Market is Relaunching - Exciting Updates Inside!",
          audience: "all",
          status: "sent",
          sent_at: "2026-03-01T10:00:00Z",
          recipients: 245,
          opens: 98,
          clicks: 23
        },
        {
          id: 2,
          name: "Referral Program Launch",
          subject: "🎉 Refer Businesses & Win a Free Website!",
          audience: "business_owners",
          status: "draft",
          created_at: "2026-03-08T15:30:00Z",
          recipients: 0,
          opens: 0,
          clicks: 0
        }
      ]);

      setSubscribers([
        {
          id: 1,
          email: "john@island-pepe.co.nz",
          first_name: "John",
          business_name: "Island Pepe",
          source: "business_signup",
          status: "subscribed",
          created_at: "2026-02-15T08:00:00Z"
        },
        {
          id: 2,
          email: "sarah@tangata-whenua.com",
          first_name: "Sarah",
          business_name: "Tangata Whenua Carving",
          source: "referral",
          status: "subscribed",
          created_at: "2026-02-20T14:30:00Z"
        }
      ]);

      setTemplates([
        {
          id: 1,
          name: "Pacific Market Relaunch",
          subject: "🌺 Pacific Market is Relaunching - Exciting Updates Inside!",
          variables: ["first_name", "email"]
        },
        {
          id: 2,
          name: "Referral Program Launch", 
          subject: "🎉 Refer Businesses & Win a Free Website!",
          variables: ["first_name", "email", "referral_link"]
        },
        {
          id: 3,
          name: "Moana Upgrade Offer",
          subject: "🚀 Unlock Powerful Business Tools - Upgrade to Moana",
          variables: ["first_name", "email"]
        }
      ]);

      setStats({
        totalSubscribers: 245,
        totalCampaigns: 2,
        totalSent: 245,
        avgOpenRate: 40.0
      });

    } catch (error) {
      console.error('Error loading email data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "draft":
        return <Clock className="w-4 h-4 text-gray-400" />;
      case "scheduled":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      sent: "bg-green-100 text-green-700 border-green-200",
      draft: "bg-gray-100 text-gray-700 border-gray-200", 
      scheduled: "bg-blue-100 text-blue-700 border-blue-200"
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-[#0a1628]">{campaign.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 capitalize">{campaign.audience.replace('_', ' ')}</td>
                  <td className="px-4 py-4">{getStatusBadge(campaign.status)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {campaign.recipients > 0 ? campaign.recipients.toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {campaign.recipients > 0 ? `${Math.round((campaign.opens / campaign.recipients) * 100)}%` : '-'}
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
              <div className="text-2xl font-bold text-[#0a1628]">12%</div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-[#0a1628]">{subscriber.first_name}</div>
                      <div className="text-sm text-gray-500">{subscriber.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{subscriber.business_name}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {subscriber.source.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      subscriber.status === 'subscribed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
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
        {templates.map((template) => (
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
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Variables:</div>
              <div className="flex flex-wrap gap-1">
                {template.variables.map((variable) => (
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
        ))}
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
              <div className="text-2xl font-bold text-[#0a1628]">{stats.avgOpenRate}%</div>
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
              <div className="text-2xl font-bold text-[#0a1628]">18.5%</div>
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
              <div className="text-2xl font-bold text-[#0a1628]">2.1%</div>
              <div className="text-sm text-gray-600">Unsubscribe</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h4 className="font-semibold text-[#0a1628] mb-4">Campaign Performance</h4>
        <div className="space-y-4">
          {campaigns.filter(c => c.status === 'sent').map((campaign) => (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-[#0a1628]">{campaign.name}</h5>
                <span className="text-sm text-gray-500">{new Date(campaign.sent_at).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-[#0a1628]">{campaign.recipients}</div>
                  <div className="text-xs text-gray-600">Sent</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">{campaign.opens}</div>
                  <div className="text-xs text-gray-600">Opens</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">{campaign.clicks}</div>
                  <div className="text-xs text-gray-600">Clicks</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">
                    {Math.round((campaign.opens / campaign.recipients) * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Open Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4f4f]"></div>
      </div>
    );
  }

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
              <div className="text-2xl font-bold text-[#0a1628]">{stats.avgOpenRate}%</div>
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
        {activeTab === "subscribers" && renderSubscribers()}
        {activeTab === "templates" && renderTemplates()}
        {activeTab === "analytics" && renderAnalytics()}
      </div>
    </div>
  );
}
