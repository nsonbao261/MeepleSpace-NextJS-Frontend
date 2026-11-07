import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 border-t pt-12">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl tracking-tight sm:text-3xl">You might also like</h2>
        <p className="text-sm text-muted-foreground">
          Discover similar board games curated for your collection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
