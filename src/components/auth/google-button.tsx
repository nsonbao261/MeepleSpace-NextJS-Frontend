"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/services/auth";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useSessionStore } from "@/store/session-store";
import { setRefreshCookie } from "@/lib/session-cookie";
import { isSafeNextPath } from "@/lib/safe-next";

export function GoogleButton({ rememberMe }: { rememberMe: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useSessionStore((s) => s.setSession);

  async function handleClick() {
    try {
      setLoading(true);
      const session = await signInWithGoogle();
      setRefreshCookie(session.refreshToken, rememberMe);
      setSession(session.user, session.accessToken);

      const next = searchParams.get("next");
      router.replace(isSafeNextPath(next) ? next! : "/");
    } catch {
      toast.add({ title: "Failed to sign in with Google", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleClick}
      disabled={loading}
    >
      Continue with Google
    </Button>
  );
}
