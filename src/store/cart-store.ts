import { create } from "zustand";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  /** Derived from `lines` on every mutation so the header badge just reads it. */
  totalQuantity: number;
  addItem: (item: Omit<CartLine, "quantity">) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

function sumQuantity(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** In-memory guest cart; no persist by design. Checkout and merge come later. */
export const useCartStore = create<CartState>((set) => ({
  lines: [],
  totalQuantity: 0,
  addItem: (item) =>
    set((state) => {
      const existing = state.lines.some((line) => line.productId === item.productId);
      const lines = existing
        ? state.lines.map((line) =>
            line.productId === item.productId ? { ...line, quantity: line.quantity + 1 } : line,
          )
        : [...state.lines, { ...item, quantity: 1 }];
      return { lines, totalQuantity: sumQuantity(lines) };
    }),
  removeItem: (productId) =>
    set((state) => {
      const lines = state.lines.filter((line) => line.productId !== productId);
      return { lines, totalQuantity: sumQuantity(lines) };
    }),
  clear: () => set({ lines: [], totalQuantity: 0 }),
}));
