import { cn } from "@/lib/utils";
import React from "react";

interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  blur?: "none" | "sm" | "md" | "lg" | "xl";
  opacity?: "light" | "medium" | "dark";
}

export const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ children, className, blur = "md", opacity = "medium", ...props }, ref) => {
    const blurClasses = {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    };

    const opacityClasses = {
      light: "bg-black/20",
      medium: "bg-black/50",
      dark: "bg-black/80",
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base backdrop styles
          "fixed inset-0 z-50 flex items-center justify-center",
          // Backdrop blur and opacity
          blurClasses[blur],
          opacityClasses[opacity],
          // Custom classes
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
