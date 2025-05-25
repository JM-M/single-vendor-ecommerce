"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
    }),
  );

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
      {data.docs.map((product) => {
        const { id, name, price } = product;
        return (
          <div key={id} className="rounded-md border bg-white p-4">
            <h2 className="text-xl font-medium">{name}</h2>
            <p>{price}</p>
          </div>
        );
      })}
    </div>
  );
};

export const ProductListSkeleton = () => {
  return <div>Loading...</div>;
};
