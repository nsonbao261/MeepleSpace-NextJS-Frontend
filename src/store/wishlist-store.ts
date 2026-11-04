import { create } from "zustand";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
}

/** In-memory wishlist; guests are blocked at the card by the auth gate. */
export const useWishlistStore = create<WishlistState>((set) => ({
  ids: [],
  toggle: (productId) =>
    set((state) => ({
      ids: state.ids.includes(productId)
        ? state.ids.filter((id) => id !== productId)
        : [...state.ids, productId],
    })),
}));
