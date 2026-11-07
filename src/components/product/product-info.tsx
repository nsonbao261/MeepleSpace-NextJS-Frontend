import { ClockIcon, PenToolIcon, ShieldCheckIcon, UsersIcon } from "lucide-react";

import type { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
}

function formatPlayers(min: number, max: number) {
  return min === max ? `${min} players` : `${min}–${max} players`;
}

function formatPlayTime(min: number, max: number) {
  return min === max ? `${min} mins` : `${min}–${max} mins`;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const specs = [
    {
      label: "Players",
      value: formatPlayers(product.minPlayers, product.maxPlayers),
      icon: UsersIcon,
    },
    {
      label: "Play time",
      value: formatPlayTime(product.minPlayTimeMinutes, product.maxPlayTimeMinutes),
      icon: ClockIcon,
    },
    {
      label: "Age",
      value: `${product.minAge}+ years`,
      icon: ShieldCheckIcon,
    },
    {
      label: "Designer",
      value: product.designer,
      icon: PenToolIcon,
    },
  ];

  return (
    <section aria-labelledby="product-info-heading" className="flex flex-col gap-6 border-t pt-12">
      <div className="flex flex-col gap-1">
        <h2 id="product-info-heading" className="font-display text-2xl tracking-tight sm:text-3xl">
          About {product.name}
        </h2>
        <p className="text-sm text-muted-foreground">What to expect when you open the box.</p>
      </div>

      <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {specs.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex flex-col rounded-lg border bg-muted/40 p-3">
            <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="size-3.5" /> {label}
            </span>
            <span className="truncate text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
