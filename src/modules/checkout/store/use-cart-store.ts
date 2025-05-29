import { siteConfig } from "@/site.config";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartProduct = { id: string; qty: number };

interface CartState {
  products: CartProduct[];
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearProduct: (productId: string) => void;
  clearCart: () => void;
  getCart: () => string[];
  getCartProduct: (productId: string) => CartProduct | null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (productId) =>
        set((state) => {
          const existingProduct = state.products.find(
            (product) => product.id === productId,
          );

          if (existingProduct) {
            // Increase quantity if product already exists
            return {
              products: state.products.map((product) =>
                product.id === productId
                  ? { ...product, qty: product.qty + 1 }
                  : product,
              ),
            };
          } else {
            // Add new product with qty 1
            return {
              products: [...state.products, { id: productId, qty: 1 }],
            };
          }
        }),
      removeProduct: (productId) =>
        set((state) => {
          const existingProduct = state.products.find(
            (product) => product.id === productId,
          );

          if ((existingProduct?.qty ?? 0) > 1) {
            // Increase quantity if product already exists
            return {
              products: state.products.map((product) =>
                product.id === productId
                  ? { ...product, qty: product.qty - 1 }
                  : product,
              ),
            };
          } else {
            return {
              products: state.products.filter(
                (product) => product.id !== productId,
              ),
            };
          }
        }),
      clearProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => product.id !== productId,
          ),
        })),
      clearCart: () =>
        set(() => ({
          products: [],
        })),
      getCart: () => get().products.map((product) => product.id),
      getCartProduct: (productId: string) =>
        get().products.find((product) => product.id === productId) || null,
    }),
    {
      name: `${siteConfig.name.toLowerCase()}-cart`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
