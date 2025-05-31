import { Product } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";

interface SearchInputResultProductProps {
  product: Product;
}

const SearchInputResultProduct = ({
  product,
}: SearchInputResultProductProps) => {
  const { name, description } = product;

  return (
    <Link href="/" className="block rounded-md hover:bg-neutral-200">
      <div className="flex gap-4 p-2">
        <div className="relative aspect-square size-20 overflow-hidden rounded-md">
          <Image alt="" fill src="/placeholder.png" className="object-cover" />
        </div>
        <div>
          <h3>{name}</h3>
          {description && <RichText data={description} />}
        </div>
      </div>
    </Link>
  );
};

interface SearchInputResultsProps {
  products: Product[];
}

export const SearchInputResults = ({ products }: SearchInputResultsProps) => {
  return (
    <div className="absolute top-[calc(100%_+_10px)] left-0 w-full space-y-0.5 rounded-md border bg-white p-1">
      {products.map((product) => (
        <SearchInputResultProduct key={product.id} product={product} />
      ))}
    </div>
  );
};
