import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface Props {
  productId: string;
  isPurchased?: boolean;
}

export const CartButton = ({ productId, isPurchased = false }: Props) => {
  const cart = useCart();

  if (isPurchased) {
    return (
      <Button
        variant="elevated"
        className="flex-1 bg-white font-medium"
        asChild
      >
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/library/${productId}`}>
          View in Library
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="elevated"
      className={cn("flex-1 bg-pink-400", {
        "bg-white": cart.isProductInCart(productId),
      })}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from Cart" : "Add to Cart"}
    </Button>
  );
};
