"use client";

import { pagesConfig } from "@/pages.config";
import Layout from "@/components/layout/Layout";

export default function HomePage() {
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];
  const MainPage = Pages[mainPageKey];

  return (
    <Layout currentPageName={mainPageKey}>
      <MainPage />
    </Layout>
  );
}
