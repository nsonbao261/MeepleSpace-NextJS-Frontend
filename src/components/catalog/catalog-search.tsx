"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SearchIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { buildCatalogHref, withCatalogFilters } from "@/lib/catalog-params";
import type { CatalogFilters } from "@/types/catalog";

import { useCatalogParams } from "./use-catalog-params";

const DEBOUNCE_MS = 250;

export function CatalogSearch({ filters }: { filters: CatalogFilters }) {
  const { setFilters } = useCatalogParams(filters);
  const [value, setValue] = useState(filters.q);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWrittenRef = useRef(filters.q);

  useEffect(() => {
    if (filters.q !== lastWrittenRef.current) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      lastWrittenRef.current = filters.q;
      setValue(filters.q);
    }
  }, [filters.q]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function commit(next: string) {
    lastWrittenRef.current = next;
    setFilters({ q: next });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setValue(next);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      commit(next);
    }, DEBOUNCE_MS);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      commit(value);
    }
  }

  const clearHref = buildCatalogHref(withCatalogFilters(filters, { q: "" }));

  return (
    <div className="relative">
      <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search games..."
        aria-label="Search catalog"
        className="w-full pr-8 pl-8"
      />
      {value !== "" && (
        <Link
          href={clearHref}
          aria-label="Clear search"
          className="group absolute top-1/2 right-1 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <XIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
