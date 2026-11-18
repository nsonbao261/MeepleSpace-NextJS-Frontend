"use client";

import { useState } from "react";

import { useCartStore } from "@/store";
import { formatVnd } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ButtonLink } from "@/components/common/button-link";

export function CartSummary() {
  const itemCount = useCartStore((state) => state.itemCount);
  const subtotal = useCartStore((state) => state.subtotal);
  const clear = useCartStore((state) => state.clear);
  const [openClear, setOpenClear] = useState(false);

  return (
    <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-xs">
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <span>Subtotal</span>
          <span className="font-heading text-lg text-primary">{formatVnd(subtotal)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ButtonLink href="/checkout" size="lg" className="w-full">
          Proceed to Checkout
        </ButtonLink>
        <ButtonLink href="/products" variant="outline" size="lg" className="w-full">
          Continue Shopping
        </ButtonLink>

        {itemCount > 0 && (
          <Dialog open={openClear} onOpenChange={setOpenClear}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-muted-foreground hover:text-destructive"
                >
                  Clear cart
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear shopping cart</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove all items from your cart? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button
                  variant="destructive"
                  onClick={() => {
                    clear();
                    setOpenClear(false);
                  }}
                >
                  Clear Cart
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
