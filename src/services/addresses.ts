import { Address } from "@/types/checkout";
import { initialAddressesByAccount, getAddresses as getMockAddresses } from "@/data/checkout.mock";

let addressesDb: Record<string, Address[]> = JSON.parse(JSON.stringify(initialAddressesByAccount));

async function delay() {
  if (process.env.NODE_ENV === "test") return;
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export function resetAddressesDbForTests() {
  addressesDb = JSON.parse(JSON.stringify(initialAddressesByAccount));
}

export async function getAddresses(accountId: string): Promise<Address[]> {
  await delay();
  if (addressesDb[accountId]) {
    return addressesDb[accountId].map((a) => ({ ...a }));
  }
  return getMockAddresses(accountId);
}
