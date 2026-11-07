import { Suspense } from "react";
import type { Metadata } from "next";

import { CatalogView } from "@/components/catalog";
import { getCatalogCached } from "@/services/products.cache";

export const metadata: Metadata = {
  title: "Board Game Catalog | MeepleSpace",
  description:
    "Explore our collection of top-rated board games, strategy classics, family favourites, and party hits in Vietnam.",
};

export default async function ProductsPage() {
  const products = await getCatalogCached();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Board Game Catalog
        </h1>
        <p className="text-muted-foreground">
          Discover tabletop adventures, gateway titles, and deep strategy masterpieces.
        </p>
      </div>

      <Suspense>
        <CatalogView products={products} />
      </Suspense>
    </div>
  );
}
