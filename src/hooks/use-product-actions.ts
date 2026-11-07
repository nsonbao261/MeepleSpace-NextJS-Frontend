"use client";

import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";
import { useAuthGateStore, useCartStore, useSessionStore, useWishlistStore } from "@/store";
import type { Product } from "@/types";

/**
 * Shared purchase behavior for ProductCard and the detail purchase panel.
 * Keeps add to cart, buy now and wishlist from drifting apart.
 */
export function useProductActions(product: Product) {
  const router = useRouter();
  const role = useSessionStore((state) => state.role);
  const addItem = useCartStore((state) => state.addItem);
  const saved = useWishlistStore((state) => state.ids.includes(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const openGate = useAuthGateStore((state) => state.openGate);

  const outOfStock = product.stock === 0;
  const returnPath = `/products/${product.slug}`;
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
      openGate("buy-now", returnPath);
      return;
    }
    addItem(cartLine);
    router.push("/checkout");
  }

  function toggleSaved() {
    if (role === "guest") {
      openGate("wishlist", returnPath);
      return;
    }
    toggleWishlist(product.id);
    toast.add({
      type: "success",
      title: saved ? "Removed from wishlist" : "Saved to wishlist",
      description: product.name,
    });
  }

  return { outOfStock, saved, addToCart, buyNow, toggleSaved };
}
