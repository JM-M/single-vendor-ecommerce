import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Media, Product } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import {
  NG_CITY_DELIVERY_PRICES,
  NG_STATE_DELIVERY_PRICES,
} from "../constants";
import { getPaystackAccessCode } from "../paystack";
import { CartProduct } from "../store/use-cart-store";

// TODO: Add types specific for city and states
const measureOrderCost = ({
  city,
  state,
  products,
  cartProducts,
}: {
  city?: string | null;
  state?: string | null;
  products: Product[];
  cartProducts: CartProduct[];
}) => {
  const subtotal = products.reduce((acc, product) => {
    const price = Number(product.price);
    const cartProduct = cartProducts.find((p) => p.id === product.id);
    return acc + (isNaN(price) ? 0 : price * (cartProduct?.qty ?? 1));
  }, 0);

  let deliveryFee: number | null = null;
  if (city && state) {
    deliveryFee =
      NG_CITY_DELIVERY_PRICES[state as keyof typeof NG_CITY_DELIVERY_PRICES][
        city as any
      ]?.price || null;
  } else if (state) {
    deliveryFee =
      NG_STATE_DELIVERY_PRICES[state as keyof typeof NG_CITY_DELIVERY_PRICES] ||
      null;
  }

  let total: number | null = null;
  if (typeof deliveryFee === "number") total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
  };
};

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        productIds: z.array(z.string()).min(1),
        cartProducts: z.array(
          z.object({
            id: z.string(),
            qty: z.number(),
          }),
        ),
        state: z.string(),
        city: z.string().nullable().optional(),
        displayedTotal: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productIds } = input;
      const productsData = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate "category" and "image"
        where: {
          and: [
            {
              id: {
                in: productIds,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
      });

      if (productsData.totalDocs !== productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more products not found",
        });
      }

      const { total } = measureOrderCost({
        city: input.city,
        state: input.state,
        products: productsData.docs,
        cartProducts: input.cartProducts,
      });

      if (total !== input.displayedTotal) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid order details",
        });
      }

      // TODO: Add paystack checkout
      const response = await getPaystackAccessCode({
        customerEmail: input.email,
        koboAmount: total * 100, // Naira to Kobo
      });

      const accessCode = response?.data?.access_code;

      if (!accessCode || !response.status) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during checkout",
        });
      }

      return {
        accessCode,
      };
    }),
  getCheckoutData: baseProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
        cartProducts: z.array(
          z.object({
            id: z.string(),
            qty: z.number(),
          }),
        ),
        state: z.string().nullable().optional(),
        city: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate "category" and "image"
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
      });

      if (data.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more products not found",
        });
      }

      // TODO: Add checks in checkout and here to confirm that all cart product quantities
      // are taken into account

      const { subtotal, deliveryFee, total } = measureOrderCost({
        city: input.city,
        state: input.state,
        products: data.docs,
        cartProducts: input.cartProducts,
      });

      return {
        ...data,
        subtotal,
        deliveryFee,
        total,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
        })),
      };
    }),
});
