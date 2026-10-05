import Image from "next/image";

import type { Game } from "@/types/game";

const COVER_WIDTH = 600;
const COVER_HEIGHT = 800;

const SPREAD = 0.54;

const MAX_TILT = 9;

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

export function CoverFan({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"

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
