import { BadgeCheckIcon, LibraryIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheckIcon, label: "Secure VNPAY checkout" },
  { icon: TruckIcon, label: "Fast nationwide shipping" },
  { icon: BadgeCheckIcon, label: "100% authentic games" },
  { icon: LibraryIcon, label: "5,000+ titles in stock" },
] as const;

/** Quiet hairline band of purchase signals below the hero. */
export function TrustStrip() {
  return (
    <section aria-label="Why shop at MeepleSpace" className="border-y bg-background">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-4 py-6 md:grid-cols-4 md:py-7">
        {TRUST_ITEMS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5">
            <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
