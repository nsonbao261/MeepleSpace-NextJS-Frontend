import { Metadata } from "next";
import { AccountPlaceholder } from "@/components/account";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Track your current orders",
};

export default function OrderTrackPage() {
  return (
    <div className="container py-8">
      <AccountPlaceholder
        title="Order Tracking"
        description="See the status of your current orders."
      />
    </div>
  );
}
