import { NEOBRUTALISM_SHADOW } from "@/constants/tailwind-classes";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { Category } from "@/payload-types";
import Link from "next/link";

interface Props {
  category: CategoriesGetManyOutput[number];
  isOpen: boolean;
  position: { top: number; left: number };
}

export const SubcategoryMenu = ({ category, isOpen, position }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#F5F5F5";

  const { top, left } = position;
  return (
    <div className="fixed z-100" style={{ top, left }}>
      {/* Invisible bridge to maintain hover */}
      <div className="h-3 w-60" />
      <div
        style={{ backgroundColor }}
        className={
          NEOBRUTALISM_SHADOW +
          "w-60 -translate-x-[2px] -translate-y-[2px] overflow-hidden rounded-md border text-black"
        }
      >
        <div>
          {category.subcategories.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="hover: flex w-full items-center justify-between p-4 text-left font-medium underline hover:bg-black hover:text-white"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
