"use client";

import { ReactNode, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionStore } from "@/store/session-store";
import { Dice1 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthSwitch } from "./auth-switch";

export function AuthShell({ children }: { children: ReactNode }) {
  const status = useSessionStore((state) => state.status);
  const pathname = usePathname();
  const isRegister = pathname === "/register";
  const isSplit = pathname === "/login" || pathname === "/register";

  if (isSplit) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-6 p-4 py-10 sm:p-6 lg:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight"
        >
          <Dice1 className="h-6 w-6 text-primary" />
          MeepleSpace
        </Link>

        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-lg lg:grid-cols-2">
          {/* Form cell */}
          <div
            className={cn(
              "flex flex-col justify-center p-6 sm:p-8 lg:min-h-[680px] lg:p-12",
              isRegister ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-2",
            )}
          >
            <div
              key={pathname}
              className="relative mx-auto w-full max-w-md animate-in duration-300 fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none"
            >
              <Suspense fallback={<Skeleton className="h-[560px] w-full" />}>{children}</Suspense>
              {status === "hydrating" && <Skeleton className="absolute inset-0 size-full" />}
            </div>
          </div>

          {/* Switch panel cell */}
          <div
            className={cn(
              "hidden lg:flex lg:items-center lg:justify-center",
              isRegister ? "lg:order-2 lg:col-start-2" : "lg:order-1 lg:col-start-1",
            )}
          >
            <Suspense fallback={<Skeleton className="h-[420px] w-full rounded-none" />}>
              <AuthSwitch variant="panel" />
            </Suspense>
          </div>
        </div>

        {/* Mobile switch */}
        <div className="w-full max-w-5xl lg:hidden">
          <Suspense fallback={<Skeleton className="h-[104px] w-full rounded-2xl" />}>
            <AuthSwitch variant="compact" />
          </Suspense>
        </div>

        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-8 text-center">
            <Link href="/" className="font-display text-2xl font-bold">
              MeepleSpace
            </Link>
          </div>
          <div className="relative">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>{children}</Suspense>
            {status === "hydrating" && <Skeleton className="absolute inset-0 size-full" />}
          </div>
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
