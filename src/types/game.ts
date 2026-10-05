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

  ratingValue: number;
  ratingCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
};
