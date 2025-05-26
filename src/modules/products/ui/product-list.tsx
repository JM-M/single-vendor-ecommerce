"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useProductFilters } from "../hooks/use-product-filters";
import { ProductCard, ProductCardSkeleton } from "./product-card";

interface Props {
  category?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}

export const ProductList = ({ category, tenantSlug, narrowView }: Props) => {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
          category,
          tenantSlug,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  const products = data?.pages.flatMap((page) => page.docs);

  if (!products?.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
          {
            "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3": narrowView,
          },
        )}
      >
        {products.map((product) => {
          const { id, name, price, image, tenant } = product;
          return (
            <ProductCard
              key={id}
              id={id}
              name={name}
              imageUrl={image?.url}
              price={price}
              tenantSlug={tenant?.slug}
              tenantImageUrl={tenant?.image?.url}
              reviewRating={4}
              reviewCount={5}
            />
          );
        })}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="bg-white text-base font-medium disabled:opacity-50"
            variant="elevated"
          >
            {isFetchingNextPage && (
              <LoaderIcon className="size-4 animate-spin" />
            )}
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = ({
  narrowView,
}: {
  narrowView?: boolean;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
        {
          "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3": narrowView,
        },
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
