"use client";

import { useEffect, useRef } from "react";
import { useSessionStore } from "@/store/session-store";
import { getRefreshCookie, clearRefreshCookie } from "@/lib/session-cookie";
import { refresh } from "@/services/auth";
import { decodeToken } from "@/lib/auth-token";
import { AccessTokenPayload } from "@/types";

export function SessionHydrator() {
  const initialized = useRef(false);
  const setSession = useSessionStore((s) => s.setSession);
  const setGuest = useSessionStore((s) => s.setGuest);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function hydrate() {
      const refreshToken = getRefreshCookie();
      if (!refreshToken) {
        setGuest();
        return;
      }

      try {
        const { accessToken } = await refresh(refreshToken);
        const payload = decodeToken<AccessTokenPayload>(accessToken);

        // Construct full PublicUser from token payload
        setSession(
          {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            avatarUrl: payload.avatarUrl,
            role: payload.role,
            dateOfBirth: payload.dateOfBirth,
            gender: payload.gender,
          },
          accessToken,
        );
      } catch {
        clearRefreshCookie();
        setGuest();
      }
    }

    hydrate();
  }, [setSession, setGuest]);

  return null;
}
