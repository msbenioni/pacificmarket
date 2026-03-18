"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import {
  Lock,
  Eye,
  EyeOff,
  User,
  Save,
  ArrowRight,
  Users,
  Shield,
  AlertCircle,
  Plus,
  ChevronDown,
  UserCircle2,
  Check,
  ArrowLeft,
} from "lucide-react";
import { isAdmin as checkIsAdmin } from "@/utils/roleHelpers";
import { useToast } from "@/components/ui/toast/ToastProvider";
import PortalShell from "@/components/portal/PortalShell";
import { COUNTRIES, LANGUAGES } from "@/constants/unifiedConstants";
import HeroStandard from "@/components/shared/HeroStandard";

// Premium accordion component with badge support
function InsightsAccordionSection({
  title,
  subtitle,
  summary,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  badge,
  badgeTone,
}) {
  const getBadgeStyles = (tone) => {
    switch (tone) {
      case "required":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "optional":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

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
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-semibold text-white text-sm">{title}</div>
              {badge && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyles(
                    badgeTone
                  )}`}
                >
                  {badge}
                </span>
              )}
            </div>
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
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white text-[#0a1628]">
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

  // Account state
  const [displayName, setDisplayName] = useState("");
  const [privateEmail, setPrivateEmail] = useState("");
  const [privatePhone, setPrivatePhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile foundation state
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [culturalIdentity, setCulturalIdentity] = useState([]);
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set());

  // Step 2 saved state
  const [profileFoundationSaved, setProfileFoundationSaved] = useState(false);

  // Admin state
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);

  const [savingAccount, setSavingAccount] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { toast } = useToast();

  const isStep2Complete =
    city.trim() !== "" &&
    country.trim() !== "" &&
    culturalIdentity.length > 0 &&
    languagesSpoken.length > 0;

  const showUnlockedState = profileFoundationSaved && isStep2Complete;

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
          console.error("Auth error or no user:", { authError, user });
          setLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(
            "role, display_name, private_email, city, country, cultural_identity, languages_spoken, private_phone"
          )
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile data error:", {
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            code: profileError.code,
            fullError: profileError,
          });
        }

        let parsedCulturalIdentity = [];
        if (profileData?.cultural_identity) {
          try {
            if (Array.isArray(profileData.cultural_identity)) {
              parsedCulturalIdentity = profileData.cultural_identity;
            } else {
              parsedCulturalIdentity = JSON.parse(
                profileData.cultural_identity
                  .replace(/^{/, "[")
                  .replace(/}$/, "]")
              );
            }
          } catch (error) {
            console.error(
              "Error parsing cultural_identity:",
              error,
              "Data:",
              profileData.cultural_identity
            );
            parsedCulturalIdentity = [];
          }
        }

        const parsedLanguages = Array.isArray(profileData?.languages_spoken)
          ? profileData.languages_spoken
          : [];

        const enhancedUser = {
          ...user,
          role: profileData?.role || "owner",
          display_name:
            profileData?.display_name ||
            user.user_metadata?.display_name ||
            user.user_metadata?.full_name ||
            "",
          private_email: profileData?.private_email || user.email || "",
        };

        setUser(enhancedUser);
        setIsAdmin(checkIsAdmin(enhancedUser));

        setDisplayName(enhancedUser.display_name || "");
        setPrivateEmail(enhancedUser.private_email || "");
        setPrivatePhone(profileData?.private_phone || "");
        setCity(profileData?.city || "");
        setCountry(profileData?.country || "");
        setCulturalIdentity(
          Array.isArray(parsedCulturalIdentity) ? parsedCulturalIdentity : []
        );
        setLanguagesSpoken(parsedLanguages);

        const step2Complete =
          Boolean((profileData?.city || "").trim()) &&
          Boolean((profileData?.country || "").trim()) &&
          parsedCulturalIdentity.length > 0 &&
          parsedLanguages.length > 0;

        setProfileFoundationSaved(step2Complete);

        if (checkIsAdmin(enhancedUser)) {
          await loadAdminUsers();
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
          details: error?.details,
          fullError: error,
        });
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
    setSavingAccount(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          private_email: privateEmail,
          private_phone: privatePhone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      const { error: userError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          full_name: displayName,
        },
      });

      if (userError) throw userError;

      if (privateEmail !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: privateEmail,
        });

        if (emailError) throw emailError;
      }

      setUser((prev) => ({
        ...prev,
        display_name: displayName,
        private_email: privateEmail,
      }));

      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete("account");
        return next;
      });

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
      setSavingAccount(false);
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

    setSavingPassword(true);

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
        setSavingPassword(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete("security");
        return next;
      });

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
      setSavingPassword(false);
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
        private_email: newAdminEmail,
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
    const currentArray =
      field === "culturalIdentity" ? culturalIdentity : languagesSpoken;
    const setter =
      field === "culturalIdentity" ? setCulturalIdentity : setLanguagesSpoken;

    if (currentArray.includes(item)) {
      setter(currentArray.filter((i) => i !== item));
    } else {
      setter([...currentArray, item]);
    }
  };

  const updateProfileFoundation = async () => {
    setSavingProfile(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase
        .from("profiles")
        .update({
          city,
          country,
          cultural_identity: culturalIdentity,
          languages_spoken: languagesSpoken,
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfileFoundationSaved(true);

      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete("profile");
        return next;
      });

      toast({
        title: "Profile Foundation Saved",
        description:
          "Thanks for completing your profile. You can now claim an existing business or add a new business in the Business Portal.",
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
      setSavingProfile(false);
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
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PortalShell>
      <HeroStandard
        badge="Profile Settings"
        title={`Welcome back, ${
          user?.user_metadata?.full_name?.split(" ")[0] ||
          user?.user_metadata?.display_name?.split(" ")[0] ||
          "User"
        }`}
        subtitle={user?.email}
        description="Manage your account information, profile foundation, and security settings"
        actions={
          showUnlockedState ? (
            <Link
              href={createPageUrl("BusinessPortal")}
              className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Business Portal
            </Link>
          ) : null
        }
        compact
      />

      <div className="min-h-screen bg-[#f8f9fc]">
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                {!showUnlockedState ? (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-900 text-sm">
                        Next step required
                      </h3>
                      <p className="text-amber-800 text-sm mt-1">
                        Complete and save Step 2: Profile Foundation to unlock
                        the ability to claim an existing business or add a new
                        business in your Business Portal.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-900 text-sm">
                        Thank you for completing your profile
                      </h3>
                      <p className="text-emerald-800 text-sm mt-1">
                        Your profile foundation is saved. You can now claim an
                        existing unclaimed business or add a new business in the
                        Business Portal.
                      </p>
                      <Link
                        href={createPageUrl("BusinessPortal")}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2"
                      >
                        Go to Business Portal
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Private Email
                    </label>
                    <input
                      type="email"
                      value={privateEmail}
                      onChange={(e) => setPrivateEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                      placeholder="Enter your private email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Private Phone
                    </label>
                    <input
                      type="tel"
                      value={privatePhone}
                      onChange={(e) => setPrivatePhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                      placeholder="Enter your private phone"
                    />
                  </div>

                  <button
                    onClick={updateProfile}
                    disabled={savingAccount}
                    className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {savingAccount ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </InsightsAccordionSection>

              <InsightsAccordionSection
                title="Profile Foundation"
                subtitle="Step 2"
                summary="Required to unlock business claiming and business creation"
                icon={UserCircle2}
                isOpen={expandedSections.has("profile")}
                onToggle={() => toggleSection("profile")}
                badge="Required"
                badgeTone="required"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-800 text-sm">
                      Complete this section to unlock the ability to claim an
                      existing unclaimed business or add a new business in your
                      Business Portal.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Where are you based? (City)
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
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
                        <option
                          key={countryItem.value}
                          value={countryItem.value}
                        >
                          {countryItem.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Cultural Identity
                    </label>
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                      {COUNTRIES.map((countryItem) => (
                        <label
                          key={countryItem.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={culturalIdentity.includes(
                              countryItem.value
                            )}
                            onChange={() =>
                              toggleArrayItem(
                                "culturalIdentity",
                                countryItem.value
                              )
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
                            checked={languagesSpoken.includes(language.value)}
                            onChange={() =>
                              toggleArrayItem("languagesSpoken", language.value)
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

                  <div className="space-y-2">
                    <button
                      onClick={updateProfileFoundation}
                      disabled={savingProfile || !isStep2Complete}
                      className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {savingProfile ? "Saving..." : "Save Profile Foundation"}
                    </button>

                    {!isStep2Complete && (
                      <p className="text-xs text-gray-500">
                        Please complete your city, country, cultural identity,
                        and languages spoken before saving.
                      </p>
                    )}
                  </div>
                </div>
              </InsightsAccordionSection>

              <InsightsAccordionSection
                title="Security Settings"
                subtitle="Step 3"
                summary="Optional password and security updates"
                icon={Shield}
                isOpen={expandedSections.has("security")}
                onToggle={() => toggleSection("security")}
                badge="Optional"
                badgeTone="optional"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 text-sm">
                      This step is optional. You can update your password now or
                      come back to it later.
                    </p>
                  </div>

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
                        className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
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
                        className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
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
                        className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
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
                    disabled={savingPassword}
                    className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {savingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </InsightsAccordionSection>

              {isAdmin && (
                <InsightsAccordionSection
                  title="Admin Users"
                  subtitle="Step 4"
                  summary="Manage admin user access"
                  icon={Users}
                  isOpen={expandedSections.has("admin")}
                  onToggle={() => toggleSection("admin")}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-[#0a1628]">
                        Current Admin Users
                      </h3>
                      <button
                        onClick={() => setShowAddAdmin(true)}
                        className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Admin
                      </button>
                    </div>

                    {showAddAdmin && (
                      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h4 className="font-medium text-[#0a1628]">
                          Add New Admin User
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-[#0a1628] mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                            placeholder="Enter admin name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#0a1628] mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                            placeholder="Enter admin email"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#0a1628] mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) =>
                              setNewAdminPassword(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                            placeholder="Enter admin password"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={addAdminUser}
                            disabled={addingAdmin}
                            className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {addingAdmin ? "Adding..." : "Add Admin"}
                          </button>
                          <button
                            onClick={() => setShowAddAdmin(false)}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {adminUsers.map((admin) => (
                        <div
                          key={admin.id}
                          className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-[#0a1628]">
                              {admin.display_name ||
                                admin.full_name ||
                                admin.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {admin.email}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeAdminUser(
                                admin.id,
                                admin.display_name ||
                                  admin.full_name ||
                                  admin.email
                              )
                            }
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
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