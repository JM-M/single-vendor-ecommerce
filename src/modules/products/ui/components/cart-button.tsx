import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import { MinusIcon, PlusIcon } from "lucide-react";

interface Props {
  productId: string;
  isPurchased?: boolean;
  disableProductRemoval?: boolean;
}

export const CartButton = ({
  productId,
  isPurchased = false,
  disableProductRemoval,
}: Props) => {
  const {
    getCartProduct,
    isProductInCart,
    addProduct,
    removeProduct,
    toggleProduct,
  } = useCart();
  const cartProduct = getCartProduct(productId);

  if (isProductInCart(productId)) {
    const qty = cartProduct?.qty ?? 0;
    const disableRemoval = disableProductRemoval && qty === 1;
    return (
      <div className="flex w-full items-center justify-between gap-4">
        <Button
          variant="elevated"
          className="size-12 bg-white"
          disabled={disableRemoval}
          onClick={() => {
            if (disableRemoval) return;
            removeProduct(productId);
          }}
        >
          <MinusIcon />
        </Button>
        <span>{qty}</span>
        <Button
          variant="elevated"
          className="size-12 bg-white"
          onClick={() => addProduct(productId)}
        >
          <PlusIcon />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="elevated"
      className="min-h-12 flex-1 border bg-white"
      onClick={() => toggleProduct(productId)}
    >
      Add to Cart
    </Button>
  );
};
