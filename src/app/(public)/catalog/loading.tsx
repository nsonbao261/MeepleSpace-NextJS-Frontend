export default function CatalogLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Catalog
      </h1>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-between">
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted md:w-80" />
          <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-end">
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted sm:w-32" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted lg:hidden" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
            <div className="flex flex-1 flex-col gap-3 p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              <div className="mt-auto flex items-center justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
