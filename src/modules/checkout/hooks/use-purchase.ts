import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { useCheckoutStates } from "./use-checkout-states";

export const usePurchase = () => {
  const router = useRouter();
  const [, setStates] = useCheckoutStates();

  const trpc = useTRPC();

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

  return {
    purchase,
  };
};
