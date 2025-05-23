import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { BasePayload } from "payload";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

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

  const cookies = await getCookies();
  cookies.set({
    name: AUTH_COOKIE,
    value: data.token,
    httpOnly: true,
    path: "/",
    // TODO: Ensure cross-domain cookie sharing
    // sameSite: "none",
    // domain: ""
  });
};

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = ctx.db.auth({ headers });

    return session;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
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

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password, // Payload automatically handles hashing
        },
      });

      // Login immediately after registering
      await loginMutation({ input, ctx });
    }),
  login: baseProcedure.input(loginSchema).mutation(loginMutation),
});
