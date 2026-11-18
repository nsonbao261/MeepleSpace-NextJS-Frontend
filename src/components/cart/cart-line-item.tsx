"use client";

import Image from "next/image";
import { useState } from "react";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { useCartStore } from "@/store";
import type { CartLine } from "@/types/cart";
import { formatVnd } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function CartLineItem({ item }: { item: CartLine }) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [openRemove, setOpenRemove] = useState(false);

  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[0.65rem] capitalize">
              {item.kind}
            </Badge>
          </div>
          <h3 className="font-heading font-medium text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{formatVnd(item.unitPrice)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        {/* Stepper */}
        <div className="flex items-center rounded-lg border">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-r-none"
            disabled={item.quantity <= 1}
            onClick={() => setQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <MinusIcon className="size-3.5" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-l-none"
            disabled={item.quantity >= item.maxQuantity}
            onClick={() => setQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </div>

        {/* Line Total */}
        <div className="w-28 text-right font-heading font-semibold">
          {formatVnd(item.unitPrice * item.quantity)}
        </div>

        {/* Remove Dialog */}
        <Dialog open={openRemove} onOpenChange={setOpenRemove}>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2Icon className="size-4" />
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove item</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove{" "}
                <span className="font-medium text-foreground">{item.name}</span> from your cart?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                variant="destructive"
                onClick={() => {
                  removeItem(item.id);
                  setOpenRemove(false);
                }}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
