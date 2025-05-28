import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CheckoutItemProps {
  isLast?: boolean;
  name: string;
  imageUrl?: string | null;
  productUrl: string;
  price: number;
  onRemove: () => void;
}

export const CheckoutItem = ({
  isLast = false,
  name,
  imageUrl,
  productUrl,
  price,
  onRemove,
}: CheckoutItemProps) => {
  return (
    <div
      className={cn("grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b pr-4", {
        "border-b-0": isLast,
      })}
    >
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between py-4">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-between py-4">
        <p className="font-medium">{formatCurrency(price)}</p>
        <button
          type="button"
          className="cursor-pointer font-medium underline"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
