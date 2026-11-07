"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartIcon } from "lucide-react";

import { cn } from "cn";

import { RatingStars } from "@/components/product/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { DISCOUNT_THRESHOLD } from "@/constants";
import { formatVnd } from "@/lib";
import { useAuthGateStore, useCartStore, useSessionStore, useWishlistStore } from "@/store";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "feature";
  className?: string;
}

/** Product tile with a stretched link to the detail page; actions sit above it. */
export function ProductCard({ product, variant = "default", className }: ProductCardProps) {
  const router = useRouter();
  const role = useSessionStore((state) => state.role);
  const addItem = useCartStore((state) => state.addItem);
  const saved = useWishlistStore((state) => state.ids.includes(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const openGate = useAuthGateStore((state) => state.openGate);

  const outOfStock = product.stock === 0;
  const originalPrice = product.originalPrice;
  const hasOriginalPrice = originalPrice !== undefined && originalPrice > product.price;
  const rawDiscount = hasOriginalPrice
    ? ((originalPrice - product.price) / originalPrice) * 100
    : 0;
  const showDiscountPill = rawDiscount >= DISCOUNT_THRESHOLD;
  const discountPercent = Math.round(rawDiscount);

  const cartLine = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
  };

  function addToCart() {
    addItem(cartLine);
    toast.add({ type: "success", title: "Added to cart", description: product.name });
  }

  function buyNow() {
    if (role === "guest") {
      openGate("buy-now", `/products/${product.slug}`);
      return;
    }
    addItem(cartLine);
    router.push("/checkout");
  }

  function onWishlist() {
    if (role === "guest") {
      openGate("wishlist");
      return;
    }
    toggleWishlist(product.id);
    toast.add({
      type: "success",
      title: saved ? "Removed from wishlist" : "Saved to wishlist",
      description: product.name,
    });
  }

  const feature = variant === "feature";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card motion-safe:transition-transform motion-safe:md:hover:-translate-y-1",
        feature && "rounded-2xl sm:flex-row",
        className,
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-10"
      />

      <div
        className={cn(
          "relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-muted",
          feature && "sm:aspect-auto sm:w-64 md:w-80",
        )}
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          unoptimized
          sizes={feature ? "(min-width:768px) 320px, 100vw" : "(min-width:768px) 25vw, 70vw"}
          className="object-cover"
        />
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          {outOfStock ? (
            <Badge variant="destructive">Out of stock</Badge>
          ) : (
            <>
              {product.isNew && <Badge>New</Badge>}
              {product.isBestSeller && <Badge variant="secondary">Best seller</Badge>}
            </>
          )}
        </div>
        {showDiscountPill && (
          <Badge variant="destructive" className="absolute top-2 right-2 z-20">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "relative flex min-w-0 flex-1 flex-col gap-1.5 p-3",
          feature && "gap-3 p-5 md:p-6",
        )}
      >
        <h3
          className={cn(
            "line-clamp-2 text-sm leading-snug font-medium",
            feature && "font-display text-2xl leading-tight tracking-normal md:text-3xl",
          )}
        >
          {product.name}
        </h3>
        {feature && product.blurb && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.blurb}</p>
        )}

        <div className="flex items-center gap-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          {product.reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span
            className={cn(
              "font-semibold tabular-nums",
              feature ? "text-xl md:text-2xl" : "text-base",
            )}
          >
            {formatVnd(product.price)}
          </span>
          {hasOriginalPrice && (
            <span className="text-sm text-muted-foreground tabular-nums line-through">
              {formatVnd(product.originalPrice!)}
            </span>
          )}
        </div>

        <div
          className={cn(
            "relative z-20 mt-auto flex items-center gap-2 pt-2",
            "opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100",
            feature && "pt-3",
          )}
        >
          <Button
            size={feature ? "lg" : "sm"}
            onClick={addToCart}
            disabled={outOfStock}
            className={cn(!feature && "flex-1", "min-h-11 md:min-h-0")}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </Button>
          <Button
            size={feature ? "lg" : "sm"}
            variant="outline"
            onClick={buyNow}
            disabled={outOfStock}
            className={cn(!feature && "flex-1", "min-h-11 md:min-h-0")}
          >
            Buy now
          </Button>
          <Button
            size={feature ? "icon-lg" : "icon-sm"}
            variant="ghost"
            aria-pressed={saved}
            aria-label={
              saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
            }
            onClick={onWishlist}
            className={cn(
              "ml-auto min-h-11 min-w-11 md:min-h-0 md:min-w-0",
              saved && "text-destructive",
            )}
          >
            <HeartIcon className={cn("size-4", saved && "fill-current")} />
          </Button>
        </div>
      </div>
    </article>
  );
}
