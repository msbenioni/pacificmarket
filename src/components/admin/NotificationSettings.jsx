"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Mail, Bell, Settings, Save } from "lucide-react";
import { useToast } from "@/components/ui/toast/ToastProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NOTIFICATION_TYPES = {
  BUSINESS_CLAIMED: { label: 'Business Claimed', description: 'When someone claims ownership of a business' },
  BUSINESS_ADDED: { label: 'Business Added', description: 'When a new business is added to the registry' },
  BUSINESS_UPDATED: { label: 'Business Updated', description: 'When a business information is updated' },
  PLAN_UPGRADED: { label: 'Plan Upgraded', description: 'When a business upgrades to a premium plan' },
  PLAN_DOWNGRADED: { label: 'Plan Downgraded', description: 'When a business downgrades or cancels' },
  PROFILE_UPDATED: { label: 'Profile Updated', description: 'When a user updates their profile' },
  CLAIM_SUBMITTED: { label: 'Claim Submitted', description: 'When a new ownership claim is submitted' }
};

export default function NotificationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load notification preferences
      const { data: prefs } = await supabase
        .from('admin_notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefs) {
        setSettings(prefs.settings || {});
        setAdminEmail(prefs.admin_email || '');
      } else {
        // Default settings - enable all notifications
        const defaultSettings = {};
        Object.keys(NOTIFICATION_TYPES).forEach(key => {
          defaultSettings[key] = true;
        });
        setSettings(defaultSettings);
        setAdminEmail(user.email);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type) => {
    setSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('admin_notification_settings')
        .upsert({
          user_id: user.id,
          settings,
          admin_email: adminEmail,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Notification settings saved successfully!",
        variant: "success"
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4f4f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_18px_50px_rgba(10,22,40,0.08)]">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-[#00c4cc]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a1628] mb-2">
                Email Notifications
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Choose which events you want to be notified about via email. Notifications are sent to your admin email address.
              </p>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#0a1628] mb-2">
              Admin Email Address
            </label>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10"
                placeholder="admin@pacificmarket.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This email address will receive all enabled notifications.
            </p>
          </div>
        </div>

        {/* Notification Toggles */}
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-[#0a1628] mb-6">Notification Types</h3>
          
          <div className="space-y-4">
            {Object.entries(NOTIFICATION_TYPES).map(([key, config]) => (
              <div
                key={key}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:bg-[#f8f9fc] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    id={key}
                    checked={settings[key] || false}
                    onChange={() => handleToggle(key)}
                    className="w-5 h-5 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] focus:ring-2"
                  />
                  <div className="min-w-0 flex-1">
                    <label 
                      htmlFor={key}
                      className="block text-sm font-semibold text-[#0a1628] cursor-pointer"
                    >
                      {config.label}
                    </label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-gray-200 bg-[#f8f9fc]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Settings className="w-4 h-4 inline mr-2" />
              Notification settings are saved automatically for your admin account.
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#0a3e3e] text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 min-h-[44px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
