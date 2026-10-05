"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CART_TOOLTIP = "Cart checkout is coming soon.";
const OUT_OF_STOCK_TOOLTIP = "This game is out of stock.";

function noop() {}

type ActionProps = {
  available: boolean;
  tooltip: string;
  variant: "default" | "outline";
  children: string;
};

function Action({ available, tooltip, variant, children }: ActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={variant}
            size="sm"
            onClick={noop}

            aria-disabled={available ? undefined : true}
            className="flex-1 aria-disabled:opacity-50"
          >
            {children}
          </Button>
        }
      />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function CartActions({ available = true }: { available?: boolean }) {
  const tooltip = available ? CART_TOOLTIP : OUT_OF_STOCK_TOOLTIP;

  return (
    <div className="flex items-stretch gap-2">
      <Action available={available} tooltip={tooltip} variant="outline">
        Add to Cart
      </Action>
      <Action available={available} tooltip={tooltip} variant="default">
        Buy Now
      </Action>
    </div>
  );
}
