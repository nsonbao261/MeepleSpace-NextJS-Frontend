import { Metadata } from "next";
import { AccountPlaceholder } from "@/components/account";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account settings",
};

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <AccountPlaceholder
        title="Profile"
        description="Update your account information and settings."
      />
    </div>
  );
}
