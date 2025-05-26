import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StarRatingProps {
  rating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
}

export const StarRating = ({
  rating = 0,
  className = "",
  iconClassName = "",
  text = "",
}: StarRatingProps) => {
  const safeRating = Math.max(MIN_RATING, Math.min(MAX_RATING, rating));

  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }, (_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "size-4",
            {
              "fill-black": index < safeRating,
            },
            iconClassName,
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
};
