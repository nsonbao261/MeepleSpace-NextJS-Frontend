import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

/**
 * `/reset-password`, the fourth `(auth)` route. The only new page that is
 * **dynamic** (`ƒ`), because it reads `searchParams` (A-5) — by design, and it
 * does not make any other route dynamic.
 *
 * The token is read here and passed down as a plain prop. The validity check
 * itself cannot happen on the server: the store that holds `pendingReset` is
 * client-only (Decision 1), so `ResetPasswordForm` resolves it after mount.
 */
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Reset password" };
}

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const { token } = await searchParams;

  return (
    <AuthCard>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose a new password for your account.
        </p>
      </div>

      {/* `searchParams` values are `string | string[] | undefined`; a repeated
          `?token=` would arrive as an array, which no minted token can match, so
          it is normalised to `undefined` and treated as an invalid link. */}
      <ResetPasswordForm
        token={typeof token === "string" ? token : undefined}
      />
    </AuthCard>
  );
}
