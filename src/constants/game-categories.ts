export const CATEGORY_LABELS = {
  strategy: "Strategy",
  party: "Party",
  cooperative: "Cooperative",
  euro: "Euro",
  "deck-building": "Deck Building",
  "worker-placement": "Worker Placement",
  deduction: "Deduction",
  "engine-building": "Engine Building",
  negotiation: "Negotiation",
  family: "Family",
} as const;

export type CategorySlug = keyof typeof CATEGORY_LABELS;

export function categoryLabel(slug: string): string | undefined {
  return CATEGORY_LABELS[slug as CategorySlug];
}
