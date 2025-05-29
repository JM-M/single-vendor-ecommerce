import { z } from "zod";
import { NG_STATES, NG_STATE_DELIVERY_PRICES } from "./constants";

export const checkoutDeliveryFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  fullName: z.string().min(1, { message: "Please enter your full name." }),
  address: z.string().min(1, { message: "Please enter your address." }),
  phone: z.string().min(11, { message: "Please enter a valid phone number" }),
  specialNotes: z.string(),
  state: z.enum(
    NG_STATES.filter(
      (state) =>
        typeof NG_STATE_DELIVERY_PRICES[
          state.code as keyof typeof NG_STATE_DELIVERY_PRICES
        ] === "number",
    ).map((state) => state.code) as [string, ...string[]],
    {
      message: "Invalid or unsupported state selected.",
    },
  ),
  city: z.string().nullable().optional(),
});
