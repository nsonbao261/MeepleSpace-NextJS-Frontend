export type CartLineKind = "base" | "expansion";

export interface CartLine {
  id: string; // equals productId
  kind: CartLineKind;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  maxQuantity: number;
}
