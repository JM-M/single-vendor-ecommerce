import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NavbarItem } from "@/modules/home/types";
import Link from "next/link";

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((item) => {
            const { href, children } = item;
            return (
              <Link
                key={href}
                href={href}
                className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                {children}
              </Link>
            );
          })}
          <div className="border-t">
            <Link
              prefetch
              href="/sign-in"
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Log in
            </Link>
            <Link
              prefetch
              href="/sign-up"
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Start selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
