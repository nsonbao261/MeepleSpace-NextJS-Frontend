import { AuthShell } from "@/components/auth/auth-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * The `(auth)` layout. Its one job is to be *different* from `(public)`: no
 * `SiteHeader`, no `SiteFooter`, no storefront chrome at all (Decision 8).
 *
 * No `ThemeProvider` and no `<Toaster />` here either — both live in the root
 * layout, and re-mounting them per group would split the theme and lose toasts
 * on navigation (A-6).
 */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    // One `TooltipProvider` per tree, mounted here rather than per form. It is
    // needed by Step 6's Google tooltip, and `Tooltip` does not fail without
    // one — it silently falls back to Base UI's 600ms `OPEN_DELAY` and loses the
    // delay group, which would make the single auth tooltip behave unlike every
    // other tooltip in the site. The `(public)` group mounts its own for the
    // same reason; route groups are siblings, so neither provider is an ancestor
    // of the other.
    <TooltipProvider>
      <AuthShell>{children}</AuthShell>
    </TooltipProvider>
  );
}
