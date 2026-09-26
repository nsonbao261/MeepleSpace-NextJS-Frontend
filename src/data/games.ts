import "server-only";

import { faker } from "./seed";
import { slugify } from "@/lib/slug";
import type { Game } from "@/types/game";

const PLACEHOLDER_COVER = "/images/placeholder-cover.svg";

const CATEGORIES = [
  "strategy",
  "party",
  "cooperative",
  "euro",
  "deck-building",
  "worker-placement",
  "deduction",
  "engine-building",
  "negotiation",
  "family",
] as const;

type CatalogEntry = {
  name: string;
  bggId: number;
  playersMin: number;
  playersMax: number;
  playTimeMin: number;
  ageMin: number;
};

const CATALOG: CatalogEntry[] = [
  {
    name: "Catan",
    bggId: 13,
    playersMin: 3,
    playersMax: 4,
    playTimeMin: 90,
    ageMin: 10,
  },
  {
    name: "Wingspan",
    bggId: 266192,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 70,
    ageMin: 10,
  },
  {
    name: "Gloomhaven",
    bggId: 174430,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 150,
    ageMin: 14,
  },
  {
    name: "Pandemic",
    bggId: 1611,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 13,
  },
  {
    name: "Azul",
    bggId: 230802,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 45,
    ageMin: 8,
  },
  {
    name: "Ticket to Ride",
    bggId: 822,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 60,
    ageMin: 8,
  },
  {
    name: "Carcassonne",
    bggId: 948,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 45,
    ageMin: 7,
  },
  {
    name: "Codenames",
    bggId: 178900,
    playersMin: 4,
    playersMax: 8,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Splendor",
    bggId: 148228,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 30,
    ageMin: 13,
  },
  {
    name: "Scythe",
    bggId: 169385,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 115,
    ageMin: 14,
  },
  {
    name: "Terraforming Mars",
    bggId: 1677,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 120,
    ageMin: 13,
  },
  {
    name: "7 Wonders Duel",
    bggId: 170918,
    playersMin: 2,
    playersMax: 2,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Brass: Birmingham",
    bggId: 224517,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 120,
    ageMin: 14,
  },
  {
    name: "Ark Nova",
    bggId: 342942,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 150,
    ageMin: 12,
  },
  {
    name: "Root",
    bggId: 237182,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 90,
    ageMin: 12,
  },
  {
    name: "Everdell",
    bggId: 233854,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 80,
    ageMin: 12,
  },
  {
    name: "Spirit Island",
    bggId: 162886,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 120,
    ageMin: 13,
  },
  {
    name: "Sushi Go Party!",
    bggId: 127007,
    playersMin: 2,
    playersMax: 8,
    playTimeMin: 20,
    ageMin: 8,
  },
  {
    name: "The Crew",
    bggId: 284083,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 20,
    ageMin: 10,
  },
  {
    name: "Rising Sun",
    bggId: 275641,
    playersMin: 2,
    playersMax: 6,
    playTimeMin: 140,
    ageMin: 13,
  },
];

function buildGame(entry: CatalogEntry, index: number): Game {
  const price = faker.number.int({ min: 20, max: 320 }) * 10_000;
  const hasDiscount = faker.datatype.boolean({ probability: 0.4 });
  const createdAt = faker.date.past({ years: 2 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

  return {
    id: faker.string.uuid(),
    slug: slugify(entry.name),
    name: entry.name,
    description: faker.lorem.sentences({ min: 2, max: 4 }),
    imageUrl: PLACEHOLDER_COVER,
    price,
    compareAtPrice: hasDiscount
      ? Math.round(
          (price *
            faker.number.float({ min: 1.15, max: 1.4, fractionDigits: 2 })) /
            10_000,
        ) * 10_000
      : null,
    bggId: entry.bggId,
    playersMin: entry.playersMin,
    playersMax: entry.playersMax,
    playTimeMin: entry.playTimeMin,
    ageMin: entry.ageMin,
    weightGrams: faker.number.int({ min: 4, max: 28 }) * 100,
    stock: faker.number.int({ min: 0, max: 60 }),
    status:
      index < CATALOG.length - 2
        ? "active"
        : faker.helpers.arrayElement(["active", "draft", "archived"]),
    categories: faker.helpers
      .multiple(() => faker.helpers.arrayElement(CATEGORIES), {
        count: faker.number.int({ min: 1, max: 3 }),
      })
      .filter((value, position, all) => all.indexOf(value) === position),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

const GAMES: Game[] = CATALOG.map(buildGame);

export function mockGames(): Game[] {
  return GAMES;
}

export function getMockGameBySlug(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}
