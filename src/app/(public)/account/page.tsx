import type { Metadata } from "next";

import { AccountView } from "@/components/auth/account-view";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6">
      <AccountView />
    </div>
  );
}
