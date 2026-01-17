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
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Eye, Star, Play, Image as ImageIcon } from "lucide-react";
import { AdminVideo, useAdminVideos } from "@/hooks/useAdminVideos";

interface VideoTableProps {
  videos: AdminVideo[];
  onEdit: (video: AdminVideo) => void;
  onRefresh: () => void;
}

export function VideoTable({ videos, onEdit, onRefresh }: VideoTableProps) {
  const { t } = useTranslation();
  const { deleteVideo } = useAdminVideos();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteVideo(deleteId);
      toast({
        title: t("admin.video.deleted"),
        description: t("admin.video.deletedDesc"),
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getLevelBadgeVariant = (level: string | null) => {
    switch (level) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  const formatViews = (views: number | null) => {
    if (!views) return '0';
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{t("admin.video.noVideos")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">{t("admin.video.thumbnail")}</TableHead>
              <TableHead>{t("admin.video.title")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("admin.video.category")}</TableHead>
              <TableHead className="hidden sm:table-cell">{t("admin.video.level")}</TableHead>
              <TableHead className="hidden lg:table-cell">{t("admin.video.views")}</TableHead>
              <TableHead className="hidden lg:table-cell">{t("admin.video.rating")}</TableHead>
              <TableHead className="text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <div className="w-16 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium line-clamp-1">{video.title}</span>
                    {video.instructor?.full_name && (
                      <span className="text-xs text-muted-foreground">
                        {video.instructor.full_name}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {video.category ? (
                    <Badge variant="outline">{video.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {video.level ? (
                    <Badge variant={getLevelBadgeVariant(video.level)}>
                      {t(`videoLibrary.level.${video.level}`)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-muted-foreground" />
                    <span>{formatViews(video.views)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{video.rating?.toFixed(1) || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(video)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(video.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
              {t("admin.video.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
