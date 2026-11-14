"use client";

import { ReactNode, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionStore } from "@/store/session-store";

export function AuthShell({ children }: { children: ReactNode }) {
  const status = useSessionStore((state) => state.status);

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-8 text-center">
            <Link href="/" className="font-serif text-2xl font-bold">
              MeepleSpace
            </Link>
          </div>
          {status === "hydrating" ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>{children}</Suspense>
          )}
          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-muted-foreground hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
