import { siteConfig } from "@/site.config";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { checkoutDeliveryFormSchema } from "../schema";

type Delivery = z.infer<typeof checkoutDeliveryFormSchema>;

interface CartState {
  delivery: Delivery;
  setDelivery: (delivery: Partial<Delivery>) => void;
}

export const useCheckoutStore = create<CartState>()(
  persist(
    (set, get) => ({
      delivery: {
        email: "",
        fullName: "",
        address: "",
        phone: "",
        specialNotes: "",
        state: "",
      },
      setDelivery: (delivery) =>
        set((state) => ({
          ...state,
          delivery: { ...state.delivery, ...delivery },
        })),
    }),
    {
      name: `${siteConfig.name.toLowerCase()}-checkout`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
