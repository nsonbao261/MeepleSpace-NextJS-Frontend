import { Address } from "@/types/checkout";

export interface VoucherRecord {
  code: string;
  percent: number;
  expiresAt: string; // ISO string
}

export const initialAddressesByAccount: Record<string, Address[]> = {
  acc_demo_user: [
    {
      id: "addr_demo_home",
      isDefault: true,
      recipientName: "Nguyễn Văn Demo",
      phone: "0901234567",
      line1: "123 Lê Lợi, Phường Bến Thành",
      ward: "Phường Bến Thành",
      district: "Quận 1",
      province: "Hồ Chí Minh",
      label: "Nhà riêng",
    },
    {
      id: "addr_demo_office",
      isDefault: false,
      recipientName: "Nguyễn Văn Demo (Office)",
      phone: "0909876543",
      line1: "456 Nguyễn Thị Minh Khai, Phường 5",
      ward: "Phường 5",
      district: "Quận 3",
      province: "Hồ Chí Minh",
      label: "Công ty",
    },
  ],
};

export const initialVouchers: VoucherRecord[] = [
  {
    code: "MEEPLE10",
    percent: 10,
    expiresAt: "2027-12-31T23:59:59.000Z",
  },
  {
    code: "SINGLE20",
    percent: 20,
    expiresAt: "2027-12-31T23:59:59.000Z",
  },
  {
    code: "OLD15",
    percent: 15,
    expiresAt: "2025-01-01T00:00:00.000Z",
  },
];

export const initialConsumedVoucherKeys = new Set<string>(["acc_demo_user:SINGLE20"]);

export function fallbackAddress(accountId: string): Address {
  return {
    id: `addr_${accountId}_home`,
    isDefault: true,
    recipientName: accountId === "acc_demo_user" ? "Nguyễn Văn Demo" : "Khách hàng",
    phone: "0900000000",
    line1: "1 Đường Mặc Định",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    province: "Hồ Chí Minh",
    label: "Mặc định",
  };
}

export function getAddresses(accountId: string): Address[] {
  const list = initialAddressesByAccount[accountId] || [fallbackAddress(accountId)];
  return list.map((a) => ({ ...a }));
}
