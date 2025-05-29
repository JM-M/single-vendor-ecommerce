import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useCartStore } from "../store/use-cart-store";

export const useCart = () => {
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearProduct = useCartStore((state) => state.clearProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const getCartProduct = useCartStore((state) => state.getCartProduct);
  const products = useCartStore((state) => state.products);

  const productIds = useCartStore(
    useShallow((state) => state.products.map((p) => p.id)),
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(productId);
      } else {
        addProduct(productId);
      }
    },
    [addProduct, removeProduct, productIds],
  );

  const isProductInCart = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds],
  );

  return {
    productIds,
    products,
    addProduct,
    removeProduct,
    clearProduct,
    clearCart,
    toggleProduct,
    isProductInCart,
    getCartProduct,
    totalItems: products.reduce((acc, product) => acc + product.qty, 0),
  };
};
