import { Metadata } from "next";
import { AccountPlaceholder } from "@/components/account";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved board games",
};

export default function WishlistPage() {
  return (
    <div className="container py-8">
      <AccountPlaceholder title="Wishlist" description="Manage your favorite games." />
    </div>
  );
}
