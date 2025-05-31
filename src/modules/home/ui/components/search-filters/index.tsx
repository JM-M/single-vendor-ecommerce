"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { useTRPC } from "@/trpc/client";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { Categories } from "./categories";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const params = useParams();
  const categoryParam = (params.category as string) || undefined;

  const activeCategory = categoryParam || "all";
  const activeCategoryData = data?.find(
    (category) => category.slug === activeCategory,
  );
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubcategory = (params.subcategory as string) || undefined;
  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find(
      (subcategory) => subcategory.slug === activeSubcategory,
    )?.name || null;

  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-12 py-8 lg:px-4"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <div className="hidden lg:block">
        <Categories />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-12 py-8 lg:px-4"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
