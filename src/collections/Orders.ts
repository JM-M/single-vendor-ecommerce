import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    read: ({ req }) => isSuperAdmin(req.user), // TODO: Allow admins, not only super admins to read orders.
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false, // Assuming one order per user
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: false,
    },
  ],
};
