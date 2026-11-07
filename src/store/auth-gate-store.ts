import { create } from "zustand";

export type GateReason = "buy-now" | "wishlist" | "checkout" | "review";

interface AuthGateState {
  open: boolean;
  reason: GateReason | null;
  /** Path to return to after login, e.g. `/products/<slug>`. */
  next: string | null;
  openGate: (reason: GateReason, next?: string) => void;
  closeGate: () => void;
}

/** State for the shared login dialog: why it opened and where to return. */
export const useAuthGateStore = create<AuthGateState>((set) => ({
  open: false,
  reason: null,
  next: null,
  openGate: (reason, next) => set({ open: true, reason, next: next ?? null }),
  closeGate: () => set({ open: false, reason: null, next: null }),
}));
