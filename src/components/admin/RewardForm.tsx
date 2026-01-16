import { useState, useEffect } from "react";
import { Gift, Star, Award, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/i18n";
import { useRewards } from "@/hooks/useRewards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
}

interface RewardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const BADGE_ICONS = [
  { value: "star", label: "Star", icon: Star },
  { value: "award", label: "Award", icon: Award },
  { value: "gift", label: "Gift", icon: Gift },
];

const BADGE_COLORS = [
  { value: "gold", label: "Gold", class: "bg-yellow-500" },
  { value: "silver", label: "Silver", class: "bg-gray-400" },
  { value: "bronze", label: "Bronze", class: "bg-orange-600" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
];

export function RewardForm({ open, onOpenChange, onSuccess }: RewardFormProps) {
  const { t } = useTranslation();
  const { awardReward } = useRewards();
  
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [rewardType, setRewardType] = useState<"points" | "badge" | "certificate">("points");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointsAmount, setPointsAmount] = useState(100);
  const [badgeIcon, setBadgeIcon] = useState("star");
  const [badgeColor, setBadgeColor] = useState("gold");

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !title.trim()) {
      toast.error(t("admin.rewards.selectUserAndTitle"));
      return;
    }

    setSubmitting(true);
    
    const success = await awardReward(
      selectedUserId,
      rewardType,
      title,
      description,
      rewardType === 'points' ? pointsAmount : 0,
      rewardType === 'badge' ? badgeIcon : undefined,
      rewardType === 'badge' ? badgeColor : undefined
    );

    if (success) {
      toast.success(t("admin.rewards.rewardGranted"));
      onSuccess();
      resetForm();
    } else {
      toast.error(t("admin.rewards.rewardFailed"));
    }

    setSubmitting(false);
  };

  const resetForm = () => {
    setSelectedUserId("");
    setRewardType("points");
    setTitle("");
    setDescription("");
    setPointsAmount(100);
    setBadgeIcon("star");
    setBadgeColor("gold");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-gold" />
            {t("admin.rewards.grantReward")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Selection */}
          <div className="space-y-2">
            <Label>{t("admin.rewards.selectUser")}</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder={t("admin.rewards.selectUserPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || t("admin.anonymous")}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Reward Type */}
          <div className="space-y-2">
            <Label>{t("admin.rewards.rewardType")}</Label>
            <RadioGroup
              value={rewardType}
              onValueChange={(v) => setRewardType(v as typeof rewardType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="points" id="points" />
                <Label htmlFor="points" className="flex items-center gap-1 cursor-pointer">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {t("admin.rewards.types.points")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="badge" id="badge" />
                <Label htmlFor="badge" className="flex items-center gap-1 cursor-pointer">
                  <Award className="w-4 h-4 text-blue-500" />
                  {t("admin.rewards.types.badge")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="certificate" id="certificate" />
                <Label htmlFor="certificate" className="flex items-center gap-1 cursor-pointer">
                  <FileText className="w-4 h-4 text-green-500" />
                  {t("admin.rewards.types.certificate")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>{t("admin.title")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("admin.rewards.titlePlaceholder")}
              required
            />
          </div>

          {/* Points Amount (only for points type) */}
          {rewardType === "points" && (
            <div className="space-y-2">
              <Label>{t("admin.rewards.pointsAmount")}</Label>
              <Input
                type="number"
                min={1}
                max={10000}
                value={pointsAmount}
                onChange={(e) => setPointsAmount(Number(e.target.value))}
              />
            </div>
          )}

          {/* Badge Options (only for badge type) */}
          {rewardType === "badge" && (
            <>
              <div className="space-y-2">
                <Label>{t("admin.rewards.badgeIcon")}</Label>
                <div className="flex gap-2">
                  {BADGE_ICONS.map((icon) => (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => setBadgeIcon(icon.value)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        badgeIcon === icon.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <icon.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("admin.rewards.badgeColor")}</Label>
                <div className="flex gap-2 flex-wrap">
                  {BADGE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setBadgeColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        badgeColor === color.value
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label>{t("admin.description")}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("admin.rewards.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Gift className="w-4 h-4" />
              )}
              {t("admin.rewards.grantReward")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
