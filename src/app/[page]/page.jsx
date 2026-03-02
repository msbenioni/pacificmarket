"use client";

import { notFound, useParams } from "next/navigation";
import { pagesConfig } from "@/pages.config";
import Layout from "@/components/layout/Layout";

export default function DynamicPage() {
  const params = useParams();
  const { Pages } = pagesConfig;
  const pageKey = typeof params?.page === "string" ? params.page : "";
  const PageComponent = Pages[pageKey];

  if (!PageComponent) {
    notFound();
  }

  return (
    <Layout currentPageName={pageKey}>
      <PageComponent />
    </Layout>
  );
}
