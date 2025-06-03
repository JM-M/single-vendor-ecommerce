import { Product } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface Props {
  description: Product["description"];
}

export const ProductDescription = ({ description }: Props) => {
  if (!description)
    return (
      <p className="text-muted-foreground font-medium italic">
        No description provided
      </p>
    );

  return (
    <RichText
      data={description}
      // converters={defaultJSXConverters}
    />
  );
};
