import { isAdmin, isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    hidden: ({ user }) => !isAdmin(user),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: true,
};
