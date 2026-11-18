import { create } from "zustand";
import type { CartLine } from "@/types/cart";

interface CartState {
  lines: CartLine[];
  /** Derived from `lines` on every mutation. */
  totalQuantity: number;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartLine, "quantity">) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

function computeDerived(lines: CartLine[]) {
  const totalQuantity = lines.reduce((total, line) => total + line.quantity, 0);
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
  return { totalQuantity, itemCount, subtotal };
}

/** In-memory guest cart; no persist by design. */
export const useCartStore = create<CartState>((set) => ({
  lines: [],
  totalQuantity: 0,
  itemCount: 0,
  subtotal: 0,
  addItem: (item) =>
    set((state) => {
      if (item.maxQuantity < 1) {
        return state;
      }
      const existingIndex = state.lines.findIndex((line) => line.id === item.id);
      let lines: CartLine[];
      if (existingIndex > -1) {
        lines = state.lines.map((line, index) => {
          if (index === existingIndex) {
            const newQty = Math.min(line.quantity + 1, line.maxQuantity);
            return { ...line, quantity: newQty };
          }
          return line;
        });
      } else {
        const initialQty = Math.min(1, item.maxQuantity);
        lines = [...state.lines, { ...item, quantity: initialQty }];
      }
      return { lines, ...computeDerived(lines) };
    }),
  setQuantity: (id, quantity) =>
    set((state) => {
      const lines = state.lines.map((line) => {
        if (line.id === id) {
          const clamped = Math.max(1, Math.min(quantity, line.maxQuantity));
          return { ...line, quantity: clamped };
        }
        return line;
      });
      return { lines, ...computeDerived(lines) };
    }),
  removeItem: (id) =>
    set((state) => {
      const lines = state.lines.filter((line) => line.id !== id);
      return { lines, ...computeDerived(lines) };
    }),
  clear: () => set({ lines: [], totalQuantity: 0, itemCount: 0, subtotal: 0 }),
}));
