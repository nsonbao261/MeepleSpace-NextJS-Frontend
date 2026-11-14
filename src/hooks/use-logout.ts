import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { useSessionStore } from "@/store/session-store";
import { logout as authLogout } from "@/services/auth";
import { clearRefreshCookie } from "@/lib/session-cookie";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setGuest = useSessionStore((s) => s.setGuest);

  return async () => {
    await authLogout();
    clearRefreshCookie();
    setGuest();
    queryClient.clear();
    toast.add({ title: "Logged out successfully" });
    router.push("/");
  };
}
