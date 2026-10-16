import { formatNumber } from "@/lib/format";

interface CatalogFacetCountProps {
  total: number;
  rangeStart: number;
  rangeEnd: number;
  empty: boolean;
}

export function CatalogFacetCount({
  total,
  rangeStart,
  rangeEnd,
  empty,
}: CatalogFacetCountProps) {
  let text: string;

  if (empty) {
    text = "No games match these filters";
  } else if (total === 1) {
    text = "1 game";
  } else {
    text = `${formatNumber(rangeStart)}–${formatNumber(rangeEnd)} of ${formatNumber(total)} games`;
  }

  return (
    <p
      aria-live="polite"
      className="text-sm text-muted-foreground tabular-nums"
    >
      {text}
    </p>
  );
}
