import { Navbar } from "@/modules/checkout/ui/components/navbar";
import Footer from "@/modules/home/ui/components/footer";

type Props = {
  children?: React.ReactNode;
};
const CheckoutLayout = async ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F0]">
      <Navbar />
      <div className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl)">{children}</div>
      </div>
      <Footer />
    </div>
  );
};
export default CheckoutLayout;
