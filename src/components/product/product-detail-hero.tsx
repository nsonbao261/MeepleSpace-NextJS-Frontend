import Image from "next/image";
import type { ReactNode } from "react";

import { RatingStars } from "@/components/product/rating-stars";
import { Badge } from "@/components/ui/badge";
import { formatVnd, getDiscount } from "@/lib";
import type { Product } from "@/types";

interface ProductDetailHeroProps {
  product: Product;
  /** Purchase actions, rendered under the pricing block. */
  children?: ReactNode;
}

export function ProductDetailHero({ product, children }: ProductDetailHeroProps) {
  const outOfStock = product.stock === 0;
  const { hasDiscount, percent, showPill } = getDiscount(product.price, product.originalPrice);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      {/* Cover image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted lg:col-span-6 lg:aspect-square">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          unoptimized
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {outOfStock ? (
            <Badge variant="destructive">Out of stock</Badge>
          ) : (
            <>
              {product.isNew && <Badge>New</Badge>}
              {product.isBestSeller && <Badge variant="secondary">Best seller</Badge>}
            </>
          )}
        </div>
        {showPill && (
          <Badge variant="destructive" className="absolute top-3 right-3 z-20 text-sm">
            -{percent}%
          </Badge>
        )}
      </div>

      {/* Product summary and purchase actions */}
      <div className="flex flex-col gap-6 lg:col-span-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
            {product.publisher} • {product.genre}
          </div>
          <h1 className="font-display text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 pt-1">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            <span className="text-sm font-medium text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3 rounded-xl border bg-card p-4">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatVnd(product.price)}
          </span>
          {hasDiscount && product.originalPrice !== undefined && (
            <span className="text-lg text-muted-foreground tabular-nums line-through">
              {formatVnd(product.originalPrice)}
            </span>
          )}
          <span className="ml-auto text-sm font-medium">
            {outOfStock ? (
              <span className="text-destructive">Out of stock</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">
                In stock ({product.stock} available)
              </span>
            )}
          </span>
        </div>

        {product.blurb && (
          <p className="text-base leading-relaxed text-muted-foreground">{product.blurb}</p>
        )}

        {children}
      </div>
    </div>
  );
}
