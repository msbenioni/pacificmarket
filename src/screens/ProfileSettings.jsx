import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import {
  Lock,
  Eye,
  EyeOff,
  User,
  Save,
  ArrowLeft,
  Users,
  Shield,
  AlertCircle,
  Plus,
  ChevronDown,
  UserCircle2,
} from "lucide-react";
import { isAdmin as checkIsAdmin } from "@/utils/roleHelpers";
import { useToast } from "@/components/ui/toast/ToastProvider";
import PortalShell from "@/components/portal/PortalShell";
import { COUNTRIES, LANGUAGES } from "@/constants/unifiedConstants";

// Premium accordion component
function InsightsAccordionSection({
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
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
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
  const [expandedSections, setExpandedSections] = useState(new Set(["account"]));

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
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select(
            "role, display_name, city, country, primary_cultural, languages, years_operating"
          )
          .eq("id", user.id)
          .single();

        const enhancedUser = {
          ...user,
          role: profileData?.role || "owner",
          display_name:
            profileData?.display_name ||
            user.user_metadata?.display_name ||
            user.user_metadata?.full_name ||
            "",
        };

        setUser(enhancedUser);
        setIsAdmin(checkIsAdmin(enhancedUser));

        setDisplayName(enhancedUser.display_name || "");
        setEmail(enhancedUser.email || "");
        setCity(profileData?.city || "");
        setCountry(profileData?.country || "");
        setPrimaryCultural(
          Array.isArray(profileData?.primary_cultural)
            ? profileData.primary_cultural
            : []
        );
        setLanguages(
          Array.isArray(profileData?.languages) ? profileData.languages : []
        );

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
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "admin");

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error("Error loading admin users:", error);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("id", user.id);

      if (profileError) throw profileError;

      const { error: userError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          full_name: displayName,
        },
      });

      if (userError) throw userError;

      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });

        if (emailError) throw emailError;
      }

      setUser((prev) => ({ ...prev, display_name: displayName, email }));

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "error",
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
        variant: "error",
      });
      return;
    }

    setSaving(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Invalid Password",
          description: "Current password is incorrect.",
          variant: "error",
        });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Update Failed",
        description:
          error.message || "Failed to update password. Please try again.",
        variant: "error",
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
        variant: "error",
      });
      return;
    }

    setAddingAdmin(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          data: {
            full_name: newAdminName,
            display_name: newAdminName,
          },
        },
      });

      if (authError) {
        if (authError.message?.includes("already registered")) {
          throw new Error(
            "This email is already registered. Please use a different email."
          );
        }
        throw authError;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: newAdminEmail,
        full_name: newAdminName,
        display_name: newAdminName,
        role: "admin",
      });

      if (profileError) throw profileError;

      setNewAdminEmail("");
      setNewAdminName("");
      setNewAdminPassword("");
      setShowAddAdmin(false);

      await loadAdminUsers();

      toast({
        title: "Admin User Added",
        description: `${newAdminName} has been added as an admin user.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding admin user:", error);
      toast({
        title: "Add Admin Failed",
        description:
          error.message || "Failed to add admin user. Please try again.",
        variant: "error",
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const removeAdminUser = async (adminUserId, adminName) => {
    if (
      !window.confirm(
        `Are you sure you want to remove admin access for ${adminName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase
        .from("profiles")
        .update({ role: "owner" })
        .eq("id", adminUserId);

      if (error) throw error;

      await loadAdminUsers();

      toast({
        title: "Admin Access Removed",
        description: `${adminName} no longer has admin access.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error removing admin user:", error);
      toast({
        title: "Remove Admin Failed",
        description: "Failed to remove admin access. Please try again.",
        variant: "error",
      });
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const toggleArrayItem = (field, item) => {
    const currentArray = field === "primaryCultural" ? primaryCultural : languages;
    const setter =
      field === "primaryCultural" ? setPrimaryCultural : setLanguages;

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
        .from("profiles")
        .update({
          city,
          country,
          primary_cultural: primaryCultural,
          languages,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile foundation has been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating profile foundation:", error);
      toast({
        title: "Update Failed",
        description:
          error.message ||
          "Failed to update profile foundation. Please try again.",
        variant: "error",
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
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">
            Access Required
          </h2>
          <p className="text-gray-500 mb-6">
            Please sign in to access your profile settings.
          </p>
          <Link
            href={createPageUrl("BusinessLogin")}
            className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]"
          >
            Sign In <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PortalShell>
      <div className="min-h-screen bg-[#f8f9fc]">
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] text-white shadow-md">
                  <UserCircle2 className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#0d4f4f]/10 px-3 py-1 text-xs font-semibold text-[#0d4f4f]">
                    Profile Settings
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a1628] sm:text-3xl">
                    Manage your profile settings
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                    Update your account information, profile foundation, and
                    security settings to keep your Pacific Market profile current
                    and secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
              <InsightsAccordionSection
                title="Account Settings"
                subtitle="Step 1"
                summary="Manage your display name and email address"
                icon={User}
                isOpen={expandedSections.has("account")}
                onToggle={() => toggleSection("account")}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Email Address
                    </label>
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

              <InsightsAccordionSection
                title="Profile Foundation"
                subtitle="Step 2"
                summary="Complete your location and cultural identity information"
                icon={UserCircle2}
                isOpen={expandedSections.has("profile")}
                onToggle={() => toggleSection("profile")}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Where are you based? (City)
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Where are you based? (Country)
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f] text-[#0a1628]"
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((countryItem) => (
                        <option key={countryItem.value} value={countryItem.value}>
                          {countryItem.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Primary Cultural Identity
                    </label>
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                      {COUNTRIES.map((countryItem) => (
                        <label
                          key={countryItem.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={primaryCultural.includes(countryItem.value)}
                            onChange={() =>
                              toggleArrayItem("primaryCultural", countryItem.value)
                            }
                            className="rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                          />
                          <span className="text-sm text-gray-700">
                            {countryItem.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Languages Spoken
                    </label>
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                      {LANGUAGES.map((language) => (
                        <label
                          key={language.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={languages.includes(language.value)}
                            onChange={() =>
                              toggleArrayItem("languages", language.value)
                            }
                            className="rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                          />
                          <span className="text-sm text-gray-700">
                            {language.label}
                          </span>
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

              <InsightsAccordionSection
                title="Security Settings"
                subtitle="Step 3"
                summary="Update your password and security preferences"
                icon={Shield}
                isOpen={expandedSections.has("security")}
                onToggle={() => toggleSection("security")}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
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

              {isAdmin && (
                <InsightsAccordionSection
                  title="Admin Users"
                  subtitle="Admin"
                  summary="Manage admin user access and permissions"
                  icon={Users}
                  isOpen={expandedSections.has("admins")}
                  onToggle={() => toggleSection("admins")}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#0a1628]">
                        Admin Users
                      </h3>
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
                            <label className="block text-sm font-medium text-[#0a1628] mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              value={newAdminName}
                              onChange={(e) => setNewAdminName(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                              placeholder="Enter admin name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#0a1628] mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={newAdminEmail}
                              onChange={(e) => setNewAdminEmail(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                              placeholder="Enter email address"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#0a1628] mb-2">
                              Password
                            </label>
                            <input
                              type="password"
                              value={newAdminPassword}
                              onChange={(e) =>
                                setNewAdminPassword(e.target.value)
                              }
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

                    <div className="space-y-3">
                      {adminUsers.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                          No admin users found.
                        </div>
                      ) : (
                        adminUsers.map((adminUser) => (
                          <div
                            key={adminUser.id}
                            className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                          >
                            <div>
                              <p className="font-medium text-[#0a1628]">
                                {adminUser.display_name || adminUser.full_name || "Admin User"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {adminUser.email}
                              </p>
                            </div>

                            {adminUser.id !== user.id && (
                              <button
                                onClick={() =>
                                  removeAdminUser(
                                    adminUser.id,
                                    adminUser.display_name ||
                                      adminUser.full_name ||
                                      adminUser.email
                                  )
                                }
                                className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </InsightsAccordionSection>
              )}
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}