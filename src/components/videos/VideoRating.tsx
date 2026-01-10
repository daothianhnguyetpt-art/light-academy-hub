import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoRatingProps {
  rating: number | null;
  userRating?: number | null;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function VideoRating({
  rating,
  userRating,
  count = 0,
  interactive = false,
  onRate,
  size = "md",
  showCount = true,
}: VideoRatingProps) {
  const displayRating = userRating || rating || 0;

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (star: number) => {
    if (interactive && onRate) {
      onRate(star);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(star)}
            className={cn(
              "transition-all",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                star <= displayRating
                  ? "fill-secondary text-secondary"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
      {rating !== null && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}
          {showCount && count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  );
}
