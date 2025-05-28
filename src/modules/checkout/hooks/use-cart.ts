import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useCartStore } from "../store/use-cart-store";

export const useCart = () => {
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);

  const productIds = useCartStore(useShallow((state) => state.productIds));

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

  const handleAddProduct = useCallback(
    (productId: string) => addProduct(productId),
    [addProduct],
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => removeProduct(productId),
    [removeProduct],
  );

  return {
    productIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
};
