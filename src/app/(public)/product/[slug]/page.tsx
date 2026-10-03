import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/constants/game-categories";
import { getGameBySlug } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { mockGames } from "@/data/games";

export function generateStaticParams() {
  return mockGames().map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  return { title: game ? game.name : "Product not found" };
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const discounted =
    game.compareAtPrice !== null && game.compareAtPrice > game.price;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-border">
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{game.name}</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {game.publisher} · {game.publishedYear}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {game.categories.map((slug) => (
              <li key={slug}>
                <Badge variant="secondary">{categoryLabel(slug)}</Badge>
              </li>
            ))}
          </ul>

          <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Players</dt>
              <dd className="font-medium">
                {game.playersMin}–{game.playersMax}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Play time</dt>
              <dd className="font-medium">{game.playTimeMin} min</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Minimum age</dt>
              <dd className="font-medium">{game.ageMin}+</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-baseline gap-3">
            <span
              className={
                discounted
                  ? "text-2xl font-semibold text-sale-price"
                  : "text-2xl font-semibold"
              }
            >
              {formatPrice(game.price)}
            </span>
            {discounted && game.compareAtPrice !== null && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(game.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Pending until Step 7 introduces the shared cart-actions client leaf. */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="min-w-32" disabled>
              Add to Cart
            </Button>
            <Button variant="outline" className="min-w-32" disabled>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
