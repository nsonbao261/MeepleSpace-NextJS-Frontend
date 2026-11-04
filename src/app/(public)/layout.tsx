import type { ReactNode } from "react";
import { Suspense } from "react";

import { LoginRequiredDialog, SessionFromQuery, SiteFooter, SiteHeader } from "@/components";

/** Shell for every public route: skip link, mock session sync, header, main, footer, auth gate. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Suspense fallback={null}>
        <SessionFromQuery />
      </Suspense>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <LoginRequiredDialog />
    </>
  );
}
