import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
  className?: string;
}

export const ProductSection = ({ title, children, className }: Props) => {
  return (
    <div className={className}>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
};
