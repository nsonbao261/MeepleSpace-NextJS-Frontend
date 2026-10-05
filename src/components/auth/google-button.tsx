"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";

const SIMULATION_NOTE = "Simulated sign-in. No Google account is contacted.";

export function GoogleButton() {
  const router = useRouter();
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);

  const signedIn = useAuthStore((state) => state.sessionUserId !== null);

  function handleClick() {
    if (signedIn) return;

    signInWithGoogle();

    toast.success("Signed in with Google");
    router.push("/");
  }

  return (
    <Tooltip>
      {}
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"

            className="h-11 w-full"
            onClick={handleClick}
          >
            {}
            {}
            <img
              src="/images/google-g.svg"
              alt=""
              width={18}
              height={18}
              className="size-4"
            />
            Google
          </Button>
        }
      />
      <TooltipContent>{SIMULATION_NOTE}</TooltipContent>
    </Tooltip>
  );
}
