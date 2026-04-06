"use client";

import Layout from "@/components/layout/Layout";
import AdminDashboard from "@/screens/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <Layout currentPageName="AdminDashboard">
      <div suppressHydrationWarning>
        <AdminDashboard />
      </div>
    </Layout>
  );
}
