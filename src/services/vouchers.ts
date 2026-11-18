import { AppliedVoucher, VoucherErrorCode } from "@/types/checkout";
import { initialVouchers, initialConsumedVoucherKeys, VoucherRecord } from "@/data/checkout.mock";

let vouchersDb: VoucherRecord[] = [...initialVouchers];
let consumedDb = new Set<string>(initialConsumedVoucherKeys);

export class VoucherError extends Error {
  constructor(public code: VoucherErrorCode) {
    super(code);
    this.name = "VoucherError";
  }
}

async function delay() {
  if (process.env.NODE_ENV === "test") return;
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export function resetVoucherDbForTests() {
  vouchersDb = [...initialVouchers];
  consumedDb = new Set<string>(initialConsumedVoucherKeys);
}

export interface ValidateVoucherParams {
  code: string;
  subtotal: number;
  accountId: string;
}

export async function validateVoucher({
  code,
  subtotal,
  accountId,
}: ValidateVoucherParams): Promise<AppliedVoucher> {
  await delay();
  const normalizedCode = code.trim().toUpperCase();
  const voucher = vouchersDb.find((v) => v.code === normalizedCode);

  if (!voucher) {
    throw new VoucherError("unknown");
  }

  if (new Date(voucher.expiresAt).getTime() <= Date.now()) {
    throw new VoucherError("expired");
  }

  const key = `${accountId}:${normalizedCode}`;
  if (consumedDb.has(key)) {
    throw new VoucherError("used");
  }

  const discountAmount = Math.round((subtotal * voucher.percent) / 100);

  return {
    code: voucher.code,
    percent: voucher.percent,
    discountAmount,
  };
}

export async function consumeVoucher(accountId: string, code: string): Promise<void> {
  await delay();
  const normalizedCode = code.trim().toUpperCase();
  const key = `${accountId}:${normalizedCode}`;
  consumedDb.add(key);
}
