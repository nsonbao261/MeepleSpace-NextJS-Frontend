import Image from "next/image";

import type { Game } from "@/types/game";

/** Cover art is generated at 3:4 (600x800). */
const COVER_WIDTH = 600;
const COVER_HEIGHT = 800;

/** Fraction of the fan box the covers sweep across, edge to edge. */
const SPREAD = 0.54;

/** Peak rotation of the outermost covers, in degrees. */
const MAX_TILT = 9;

/**
 * Per-cover geometry, derived from the cover's position across the fan rather
 * than from a hardcoded lookup table, so the fan stays correct if
 * `getHeroCovers` ever returns a different count.
 *
 * `arc` is a sine: 0 at the outer covers, 1 at the centre. It drives height,
 * scale and stacking together, which is what makes the middle cover read as the
 * front of the fan.
 */
function fanLayout(index: number, total: number) {
  const across = total === 1 ? 0.5 : index / (total - 1);
  const arc = Math.sin(across * Math.PI);

  return {
    left: `${across * SPREAD * 100}%`,
    top: `${24 - arc * 18}%`,
    transform: `rotate(${(across - 0.5) * 2 * MAX_TILT}deg) scale(${0.88 + arc * 0.16})`,
    zIndex: Math.round(arc * 100),
    isFront: arc > 0.7,
  };
}

/**
 * Decorative cover collage. Server component and entirely static: no pointer
 * interaction, no parallax, no hover rotation (Decision 11).
 *
 * `aria-hidden` because every cover shown here also appears on a real card
 * elsewhere on the page, so the images are duplicates of content the user can
 * already reach. The `alt=""` on each image is therefore correct rather than an
 * oversight.
 *
 * Hidden below `lg` rather than scaled down: at mobile widths the covers would
 * fall below the legibility floor, and the hero becomes a single column.
 */
export function CoverFan({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      // `isolate` is load-bearing, not cosmetic. `fanLayout` scales the arc to
      // `arc * 100`, so the three centre covers render at z-index 71 / 100 / 71.
      // Nothing between here and the root creates a stacking context, so those
      // values escaped into the root and outranked the sticky header's `z-40` —
      // the centre covers painted on top of the navbar. `isolate` makes this div
      // a stacking context, so 0-100 resolves only against the other covers and
      // the fan now composites as one z-auto unit, below any positive z-index.
      // If this class is ever removed the navbar regression comes straight back.
      className="relative isolate hidden aspect-4/3 w-full lg:block"
    >
      {games.map((game, index) => {
        const layout = fanLayout(index, games.length);

        return (
          <div
            key={game.id}
            className="absolute w-[42%]"
            style={{
              left: layout.left,
              top: layout.top,
              transform: layout.transform,
              zIndex: layout.zIndex,
            }}
          >
            <Image
              src={game.imageUrl}
              alt=""
              width={COVER_WIDTH}
              height={COVER_HEIGHT}
              // Tinted elevation ramp (spec 7.1). The centre cover is the front
              // of the fan and carries the deeper step.
              className={`h-auto w-full rounded-xl border border-border object-cover ${
                layout.isFront ? "shadow-2xl" : "shadow-lg"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
