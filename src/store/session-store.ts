import { create } from "zustand";
import { PublicUser, AccountRole } from "@/types";

export type SessionStatus = "hydrating" | "guest" | "authenticated";

interface SessionState {
  status: SessionStatus;
  user: PublicUser | null;
  accessToken: string | null;
  role: AccountRole | "guest";
  setSession: (user: PublicUser, accessToken: string) => void;
  setGuest: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: "hydrating",
  user: null,
  accessToken: null,
  role: "guest",
  setSession: (user, accessToken) =>
    set({ status: "authenticated", user, accessToken, role: user.role }),
  setGuest: () => set({ status: "guest", user: null, accessToken: null, role: "guest" }),
}));
