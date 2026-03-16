"use client";

import { pagesConfig } from "@/pages.config";
import Layout from "@/components/layout/Layout";

export default function PacificBusinessesPage() {
  const { Pages } = pagesConfig;
  const PacificBusinessesPage = Pages["PacificBusinesses"];

  return (
    <Layout currentPageName="PacificBusinesses">
      <PacificBusinessesPage />
    </Layout>
  );
}
