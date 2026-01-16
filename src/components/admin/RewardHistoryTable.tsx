import { useEffect, useState } from "react";
import { Star, Award, FileText, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/i18n";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRewards, Reward } from "@/hooks/useRewards";
import { getDateLocale } from "@/lib/date-utils";
import { format } from "date-fns";
import { toast } from "sonner";

const getRewardIcon = (type: string) => {
  switch (type) {
    case 'points':
      return <Star className="w-4 h-4 text-yellow-500" />;
    case 'badge':
      return <Award className="w-4 h-4 text-blue-500" />;
    case 'certificate':
      return <FileText className="w-4 h-4 text-green-500" />;
    default:
      return <Star className="w-4 h-4" />;
  }
};

const getBadgeColorClass = (color: string | null) => {
  switch (color) {
    case 'gold': return 'bg-yellow-500';
    case 'silver': return 'bg-gray-400';
    case 'bronze': return 'bg-orange-600';
    case 'blue': return 'bg-blue-500';
    case 'green': return 'bg-green-500';
    case 'purple': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export function RewardHistoryTable() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { rewards, loading, fetchAllRewards, deleteReward } = useRewards();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const dateLocale = getDateLocale(language);

  useEffect(() => {
    fetchAllRewards();
  }, [fetchAllRewards]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    const success = await deleteReward(deleteId);
    
    if (success) {
      toast.success(t("admin.rewards.rewardDeleted"));
      fetchAllRewards();
    } else {
      toast.error(t("common.error"));
    }
    
    setDeleting(false);
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("admin.rewards.noRewards")}
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.rewards.recipient")}</TableHead>
              <TableHead>{t("admin.rewards.rewardType")}</TableHead>
              <TableHead>{t("admin.title")}</TableHead>
              <TableHead>{t("admin.rewards.details")}</TableHead>
              <TableHead>{t("admin.rewards.grantedBy")}</TableHead>
              <TableHead>{t("admin.rewards.date")}</TableHead>
              <TableHead className="w-[80px]">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell className="font-medium">
                  {reward.user_name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRewardIcon(reward.reward_type)}
                    <span className="capitalize">
                      {t(`admin.rewards.types.${reward.reward_type}`)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{reward.title}</TableCell>
                <TableCell>
                  {reward.reward_type === 'points' && (
                    <span className="text-yellow-600 font-semibold">
                      +{reward.points_amount} {t("admin.rewards.points")}
                    </span>
                  )}
                  {reward.reward_type === 'badge' && reward.badge_color && (
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${getBadgeColorClass(reward.badge_color)}`} />
                      <span className="capitalize">{reward.badge_color}</span>
                    </div>
                  )}
                  {reward.reward_type === 'certificate' && (
                    <span className="text-green-600">
                      {reward.description?.slice(0, 30) || '-'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {reward.awarded_by_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(reward.created_at), 'd MMM yyyy', { locale: dateLocale })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(reward.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.rewards.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
