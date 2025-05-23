import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email added by default because we are using auth: true
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },
  ],
};
