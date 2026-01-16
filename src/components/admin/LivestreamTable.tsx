import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Play, Pause, CheckCircle, Radio } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface LivestreamTableProps {
  classes: any[];
  onEdit: (classItem: any) => void;
  onRefresh: () => void;
}

export function LivestreamTable({ classes, onEdit, onRefresh }: LivestreamTableProps) {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('live_classes')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: t("admin.livestreamDeleted"),
        description: t("admin.livestreamDeletedDesc"),
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('live_classes')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("admin.statusChanged"),
        description: `${t("admin.status")}: ${newStatus}`,
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 animate-pulse"><Radio className="w-3 h-3 mr-1" /> {t("admin.liveNow")}</Badge>;
      case 'scheduled':
        return <Badge variant="secondary"><Play className="w-3 h-3 mr-1" /> {t("admin.scheduled")}</Badge>;
      case 'completed':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" /> {t("admin.completed")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      youtube: "bg-red-100 text-red-700 border-red-200",
      facebook: "bg-blue-100 text-blue-700 border-blue-200",
      zoom: "bg-blue-100 text-blue-700 border-blue-200",
      google_meet: "bg-green-100 text-green-700 border-green-200",
    };
    return <Badge className={colors[platform] || ""} variant="outline">{platform}</Badge>;
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.title")}</TableHead>
              <TableHead>{t("admin.platform")}</TableHead>
              <TableHead>{t("admin.scheduledAt")}</TableHead>
              <TableHead>{t("admin.status")}</TableHead>
              <TableHead className="text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {t("admin.noLivestreams")}
                </TableCell>
              </TableRow>
            ) : (
              classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {classItem.title}
                  </TableCell>
                  <TableCell>{getPlatformBadge(classItem.meeting_platform || 'unknown')}</TableCell>
                  <TableCell>
                    {format(new Date(classItem.scheduled_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </TableCell>
                  <TableCell>{getStatusBadge(classItem.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {classItem.status === 'scheduled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(classItem.id, 'live')}
                          title={t("admin.goLive")}
                        >
                          <Play className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      {classItem.status === 'live' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(classItem.id, 'completed')}
                          title={t("admin.endLive")}
                        >
                          <Pause className="w-4 h-4 text-orange-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(classItem)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(classItem.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
