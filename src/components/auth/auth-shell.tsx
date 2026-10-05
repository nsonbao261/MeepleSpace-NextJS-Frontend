import type { ReactNode } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      {}
      <div className="px-4 pt-10 pb-8 md:px-6 md:pt-14 md:pb-10">
        <div className="mx-auto w-full max-w-md text-center">
          <Link
            href="/"
            className="inline-block font-heading text-3xl font-semibold tracking-tight transition-colors hover:text-muted-foreground"
          >
            Meeple Space
          </Link>

          {}
          <p className="mt-1.5 text-sm text-balance text-muted-foreground">
            Your wonderful space for board games
          </p>
        </div>
      </div>

      {}
      <div className="flex flex-1 items-center justify-center px-4 py-12 md:px-6 lg:py-16">
        <div className="flex w-full max-w-md flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return <Card className="gap-6 p-6 shadow-sm">{children}</Card>;
}
