import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Media } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import {
  NG_CITY_DELIVERY_PRICES,
  NG_STATE_DELIVERY_PRICES,
} from "../constants";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productIds } = input;
      const products = await ctx.db.find({
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

      if (products.totalDocs !== productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more products not found",
        });
      }

      const totalAmount = products.docs.reduce(
        (acc, product) => acc + product.price * 100,
        0,
      );

      // TODO: Add paystack checkout

      return {
        url: "/",
      };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
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
                in: input.ids,
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

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more products not found",
        });
      }

      // TODO: Add checks in checkout and here to confirm that all cart product quantities
      // are taken into account
      const subtotal = data.docs.reduce((acc, product) => {
        const price = Number(product.price);
        const cartProduct = input.cartProducts.find((p) => p.id === product.id);
        return acc + (isNaN(price) ? 0 : price * (cartProduct?.qty ?? 1));
      }, 0);

      const { city, state } = input;
      let deliveryFee: number | null = null;
      if (city && state) {
        deliveryFee =
          NG_CITY_DELIVERY_PRICES[
            state as keyof typeof NG_CITY_DELIVERY_PRICES
          ][city as any]?.price || null;
      } else if (state) {
        deliveryFee =
          NG_STATE_DELIVERY_PRICES[
            state as keyof typeof NG_CITY_DELIVERY_PRICES
          ] || null;
      }

      let total: number | null = null;
      if (typeof deliveryFee === "number") total = subtotal + deliveryFee;

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
