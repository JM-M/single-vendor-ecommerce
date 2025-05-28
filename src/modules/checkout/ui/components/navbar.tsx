import Link from "next/link";

import { Button } from "@/components/ui/button";

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <p className="text-xl capitalize">Checkout</p>
        <Button variant="elevated" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </nav>
  );
};
