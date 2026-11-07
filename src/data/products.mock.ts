import { faker, seedFaker } from "@/lib";
import { summarizeReviews } from "@/lib/reviews";
import type { Product, Review } from "@/types";

import { reviews } from "./reviews.mock";

seedFaker(42);

interface ProductSeed {
  slug: string;
  name: string;
  blurb?: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  genre: string;
  publisher: string;
  minPlayers: number;
  maxPlayers: number;
  minPlayTimeMinutes: number;
  maxPlayTimeMinutes: number;
  minAge: number;
  designer: string;
}

/** Hand-written Vietnamese-market catalogue. Two items are out of stock. */
const seeds: ProductSeed[] = [
  {
    slug: "catan",
    name: "Catan",
    blurb: "Trade, build, settle — the classic that starts every collection.",
    description:
      "Settle the island of Catan by gathering resources, building roads and trading with rivals. Every roll of the dice changes the board, so no two games play the same. The perfect first strategy game for families and new groups.",
    price: 1_190_000,
    originalPrice: 1_350_000,
    stock: 24,
    genre: "Strategy",
    publisher: "KOSMOS",
    minPlayers: 3,
    maxPlayers: 4,
    minPlayTimeMinutes: 60,
    maxPlayTimeMinutes: 120,
    minAge: 10,
    designer: "Klaus Teuber",
  },
  {
    slug: "wingspan",
    name: "Wingspan",
    blurb: "Attract birds to your wildlife preserve in this serene engine builder.",
    description:
      "Draw and play bird cards to build a thriving wildlife preserve across four habitats. Each bird adds a new action or bonus, creating a gentle engine that rewards planning. A relaxing, beautifully produced game that works solo or with a full table.",
    price: 1_450_000,
    stock: 18,
    genre: "Strategy",
    publisher: "Stonemaier Games",
    minPlayers: 1,
    maxPlayers: 5,
    minPlayTimeMinutes: 40,
    maxPlayTimeMinutes: 70,
    minAge: 10,
    designer: "Elizabeth Hargrave",
  },
  {
    slug: "ticket-to-ride-europe",
    name: "Ticket to Ride: Europe",
    blurb: "Claim railway routes across Europe — the friendliest gateway game.",
    description:
      "Collect train cards and claim routes linking Europe's great cities. Destination tickets send you across the continent while tunnels and ferries add small twists. Easy to teach, tense to finish and a reliable hit with any group.",
    price: 1_090_000,
    originalPrice: 1_250_000,
    stock: 15,
    genre: "Family",
    publisher: "Days of Wonder",
    minPlayers: 2,
    maxPlayers: 5,
    minPlayTimeMinutes: 30,
    maxPlayTimeMinutes: 60,
    minAge: 8,
    designer: "Alan R. Moon",
  },
  {
    slug: "azul",
    name: "Azul",
    blurb: "Draft colourful tiles to decorate the royal palace of Évora.",
    description:
      "Draft azulejo tiles and arrange them on your player board to score patterns. Take too many tiles and they spill onto the floor, costing you points. Simple rules, sharp decisions and a table that looks great in any light.",
    price: 790_000,
    stock: 30,
    genre: "Family",
    publisher: "Plan B Games",
    minPlayers: 2,
    maxPlayers: 4,
    minPlayTimeMinutes: 30,
    maxPlayTimeMinutes: 45,
    minAge: 8,
    designer: "Michael Kiesling",
  },
  {
    slug: "pandemic",
    name: "Pandemic",
    blurb: "Race against four spreading diseases as one team of specialists.",
    description:
      "Work together as a team of specialists to cure four diseases before they overrun the world. Every turn is a shared puzzle of movement, treatment and research. Cooperative play means everyone wins or loses together.",
    price: 950_000,
    stock: 0,
    genre: "Cooperative",
    publisher: "Z-Man Games",
    minPlayers: 2,
    maxPlayers: 4,
    minPlayTimeMinutes: 45,
    maxPlayTimeMinutes: 45,
    minAge: 8,
    designer: "Matt Leacock",
  },
  {
    slug: "carcassonne",
    name: "Carcassonne",
    description:
      "Build a medieval landscape tile by tile, placing followers on roads, cities and monasteries. Claim the right features at the right time to score the most points. A timeless tile-laying game that stays fresh after hundreds of plays.",
    price: 690_000,
    stock: 27,
    genre: "Family",
    publisher: "Hans im Glück",
    minPlayers: 2,
    maxPlayers: 5,
    minPlayTimeMinutes: 35,
    maxPlayTimeMinutes: 45,
    minAge: 7,
    designer: "Klaus-Jürgen Wrede",
  },
  {
    slug: "7-wonders",
    name: "7 Wonders",
    description:
      "Draft cards across three ages to develop your ancient city and build a wonder. Pass hands around the table, choosing military, science, commerce or culture. Supports up to seven players with almost no downtime.",
    price: 850_000,
    stock: 0,
    genre: "Strategy",
    publisher: "Repos Production",
    minPlayers: 3,
    maxPlayers: 7,
    minPlayTimeMinutes: 30,
    maxPlayTimeMinutes: 30,
    minAge: 10,
    designer: "Antoine Bauza",
  },
  {
    slug: "dixit",
    name: "Dixit",
    description:
      "Tell a story with a single card and let the table guess which image you meant. Dreamlike artwork leaves room for wild interpretations and surprising connections. A creative party game that works with family and friends alike.",
    price: 990_000,
    stock: 20,
    genre: "Party",
    publisher: "Libellud",
    minPlayers: 3,
    maxPlayers: 6,
    minPlayTimeMinutes: 30,
    maxPlayTimeMinutes: 30,
    minAge: 8,
    designer: "Jean-Louis Roubira",
  },
  {
    slug: "codenames",
    name: "Codenames",
    description:
      "Two spymasters give one-word clues so their teams can find the right agents on a grid of words. Simple to explain, endlessly tense to play, and best with a loud table. A modern party staple for groups of any size.",
    price: 450_000,
    stock: 40,
    genre: "Party",
    publisher: "Czech Games Edition",
    minPlayers: 2,
    maxPlayers: 8,
    minPlayTimeMinutes: 15,
    maxPlayTimeMinutes: 15,
    minAge: 14,
    designer: "Vlaada Chvátil",
  },
  {
    slug: "ultimate-werewolf",
    name: "Ultimate Werewolf",
    description:
      "A social deduction game where villagers try to unmask hidden werewolves before it is too late. Dozens of roles and a moderator guide let you scale from a small group to a full party. Best played loud, late and with friends.",
    price: 390_000,
    stock: 55,
    genre: "Party",
    publisher: "Asmodee",
    minPlayers: 5,
    maxPlayers: 68,
    minPlayTimeMinutes: 30,
    maxPlayTimeMinutes: 60,
    minAge: 13,
    designer: "Ted Alspach",
  },
  {
    slug: "exploding-kittens",
    name: "Exploding Kittens",
    description:
      "Take turns drawing cards while avoiding the exploding kittens hidden in the deck. Use defuses, skips and attacks to survive and outlast everyone else. Fast, silly and perfect for a quick round between bigger games.",
    price: 520_000,
    stock: 33,
    genre: "Party",
    publisher: "Exploding Kittens",
    minPlayers: 2,
    maxPlayers: 5,
    minPlayTimeMinutes: 15,
    maxPlayTimeMinutes: 15,
    minAge: 7,
    designer: "Elan Lee, Matthew Inman",
  },
  {
    slug: "everdell",
    name: "Everdell",
    blurb: "Build a woodland city under the branches of the Ever Tree.",
    description:
      "Lead a woodland community through the seasons, placing workers to gather resources and play creature cards. The three-dimensional tree and lavish components make every table feel special. A deeper worker-placement game with a warm theme.",
    price: 1_290_000,
    originalPrice: 1_490_000,
    stock: 14,
    genre: "Strategy",
    publisher: "Starling Games",
    minPlayers: 1,
    maxPlayers: 4,
    minPlayTimeMinutes: 40,
    maxPlayTimeMinutes: 80,
    minAge: 13,
    designer: "James A. Wilson",
  },
  {
    slug: "brass-birmingham",
    name: "Brass: Birmingham",
    description:
      "Build canals, railways and industries across the industrial heartland of England. Every decision is tight, from network links to coal and iron demand. A heavy economic strategy game with a well-earned reputation.",
    price: 1_690_000,
    stock: 8,
    genre: "Strategy",
    publisher: "Roxley Games",
    minPlayers: 2,
    maxPlayers: 4,
    minPlayTimeMinutes: 60,
    maxPlayTimeMinutes: 120,
    minAge: 14,
    designer: "Gavan Brown, Matt Tolman, Martin Wallace",
  },
  {
    slug: "gloomhaven-jaws-of-the-lion",
    name: "Gloomhaven: Jaws of the Lion",
    description:
      "Fight through a branching campaign in this streamlined introduction to Gloomhaven. Pick a class, level up and tackle tactical scenarios with a small group. A complete story-driven experience that also works well solo.",
    price: 1_590_000,
    stock: 16,
    genre: "Cooperative",
    publisher: "Cephalofair Games",
    minPlayers: 1,
    maxPlayers: 4,
    minPlayTimeMinutes: 30,
    maxPlayTimeMinutes: 120,
    minAge: 14,
    designer: "Isaac Childres",
  },
  {
    slug: "splendor",
    name: "Splendor",
    blurb: "Collect gems to build the most influential Renaissance merchant empire.",
    description:
      "Buy gem mines and city cards to grow a merchant empire and attract the nobility. Engine building stays clean and quick, making every turn feel rewarding. A compact, elegant game that plays well at two or four players.",
    price: 890_000,
    stock: 25,
    genre: "Family",
    publisher: "Space Cowboys",
    minPlayers: 2,
    maxPlayers: 4,
    minPlayTimeMinutes: 30,
    maxPlayTimeMinutes: 30,
    minAge: 10,
    designer: "Marc André",
  },
];

const reviewsByProduct = new Map<string, Review[]>();
for (const review of reviews) {
  const bucket = reviewsByProduct.get(review.productId) ?? [];
  bucket.push(review);
  reviewsByProduct.set(review.productId, bucket);
}

const baseProducts: Product[] = seeds.map((seed) => {
  const id = `prd_${seed.slug}`;
  const summary = summarizeReviews(reviewsByProduct.get(id) ?? []);

  return {
    id,
    slug: seed.slug,
    name: seed.name,
    blurb: seed.blurb,
    description: seed.description,
    price: seed.price,
    originalPrice: seed.originalPrice,
    rating: summary.average,
    reviewCount: summary.count,
    image: "/assets/images/products/placeholder.svg",
    imageAlt: `${seed.name} board game box cover`,
    stock: seed.stock,
    salesCount: faker.number.int({ min: 10, max: 9_999 }),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    genre: seed.genre,
    publisher: seed.publisher,
    isNew: false,
    isBestSeller: false,
    minPlayers: seed.minPlayers,
    maxPlayers: seed.maxPlayers,
    minPlayTimeMinutes: seed.minPlayTimeMinutes,
    maxPlayTimeMinutes: seed.maxPlayTimeMinutes,
    minAge: seed.minAge,
    designer: seed.designer,
  };
});

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
