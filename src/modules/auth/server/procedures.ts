import { stripe } from "@/lib/stripe";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { BasePayload } from "payload";
import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

const loginMutation = async ({
  ctx,
  input,
}: {
  ctx: { db: BasePayload };
  input: {
    email: string;
    password: string;
  };
}) => {
  const data = await ctx.db.login({
    collection: "users",
    data: {
      email: input.email,
      password: input.password,
    },
  });

  if (!data.token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Failed to login",
    });
  }

  await generateAuthCookie({
    prefix: ctx.db.config.cookiePrefix,
    value: data.token,
  });

  return data;
};

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = ctx.db.auth({ headers });

    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      const existingUser = existingData.docs?.at(0);

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      const account = await stripe.accounts.create({});

      if (!account) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create Stripe account",
        });
      }

      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        },
      });

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password, // Payload automatically handles hashing
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
        },
      });

      // Login immediately after registering
      await loginMutation({ input, ctx });
    }),
  login: baseProcedure.input(loginSchema).mutation(loginMutation),
});
