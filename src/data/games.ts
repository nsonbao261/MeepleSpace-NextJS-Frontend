import "server-only";

import { faker } from "./seed";
import { slugify } from "@/lib/slug";
import { CATEGORY_LABELS } from "@/constants/game-categories";
import type { Game, GameStatus } from "@/types/game";

const REFERENCE_DATE = new Date("2026-09-26T00:00:00.000Z");

const MS_PER_DAY = 86_400_000;

const COVER_IMAGE = "/images/cover.svg";

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
] as const satisfies readonly (keyof typeof CATEGORY_LABELS)[];

type CatalogEntry = {
  name: string;
  publisher: string;
  publishedYear: number;
  playersMin: number;
  playersMax: number;
  playTimeMin: number;
  ageMin: number;
};

const CATALOG: CatalogEntry[] = [
  {
    name: "Catan",
    publisher: "Kosmos",
    publishedYear: 1995,
    playersMin: 3,
    playersMax: 4,
    playTimeMin: 90,
    ageMin: 10,
  },
  {
    name: "Wingspan",
    publisher: "Stonemaier Games",
    publishedYear: 2019,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 70,
    ageMin: 10,
  },
  {
    name: "Gloomhaven",
    publisher: "Cephalofair Games",
    publishedYear: 2017,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 150,
    ageMin: 14,
  },
  {
    name: "Pandemic",
    publisher: "Z-Man Games",
    publishedYear: 2007,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 13,
  },
  {
    name: "Azul",
    publisher: "Plan B Games",
    publishedYear: 2017,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 45,
    ageMin: 8,
  },
  {
    name: "Ticket to Ride",
    publisher: "Days of Wonder",
    publishedYear: 2004,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 60,
    ageMin: 8,
  },
  {
    name: "Carcassonne",
    publisher: "Z-Man Games",
    publishedYear: 2000,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 45,
    ageMin: 7,
  },
  {
    name: "Codenames",
    publisher: "Iello",
    publishedYear: 2015,
    playersMin: 4,
    playersMax: 8,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Splendor",
    publisher: "Space Cowboys",
    publishedYear: 2014,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 30,
    ageMin: 13,
  },
  {
    name: "Scythe",
    publisher: "Stonemaier Games",
    publishedYear: 2016,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 115,
    ageMin: 14,
  },
  {
    name: "Terraforming Mars",
    publisher: "Fryx Games",
    publishedYear: 2016,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 120,
    ageMin: 13,
  },
  {
    name: "7 Wonders Duel",
    publisher: "Asmodee",
    publishedYear: 2015,
    playersMin: 2,
    playersMax: 2,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Brass: Birmingham",
    publisher: "Roxley",
    publishedYear: 2018,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 120,
    ageMin: 14,
  },
  {
    name: "Ark Nova",
    publisher: "Capstone Games",
    publishedYear: 2021,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 150,
    ageMin: 12,
  },
  {
    name: "Root",
    publisher: "Leder Games",
    publishedYear: 2018,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 90,
    ageMin: 12,
  },
  {
    name: "Everdell",
    publisher: "ThunderGryph Games",
    publishedYear: 2018,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 80,
    ageMin: 12,
  },
  {
    name: "Spirit Island",
    publisher: "Greater Than Games",
    publishedYear: 2017,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 120,
    ageMin: 13,
  },
  {
    name: "Sushi Go Party!",
    publisher: "Oink Games",
    publishedYear: 2018,
    playersMin: 2,
    playersMax: 8,
    playTimeMin: 20,
    ageMin: 8,
  },
  {
    name: "The Crew",
    publisher: "Kosmos",
    publishedYear: 2019,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 20,
    ageMin: 10,
  },
  {
    name: "Rising Sun",
    publisher: "Oink Games",
    publishedYear: 2018,
    playersMin: 2,
    playersMax: 6,
    playTimeMin: 140,
    ageMin: 13,
  },
  {
    name: "Dominion",
    publisher: "Rio Grande Games",
    publishedYear: 2008,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 30,
    ageMin: 13,
  },
  {
    name: "Clank!: A Deck-Building Adventure",
    publisher: "Asmodee",
    publishedYear: 2016,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 30,
    ageMin: 13,
  },
  {
    name: "Legendary: A Marvel Deck Building Game",
    publisher: "Fantasy Flight Games",
    publishedYear: 2014,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 45,
    ageMin: 13,
  },
  {
    name: "Star Realms",
    publisher: "Fantasy Flight Games",
    publishedYear: 2014,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 20,
    ageMin: 12,
  },
  {
    name: "Android: Netrunner",
    publisher: "Fantasy Flight Games",
    publishedYear: 2012,
    playersMin: 2,
    playersMax: 2,
    playTimeMin: 30,
    ageMin: 14,
  },
  {
    name: "Aeon's End",
    publisher: "Awaken Realms",
    publishedYear: 2016,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 30,
    ageMin: 12,
  },
  {
    name: "Sentinels of the Multiverse",
    publisher: "Greater Than Games",
    publishedYear: 2012,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 45,
    ageMin: 13,
  },
  {
    name: "Pandemic Legacy: Season 1",
    publisher: "Z-Man Games",
    publishedYear: 2015,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 13,
  },
  {
    name: "The Resistance: Avalon",
    publisher: "Indie Boards & Cards",
    publishedYear: 2012,
    playersMin: 5,
    playersMax: 10,
    playTimeMin: 60,
    ageMin: 13,
  },
  {
    name: "In the Hall of the Dragon King",
    publisher: "Iello",
    publishedYear: 2016,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 12,
  },
  {
    name: "Agricola",
    publisher: "Lookout Spiele",
    publishedYear: 2007,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 150,
    ageMin: 13,
  },
  {
    name: "Le Havre",
    publisher: "Lookout Spiele",
    publishedYear: 2009,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 150,
    ageMin: 12,
  },
  {
    name: "Bora Bora",
    publisher: "Kosmos",
    publishedYear: 2017,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 60,
    ageMin: 12,
  },
  {
    name: "Lorenzo il Magnifico",
    publisher: "Hub Games",
    publishedYear: 2015,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 90,
    ageMin: 12,
  },
  {
    name: "Stone Age",
    publisher: "Hans im Glück",
    publishedYear: 2017,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 90,
    ageMin: 13,
  },
  {
    name: "Concordia",
    publisher: "Rio Grande Games",
    publishedYear: 2013,
    playersMin: 2,
    playersMax: 6,
    playTimeMin: 60,
    ageMin: 13,
  },
  {
    name: "Tikal II",
    publisher: "Rio Grande Games",
    publishedYear: 2020,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 12,
  },
  {
    name: "Macao",
    publisher: "Rio Grande Games",
    publishedYear: 2013,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 90,
    ageMin: 12,
  },
  {
    name: "It's a Wonderful World",
    publisher: "Passe Temps",
    publishedYear: 2015,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 10,
  },
  {
    name: "Century: Spice Road",
    publisher: "Plan B Games",
    publishedYear: 2018,
    playersMin: 1,
    playersMax: 4,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Jaipur",
    publisher: "World of Games",
    publishedYear: 2019,
    playersMin: 2,
    playersMax: 2,
    playTimeMin: 30,
    ageMin: 8,
  },
  {
    name: "Great Western Trail",
    publisher: "NSKN",
    publishedYear: 2019,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 120,
    ageMin: 12,
  },
  {
    name: "Trajan",
    publisher: "Kosmos",
    publishedYear: 2019,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 12,
  },
  {
    name: "Mysterium",
    publisher: "Iello",
    publishedYear: 2015,
    playersMin: 2,
    playersMax: 7,
    playTimeMin: 45,
    ageMin: 10,
  },
  {
    name: "Concept",
    publisher: "Asmodee",
    publishedYear: 2019,
    playersMin: 2,
    playersMax: 8,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Cluedo",
    publisher: "Hasbro",
    publishedYear: 1949,
    playersMin: 2,
    playersMax: 6,
    playTimeMin: 60,
    ageMin: 8,
  },
  {
    name: "Camel Up",
    publisher: "Kosmos",
    publishedYear: 2014,
    playersMin: 2,
    playersMax: 8,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Wavelength",
    publisher: "Red Raven Games",
    publishedYear: 2019,
    playersMin: 2,
    playersMax: 10,
    playTimeMin: 45,
    ageMin: 10,
  },
  {
    name: "Qwixx",
    publisher: "Schmidt Spiele",
    publishedYear: 2014,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 15,
    ageMin: 6,
  },
  {
    name: "Dixit",
    publisher: "Libellud",
    publishedYear: 2008,
    playersMin: 3,
    playersMax: 8,
    playTimeMin: 30,
    ageMin: 8,
  },
  {
    name: "Exploding Kittens",
    publisher: "Asmodee",
    publishedYear: 2012,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 15,
    ageMin: 7,
  },
  {
    name: "6 nimmt!",
    publisher: "Amigo",
    publishedYear: 1994,
    playersMin: 2,
    playersMax: 10,
    playTimeMin: 30,
    ageMin: 7,
  },
  {
    name: "Small World",
    publisher: "Days of Wonder",
    publishedYear: 2009,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 60,
    ageMin: 10,
  },
  {
    name: "Race for the Galaxy",
    publisher: "Fantasy Flight Games",
    publishedYear: 2007,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 60,
    ageMin: 10,
  },
  {
    name: "Castles of Burgundy",
    publisher: "Z-Man Games",
    publishedYear: 2011,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 90,
    ageMin: 12,
  },
  {
    name: "Alhambra",
    publisher: "Amigo",
    publishedYear: 2014,
    playersMin: 1,
    playersMax: 5,
    playTimeMin: 60,
    ageMin: 8,
  },
  {
    name: "Kingdomino",
    publisher: "Space Cowboys",
    publishedYear: 2015,
    playersMin: 2,
    playersMax: 4,
    playTimeMin: 30,
    ageMin: 8,
  },
  {
    name: "Splendor Duel",
    publisher: "Space Cowboys",
    publishedYear: 2017,
    playersMin: 2,
    playersMax: 2,
    playTimeMin: 30,
    ageMin: 10,
  },
  {
    name: "Targi",
    publisher: "Kosmos",
    publishedYear: 2012,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 30,
    ageMin: 12,
  },
  {
    name: "Imperial Settlers",
    publisher: "Storm Citadel",
    publishedYear: 2014,
    playersMin: 2,
    playersMax: 5,
    playTimeMin: 60,
    ageMin: 12,
  },
];

function assertUniqueSlugs(entries: CatalogEntry[]) {
  const seen = new Set<string>();

  for (const entry of entries) {
    const slug = slugify(entry.name);
    if (seen.has(slug)) {
      throw new Error(
        `Duplicate catalog slug "${slug}" from "${entry.name}". A collision would ` +
          `overwrite a cover file and mis-route the product page.`,
      );
    }
    seen.add(slug);
  }
}

assertUniqueSlugs(CATALOG);

function buildGame(entry: CatalogEntry, index: number): Game {
  const slug = slugify(entry.name);
  const price = faker.number.int({ min: 20, max: 320 }) * 10_000;
  const hasDiscount = faker.datatype.boolean({ probability: 0.4 });
  const createdAt = faker.date.past({ years: 1.5, refDate: REFERENCE_DATE });
  const updatedAt = faker.date.between({ from: createdAt, to: REFERENCE_DATE });
  const ageInDays =
    (REFERENCE_DATE.getTime() - createdAt.getTime()) / MS_PER_DAY;

  const isUnrated =
    ageInDays < 150 && faker.datatype.boolean({ probability: 0.3 });

  const soldCount = isUnrated
    ? Math.floor(faker.number.float() ** 2 * 30)
    : Math.floor(faker.number.float() ** 5 * 800);

  const ratingCount = isUnrated
    ? 0
    : Math.max(
        1,
        Math.min(
          4000,
          Math.round(soldCount * (0.6 + faker.number.float({ max: 2.4 }))),
        ),
      );

  const ratingValue =
    ratingCount === 0
      ? 0
      : Math.min(
          5,
          Math.round(faker.number.float({ min: 3.4, max: 4.7 }) * 10) / 10,
        );

  const status: GameStatus =
    index < CATALOG.length - 2
      ? "active"
      : index === CATALOG.length - 2
        ? "draft"
        : "archived";

  return {
    id: faker.string.uuid(),
    slug,
    name: entry.name,
    description: faker.lorem.sentences({ min: 2, max: 4 }),
    imageUrl: COVER_IMAGE,
    price,
    compareAtPrice: hasDiscount
      ? Math.round(
          (price *
            faker.number.float({ min: 1.15, max: 1.4, fractionDigits: 2 })) /
            10_000,
        ) * 10_000
      : null,
    publisher: entry.publisher,
    publishedYear: entry.publishedYear,
    playersMin: entry.playersMin,
    playersMax: entry.playersMax,
    playTimeMin: entry.playTimeMin,
    ageMin: entry.ageMin,
    weightGrams: faker.number.int({ min: 4, max: 28 }) * 100,
    stock: faker.number.int({ min: 0, max: 60 }),
    status,
    categories: faker.helpers
      .multiple(() => faker.helpers.arrayElement(CATEGORIES), {
        count: faker.number.int({ min: 1, max: 3 }),
      })
      .filter((value, position, all) => all.indexOf(value) === position),
    ratingValue,
    ratingCount,
    soldCount,
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
