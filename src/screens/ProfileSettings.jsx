import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Mail, Lock, Eye, EyeOff, User, Save, ArrowLeft, Users, Shield, AlertCircle, CheckCircle, X, Plus, Trash2, ChevronDown, ChevronUp, Globe, UserCircle2, Sparkles } from "lucide-react";
import { isAdmin as checkIsAdmin } from "@/utils/roleHelpers";
import { useToast } from "@/components/ui/toast/ToastProvider";
import HeroRegistry from "@/components/shared/HeroRegistry";
import PortalShell from "@/components/portal/PortalShell";
import { COUNTRIES, LANGUAGES } from "@/constants/unifiedConstants";

// Premium accordion component (matching ProfileInsightsTab style)
function InsightsAccordionSection({
  id,
  title,
  subtitle,
  summary,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0 bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] text-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left hover:bg-white/10 transition"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-white text-sm">{title}</div>
            {subtitle && (
              <div className="text-xs text-gray-300 mt-0.5">{subtitle}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {summary && (
            <div className="hidden md:block text-xs text-gray-300 text-right">
              {summary}
            </div>
          )}
          <div className="text-gray-300 text-sm">
            {isOpen ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white">
          <div className="pt-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [adminUsers, setAdminUsers] = useState([]);
  
  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile foundation state
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [primaryCultural, setPrimaryCultural] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [yearsOperating, setYearsOperating] = useState("");
  const [expandedSections, setExpandedSections] = useState(new Set());
  
  // Admin management state
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Import getSupabase dynamically
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setLoading(false);
          return;
        }

        // Get user profile for role information and profile foundation data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, display_name, city, country, primary_cultural, languages, years_operating')
          .eq('id', user.id)
          .single();

        const enhancedUser = { 
          ...user, 
          role: profileData?.role || 'owner',
          display_name: profileData?.display_name || user.user_metadata?.display_name || user.user_metadata?.full_name
        };

        setUser(enhancedUser);
        setIsAdmin(checkIsAdmin(enhancedUser));
        
        // Set form values
        setDisplayName(enhancedUser.display_name || "");
        setEmail(enhancedUser.email || "");
        
        // Set profile foundation values
        setCity(profileData?.city || "");
        setCountry(profileData?.country || "");
        setPrimaryCultural(Array.isArray(profileData?.primary_cultural) ? profileData.primary_cultural : []);
        setLanguages(Array.isArray(profileData?.languages) ? profileData.languages : []);
        setYearsOperating(profileData?.years_operating || "");

        // Load admin users if this is an admin
        if (checkIsAdmin(enhancedUser)) {
          await loadAdminUsers();
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const loadAdminUsers = async () => {
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin');

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error("Error loading admin users:", error);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      // Update profile display name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: { 
          display_name: displayName,
          full_name: displayName
        }
      });

      if (userError) throw userError;

      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email
        });

        if (emailError) throw emailError;
      }

      setUser(prev => ({ ...prev, display_name: displayName, email }));
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "error"
      });
      return;
    }

    setSaving(true);
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        toast({
          title: "Invalid Password",
          description: "Current password is incorrect.",
          variant: "error"
        });
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const addAdminUser = async () => {
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "error"
      });
      return;
    }

    setAddingAdmin(true);
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          data: {
            full_name: newAdminName,
            display_name: newAdminName
          }
        }
      });

      if (authError) {
        if (authError.message?.includes("already registered")) {
          throw new Error("This email is already registered. Please use a different email.");
        }
        throw authError;
      }

      // Create profile with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: newAdminEmail,
          full_name: newAdminName,
          display_name: newAdminName,
          role: 'admin'
        });

      if (profileError) throw profileError;

      // Reset form and refresh admin list
      setNewAdminEmail("");
      setNewAdminName("");
      setNewAdminPassword("");
      setShowAddAdmin(false);
      await loadAdminUsers();

      toast({
        title: "Admin User Added",
        description: `${newAdminName} has been added as an admin user.`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error adding admin user:", error);
      toast({
        title: "Add Admin Failed",
        description: error.message || "Failed to add admin user. Please try again.",
        variant: "error"
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const removeAdminUser = async (adminUserId, adminName) => {
    if (!confirm(`Are you sure you want to remove admin access for ${adminName}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      // Update role to owner instead of deleting the user
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'owner' })
        .eq('id', adminUserId);

      if (error) throw error;

      await loadAdminUsers();
      toast({
        title: "Admin Access Removed",
        description: `${adminName} no longer has admin access.`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error removing admin user:", error);
      toast({
        title: "Remove Admin Failed",
        description: "Failed to remove admin access. Please try again.",
        variant: "error"
      });
    }
  };

  // Profile foundation helper functions
  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const toggleArrayItem = (field, item) => {
    const currentArray = field === 'primaryCultural' ? primaryCultural : languages;
    const setter = field === 'primaryCultural' ? setPrimaryCultural : setLanguages;
    
    if (currentArray.includes(item)) {
      setter(currentArray.filter((i) => i !== item));
    } else {
      setter([...currentArray, item]);
    }
  };

  const updateProfileFoundation = async () => {
    setSaving(true);
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          city,
          country,
          primary_cultural: primaryCultural,
          languages: languages,
          years_operating: yearsOperating
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile foundation has been successfully updated.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating profile foundation:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile foundation. Please try again.",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
          <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to access your profile settings.</p>
          <Link href={createPageUrl("BusinessLogin")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
            Sign In <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a1628] sm:text-3xl">
              Manage your profile settings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px)">
              Update your account information, profile foundation, and security settings 
              to keep your Pacific Market profile current and secure.
            </p>
          </div>

        </div>
      </section>

      {/* Accordion Sections */}
      <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
        
        {/* Basic Account Settings */}
        <InsightsAccordionSection
          id="account"
          title="Account Settings"
          subtitle="Step 1"
          summary="Manage your display name and email address"
          icon={User}
          isOpen={expandedSections.has("account")}
          onToggle={() => toggleSection("account")}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                placeholder="Enter your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                placeholder="Enter your email"
              />
            </div>
            <button
              onClick={updateProfile}
              disabled={saving}
              className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </InsightsAccordionSection>

        {/* Profile Foundation */}
        <InsightsAccordionSection
          id="profile"
          title="Profile Foundation"
          subtitle="Step 2"
          summary="Complete your location and cultural identity information"
          icon={UserCircle2}
          isOpen={expandedSections.has("profile")}
          onToggle={() => toggleSection("profile")}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Primary Cultural Identity</label>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {COUNTRIES.filter(country => country.value.includes('fiji') || country.value.includes('samoa') || country.value.includes('tonga') || country.value.includes('cook') || country.value.includes('niue') || country.value.includes('tuvalu') || country.value.includes('kiribati') || country.value.includes('marshall') || country.value.includes('micronesia') || country.value.includes('palau') || country.value.includes('papua') || country.value.includes('vanuatu') || country.value.includes('solomon') || country.value.includes('new-caledonia') || country.value.includes('french-polynesia') || country.value.includes('wallis') || country.value.includes('american-samoa') || country.value.includes('guam') || country.value.includes('northern-mariana')).map((country) => (
                  <label key={country.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={primaryCultural.includes(country.value)}
                      onChange={() => toggleArrayItem('primaryCultural', country.value)}
                      className="rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                    />
                    <span className="text-sm text-gray-700">{country.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Languages Spoken</label>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {LANGUAGES.map((language) => (
                  <label key={language.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={languages.includes(language.value)}
                      onChange={() => toggleArrayItem('languages', language.value)}
                      className="rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                    />
                    <span className="text-sm text-gray-700">{language.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={updateProfileFoundation}
              disabled={saving}
              className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile Foundation"}
            </button>
          </div>
        </InsightsAccordionSection>

        {/* Security Settings */}
        <InsightsAccordionSection
          id="security"
          title="Security Settings"
          subtitle="Step 3"
          summary="Update your password and security preferences"
          icon={Shield}
          isOpen={expandedSections.has("security")}
          onToggle={() => toggleSection("security")}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              onClick={updatePassword}
              disabled={saving}
              className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </InsightsAccordionSection>

        {/* Admin Users Section - Only show if admin */}
        {isAdmin && (
          <InsightsAccordionSection
            id="admins"
            title="Admin Users"
            subtitle="Admin"
            summary="Manage admin user access and permissions"
            icon={Users}
            isOpen={expandedSections.has("admins")}
            onToggle={() => toggleSection("admins")}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0a1628]">Admin Users</h3>
                <button
                  onClick={() => setShowAddAdmin(!showAddAdmin)}
                  className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Admin
                </button>
              </div>

              {showAddAdmin && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Name</label>
                      <input
                        type="text"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        placeholder="Enter admin name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Email Address</label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Password</label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={addAdminUser}
                        disabled={addingAdmin}
                        className="flex-1 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {addingAdmin ? "Adding..." : "Add Admin"}
                      </button>
                      <button
                        onClick={() => setShowAddAdmin(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </InsightsAccordionSection>
        )}

      </div>
    </div>
  </PortalShell>
);
