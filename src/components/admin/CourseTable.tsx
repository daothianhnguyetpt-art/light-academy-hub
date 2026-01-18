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
import { Edit, Trash2, Video, BookOpen, Loader2 } from "lucide-react";
import { useAdminCourses, AdminCourse } from "@/hooks/useAdminCourses";

interface CourseTableProps {
  courses: AdminCourse[];
  onEdit: (course: AdminCourse) => void;
  onManageVideos: (course: AdminCourse) => void;
  onRefresh: () => void;
}

export function CourseTable({ courses, onEdit, onManageVideos, onRefresh }: CourseTableProps) {
  const { t } = useTranslation();
  const { deleteCourse } = useAdminCourses();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      await deleteCourse(deletingId);
      toast({
        title: t("admin.course.deleted"),
        description: t("admin.course.deletedDesc"),
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const getLevelBadgeClass = (level: string | null) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "intermediate":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "advanced":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "";
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 academic-card">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t("admin.course.noCourses")}
        </h3>
        <p className="text-muted-foreground">
          {t("admin.course.noCoursesDesc")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>{t("admin.course.title")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("admin.course.category")}</TableHead>
              <TableHead className="hidden sm:table-cell">{t("admin.course.level")}</TableHead>
              <TableHead>{t("admin.course.videoCount")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("admin.video.instructor")}</TableHead>
              <TableHead className="text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-14 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-14 h-10 bg-accent rounded flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {course.title}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.category || "-"}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {course.level && (
                    <Badge variant="secondary" className={getLevelBadgeClass(course.level)}>
                      {t(`videoLibrary.level.${course.level}`)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1">
                    <Video className="w-3 h-3" />
                    {course.video_count || 0}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.instructor?.full_name || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onManageVideos(course)}
                      title={t("admin.course.manageVideos")}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(course)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingId(course.id)}
                      className="text-destructive hover:text-destructive"
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.course.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
