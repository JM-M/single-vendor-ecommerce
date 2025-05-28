import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Media } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

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

      const totalPrice = data.docs.reduce((acc, product) => {
        const price = Number(product.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
        })),
      };
    }),
});
