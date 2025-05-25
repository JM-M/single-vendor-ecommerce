"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { NavbarSidebar } from "./navbar-sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps extends PropsWithChildren {
  href: string;
  isActive?: boolean;
  children: ReactNode;
}

const NavbarItem = ({ href, isActive = false, children }: NavbarItemProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "hover:border-primary rounded-full border-transparent bg-transparent px-3.5 text-lg hover:bg-transparent",
        isActive && "bg-black text-white hover:bg-black hover:text-white",
      )}
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="flex h-20 items-center justify-between border-b bg-white font-medium">
      <Link href="/" className="pl-6">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          CumRoad
        </span>
      </Link>

      <NavbarSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        items={navbarItems}
      />

      <div className="item-center hidden h-full items-center gap-4 lg:flex">
        {navbarItems.map((item) => {
          const { href, children } = item;
          return (
            <NavbarItem key={href} href={href} isActive={pathname === href}>
              {children}
            </NavbarItem>
          );
        })}
      </div>

      {session.data?.user ? (
        <div className="hidden h-full lg:flex">
          <Button
            className="h-full rounded-none border-0 border-l bg-black px-12 text-lg text-white transition-colors hover:bg-pink-400 hover:text-black"
            asChild
          >
            <Link href="/admin">Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="hidden h-full lg:flex">
          <Button
            variant="secondary"
            className="h-full rounded-none border-0 border-l bg-white px-12 text-lg transition-colors hover:bg-pink-400"
            asChild
          >
            <Link prefetch href="/sign-in">
              Log in
            </Link>
          </Button>
          <Button
            className="h-full rounded-none border-0 border-l bg-black px-12 text-lg text-white transition-colors hover:bg-pink-400 hover:text-black"
            asChild
          >
            <Link prefetch href="/sign-up">
              Start selling
            </Link>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center lg:hidden">
        <Button
          variant="ghost"
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};
