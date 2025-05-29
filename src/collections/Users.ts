import { isAdmin, isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: ({ req }) => isAdmin(req.user),
    update: ({ req, id }) => {
      if (isAdmin(req.user)) return true;
      // Allow users to update their own profile
      return req.user?.id === id;
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isAdmin(user),
  },
  auth: {
    cookies: {
      ...(process.env.NODE_ENV === "production" && {
        sameSite: "None",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
        secure: true,
      }),
    },
  },
  fields: [
    // Email added by default because we are using auth: true
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: "user",
      hasMany: true,
      options: ["super-admin", "admin", "user"],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
  ],
};
