"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// BookCard is shared, so these toasts land on the landing rails too — that is
// the intended change (Decision 22), not a side effect.
const OUT_OF_STOCK_TOOLTIP = "This game is out of stock.";

type ActionProps = {
  available: boolean;
  variant: "default" | "outline";
  onAction: () => void;
  children: string;
};

function Action({ available, variant, onAction, children }: ActionProps) {
  const button = (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={() => {
        if (!available) {
          return;
        }

        onAction();
      }}
      aria-disabled={available ? undefined : true}
      className="flex-1 aria-disabled:opacity-50"
    >
      {children}
    </Button>
  );

  if (available) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{OUT_OF_STOCK_TOOLTIP}</TooltipContent>
    </Tooltip>
  );
}

export function CartActions({ available = true }: { available?: boolean }) {
  return (
    <div className="flex items-stretch gap-2">
      <Action
        available={available}
        variant="outline"
        onAction={() =>
          toast.success("Added to cart", {
            description: "Cart checkout is coming soon.",
          })
        }
      >
        Add to Cart
      </Action>
      <Action
        available={available}
        variant="default"
        onAction={() => toast.info("Checkout is coming soon.")}
      >
        Buy Now
      </Action>
    </div>
  );
}
