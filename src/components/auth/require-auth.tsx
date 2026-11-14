"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session-store";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [status, router]);

  if (status === "hydrating") {
    return <Skeleton className="h-64 w-full" />;
  }

  if (status === "guest") {
    return null;
  }

  return <>{children}</>;
}
