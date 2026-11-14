"use client";

import { useSessionStore } from "@/store/session-store";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { isSafeNextPath } from "@/lib/safe-next";
import { useRouter } from "next/navigation";

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = useSessionStore((s) => s.status);
  const role = useSessionStore((s) => s.role);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && !hasRedirected.current) {
      hasRedirected.current = true;
      const next = searchParams.get("next");
      const safeNext = isSafeNextPath(next) ? next! : "/";
      router.replace(safeNext);
    }
  }, [status, role, router, searchParams]);
}
