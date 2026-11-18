"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session-store";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") {
      const next = window.location.pathname + window.location.search;
      router.push(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [status, router]);

  return (
    <div className="relative">
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>{children}</Suspense>
      {status !== "authenticated" && <Skeleton className="absolute inset-0 size-full" />}
    </div>
  );
}
