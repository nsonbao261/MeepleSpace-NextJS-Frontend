import type { VariantProps } from "class-variance-authority";

import { Badge, badgeVariants } from "@/components/ui/badge";
import type { Role } from "@/types/user";

/**
 * The one `role -> variant` mapping in the codebase, created here because this
 * is the badge's first appearance and §7.1 fixes the pairing: the default
 * variant for `customer`, `destructive` for `admin`, because a privilege should
 * read as one.
 *
 * It lives in its own file rather than inside `account-view.tsx` for the reason
 * every other shared piece in this feature is its own file: Step 10's header
 * dropdown is the second call site, and it must import this rather than restate
 * the mapping. Two call sites with two literals is how they drift.
 *
 * **No new `Badge` variant.** `badge.tsx` is shadcn vendor code and is
 * Prettier-ignored; both values below already exist in `badgeVariants`. This is
 * the same reading landing applied to its out-of-stock badge, and it is why
 * §7.2's "applied through `className`" is satisfied without any `className`
 * here — the rule forbids extending `badgeVariants`, and nothing is extended.
 */
type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const ROLE_VARIANT: Record<Role, BadgeVariant> = {
  customer: "default",
  admin: "destructive",
};

const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  admin: "Admin",
};

/**
 * **Decorative, and not an authorisation surface.** The badge states which role
 * the account carries; it grants nothing, checks nothing, and hides nothing. A
 * signed-in `admin` has no destination in this build at all (Decision 3, D-1) —
 * their login toasts and stays put, and the header swap in Step 10 is the only
 * visible proof it worked.
 *
 * It is readable rather than `aria-hidden`, because the word is information: a
 * screen reader user should learn the account is an admin exactly as a sighted
 * one does. §9 asks that colour never be the only signal, and here the signal
 * is the word.
 */
export function RoleBadge({ role }: { role: Role }) {
  return <Badge variant={ROLE_VARIANT[role]}>{ROLE_LABEL[role]}</Badge>;
}
