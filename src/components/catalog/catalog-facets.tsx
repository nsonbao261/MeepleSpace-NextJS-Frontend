"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AGE_OPTIONS,
  BADGE_OPTIONS,
  PLAYER_BUCKETS,
  PLAY_TIME_BUCKETS,
  RATING_OPTIONS,
} from "@/constants/catalog-filters";
import { formatPrice } from "@/lib/format";
import type {
  CatalogFilters,
  CategoryOption,
  FacetCounts,
  PriceBounds,
  PublisherOption,
} from "@/types/catalog";
import type { CategorySlug } from "@/constants/game-categories";

import { useCatalogParams } from "./use-catalog-params";

const ALL_PUBLISHERS_VALUE = "__all__";
const ANY_VALUE = "any";

interface CatalogFacetsProps {
  variant: "sidebar" | "sheet";
  filters: CatalogFilters;
  priceBounds: PriceBounds;
  publishers: PublisherOption[];
  categories: CategoryOption[];
  facetCounts: FacetCounts;
}

interface FacetGroupProps {
  id: string;
  title: string;
  variant: "sidebar" | "sheet";
  children: React.ReactNode;
}

function FacetGroup({ id, title, variant, children }: FacetGroupProps) {
  const headingId = `${id}-heading`;
  const heading = (
    <span id={headingId} className="text-sm font-medium text-foreground">
      {title}
    </span>
  );

  const body = (
    <div
      role="group"
      aria-labelledby={headingId}
      className="flex flex-col gap-2.5"
    >
      {children}
    </div>
  );

  if (variant === "sheet") {
    return (
      <AccordionItem value={id}>
        <AccordionTrigger className="hover:no-underline focus-visible:no-underline">
          {heading}
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-2">{body}</div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 py-4">
      <h2 id={headingId} className="text-sm font-medium text-foreground">
        {title}
      </h2>
      {body}
    </div>
  );
}

function orderPrices(
  min: number | null,
  max: number | null,
): [number | null, number | null] {
  if (min !== null && max !== null && min > max) {
    return [max, min];
  }

  return [min, max];
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function CatalogFacets({
  variant,
  filters,
  priceBounds,
  publishers,
  categories,
  facetCounts,
}: CatalogFacetsProps) {
  const { setFilters } = useCatalogParams(filters);
  const minId = useId();
  const maxId = useId();

  const [minInput, setMinInput] = useState(
    filters.priceMin === null ? "" : String(filters.priceMin),
  );
  const [maxInput, setMaxInput] = useState(
    filters.priceMax === null ? "" : String(filters.priceMax),
  );

  const lastMinRef = useRef(filters.priceMin);
  const lastMaxRef = useRef(filters.priceMax);

  useEffect(() => {
    if (lastMinRef.current !== filters.priceMin) {
      lastMinRef.current = filters.priceMin;
      setMinInput(filters.priceMin === null ? "" : String(filters.priceMin));
    }
  }, [filters.priceMin]);

  useEffect(() => {
    if (lastMaxRef.current !== filters.priceMax) {
      lastMaxRef.current = filters.priceMax;
      setMaxInput(filters.priceMax === null ? "" : String(filters.priceMax));
    }
  }, [filters.priceMax]);

  const publisherValue = filters.publisher ?? ALL_PUBLISHERS_VALUE;

  const ratingValue = useMemo(
    () => (filters.rating === null ? [ANY_VALUE] : [String(filters.rating)]),
    [filters.rating],
  );

  const ageValue = useMemo(
    () => (filters.ageMax === null ? [ANY_VALUE] : [String(filters.ageMax)]),
    [filters.ageMax],
  );

  const commitPrices = useCallback(() => {
    const minParsed =
      minInput.trim() === ""
        ? null
        : Number.isNaN(Number(minInput.trim()))
          ? null
          : Number(minInput.trim());
    const maxParsed =
      maxInput.trim() === ""
        ? null
        : Number.isNaN(Number(maxInput.trim()))
          ? null
          : Number(maxInput.trim());

    const [min, max] = orderPrices(minParsed, maxParsed);

    setFilters({ priceMin: min, priceMax: max });
  }, [minInput, maxInput, setFilters]);

  const handleMinBlur = useCallback(() => {
    commitPrices();
  }, [commitPrices]);

  const handleMaxBlur = useCallback(() => {
    commitPrices();
  }, [commitPrices]);

  const handleMinKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.currentTarget.blur();
      }
    },
    [],
  );

  const handleMaxKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.currentTarget.blur();
      }
    },
    [],
  );

  const handlePublisherChange = useCallback(
    (value: string) => {
      const next = value === ALL_PUBLISHERS_VALUE ? null : value;
      setFilters({ publisher: next });
    },
    [setFilters],
  );

  const handleRatingChange = useCallback(
    (values: string[]) => {
      if (values.length === 0 || values.includes(ANY_VALUE)) {
        setFilters({ rating: null });
        return;
      }

      const first = values[0];
      const parsed = Number(first);

      if (!Number.isNaN(parsed)) {
        const threshold = parsed as 3.5 | 4 | 4.5;
        setFilters({ rating: threshold });
      }
    },
    [setFilters],
  );

  const handleAgeChange = useCallback(
    (values: string[]) => {
      if (values.length === 0 || values.includes(ANY_VALUE)) {
        setFilters({ ageMax: null });
        return;
      }

      const first = values[0];
      const parsed = Number(first);

      if (!Number.isNaN(parsed)) {
        const threshold = parsed as 6 | 8 | 10 | 12 | 14;
        setFilters({ ageMax: threshold });
      }
    },
    [setFilters],
  );

  const handleCategoryToggle = useCallback(
    (slug: CategorySlug) => {
      setFilters({ categories: toggleValue(filters.categories, slug) });
    },
    [filters.categories, setFilters],
  );

  const handlePlayerToggle = useCallback(
    (bucket: (typeof PLAYER_BUCKETS)[number]["value"]) => {
      setFilters({ players: toggleValue(filters.players, bucket) });
    },
    [filters.players, setFilters],
  );

  const handleTimeToggle = useCallback(
    (bucket: (typeof PLAY_TIME_BUCKETS)[number]["value"]) => {
      setFilters({ playTimes: toggleValue(filters.playTimes, bucket) });
    },
    [filters.playTimes, setFilters],
  );

  const handleBadgeToggle = useCallback(
    (badge: (typeof BADGE_OPTIONS)[number]["value"]) => {
      setFilters({ badges: toggleValue(filters.badges, badge) });
    },
    [filters.badges, setFilters],
  );

  const minDisplay = minInput.trim() === "" ? null : Number(minInput.trim());
  const maxDisplay = maxInput.trim() === "" ? null : Number(maxInput.trim());

  const content = (
    <div className={variant === "sidebar" ? "divide-y" : undefined}>
      <FacetGroup id="category" title="Category" variant={variant}>
        {categories.map((option) => {
          const checked = filters.categories.includes(option.slug);
          return (
            <label
              key={option.slug}
              className="flex items-center gap-2 text-sm"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleCategoryToggle(option.slug)}
              />
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {option.count}
              </span>
            </label>
          );
        })}
      </FacetGroup>

      <FacetGroup id="publisher" title="Publisher" variant={variant}>
        <Select
          value={publisherValue}
          onValueChange={(value) =>
            handlePublisherChange(String(value ?? ALL_PUBLISHERS_VALUE))
          }
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue placeholder="All publishers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_PUBLISHERS_VALUE}>All publishers</SelectItem>
            {publishers.map((option) => (
              <SelectItem key={option.name} value={option.name}>
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="truncate">{option.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {option.count}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FacetGroup>

      <FacetGroup id="price" title="Price" variant={variant}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor={minId} className="text-xs font-medium">
              Min price
            </label>
            <Input
              id={minId}
              inputMode="numeric"
              value={minInput}
              onChange={(event) => setMinInput(event.target.value)}
              onBlur={handleMinBlur}
              onKeyDown={handleMinKeyDown}
              placeholder={formatPrice(priceBounds.min)}
            />
            <p
              aria-hidden="true"
              className="text-xs text-muted-foreground tabular-nums"
            >
              {minDisplay === null ? null : formatPrice(minDisplay)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={maxId} className="text-xs font-medium">
              Max price
            </label>
            <Input
              id={maxId}
              inputMode="numeric"
              value={maxInput}
              onChange={(event) => setMaxInput(event.target.value)}
              onBlur={handleMaxBlur}
              onKeyDown={handleMaxKeyDown}
              placeholder={formatPrice(priceBounds.max)}
            />
            <p
              aria-hidden="true"
              className="text-xs text-muted-foreground tabular-nums"
            >
              {maxDisplay === null ? null : formatPrice(maxDisplay)}
            </p>
          </div>
        </div>
      </FacetGroup>

      <FacetGroup id="rating" title="Rating" variant={variant}>
        <ToggleGroup
          value={ratingValue}
          onValueChange={handleRatingChange}
          multiple={false}
          spacing={2}
          orientation="horizontal"
          className="flex flex-wrap gap-2"
        >
          <ToggleGroupItem value={ANY_VALUE} size="sm">
            Any
          </ToggleGroupItem>
          {RATING_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={String(option.value)}
              value={String(option.value)}
              size="sm"
            >
              {option.label}
              <span className="ml-1 text-xs text-muted-foreground tabular-nums">
                {facetCounts.rating[String(option.value)] ?? 0}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FacetGroup>

      <FacetGroup id="players" title="Players" variant={variant}>
        {PLAYER_BUCKETS.map((option) => {
          const checked = filters.players.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => handlePlayerToggle(option.value)}
              />
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {facetCounts.players[option.value] ?? 0}
              </span>
            </label>
          );
        })}
      </FacetGroup>

      <FacetGroup id="playTime" title="Play time" variant={variant}>
        {PLAY_TIME_BUCKETS.map((option) => {
          const checked = filters.playTimes.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleTimeToggle(option.value)}
              />
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {facetCounts.playTime[option.value] ?? 0}
              </span>
            </label>
          );
        })}
      </FacetGroup>

      <FacetGroup id="age" title="Age" variant={variant}>
        <ToggleGroup
          value={ageValue}
          onValueChange={handleAgeChange}
          multiple={false}
          spacing={2}
          orientation="horizontal"
          className="flex flex-wrap gap-2"
        >
          <ToggleGroupItem value={ANY_VALUE} size="sm">
            Any
          </ToggleGroupItem>
          {AGE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={String(option.value)}
              value={String(option.value)}
              size="sm"
            >
              {option.label}
              <span className="ml-1 text-xs text-muted-foreground tabular-nums">
                {facetCounts.age[String(option.value)] ?? 0}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FacetGroup>

      <FacetGroup id="badge" title="Badge" variant={variant}>
        {BADGE_OPTIONS.map((option) => {
          const checked = filters.badges.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleBadgeToggle(option.value)}
              />
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {facetCounts.badge[option.value] ?? 0}
              </span>
            </label>
          );
        })}
      </FacetGroup>
    </div>
  );

  if (variant === "sheet") {
    return <Accordion multiple>{content.props.children}</Accordion>;
  }

  return content;
}
