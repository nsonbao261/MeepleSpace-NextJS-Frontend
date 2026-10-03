import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { buttonVariants } from "@/components/ui/button";

/**
 * `/forgot-password`, the third `(auth)` route.
 *
 * A server page for `metadata`, like `/login` and `/register` (A-4).
 *
 * This is the **one** `(auth)` route that does not render `AuthCard`, and it is
 * deliberate: §5.6 says a single-input form does not get a card, a shadow, or a
 * heading treatment implying more is coming. The `h1` stays because the shell's
 * wordmark is a `<p>` and a page with no `h1` is an accessibility regression —
 * what is dropped is the panel, not the document structure.
 */
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Forgot password" };
}

export default function ForgotPasswordPage() {
  return (
    // A fragment, like the two mode pages. This route's own `flex flex-col
    // gap-6` wrapper is gone because the shell's centred column now is exactly
    // that — same display, same direction, same 24px — and the three elements
    // below land in it directly. The spacing is unchanged, which was the
    // condition for removing the wrapper rather than leaving it.
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your email and we will help you choose a new password.
        </p>
      </div>

      <ForgotPasswordForm />

      {/*
        The `Sign in` back-link **stays** (Decision 26, §5.2). This route is not
        one of the switcher's two options, so it gets no switcher and keeps the
        single way back. `buttonVariants` on a bare `next/link`, never
        `Button render={<Link />}`, which merges `type="button"` onto an anchor
        (landing A-8, §5.9) — the same rule as the switcher's two segments.
      */}
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className={buttonVariants({ variant: "link" })}>
          Sign in
        </Link>
      </p>
    </>
  );
}
