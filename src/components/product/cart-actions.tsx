"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CART_TOOLTIP = "Cart checkout is coming soon.";
const OUT_OF_STOCK_TOOLTIP = "This game is out of stock.";

/**
 * The actions are deliberately inert: there is no cart yet (Decision 4). They
 * are real `<button type="button">` elements rather than `href="#"` anchors,
 * because an anchor would scroll the user to the top of the page and push a
 * junk entry onto browser history.
 */
function noop() {}

type ActionProps = {
  available: boolean;
  tooltip: string;
  variant: "default" | "outline";
  children: string;
};

/**
 * One action. `TooltipTrigger` is composed through its `render` prop rather
 * than by nesting `Button` as a child: the trigger renders a `<button>` by
 * default, so the child form produces `<button><button>`, which is invalid HTML
 * and breaks both keyboard traversal and the accessibility tree. Verified
 * against the installed Base UI 1.8 — `render` yields exactly one button
 * element with the tooltip wiring and `tabindex` on it.
 */
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
            // `aria-disabled`, not `disabled`. The `disabled` attribute would
            // drop the button out of the tab order, and spec 11 requires both
            // actions to stay focusable. No `pointer-events-none` either, since
            // that would kill the hover that opens this tooltip.
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

/**
 * Client component: the tooltip portal and its hover/focus wiring need
 * interactivity. It is the only client leaf in the card, so the card itself
 * stays a server component and `formatPrice` never enters the client bundle.
 * The one `TooltipProvider` is mounted in the `(public)` group layout, not here.
 */
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
