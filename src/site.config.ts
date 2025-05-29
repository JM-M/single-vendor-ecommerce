import { NavbarItem } from "./modules/home/types";

export const siteConfig = {
  name: "BeeCee",
  navbarItems: [{ href: "/", children: "Home" }] as NavbarItem[],
} as const;
