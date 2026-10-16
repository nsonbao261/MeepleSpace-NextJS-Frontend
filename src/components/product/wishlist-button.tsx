"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const subscribeToNothing = () => () => {};

export function WishlistButton({ gameName }: { gameName: string }) {
  const router = useRouter();

  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const user = useAuthStore(useShallow((state) => state.getSessionUser()));

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Add ${gameName} to wishlist`}
      onClick={() => {
        if (!mounted) {
          return;
        }

        if (user === null) {
          router.push("/login");
          return;
        }

        toast.success(`${gameName} saved to your wishlist`);
      }}
      className="relative bg-background/70 text-muted-foreground after:absolute after:-inset-1.5 after:content-[''] hover:bg-background/90 hover:text-foreground"
    >
      <HeartIcon aria-hidden="true" className="size-4" />
    </Button>
  );
}
