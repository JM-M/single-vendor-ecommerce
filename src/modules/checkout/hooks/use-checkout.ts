import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useCheckoutStore } from "../store/use-checkout-store";
import { useCart } from "./use-cart";
import { useCheckoutStates } from "./use-checkout-states";

export const useCheckout = () => {
  const delivery = useCheckoutStore((state) => state.delivery);
  const setDelivery = useCheckoutStore((state) => state.setDelivery);
  const [checkoutStates] = useCheckoutStates();
  const { buyProductNow } = checkoutStates;

  const cart = useCart();

  const trpc = useTRPC();

  let productIds: string[] = cart.productIds;
  let checkoutProducts = cart.products;
  // If the user is buying a product directly, we use that product ID.
  // Otherwise, we use the product IDs from the cart.
  if (buyProductNow) {
    productIds = [buyProductNow];
    checkoutProducts = cart.products.filter(
      (product) => product.id === buyProductNow,
    );
  }

  const checkout = useQuery(
    trpc.checkout.getCheckoutData.queryOptions(
      {
        productIds,
        checkoutProducts,
        state: delivery.state,
        city: delivery.city,
      },
      {
        placeholderData: (data) => data,
      },
    ),
  );

  return {
    checkout,
    delivery,
    setDelivery,
  };
};
