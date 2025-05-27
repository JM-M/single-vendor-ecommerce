"use client";

// TODO: Add real ratings

import { useQuery } from "@tanstack/react-query";
import { LinkIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { StarRating } from "@/components/stars-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button className="flex-1 bg-pink-400" disabled>
        Add to Cart
      </Button>
    ),
  },
);

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.products.getOne.queryOptions({ id: productId }),
  );

  const { name, image, price, tenant, description, refundPolicy, isPurchased } =
    data || {};

  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="overflow-hidden rounded-sm border bg-white">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={image?.url || "/placeholder.png"}
            alt={name || "Product Image"}
            className="object-cover"
            fill
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{name}</h1>
            </div>
            <div className="flex border-y">
              <div className="flex items-center justify-center border-r px-6 py-4">
                <div className="w-fit border bg-pink-400 px-2 py-1">
                  <p className="text-base font-medium">
                    {formatCurrency(price || "")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center px-6 py-4 lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {tenant?.image && (
                    <Image
                      src={tenant?.image?.url || "/placeholder.png"}
                      alt={tenant?.name}
                      width={20}
                      height={20}
                      className="size-[20px] shrink-0 rounded-full border"
                    />
                  )}
                  <p className="text-base font-medium underline">
                    {tenant?.name}
                  </p>
                </Link>
              </div>
              <div className="hidden items-center justify-center px-6 py-4 lg:flex">
                <div className="flex items-center gap-1">
                  <StarRating rating={4} iconClassName="size-4" />
                </div>
              </div>
            </div>
            <div className="block items-center justify-center border-b px-6 py-4 lg:hidden">
              <div className="flex items-center gap-1">
                <StarRating rating={4} iconClassName="size-4" />
                <p className="text-base font-medium">{5} ratings</p>
              </div>
            </div>
            <div className="p-6">
              {description ? (
                <p>{description}</p>
              ) : (
                <p className="text-muted-foreground font-medium italic">
                  No description provided
                </p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="h-full border-t lg:border-t-0 lg:border-l">
              <div className="flex flex-col gap-4 border-b p-6">
                <div className="flex flex-row items-center gap-2">
                  <CartButton
                    isPurchased={isPurchased}
                    productId={productId}
                    tenantSlug={tenantSlug}
                  />
                  <Button
                    className="size-12"
                    variant="elevated"
                    onClick={() => {}}
                    disabled={false}
                  >
                    <LinkIcon />
                  </Button>
                </div>
                <p className="text-center font-medium">
                  {data?.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${refundPolicy} money back guarantee`}
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p className="text-base">{5} ratings</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">
                        {stars} star{stars === 1 ? "" : "s"}
                      </div>
                      <Progress value={20} className="h-[1lh]" />
                      <div className="font-medium">{20}%</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
