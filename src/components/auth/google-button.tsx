"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";

/**
 * The one Google affordance, and it signs nobody in.
 *
 * Decision 5 and §5.5: pressing it signs the visitor in **immediately** as a
 * `customer`, toasts, and goes home. There is no dialog, no account picker, no
 * loading state, and no failure path, because there is nothing to wait for and
 * nothing that can fail. §12.1 records why that is a cost rather than a
 * free win, and F-3 records what retires it.
 *
 * Two things this file must not grow, and the reasons:
 *
 * - **No iframe and no embedded OAuth widget.** Refusing Google's popup is the
 *   one real advantage of the fake, and the obvious "improvement" a later
 *   session would attempt is the one change that reintroduces the third-party
 *   script this build has no reason to load.
 * - **No per-press identity.** The account is fixed, so pressing this twice
 *   cannot invent two people (EC-11). That is the store's job — see
 *   `signInWithGoogle` — and it is why this file holds no email and no name.
 */

/** D-5: the one honesty affordance this button is allowed. */
const SIMULATION_NOTE = "Simulated sign-in. No Google account is contacted.";

export function GoogleButton() {
  const router = useRouter();
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  // A **primitive** selector, deliberately. `getSessionUser()` builds a fresh
  // object on every call, so reading it here would hand `useSyncExternalStore`
  // a new snapshot each render and loop forever (A-11). The whole answer this
  // needs is "is there a session", and `sessionUserId` is already one.
  const signedIn = useAuthStore((state) => state.sessionUserId !== null);

  // No mounted guard here, unlike the header swap in Step 10: nothing about the
  // session changes what this renders. Both the server and the first client
  // render the same button, and the only thing rehydration can move is whether
  // a press is a no-op — which is a click handler, not markup.

  function handleClick() {
    // EC-11: pressing while already signed in is a no-op, not a second account.
    if (signedIn) return;

    signInWithGoogle();
    // Raised before the navigation, and it survives it: `<Toaster />` is
    // mounted in the root layout, so a client navigation does not unmount it
    // (A-6). Reversing these two lines is the bug this comment exists for.
    toast.success("Signed in with Google");
    router.push("/");
  }

  return (
    <Tooltip>
      {/* `render` rather than a nested `Button`, exactly as in `cart-actions.tsx`:
          the trigger renders a `<button>` of its own, and the child form would
          produce `<button><button>`, which is invalid HTML. */}
      <TooltipTrigger
        render={
          <Button
            // Not optional: this sits inside the login `<form>`, and a `<button>`
            // in a form submits it by default.
            type="button"
            variant="outline"
            // `h-11` to match the inputs (Decision 20) and `w-full` because the
            // design review asks for a full-width outline button with the mark
            // beside the label. An icon-only square is the multi-provider kit
            // applied to a single provider, and it is a 24px target beside a
            // 44px input.
            className="h-11 w-full"
            onClick={handleClick}
          >
            {/* Decorative: the accessible name is the "Google" text beside it,
                so an `alt` here would only make a screen reader read the word
                twice. A plain `<img>` rather than `next/image`, because the
                image optimizer refuses an SVG unless
                `images.dangerouslyAllowSVG` is set and next.config.ts has no
                `images` key at all — the same conclusion A-8 reached for the
                avatar, and the same reason neither may reach for `next/image`. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/google-g.svg"
              alt=""
              width={18}
              height={18}
              className="size-4"
            />
            Google
          </Button>
        }
      />
      <TooltipContent>{SIMULATION_NOTE}</TooltipContent>
    </Tooltip>
  );
}
