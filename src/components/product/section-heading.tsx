import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  title,
  subline,
  viewAllHref,
}: {
  id?: string;
  title: string;
  subline: string;

  viewAllHref: `#${string}`;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2
          id={id}
          className="text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{subline}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={viewAllHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground",
          )}
        >
          View all
        </Link>
      </div>
    </div>
  );
}
