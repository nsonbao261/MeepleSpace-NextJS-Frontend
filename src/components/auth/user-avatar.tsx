"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * `avatarUrl` first, initials only when it is `null` (Decision 12).
 *
 * No consumer hardcodes initials: both call sites — this step's `/account`
 * read-out and Step 10's header dropdown — pass the same `PublicUser` fields, so
 * the rule "derive the fallback here, once" holds structurally rather than by
 * convention.
 *
 * `AvatarImage` is **not** `next/image` and must not become it. The vendored
 * primitive renders a native `<img>` (`AvatarImage.js:140`), so a remote
 * `avatarUrl` needs no `images.remotePatterns` entry and `next.config.ts` — which
 * has no `images` key at all — stays seven lines (A-8, EC-16). Reaching for
 * `next/image` here re-introduces a render-time throw for any host that is not
 * listed, and nothing in this build writes `avatarUrl` yet.
 */
type UserAvatarProps = {
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  size?: "sm" | "default" | "lg";
  className?: string;
};

/** First letter of each name. `toUpperCase` rather than `toLocaleUpperCase` so the result is deterministic. */
function initials(firstName: string, lastName: string): string {
  return `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`.toUpperCase();
}

export function UserAvatar({
  avatarUrl,
  firstName,
  lastName,
  size = "default",
  className,
}: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {/* `alt=""` because the avatar is decorative beside the display name
          everywhere it appears (§9: the avatar is never the only name of
          anything). An `alt` here would make a screen reader read the name
          twice. */}
      {avatarUrl === null ? null : <AvatarImage src={avatarUrl} alt="" />}

      {/* Always rendered, including when an image is present: Base UI un-mounts
          a failed image and shows the fallback, so a broken remote `avatarUrl`
          degrades to initials rather than to a broken-image glyph (EC-16). */}
      <AvatarFallback>{initials(firstName, lastName)}</AvatarFallback>
    </Avatar>
  );
}
