"use client";

import { useQueryState } from "nuqs";
import { useEffect } from "react";

import { useSessionStore } from "@/store";

/**
 * Hydrates the mock session from `?as=user|admin`. The header reads the store
 * only, so the server never touches searchParams and the page stays static.
 * Renders nothing; mounted inside <Suspense> because nuqs suspends.
 */
export function SessionFromQuery() {
  const [as] = useQueryState("as");
  const signIn = useSessionStore((state) => state.signIn);
  const signOut = useSessionStore((state) => state.signOut);

  useEffect(() => {
    if (as === "user" || as === "admin") {
      signIn(as);
    } else if (as !== null) {
      // Any other value (e.g. ?as=garbage) means guest.
      signOut();
    }
  }, [as, signIn, signOut]);

  return null;
}
