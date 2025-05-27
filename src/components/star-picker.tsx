"use client";

import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { useState } from "react";

interface StarPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const StarPicker = ({
  value = 0,
  onChange,
  disabled = false,
  className = "",
}: StarPickerProps) => {
  const [hoveredValue, setHoveredValue] = useState<number>(0);

  return (
    <div
      className={cn(
        "flex items-center",
        {
          "cursor-not-allowed opacity-50": disabled,
        },
        className,
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn("p-0.5 transition", {
            "cursor-pointer hover:scale-110": !disabled,
          })}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoveredValue(star)}
          onMouseLeave={() => setHoveredValue(0)}
        >
          <StarIcon
            className={cn("size-5 stroke-black", {
              "fill-black": (hoveredValue || value) >= star,
            })}
          />
        </button>
      ))}
    </div>
  );
};
