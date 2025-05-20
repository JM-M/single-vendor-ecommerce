import { PropsWithChildren } from "react";
import Footer from "./footer";
import { Navbar } from "./navbar";

type Props = PropsWithChildren;
const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 bg-neutral-100">{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
