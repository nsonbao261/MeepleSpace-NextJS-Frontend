"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import { useCartStore } from "@/store/cart-store";

/** Live cart badge; clamps to `99+` visually, real count stays in the label. */
export function CartButton() {
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const label =
    totalQuantity === 0
      ? "Cart, empty"
      : `Cart, ${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`;

  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative inline-flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <ShoppingCartIcon aria-hidden="true" className="size-5" />
      {totalQuantity > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] leading-4 font-semibold text-primary-foreground"
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      )}
    </Link>
  );
}
