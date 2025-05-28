import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HOVER_NEOBRUTALISM_SHADOW } from "@/constants/tailwind-classes";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
}

export const ProductCard = ({
  id,
  name,
  imageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) => {
  return (
    <Link href={`/library/${id}`}>
      <div
        className={cn(
          HOVER_NEOBRUTALISM_SHADOW,
          "flex h-full flex-col overflow-hidden rounded-md border bg-white transition-shadow",
        )}
      >
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/placeholder.png"}
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 border-y p-4">
          <h2 className="line-clamp-4 text-lg font-medium">{name}</h2>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="aspect-3/4 w-full animate-pulse rounded-lg bg-neutral-200" />
  );
};
