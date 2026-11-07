import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ExpansionsSection,
  ProductBreadcrumb,
  ProductDetailHero,
  ProductInfo,
  ProductPurchasePanel,
  RelatedProducts,
  ReviewsSection,
} from "@/components/product";
import { getAllProductSlugs, getProductBySlug } from "@/services/products";
import { getProductDetailCached } from "@/services/products.cache";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found — MeepleSpace" };
  }

  const description =
    product.blurb ?? `Buy ${product.name} board game at MeepleSpace. Fast shipping across Vietnam.`;

  return {
    title: `${product.name} — Buy Board Games Online | MeepleSpace`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [{ url: product.image, alt: product.imageAlt }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const detail = await getProductDetailCached(slug);

  if (!detail) {
    notFound();
  }

  const { product, expansions, related, reviews, summary } = detail;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <ProductBreadcrumb productName={product.name} />

        <ProductDetailHero product={product}>
          <ProductPurchasePanel product={product} />
        </ProductDetailHero>

        <ProductInfo product={product} />

        <ExpansionsSection product={product} expansions={expansions} />

        <ReviewsSection productSlug={product.slug} summary={summary} reviews={reviews} />

        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
