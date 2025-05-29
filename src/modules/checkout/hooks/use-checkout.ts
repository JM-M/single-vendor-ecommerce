import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useCheckoutStore } from "../store/use-checkout-store";
import { useCart } from "./use-cart";

export const useCheckout = () => {
  const delivery = useCheckoutStore((state) => state.delivery);
  const setDelivery = useCheckoutStore((state) => state.setDelivery);

  const { productIds, products } = useCart();

  const trpc = useTRPC();

  const checkout = useQuery(
    trpc.checkout.getProducts.queryOptions(
      {
        ids: productIds,
        cartProducts: products,
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
