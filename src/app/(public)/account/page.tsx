import type { Metadata } from "next";

import { AccountView } from "@/components/auth/account-view";

/**
 * A server page whose entire body is one client component. It earns that for
 * two reasons, and only two: `useAuthStore` cannot cross the server boundary,
 * and the self-guard (Decision 16) has to fire after mount. Everything else
 * here is static.
 *
 * It lives under `(public)` rather than `(auth)` because it is not a credential
 * surface — it is a storefront page wearing the header and footer, and the
 * header is exactly where the signed-in affordance appears in Step 10.
 *
 * The container is narrower than the storefront rails on purpose: a three-field
 * read-out stretched across a 7xl measure would leave the eye travelling.
 */
export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6">
      <AccountView />
    </div>
  );
}
