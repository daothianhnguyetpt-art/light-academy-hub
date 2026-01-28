import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  const location = useLocation();

  // Only show on social feed
  if (location.pathname !== "/social-feed") {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-4 z-40 lg:hidden",
        "w-14 h-14 rounded-full",
        "bg-primary text-primary-foreground",
        "flex items-center justify-center",
        "shadow-lg shadow-primary/25",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-xl hover:shadow-primary/30",
        "active:scale-95",
        "btn-ripple",
        className
      )}
      style={{
        boxShadow: `
          0 4px 14px hsl(var(--primary) / 0.25),
          inset 0 0 0 1px hsl(var(--gold) / 0.3)
        `
      }}
      aria-label="Tạo bài viết mới"
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
}
