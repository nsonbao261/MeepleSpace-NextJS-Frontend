"use client";

import { HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProductActions } from "@/hooks";
import type { Product } from "@/types";

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { outOfStock, saved, addToCart, buyNow, toggleSaved } = useProductActions(product);

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <Button
        size="lg"
        onClick={addToCart}
        disabled={outOfStock}
        className="min-h-12 flex-1 text-base font-medium"
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={buyNow}
        disabled={outOfStock}
        className="min-h-12 flex-1 text-base font-medium"
      >
        Buy now
      </Button>
      <Button
        size="lg"
        variant="ghost"
        aria-pressed={saved}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        onClick={toggleSaved}
        className={`min-h-12 min-w-12 px-3 ${saved ? "text-destructive" : ""}`}
      >
        <HeartIcon className={`size-5 ${saved ? "fill-current" : ""}`} />
      </Button>
    </div>
  );
}
