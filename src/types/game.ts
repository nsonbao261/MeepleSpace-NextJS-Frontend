export const GAME_STATUSES = ["draft", "active", "archived"] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];

export type Game = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  compareAtPrice: number | null;
  publisher: string;
  publishedYear: number;
  playersMin: number;
  playersMax: number;
  playTimeMin: number;
  ageMin: number;
  weightGrams: number;
  stock: number;
  status: GameStatus;
  categories: string[];
  /**
   * Average rating on a 0-5 scale with one decimal place, not BGG's native 0-10,
   * because the card renders stars. `ratingCount === 0` implies
   * `ratingValue === 0`: the count is tested first, so the two must never
   * disagree. The 0-10 -> 0-5 conversion is owed exactly once, at the API
   * boundary mapper, when the real backend lands. Never leak it into components.
   */
  ratingValue: number;
  ratingCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
};
