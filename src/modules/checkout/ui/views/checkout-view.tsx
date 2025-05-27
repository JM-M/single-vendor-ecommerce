"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useCart } from "../../hooks/use-cart";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    }),
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({
          success: false,
          cancel: false,
        });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          // TODO: Modify when subdomains are implemented
          router.push("/sign-in");
          toast.error("Not logged in.");
        }

        toast.error(error.message || "An error occurred during checkout.");
      },
    }),
  );

  useEffect(() => {
    if (states.success) {
      setStates({
        success: false,
        cancel: false,
      });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    queryClient,
    trpc.library.getMany,
  ]);

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
    <div className="px-4 pt-4 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-md border bg-white">
            {data?.docs.map((product, index) => {
              const { id, name, price, image, tenant } = product;
              const isLast = index === data.docs.length - 1;
              return (
                <CheckoutItem
                  key={id}
                  name={name}
                  isLast={isLast}
                  imageUrl={image?.url}
                  productUrl={generateTenantURL(tenant.slug, `/products/${id}`)}
                  tenantUrl={generateTenantURL(tenant.slug)}
                  tenantName={tenant.name}
                  price={price}
                  onRemove={() => removeProduct(id)}
                />
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
