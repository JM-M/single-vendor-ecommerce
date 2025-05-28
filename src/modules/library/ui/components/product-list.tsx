"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "./product-card";

export const ProductList = () => {
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.library.getMany.infiniteQueryOptions(
        {
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => {
          const { id, name, image, tenant, reviewRating, reviewCount } =
            product;
          return (
            <ProductCard
              key={id}
              id={id}
              name={name}
              imageUrl={image?.url}
              tenantSlug={tenant?.slug}
              tenantImageUrl={tenant?.image?.url}
              reviewRating={reviewRating}
              reviewCount={reviewCount}
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

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
