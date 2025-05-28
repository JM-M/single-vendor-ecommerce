import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantURL(slug: string, childrenPath: string = "") {
  if (process.env.NODE_ENV === "development") {
    return (
      process.env.NEXT_PUBLIC_APP_URL +
      `/tenants/${slug}/${childrenPath}`.replace(/\/+/g, "/")
    );
  }

  let protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  // if (process.env.NODE_ENV === "development") {
  //   protocol = "http";
  // }

  return (
    `${protocol}://${slug}.${domain}` + `/${childrenPath}`.replace(/\/+/g, "/")
  );
}

export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
