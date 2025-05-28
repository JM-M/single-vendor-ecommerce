import { siteConfig } from "@/site.config";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface CartState {
  productIds: string[];
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  getCart: () => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addProduct: (productId) =>
        set((state) => ({
          productIds: [...state.productIds, productId],
        })),
      removeProduct: (productId) =>
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        })),
      clearCart: () =>
        set(() => ({
          productIds: [],
        })),
      getCart: () => get()?.productIds || [],
    }),
    {
      name: `${siteConfig.name.toLowerCase()}-cart`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
