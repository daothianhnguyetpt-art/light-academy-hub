import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface VideoFilters {
  level: string | null;
  duration: string | null;
  minRating: number | null;
}

interface VideoFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: VideoFilters;
  onFiltersChange: (filters: VideoFilters) => void;
}

const levels = [
  { value: "all", label: "Tất cả" },
  { value: "beginner", label: "Cơ bản" },
  { value: "intermediate", label: "Trung cấp" },
  { value: "advanced", label: "Nâng cao" },
];

const durations = [
  { value: "all", label: "Tất cả" },
  { value: "short", label: "< 30 phút" },
  { value: "medium", label: "30 - 60 phút" },
  { value: "long", label: "> 60 phút" },
];

const ratings = [
  { value: "all", label: "Tất cả" },
  { value: "4.5", label: "≥ 4.5 sao" },
  { value: "4.0", label: "≥ 4.0 sao" },
  { value: "3.5", label: "≥ 3.5 sao" },
];

export function VideoFilterDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: VideoFilterDrawerProps) {
  const handleLevelChange = (value: string) => {
    onFiltersChange({
      ...filters,
      level: value === "all" ? null : value,
    });
  };

  const handleDurationChange = (value: string) => {
    onFiltersChange({
      ...filters,
      duration: value === "all" ? null : value,
    });
  };

  const handleRatingChange = (value: string) => {
    onFiltersChange({
      ...filters,
      minRating: value === "all" ? null : parseFloat(value),
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      level: null,
      duration: null,
      minRating: null,
    });
  };

  const hasActiveFilters = filters.level || filters.duration || filters.minRating;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[320px] sm:w-[400px] bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center justify-between">
            Bộ lọc nâng cao
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Level Filter */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Trình độ</Label>
            <RadioGroup
              value={filters.level || "all"}
              onValueChange={handleLevelChange}
              className="space-y-2"
            >
              {levels.map((level) => (
                <div key={level.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={level.value}
                    id={`level-${level.value}`}
                    className="border-border text-primary"
                  />
                  <Label
                    htmlFor={`level-${level.value}`}
                    className="text-sm text-foreground/80 cursor-pointer"
                  >
                    {level.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Duration Filter */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Thời lượng</Label>
            <RadioGroup
              value={filters.duration || "all"}
              onValueChange={handleDurationChange}
              className="space-y-2"
            >
              {durations.map((duration) => (
                <div key={duration.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={duration.value}
                    id={`duration-${duration.value}`}
                    className="border-border text-primary"
                  />
                  <Label
                    htmlFor={`duration-${duration.value}`}
                    className="text-sm text-foreground/80 cursor-pointer"
                  >
                    {duration.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Đánh giá</Label>
            <RadioGroup
              value={filters.minRating?.toString() || "all"}
              onValueChange={handleRatingChange}
              className="space-y-2"
            >
              {ratings.map((rating) => (
                <div key={rating.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={rating.value}
                    id={`rating-${rating.value}`}
                    className="border-border text-primary"
                  />
                  <Label
                    htmlFor={`rating-${rating.value}`}
                    className="text-sm text-foreground/80 cursor-pointer"
                  >
                    {rating.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <SheetFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Áp dụng bộ lọc
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
