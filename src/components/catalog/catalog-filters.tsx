"use client";

import { useId, useState } from "react";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BADGE_OPTIONS, GENRE_OPTIONS, PRICE_BUCKETS, PUBLISHER_OPTIONS } from "@/constants";

interface CatalogFiltersProps {
  onApply?: () => void;
}

export function CatalogFilters({ onApply }: CatalogFiltersProps) {
  const uid = useId();
  const [q, setQ] = useQueryState("q");
  const [, setPage] = useQueryState("page", parseAsInteger);

  const [appliedFilters, setAppliedFilters] = useQueryStates({
    badge: parseAsArrayOf(parseAsString),
    genre: parseAsArrayOf(parseAsString),
    publisher: parseAsString,
    price: parseAsString,
  });

  const [draftSearch, setDraftSearch] = useState(q ?? "");
  const [draftBadges, setDraftBadges] = useState<string[]>(appliedFilters.badge ?? []);
  const [draftGenres, setDraftGenres] = useState<string[]>(appliedFilters.genre ?? []);
  const [draftPublisher, setDraftPublisher] = useState<string>(appliedFilters.publisher ?? "");
  const [draftPrice, setDraftPrice] = useState<string>(appliedFilters.price ?? "");

  const searchId = `${uid}-search`;
  const publisherId = `${uid}-publisher`;
  const priceId = `${uid}-price`;

  const handleApply = () => {
    const trimmedQ = draftSearch.trim();
    setQ(trimmedQ.length > 0 ? trimmedQ : null);
    setAppliedFilters({
      badge: draftBadges.length > 0 ? draftBadges : null,
      genre: draftGenres.length > 0 ? draftGenres : null,
      publisher: draftPublisher.length > 0 ? draftPublisher : null,
      price: draftPrice.length > 0 ? draftPrice : null,
    });
    // Committing filters always resets page to 1 (omitted from URL when 1).
    setPage(null);
    onApply?.();
  };

  const handleClearAll = () => {
    setDraftSearch("");
    setDraftBadges([]);
    setDraftGenres([]);
    setDraftPublisher("");
    setDraftPrice("");

    setQ(null);
    setAppliedFilters({
      badge: null,
      genre: null,
      publisher: null,
      price: null,
    });
    setPage(null);
    onApply?.();
  };

  const toggleBadge = (value: string, checked: boolean) => {
    setDraftBadges((prev) =>
      checked ? [...new Set([...prev, value])] : prev.filter((item) => item !== value),
    );
  };

  const toggleGenre = (value: string, checked: boolean) => {
    setDraftGenres((prev) =>
      checked ? [...new Set([...prev, value])] : prev.filter((item) => item !== value),
    );
  };

  return (
    <form
      role="search"
      aria-label="Product filters"
      onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}
      className="flex flex-col gap-6"
    >
      {/* Search Input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={searchId} className="text-sm font-medium">
          Search
        </Label>
        <Input
          id={searchId}
          type="search"
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
          placeholder="Search board games..."
          className="w-full"
        />
      </div>

      {/* Badges / Features */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-semibold text-foreground">Features</legend>
        <div className="flex flex-col gap-2 pt-1">
          {BADGE_OPTIONS.map((opt) => {
            const id = `${uid}-badge-${opt.value}`;
            return (
              <div key={opt.value} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={draftBadges.includes(opt.value)}
                  onCheckedChange={(checked) => toggleBadge(opt.value, checked)}
                />
                <label
                  htmlFor={id}
                  className="cursor-pointer text-sm font-normal text-muted-foreground select-none hover:text-foreground"
                >
                  {opt.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      {/* Genres */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-semibold text-foreground">Genre</legend>
        <div className="flex flex-col gap-2 pt-1">
          {GENRE_OPTIONS.map((opt) => {
            const id = `${uid}-genre-${opt.value}`;
            return (
              <div key={opt.value} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={draftGenres.includes(opt.value)}
                  onCheckedChange={(checked) => toggleGenre(opt.value, checked)}
                />
                <label
                  htmlFor={id}
                  className="cursor-pointer text-sm font-normal text-muted-foreground select-none hover:text-foreground"
                >
                  {opt.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      {/* Publisher (single select) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={publisherId} className="text-sm font-semibold text-foreground">
          Publisher
        </Label>
        <Select
          value={draftPublisher || "all"}
          onValueChange={(val) => setDraftPublisher(val === "all" || !val ? "" : val)}
        >
          <SelectTrigger id={publisherId} className="w-full">
            <SelectValue placeholder="All publishers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All publishers</SelectItem>
            {PUBLISHER_OPTIONS.map((pub) => (
              <SelectItem key={pub} value={pub}>
                {pub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Buckets (single select) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={priceId} className="text-sm font-semibold text-foreground">
          Price range
        </Label>
        <Select
          value={draftPrice || "all"}
          onValueChange={(val) => setDraftPrice(val === "all" || !val ? "" : val)}
        >
          <SelectTrigger id={priceId} className="w-full">
            <SelectValue placeholder="All prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All prices</SelectItem>
            {PRICE_BUCKETS.map((bucket) => (
              <SelectItem key={bucket.value} value={bucket.value}>
                {bucket.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" className="flex-1">
          Apply
        </Button>
        <Button type="button" variant="outline" onClick={handleClearAll} className="flex-1">
          Clear all
        </Button>
      </div>
    </form>
  );
}
