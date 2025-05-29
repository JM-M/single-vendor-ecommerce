"use client";

import { InboxIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useCart } from "../../hooks/use-cart";
import { useCheckout } from "../../hooks/use-checkout";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

export const CheckoutView = () => {
  const router = useRouter();
  const { clearCart, clearProduct } = useCart();

  const { checkout } = useCheckout();
  const { data, error, isLoading } = checkout;

  // TODO: Rather than clearing the cart, we should remove the mark invalid products
  // as no longer available, so the user can still see them in the cart.
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products in cart. Cart has been cleared.");
    }
  }, [error, clearCart]);

  if (isLoading) {
    return (
      <div className="px-4 pt-4 lg:px-12 lg:pt-16">
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <LoaderIcon className="tex-muted-foreground animate-spin" />
          <p className="text-base font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className="px-4 pt-4 lg:px-12 lg:pt-16">
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 lg:px-12 lg:py-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-md border bg-white">
            {data?.docs.map((product, index) => {
              const { id, name, price, image } = product;
              const isLast = index === data.docs.length - 1;
              return (
                <CheckoutItem
                  key={id}
                  productId={id}
                  name={name}
                  isLast={isLast}
                  imageUrl={image?.url}
                  productUrl={`/products/${id}`}
                  price={price}
                  onRemove={() => clearProduct(id)}
                />
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar />
        </div>
      </div>
    </div>
  );
};
