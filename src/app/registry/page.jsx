"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegistryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /PacificBusinesses
    router.replace("/PacificBusinesses");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4f4f] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Pacific Businesses...</p>
      </div>
    </div>
  );
}
