"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCheckIcon, LinkIcon, PhoneIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { StarRating } from "@/components/stars-rating";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import { useCheckoutStates } from "@/modules/checkout/hooks/use-checkout-states";
import { useTRPC } from "@/trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductCarousel } from "../components/product-carousel";
import { ProductDescription } from "../components/product-description";
import { ProductHighlights } from "../components/product-highlights";
import { ProductSection } from "../components/product-section";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button className="min-h-12 flex-1 bg-white" disabled>
        Add to Cart
      </Button>
    ),
  },
);

interface ProductViewProps {
  productId: string;
}

export const ProductView = ({ productId }: ProductViewProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { removeProduct, addProduct } = useCart();
  const [, setCheckoutStates] = useCheckoutStates();

  const router = useRouter();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId }),
  );

  const {
    id,
    name,
    image,
    price,
    description,
    refundPolicy,
    isPurchased,
    reviewRating,
    reviewCount,
    ratingDistribution,
  } = data;

  const buyProductNow = () => {
    // If the product is already in the cart, we remove it and then add it again.
    // This ensures the qty is set to 1
    removeProduct(id);
    addProduct(id);
    router.push(`/checkout?buyProductNow=${id}`);
  };

  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="overflow-hidden rounded-sm md:flex md:gap-5 lg:gap-10">
        <div className="relative aspect-square space-y-6 md:max-w-1/2 md:flex-1">
          <ProductCarousel />
          <div className="hidden space-y-6 py-5 md:block">
            {/* <ProductSection title="Condition: Open box">
              <p>
                “These Open Box units are in mint cosmetic condition. Includes
                original box (box may show wear) and accessories. The unit will
                be clean with little to no usage. Machines are tested by our
                Apple certified technicians and guaranteed fully functional!
              </p>
            </ProductSection> */}
            <ProductSection title="Highlights">
              <ProductHighlights />
            </ProductSection>
            <ProductSection title="Description">
              <ProductDescription description={description} />
            </ProductSection>
            <ProductSection title="Full Specifications">
              <ProductDescription description={description} />
            </ProductSection>
          </div>
        </div>
        <div className="space-y-4 md:flex-1">
          <div>
            <div className="py-3">
              <h1 className="text-2xl font-medium">{name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center">
                <div className="w-fit py-1">
                  <p className="text-lg font-medium">
                    {formatCurrency(price || "")}
                  </p>
                </div>
              </div>
              <div className="items-center justify-center">
                <div className="flex items-center gap-2">
                  <StarRating rating={reviewRating} iconClassName="size-4" />
                  <p className="text-base font-medium">
                    {reviewCount} rating{reviewCount !== 1 && "s"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium">
              Condition: <span className="font-semibold">Open box</span>
            </h3>
            <p>
              “These Open Box units are in mint cosmetic condition. Includes
              original box (box may show wear) and accessories. The unit will be
              clean with little to no usage. Machines are tested by our Apple
              certified technicians and guaranteed fully functional!
            </p>
          </div>
          <div>
            <h3 className="font-medium">Contact</h3>
            <Link
              href={`tel:${"08071024533"}`}
              className="text-primary flex items-center gap-2 font-semibold underline"
            >
              <PhoneIcon className="size-5" />
              08071024533
            </Link>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Pickup available at</h3>
            <p>
              <span className="font-semibold">Sango Office: </span>The
              Polytechnic Ibadan Entrance Gate, Sango. Ibadan, Oyo State.
            </p>
            <p>
              <span className="font-semibold">Iwo Road: </span>Omoola Motors,
              Fanawole Street, Behind World Oil, Iwo Road.
            </p>
          </div>
          <div className="h-full">
            <div className="flex flex-col gap-4 py-5">
              <Button
                variant="elevated"
                className="bg-pink-400"
                onClick={buyProductNow}
              >
                Buy Now
              </Button>
              <CartButton isPurchased={isPurchased} productId={productId} />
              <Button
                className="bg-white"
                variant="elevated"
                onClick={() => {
                  setIsCopied(true);
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Product link copied to clipboard");

                  setTimeout(() => {
                    setIsCopied(false);
                  }, 1000);
                }}
                disabled={isCopied}
              >
                {isCopied ? "Link Copied" : "Copy Product Link"}
                {isCopied ? <CheckCheckIcon /> : <LinkIcon />}
              </Button>
            </div>

            {/* TODO: Extract into own component */}
            {/* <div className="py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({reviewRating})</p>
                    <p className="text-base">{reviewCount} ratings</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const value = ratingDistribution[stars];
                    return (
                      <Fragment key={stars}>
                        <div className="font-medium">
                          {stars} star{stars === 1 ? "" : "s"}
                        </div>
                        <Progress value={value} className="h-[1lh]" />
                        <div className="font-medium">{value}%</div>
                      </Fragment>
                    );
                  })}
                </div>
              </div> */}
          </div>
          <div className="space-y-6 py-5 md:hidden">
            <ProductSection title="Highlights">
              <ProductHighlights />
            </ProductSection>
            <ProductSection title="Description">
              <ProductDescription description={description} />
            </ProductSection>
            <ProductSection title="Full Specifications">
              TODO: Add product specification
            </ProductSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="overflow-hidden rounded-sm bg-white">
        <div className="relative aspect-[3.9]">
          <Image
            src="/placeholder.png"
            alt="Placeholder"
            className="object-cover"
            fill
          />
        </div>
      </div>
    </div>
  );
};
