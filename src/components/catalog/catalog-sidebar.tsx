import { CatalogFacets } from "./catalog-facets";
import type {
  CatalogFilters,
  CategoryOption,
  FacetCounts,
  PriceBounds,
  PublisherOption,
} from "@/types/catalog";

interface CatalogSidebarProps {
  filters: CatalogFilters;
  priceBounds: PriceBounds;
  publishers: PublisherOption[];
  categories: CategoryOption[];
  facetCounts: FacetCounts;
}

export function CatalogSidebar({
  filters,
  priceBounds,
  publishers,
  categories,
  facetCounts,
}: CatalogSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="rounded-xl border border-border bg-card p-4">
        <CatalogFacets
          variant="sidebar"
          filters={filters}
          priceBounds={priceBounds}
          publishers={publishers}
          categories={categories}
          facetCounts={facetCounts}
        />
      </div>
    </aside>
  );
}
