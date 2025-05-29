import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "../../hooks/use-cart";
import { useCheckout } from "../../hooks/use-checkout";
import { usePurchase } from "../../hooks/use-purchase";
import { DeliveryForm } from "./delivery-form";

export const CheckoutSidebar = () => {
  const { productIds, products: cartProducts } = useCart();
  const { checkout, delivery } = useCheckout();
  const { purchase } = usePurchase();

  const { data, isFetching } = checkout;
  const { subtotal, deliveryFee, total } = data || {};
  const isLoadingTotal = isFetching;
  const disabled = purchase.isPending || isFetching;

  return (
    <div className="flex flex-col overflow-hidden rounded-md border bg-white">
      <DeliveryForm />

      <div className="flex items-center justify-between border-b p-4">
        <h4 className="text-lg font-medium">Subtotal</h4>
        <p className="text-lg font-medium">
          {isLoadingTotal
            ? "Loading..."
            : formatCurrency(subtotal, { fallback: "--" })}
        </p>
      </div>
      <div className="flex items-center justify-between border-b p-4">
        <h4 className="text-lg font-medium">Delivery</h4>
        <p className="text-lg font-medium">
          {formatCurrency(deliveryFee, { fallback: "--" })}
        </p>
      </div>
      <div className="flex items-center justify-between border-b p-4">
        <h4 className="text-lg font-medium">Total</h4>
        <p className="text-lg font-medium">
          {formatCurrency(total, { fallback: "--" })}
        </p>
      </div>
      <div className="flex items-center justify-center p-4">
        <Button
          variant="elevated"
          disabled={disabled || !total}
          onClick={() =>
            purchase.mutate({
              email: delivery.email,
              productIds,
              cartProducts: cartProducts ?? [],
              state: delivery.state,
              city: delivery.city,
              displayedTotal: total ?? 0,
            })
          }
          className="bg-primary hover:text-primary w-full text-base text-white hover:bg-pink-400"
        >
          Checkout
        </Button>
      </div>
      {/* TODO: Implement cancelled handling */}
      {/* {isCanceled && (
        <div className="flex items-center justify-center border-t p-4">
          <div className="flex w-full items-center rounded bg-red-100 px-4 py-3 font-medium text-red-500">
            <div className="flex items-center">
              <CircleXIcon className="mr-2 size-6 fill-red-500 text-red-100" />
              <span>Checkout failed. Please try again.</span>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
