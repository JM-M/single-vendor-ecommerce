import configPromise from "@payload-config";
import { getPayload } from "payload";
import { PropsWithChildren } from "react";

import { Category } from "@/payload-types";
import Footer from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";

type Props = PropsWithChildren;
const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // Populate subcategories, subcategories will be type "{ docs: Category[] ... }"
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  // TODO: Extract this into its own helper function
  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Because of "depth: 1", we are confident doc will be a category
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-neutral-100">{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
