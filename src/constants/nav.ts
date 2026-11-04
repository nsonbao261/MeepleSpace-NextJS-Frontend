export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation; planned routes 404 until their features exist. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
  { label: "About Us", href: "/about" },
];
