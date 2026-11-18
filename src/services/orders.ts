import { Order, CreateOrderInput, OrderStatus, AppliedVoucher } from "@/types/checkout";
import { ORDER_CODE_PREFIX, ORDER_STORAGE_KEY_PREFIX } from "@/constants/checkout";
import { getDeliveryEstimate, computeTotals } from "@/lib/checkout";

const ordersMap = new Map<string, Order>();

async function delay() {
  if (process.env.NODE_ENV === "test") return;
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export function resetOrdersForTests() {
  ordersMap.clear();
  if (typeof window !== "undefined") {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(ORDER_STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => sessionStorage.removeItem(k));
    } catch {
      // ignore
    }
  }
}

//Persist order, dev only
export function setOrderPersistence(code: string, enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    const key = `${ORDER_STORAGE_KEY_PREFIX}${code}`;
    const order = ordersMap.get(code);
    if (enabled) {
      if (order) {
        sessionStorage.setItem(key, JSON.stringify(order));
      }
    } else {
      sessionStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const rand2 = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${ORDER_CODE_PREFIX}${timestamp}-${rand2}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await delay();

  const lines = input.lines.map((item) => ({
    ...item,
    lineTotal: item.unitPrice * item.quantity,
  }));

  const subtotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryInfo = getDeliveryEstimate(input.deliveryTierId);
  const deliveryFee = deliveryInfo.tier.fee;
  const percent = input.voucherPercent ?? 0;

  const { discount, total } = computeTotals({
    subtotal,
    deliveryFee,
    percent,
  });

  const code = generateOrderCode();

  const voucher: AppliedVoucher | null =
    input.voucherCode && typeof input.voucherPercent === "number"
      ? {
          code: input.voucherCode.trim().toUpperCase(),
          percent: input.voucherPercent,
          discountAmount: discount,
        }
      : null;

  const order: Order = {
    code,
    accountId: input.accountId,
    status: "pending",
    lines,
    itemCount: lines.reduce((count, item) => count + item.quantity, 0),
    subtotal,
    address: input.address,
    deliveryTier: deliveryInfo.tier,
    deliveryFee,
    voucher,
    discount,
    total,
    estimatedDeliveryFrom: deliveryInfo.from,
    estimatedDeliveryTo: deliveryInfo.to,
    createdAt: new Date().toISOString(),
    paidAt: null,
  };

  ordersMap.set(code, order);
  return order;
}

export async function getOrder(code: string, accountId: string): Promise<Order | undefined> {
  await delay();
  let order = ordersMap.get(code);

  if (!order && typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(`${ORDER_STORAGE_KEY_PREFIX}${code}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.code === code) {
          order = parsed;
          ordersMap.set(code, order!);
        }
      }
    } catch {
      // ignore
    }
  }

  if (!order) return undefined;
  if (order.accountId !== accountId) return undefined;

  return order;
}

export async function setOrderStatus(
  code: string,
  status: OrderStatus,
): Promise<Order | undefined> {
  await delay();
  const order = ordersMap.get(code);
  if (!order) return undefined;

  order.status = status;
  if (status === "paid") {
    order.paidAt = new Date().toISOString();
  } else {
    order.paidAt = null;
  }
  ordersMap.set(code, order);

  //Save order in Local Storage, dev only
  if (typeof window !== "undefined") {
    try {
      const key = `${ORDER_STORAGE_KEY_PREFIX}${code}`;
      if (sessionStorage.getItem(key) !== null) {
        sessionStorage.setItem(key, JSON.stringify(order));
      }
    } catch {
      // ignore
    }
  }

  return order;
}

export async function listOrders(accountId: string): Promise<Order[]> {
  await delay();
  const orderMap = new Map<string, Order>();

  // 1. Seed from sessionStorage snapshots
  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(ORDER_STORAGE_KEY_PREFIX)) {
          const raw = sessionStorage.getItem(key);
          if (raw) {
            try {
              const parsed: Order = JSON.parse(raw);
              if (parsed && parsed.code) {
                orderMap.set(parsed.code, parsed);
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. In-memory orders win for duplicate codes
  for (const [code, order] of ordersMap.entries()) {
    orderMap.set(code, order);
  }

  const results: Order[] = [];
  for (const order of orderMap.values()) {
    if (order.accountId === accountId) {
      results.push(order);
    }
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
