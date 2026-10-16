import { CatalogActiveFilters } from "@/components/catalog/catalog-active-filters";
import { CatalogFacetCount } from "@/components/catalog/catalog-facet-count";
import { CatalogPageCanonicaliser } from "@/components/catalog/catalog-page-canonicaliser";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { CatalogResults } from "@/components/catalog/catalog-results";
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { parseCatalogFilters } from "@/lib/catalog-params";
import { queryCatalog } from "@/lib/queries";
import { PAGE_SIZE } from "@/constants/catalog-filters";

type CatalogSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: CatalogSearchParams;
}) {
  const params = await searchParams;
  const parsed = parseCatalogFilters(params);
  const result = queryCatalog(parsed);

  const rangeStart = (result.filters.page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(result.filters.page * PAGE_SIZE, result.total);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
      <CatalogPageCanonicaliser
        filters={result.filters}
        requested={parsed.page}
        clamped={result.filters.page}
      />
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Catalog
      </h1>

      <CatalogToolbar
        filters={result.filters}
        priceBounds={result.priceBounds}
        publishers={result.publishers}
        categories={result.categories}
        facetCounts={result.facetCounts}
        total={result.total}
      />

      <CatalogActiveFilters filters={result.filters} />

      <div className="flex gap-6">
        <CatalogSidebar
          filters={result.filters}
          priceBounds={result.priceBounds}
          publishers={result.publishers}
          categories={result.categories}
          facetCounts={result.facetCounts}
        />

        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <CatalogFacetCount
            total={result.total}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            empty={result.total === 0}
          />

          <CatalogResults
            filters={result.filters}
            games={result.games}
            flags={result.flags}
            total={result.total}
          />

          <CatalogPagination
            filters={result.filters}
            pageCount={result.pageCount}
          />
        </main>
      </div>
    </div>
  );
}
