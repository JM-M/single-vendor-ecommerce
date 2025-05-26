"use client";

import { Button } from "@/components/ui/button";
import { NEOBRUTALISM_SHADOW } from "@/constants/tailwind-classes";
import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import Link from "next/link";
import { useRef, useState } from "react";
import { SubcategoryMenu } from "./subcategory-menu";
import { useDropdownPosition } from "./use-dropdown-position";

// TODO: When dropdown is closed and the mouse is outside the navbar,
// isNavigationHovered remains true. Make it false in that case.

interface Props {
  category: CategoriesGetManyOutput[number];
  isActive?: boolean;
  isNavigationHovered?: boolean;
  onClose?: () => void;
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
  onClose,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  const dropdownPosition = getDropdownPosition();

  const toggleDropdown = () => {
    if (category.subcategories.length) {
      setIsOpen(!isOpen);
      if (isOpen && onClose) onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      <div className="relative">
        <Button
          variant="elevated"
          className={cn(
            "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
            {
              "border-primary bg-white": isActive && !isNavigationHovered,
              [NEOBRUTALISM_SHADOW +
              "border-primary -translate-x-[4px] -translate-y-[4px] bg-white"]:
                isOpen,
            },
          )}
          asChild
        >
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-r-[10px] border-b-[10px] border-l-[10px] border-r-transparent border-b-black border-l-transparent opacity-0",
              isOpen && "opacity-100",
            )}
          />
        )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};
