"use client";

import Image from "next/image";
import { PackagePlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatVnd } from "@/lib";
import { useCartStore } from "@/store";
import type { Expansion, Product } from "@/types";

interface ExpansionCardProps {
  expansion: Expansion;
  baseProduct: Product;
}

export function ExpansionCard({ expansion, baseProduct }: ExpansionCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const baseOutOfStock = baseProduct.stock === 0;
  const expansionOutOfStock = expansion.stock === 0;
  const bundleDisabled = baseOutOfStock || expansionOutOfStock;

  function addExpansion() {
    addItem({
      productId: expansion.id,
      slug: expansion.slug,
      name: expansion.name,
      price: expansion.price,
      image: expansion.image,
    });
    toast.add({ type: "success", title: "Expansion added to cart", description: expansion.name });
  }

  function addBundle() {
    addItem({
      productId: baseProduct.id,
      slug: baseProduct.slug,
      name: baseProduct.name,
      price: baseProduct.price,
      image: baseProduct.image,
    });
    addItem({
      productId: expansion.id,
      slug: expansion.slug,
      name: expansion.name,
      price: expansion.price,
      image: expansion.image,
    });
    toast.add({
      type: "success",
      title: "Base game & expansion bundled",
      description: `${baseProduct.name} + ${expansion.name}`,
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:p-5">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-36">
        <Image
          src={expansion.image}
          alt={expansion.imageAlt}
          fill
          unoptimized
          sizes="160px"
          className="object-cover"
        />
        {expansionOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 left-2 z-10">
            Out of stock
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold">{expansion.name}</h3>
            <span className="text-base font-semibold tabular-nums">
              {formatVnd(expansion.price)}
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{expansion.blurb}</p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={addExpansion}
            disabled={expansionOutOfStock}
            className="flex-1"
          >
            {expansionOutOfStock ? "Unavailable" : "Add expansion"}
          </Button>
          <Button size="sm" onClick={addBundle} disabled={bundleDisabled} className="flex-1">
            <PackagePlusIcon className="mr-1.5 size-4" />
            {bundleDisabled ? "Bundle unavailable" : "Add both"}
          </Button>
        </div>
      </div>
    </div>
  );
}
