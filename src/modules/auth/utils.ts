import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}
export const generateAuthCookie = async ({ prefix, value }: Props) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`, // payload-token by default
    value,
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? "none" : undefined,
    domain: isProduction ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : undefined,
    secure: isProduction,
  });
};
