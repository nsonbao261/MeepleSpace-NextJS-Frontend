import { DeliveryTier, VoucherErrorCode } from "@/types/checkout";

export const DELIVERY_TIERS: DeliveryTier[] = [
  {
    id: "free",
    label: "Free Tier",
    fee: 0,
    minDays: 5,
    maxDays: 7,
  },
  {
    id: "express",
    label: "Express Tier",
    fee: 35000,
    minDays: 1,
    maxDays: 2,
  },
];

export const ORDER_CODE_PREFIX = "MS-";

export const PAYMENT_RESULT_CODES = {
  success: "00",
  failed: "24",
} as const;

export const ORDER_STORAGE_KEY_PREFIX = "meeple.order.";

export const VOUCHER_ERROR_MESSAGES: Record<VoucherErrorCode, string> = {
  unknown: "Voucher does not exist.",
  expired: "Voucher has expired.",
  used: "Voucher has already been used.",
};
