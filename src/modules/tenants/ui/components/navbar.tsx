"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton,
    ),
  {
    ssr: false,
    loading: () => (
      <Button className="bg-white text-black" disabled>
        <ShoppingCartIcon />
      </Button>
    ),
  },
);
interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  const { name, image } = data || {};

  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          {image?.url && (
            <Image
              src={image.url}
              alt={slug}
              width={32}
              height={32}
              className="size-[32px] shrink-0 rounded-full border"
            />
          )}
          <p className="text-xl capitalize">{name}</p>
        </Link>
        <CheckoutButton tenantSlug={slug} />
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => (
  <nav className="h-20 border-b bg-white font-medium">
    <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
      <div />
      <Button className="bg-white text-black" disabled>
        <ShoppingCartIcon />
      </Button>
    </div>
  </nav>
);
