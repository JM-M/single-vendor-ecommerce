import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { z } from "zod";

import { stripe } from "@/lib/stripe";
import { Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { CheckoutMetadata, ProductMetadata } from "../types";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productIds, tenantSlug } = input;
      const products = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate "category", "image", "tenant", & "tenant.image"
        where: {
          and: [
            {
              id: {
                in: productIds,
              },
            },
            {
              "tenant.slug": {
                equals: tenantSlug,
              },
            },
          ],
        },
      });

      if (products.totalDocs !== productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more products not found for the specified tenant",
        });
      }

      const tenantsData = await ctx.db.find({
        collection: "tenants",
        depth: 1, // Populate "image"
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: tenantSlug,
          },
        },
      });

      const tenant = tenantsData.docs.at(0);

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      }

      // TODO: Throw error if stripe details not submitted

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          quantity: 1, // Assuming quantity is always 1 since these are digital products
          price_data: {
            currency: "usd", // Assuming USD for simplicity
            unit_amount: Math.round(Number(product.price) * 100), // Convert to cents
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId || "",
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata,
            },
          },
        }));

      const checkout = await stripe.checkout.sessions.create({
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}/checkout?cancel=true`,
        mode: "payment",
        line_items: lineItems,
        invoice_creation: {
          enabled: true,
        },
        metadata: {
          userId: ctx.session.user.id,
        } as CheckoutMetadata,
      });

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return {
        url: checkout.url,
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
        depth: 2, // Populate "category", "image", "tenant", & "tenant.image"
        where: {
          id: {
            in: input.ids,
          },
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
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
