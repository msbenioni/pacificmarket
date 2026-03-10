import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Mail, Lock, Eye, EyeOff, User, Save, ArrowLeft, Users, Shield, AlertCircle, CheckCircle, X, Plus, Trash2 } from "lucide-react";
import { isAdmin as checkIsAdmin } from "@/utils/roleHelpers";
import { useToast } from "@/components/ui/toast/ToastProvider";
import HeroRegistry from "@/components/shared/HeroRegistry";
import PortalShell from "@/components/portal/PortalShell";

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

        // Get user profile for role information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, display_name')
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

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
  ];

  if (isAdmin) {
    tabs.push({ id: "admins", label: "Admin Users", icon: Users });
  }

  return (
    <PortalShell>
      <HeroRegistry
        badge="Profile Settings"
        title={`Welcome, ${user?.display_name?.split(" ")[0] || user?.full_name?.split(" ")[0] || "User"}`}
        subtitle={user?.email}
        description="Manage your account settings and preferences"
        actions={null}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl mb-8">
          <div className="flex gap-8 p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#0d4f4f] text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Profile Settings Tab */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#0a1628] mb-6">Basic Information</h2>
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
            </div>

            {/* Change Password */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#0a1628] mb-6">Change Password</h2>
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
                  disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                  className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Users Tab */}
        {activeTab === "admins" && isAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#0a1628]">Admin Users</h2>
                <p className="text-sm text-gray-500">Manage users with administrative access</p>
              </div>
              <button
                onClick={() => setShowAddAdmin(true)}
                className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Admin
              </button>
            </div>

            {/* Admin Users List */}
            <div className="bg-white border border-gray-200 rounded-xl">
              {adminUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No admin users found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {adminUsers.map(admin => (
                    <div key={admin.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0a1628]">{admin.display_name || admin.full_name}</p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                      {admin.id !== user.id && (
                        <button
                          onClick={() => removeAdminUser(admin.id, admin.display_name || admin.full_name)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Admin Modal */}
            {showAddAdmin && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#0a1628]">Add Admin User</h3>
                    <button
                      onClick={() => setShowAddAdmin(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Full Name</label>
                      <input
                        type="text"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                        placeholder="Enter full name"
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
              </div>
            )}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
