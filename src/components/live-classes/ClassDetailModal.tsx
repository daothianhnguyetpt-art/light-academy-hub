import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Clock, 
  Users, 
  CalendarPlus,
  Download,
  Bell,
  BellOff,
  Loader2,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { LiveClass } from "@/hooks/useLiveClasses";
import { useLiveClassRegistration } from "@/hooks/useLiveClassRegistration";
import { addToGoogleCalendar, downloadICS, requestNotificationPermission } from "@/lib/calendar-utils";
import { useAuth } from "@/hooks/useAuth";

interface ClassDetailModalProps {
  classItem: LiveClass | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClassDetailModal({ classItem, isOpen, onClose }: ClassDetailModalProps) {
  const { user } = useAuth();
  const [enableReminder, setEnableReminder] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { 
    isRegistered, 
    registrationCount, 
    loading,
    registerForClass,
    unregisterFromClass 
  } = useLiveClassRegistration(classItem?.id || null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRegister = async () => {
    if (!classItem) return;
    
    setIsRegistering(true);
    
    if (enableReminder) {
      await requestNotificationPermission();
    }
    
    await registerForClass(classItem.title, classItem.scheduled_at, enableReminder);
    setIsRegistering(false);
  };

  const handleUnregister = async () => {
    setIsRegistering(true);
    await unregisterFromClass();
    setIsRegistering(false);
  };

  const handleAddToGoogleCalendar = () => {
    if (!classItem) return;
    
    const startTime = new Date(classItem.scheduled_at);
    const endTime = new Date(startTime.getTime() + (classItem.duration_minutes || 60) * 60000);
    
    addToGoogleCalendar({
      title: classItem.title,
      description: classItem.description || undefined,
      startTime,
      endTime,
      location: 'FUN Academy Online',
    });
  };

  const handleDownloadICS = () => {
    if (!classItem) return;
    
    const startTime = new Date(classItem.scheduled_at);
    const endTime = new Date(startTime.getTime() + (classItem.duration_minutes || 60) * 60000);
    
    downloadICS({
      title: classItem.title,
      description: classItem.description || undefined,
      startTime,
      endTime,
      location: 'FUN Academy Online',
    });
  };

  if (!classItem) return null;

  const spotsLeft = classItem.max_participants 
    ? classItem.max_participants - registrationCount 
    : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {classItem.category || "Lớp học"}
            </Badge>
            {classItem.status === 'live' && (
              <Badge variant="destructive" className="text-xs">
                🔴 Đang diễn ra
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl font-display">
            {classItem.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Instructor Info */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border">
            <Avatar className="w-12 h-12 border-2 border-gold-muted">
              <AvatarImage src={classItem.instructor?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {classItem.instructor?.full_name?.charAt(0) || "GV"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {classItem.instructor?.full_name || "Giảng viên FUN Academy"}
              </p>
              <p className="text-sm text-muted-foreground">
                {classItem.instructor?.academic_title || "Giảng viên"}
              </p>
            </div>
          </div>

          {/* Description */}
          {classItem.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Mô tả</h4>
              <p className="text-foreground">{classItem.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/30 border border-border">
              <Calendar className="w-5 h-5 text-secondary mb-2" />
              <span className="text-xs text-muted-foreground">Ngày</span>
              <span className="text-sm font-medium text-foreground text-center">
                {formatDate(classItem.scheduled_at).split(',')[0]}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/30 border border-border">
              <Clock className="w-5 h-5 text-secondary mb-2" />
              <span className="text-xs text-muted-foreground">Giờ bắt đầu</span>
              <span className="text-sm font-medium text-foreground">
                {formatTime(classItem.scheduled_at)}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/30 border border-border">
              <Users className="w-5 h-5 text-secondary mb-2" />
              <span className="text-xs text-muted-foreground">Đã đăng ký</span>
              <span className="text-sm font-medium text-foreground">
                {loading ? "..." : `${registrationCount}/${classItem.max_participants || "∞"}`}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Thời lượng: {classItem.duration_minutes} phút</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>FUN Academy Online (Link sẽ được gửi qua email)</span>
          </div>

          {/* Reminder Option */}
          {!isRegistered && user && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/30 border border-border">
              <Checkbox 
                id="reminder" 
                checked={enableReminder} 
                onCheckedChange={(checked) => setEnableReminder(checked as boolean)}
              />
              <label htmlFor="reminder" className="flex items-center gap-2 text-sm cursor-pointer">
                {enableReminder ? <Bell className="w-4 h-4 text-secondary" /> : <BellOff className="w-4 h-4" />}
                Nhận thông báo nhắc nhở trước 30 phút
              </label>
            </div>
          )}

          {/* Registration Status */}
          {isRegistered && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-secondary">Bạn đã đăng ký lớp học này</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!user ? (
              <Button className="w-full" variant="gold" disabled>
                Vui lòng đăng nhập để đăng ký
              </Button>
            ) : isRegistered ? (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleUnregister}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Hủy đăng ký"
                )}
              </Button>
            ) : (
              <Button 
                className="w-full" 
                variant="gold"
                onClick={handleRegister}
                disabled={isRegistering || isFull}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : isFull ? (
                  "Lớp học đã đầy"
                ) : (
                  "Đăng Ký Tham Gia"
                )}
              </Button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={handleAddToGoogleCalendar}
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Google Calendar
              </Button>
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={handleDownloadICS}
              >
                <Download className="w-4 h-4 mr-2" />
                Tải file .ics
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
