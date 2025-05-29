import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export const usePurchase = () => {
  const router = useRouter();

  const trpc = useTRPC();

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onSuccess: async (data) => {
        if (typeof window !== "undefined") {
          const { default: PaystackPop } = await import("@paystack/inline-js");
          // Open Paystack popup
          const popup = new PaystackPop();
          popup.resumeTransaction(data.accessCode);
          // TODO: Initiate polling of order to see if payment has been updated.
          // Ensure the page works on reload by keeping track of a checkout state
        }
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
