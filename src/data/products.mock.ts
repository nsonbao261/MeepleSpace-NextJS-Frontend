import { faker, seedFaker } from "@/lib/faker";

import type { Product } from "@/types/product";

seedFaker(42);

interface ProductSeed {
  slug: string;
  name: string;
  blurb?: string;
  price: number;
  originalPrice?: number;
  stock: number;
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
  },
  {
    slug: "wingspan",
    name: "Wingspan",
    blurb: "Attract birds to your wildlife preserve in this serene engine builder.",
    price: 1_450_000,
    stock: 18,
  },
  {
    slug: "ticket-to-ride-europe",
    name: "Ticket to Ride: Europe",
    blurb: "Claim railway routes across Europe — the friendliest gateway game.",
    price: 1_090_000,
    originalPrice: 1_250_000,
    stock: 15,
  },
  {
    slug: "azul",
    name: "Azul",
    blurb: "Draft colourful tiles to decorate the royal palace of Évora.",
    price: 790_000,
    stock: 30,
  },
  {
    slug: "pandemic",
    name: "Pandemic",
    blurb: "Race against four spreading diseases as one team of specialists.",
    price: 950_000,
    stock: 0,
  },
  {
    slug: "carcassonne",
    name: "Carcassonne",
    price: 690_000,
    stock: 27,
  },
  {
    slug: "7-wonders",
    name: "7 Wonders",
    price: 850_000,
    stock: 0,
  },
  {
    slug: "dixit",
    name: "Dixit",
    price: 990_000,
    stock: 20,
  },
  {
    slug: "codenames",
    name: "Codenames",
    price: 450_000,
    stock: 40,
  },
  {
    slug: "ma-soi",
    name: "Ma Sói",
    price: 390_000,
    stock: 55,
  },
  {
    slug: "exploding-kittens",
    name: "Exploding Kittens",
    price: 520_000,
    stock: 33,
  },
  {
    slug: "everdell",
    name: "Everdell",
    price: 1_290_000,
    originalPrice: 1_490_000,
    stock: 14,
  },
  {
    slug: "brass-birmingham",
    name: "Brass: Birmingham",
    price: 1_690_000,
    stock: 8,
  },
  {
    slug: "gloomhaven-jaws-of-the-lion",
    name: "Gloomhaven: Jaws of the Lion",
    price: 1_590_000,
    stock: 16,
  },
];

export const products: Product[] = seeds.map((seed) => ({
  id: `prd_${seed.slug}`,
  slug: seed.slug,
  name: seed.name,
  blurb: seed.blurb,
  price: seed.price,
  originalPrice: seed.originalPrice,
  rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
  reviewCount: faker.number.int({ min: 5, max: 480 }),
  // Single shared placeholder until unique covers land with the landing sections.
  image: "/assets/images/products/placeholder.svg",
  imageAlt: `${seed.name} board game box cover`,
  stock: seed.stock,
  salesCount: faker.number.int({ min: 10, max: 9_999 }),
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}));

/** Products with a blurb form the rotating Daily Pick pool. */
export const curated: Product[] = products.filter((product) => product.blurb !== undefined);
