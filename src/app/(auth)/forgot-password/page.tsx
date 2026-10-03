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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your email and we will help you choose a new password.
        </p>
      </div>

      <ForgotPasswordForm />

      {/* `buttonVariants` on a bare `next/link`, never `Button render={<Link />}`
          (landing A-8, §5.9), and the same link treatment as the switch on
          `/login` (design review item 2). */}
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className={buttonVariants({ variant: "link" })}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
