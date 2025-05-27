"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ListFilterIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoryDropdown } from "./category-dropdown";

export const Categories = () => {
  const params = useParams();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryIndex = data.findIndex(
    (cat) => cat.slug === activeCategory,
  );
  const isActiveCategoryHidden =
    activeCategoryIndex !== -1 && activeCategoryIndex >= visibleCount;

  useEffect(() => {
    if (!containerRef.current || !measureRef.current || !viewAllRef.current)
      return;

    const calculateVisible = () => {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const viewAllWidth = viewAllRef.current?.offsetWidth || 0;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current?.children || []);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Hidden div to measure all items */}
      <div
        ref={measureRef}
        className="pointer-events-none absolute flex opacity-0"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {data.map((category) => {
          return (
            <div key={category.id}>
              <CategoryDropdown
                category={category}
                isActive={activeCategory === category.slug}
                isNavigationHovered={false}
              />
            </div>
          );
        })}
      </div>

      {/* Visible items */}
      <div
        ref={containerRef}
        className="flex flex-nowrap items-center"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => {
          return (
            <div key={category.id}>
              <CategoryDropdown
                category={category}
                isActive={activeCategory === category.slug}
                isNavigationHovered={isAnyHovered}
                onClose={() => setIsAnyHovered(false)}
              />
            </div>
          );
        })}

        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant="elevated"
            className={cn(
              "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "border-primary bg-white",
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
