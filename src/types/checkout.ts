import type { CartLineKind } from "./cart";

export interface Address {
  id: string;
  isDefault: boolean;
  recipientName: string;
  phone: string;
  line1: string;
  ward: string;
  district: string;
  province: string;
  label: string;
}

export type DeliveryTierId = "free" | "express";

export interface DeliveryTier {
  id: DeliveryTierId;
  label: string;
  fee: number;
  minDays: number;
  maxDays: number;
}

export type VoucherErrorCode = "unknown" | "expired" | "used";

export interface AppliedVoucher {
  code: string;
  percent: number;
  discountAmount: number;
}

export type OrderStatus = "pending" | "paid" | "failed";

export interface OrderLine {
  id: string;
  kind: CartLineKind;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type OrderLineInput = Omit<OrderLine, "lineTotal">;

export interface Order {
  code: string;
  accountId: string;
  status: OrderStatus;
  lines: OrderLine[];
  itemCount: number;
  subtotal: number;
  address: Address;
  deliveryTier: DeliveryTier;
  deliveryFee: number;
  voucher: AppliedVoucher | null;
  discount: number;
  total: number;
  estimatedDeliveryFrom: string;
  estimatedDeliveryTo: string;
  createdAt: string;
  paidAt: string | null;
}

export interface CreateOrderInput {
  accountId: string;
  lines: OrderLineInput[];
  address: Address;
  deliveryTierId: DeliveryTierId;
  voucherCode?: string;
  voucherPercent?: number;
}
