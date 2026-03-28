import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

/**
 * Admin access gate component
 * Handles authentication and authorization states
 */

export default function AdminAccessGate({ authLoading, checkingAdmin, user, isAdmin }) {
  const router = useRouter();

  if (authLoading || checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#0d4f4f] border-t-transparent" />
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">
            {authLoading
              ? "Restoring Session"
              : checkingAdmin
              ? "Checking Access"
              : "Loading Dashboard"}
          </h2>
          <p className="text-sm text-gray-500">
            {authLoading
              ? "Signing you in..."
              : checkingAdmin
              ? "Verifying admin privileges..."
              : "Loading admin data..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">
        <div className="max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">
            Authentication Required
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Please sign in to access this page.
          </p>
          <button
            onClick={() => router.push("/BusinessLogin")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a6b6b]"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">
        <div className="max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">Access Denied</h2>
          <p className="mb-6 text-sm text-gray-500">
            Admin access required to view this page. Your account does not have admin privileges.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a6b6b]"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return null; // User is authenticated and has admin access
}
