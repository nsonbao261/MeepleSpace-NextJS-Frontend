import { faker, seedFaker } from "@/lib";

import type { Product } from "@/types";

seedFaker(42);

interface ProductSeed {
  slug: string;
  name: string;
  blurb?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  genre: string;
  publisher: string;
}

/** Hand-written Vietnamese-market catalogue. Two items are out of stock. */
const seeds: ProductSeed[] = [
  {
    slug: "catan",
    name: "Catan",
    blurb: "Trade, build, settle — the classic that starts every collection.",
    price: 1_190_000,
    originalPrice: 1_350_000,
    stock: 24,
    genre: "Strategy",
    publisher: "KOSMOS",
  },
  {
    slug: "wingspan",
    name: "Wingspan",
    blurb: "Attract birds to your wildlife preserve in this serene engine builder.",
    price: 1_450_000,
    stock: 18,
    genre: "Strategy",
    publisher: "Stonemaier Games",
  },
  {
    slug: "ticket-to-ride-europe",
    name: "Ticket to Ride: Europe",
    blurb: "Claim railway routes across Europe — the friendliest gateway game.",
    price: 1_090_000,
    originalPrice: 1_250_000,
    stock: 15,
    genre: "Family",
    publisher: "Days of Wonder",
  },
  {
    slug: "azul",
    name: "Azul",
    blurb: "Draft colourful tiles to decorate the royal palace of Évora.",
    price: 790_000,
    stock: 30,
    genre: "Family",
    publisher: "Plan B Games",
  },
  {
    slug: "pandemic",
    name: "Pandemic",
    blurb: "Race against four spreading diseases as one team of specialists.",
    price: 950_000,
    stock: 0,
    genre: "Cooperative",
    publisher: "Z-Man Games",
  },
  {
    slug: "carcassonne",
    name: "Carcassonne",
    price: 690_000,
    stock: 27,
    genre: "Family",
    publisher: "Hans im Glück",
  },
  {
    slug: "7-wonders",
    name: "7 Wonders",
    price: 850_000,
    stock: 0,
    genre: "Strategy",
    publisher: "Repos Production",
  },
  {
    slug: "dixit",
    name: "Dixit",
    price: 990_000,
    stock: 20,
    genre: "Party",
    publisher: "Libellud",
  },
  {
    slug: "codenames",
    name: "Codenames",
    price: 450_000,
    stock: 40,
    genre: "Party",
    publisher: "Czech Games Edition",
  },
  {
    slug: "ultimate-werewolf",
    name: "Ultimate Werewolf",
    price: 390_000,
    stock: 55,
    genre: "Party",
    publisher: "Asmodee",
  },
  {
    slug: "exploding-kittens",
    name: "Exploding Kittens",
    price: 520_000,
    stock: 33,
    genre: "Party",
    publisher: "Exploding Kittens",
  },
  {
    slug: "everdell",
    name: "Everdell",
    price: 1_290_000,
    originalPrice: 1_490_000,
    stock: 14,
    genre: "Strategy",
    publisher: "Starling Games",
  },
  {
    slug: "brass-birmingham",
    name: "Brass: Birmingham",
    price: 1_690_000,
    stock: 8,
    genre: "Strategy",
    publisher: "Roxley Games",
  },
  {
    slug: "gloomhaven-jaws-of-the-lion",
    name: "Gloomhaven: Jaws of the Lion",
    price: 1_590_000,
    stock: 16,
    genre: "Cooperative",
    publisher: "Cephalofair Games",
  },
  {
    slug: "splendor",
    name: "Splendor",
    blurb: "Collect gems to build the most influential Renaissance merchant empire.",
    price: 890_000,
    stock: 25,
    genre: "Family",
    publisher: "Space Cowboys",
  },
];

const baseProducts: Product[] = seeds.map((seed) => ({
  id: `prd_${seed.slug}`,
  slug: seed.slug,
  name: seed.name,
  blurb: seed.blurb,
  price: seed.price,
  originalPrice: seed.originalPrice,
  rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
  reviewCount: faker.number.int({ min: 5, max: 480 }),
  image: "/assets/images/products/placeholder.svg",
  imageAlt: `${seed.name} board game box cover`,
  stock: seed.stock,
  salesCount: faker.number.int({ min: 10, max: 9_999 }),
  createdAt: faker.date.past({ years: 2 }).toISOString(),
  kind: "base" as const,
  genre: seed.genre,
  publisher: seed.publisher,
  isNew: false,
  isBestSeller: false,
}));

// Derive top 5 newest by createdAt
const newestIds = new Set(
  [...baseProducts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((p) => p.id),
);

// Derive top 5 best sellers by salesCount
const bestSellerIds = new Set(
  [...baseProducts]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5)
    .map((p) => p.id),
);

export const products: Product[] = baseProducts.map((p) => ({
  ...p,
  isNew: newestIds.has(p.id),
  isBestSeller: bestSellerIds.has(p.id),
}));

/** Products with a blurb form the rotating Daily Pick pool. */
export const curated: Product[] = products.filter((product) => product.blurb !== undefined);
