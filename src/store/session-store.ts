import { create } from "zustand";

export type Role = "guest" | "user" | "admin";

interface SessionState {
  role: Role;
  signIn: (role: Exclude<Role, "guest">) => void;
  signOut: () => void;
}

/** Mock session: hydrated by `?as=user|admin` via SessionFromQuery, read by the header. */
export const useSessionStore = create<SessionState>((set) => ({
  role: "guest",
  signIn: (role) => set({ role }),
  signOut: () => set({ role: "guest" }),
}));
