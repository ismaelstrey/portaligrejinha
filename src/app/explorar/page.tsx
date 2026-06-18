import type { Metadata } from "next";

import { MapExplorer } from "@/components/catalog/map-explorer";
import { getCategories, getExploreProviders } from "@/server/portal-data";

export const metadata: Metadata = {
  title: "Explorar | Portal Igrejinha",
  description: "Visualize serviços e comércios no modo lista e mapa."
};

export default async function ExplorarPage() {
  const [categories, providers] = await Promise.all([getCategories(), getExploreProviders()]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <MapExplorer categories={categories} providers={providers} />
    </main>
  );
}
