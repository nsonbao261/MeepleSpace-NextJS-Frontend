"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthGateStore, type GateReason } from "@/store";

const COPY: Record<GateReason, { title: string; description: string }> = {
  "buy-now": {
    title: "Log in to buy now",
    description: "You'll come back to this game and continue straight to checkout.",
  },
  wishlist: {
    title: "Log in to save items",
    description: "Add games to your wishlist and find them again any time.",
  },
  checkout: {
    title: "Log in to check out",
    description: "Your cart is waiting — log in to complete the order.",
  },
  review: {
    title: "Log in to review",
    description: "Share your rating and feedback for this board game with the community.",
  },
};

/** Shared login gate for Buy Now, wishlist, checkout and reviews. */
export function LoginRequiredDialog() {
  const open = useAuthGateStore((state) => state.open);
  const reason = useAuthGateStore((state) => state.reason);
  const next = useAuthGateStore((state) => state.next);
  const closeGate = useAuthGateStore((state) => state.closeGate);
  const pathname = usePathname();

  // Close after navigating to /login so the dialog never sits on top of it.
  useEffect(() => {
    closeGate();
  }, [pathname, closeGate]);

  const copy = reason ? COPY[reason] : null;
  const loginHref = `/login${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) closeGate();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy?.title ?? "Log in required"}</DialogTitle>
          <DialogDescription>{copy?.description ?? "Log in to continue."}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeGate}>
            Keep browsing
          </Button>
          <Button render={<Link href={loginHref} />}>Log in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
