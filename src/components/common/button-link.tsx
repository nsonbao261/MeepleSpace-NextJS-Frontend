import Link from "next/link";

import { Button } from "@/components/ui/button";

type ButtonLinkProps = Omit<React.ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  href: React.ComponentProps<typeof Link>["href"];
};

/** Button-styled link. Non-native button so Base UI does not assert <button> semantics. */
export function ButtonLink({ href, ...props }: ButtonLinkProps) {
  return <Button {...props} nativeButton={false} render={<Link href={href} />} />;
}
