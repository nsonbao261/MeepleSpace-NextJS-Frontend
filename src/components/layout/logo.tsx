import Link from "next/link";

/** Inline meeple + wordmark; keeps the logo out of the image pipeline. */
export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="MeepleSpace home">
      <svg viewBox="-120 -160 240 240" aria-hidden="true" className="size-7 fill-primary">
        <circle cy="-100" r="42" />
        <rect x="-30" y="-62" width="60" height="80" rx="30" />
        <rect x="-105" y="-52" width="210" height="46" rx="23" />
        <rect x="-34" y="-14" width="30" height="76" rx="15" transform="rotate(-16 -19 -14)" />
        <rect x="4" y="-14" width="30" height="76" rx="15" transform="rotate(16 19 -14)" />
      </svg>
      <span className="font-display text-xl font-medium tracking-tight">MeepleSpace</span>
    </Link>
  );
}
