import { Metadata } from "next";
import { AccountPlaceholder } from "@/components/account";

export const metadata: Metadata = {
  title: "Order History",
  description: "View your past orders",
};

export default function OrdersPage() {
  return (
    <div className="container py-8">
      <AccountPlaceholder
        title="Order History"
        description="Track and view your previous orders."
      />
    </div>
  );
}
