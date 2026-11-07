import { ExpansionCard } from "@/components/product/expansion-card";
import { EXPANSIONS_SECTION_ID } from "@/constants";
import type { Expansion, Product } from "@/types";

interface ExpansionsSectionProps {
  product: Product;
  expansions: Expansion[];
}

export function ExpansionsSection({ product, expansions }: ExpansionsSectionProps) {
  if (expansions.length === 0) return null;

  return (
    <section
      id={EXPANSIONS_SECTION_ID}
      aria-labelledby="expansions-heading"
      className="flex scroll-mt-24 flex-col gap-6 border-t pt-12"
    >
      <div className="flex flex-col gap-1">
        <h2 id="expansions-heading" className="font-display text-2xl tracking-tight sm:text-3xl">
          Expansions & Add-ons
        </h2>
        <p className="text-sm text-muted-foreground">
          Enhance your gameplay experience with official expansions designed for {product.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {expansions.map((expansion) => (
          <ExpansionCard key={expansion.id} expansion={expansion} baseProduct={product} />
        ))}
      </div>
    </section>
  );
}
