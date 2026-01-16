import { useState } from "react";
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
  CheckCircle2,
  ExternalLink,
  Play
} from "lucide-react";
import { LiveClass } from "@/hooks/useLiveClasses";
import { useLiveClassRegistration } from "@/hooks/useLiveClassRegistration";
import { addToGoogleCalendar, downloadICS, requestNotificationPermission } from "@/lib/calendar-utils";
import { joinMeeting, getPlatformDisplayName, isLivestreamPlatform, isMeetingPlatform } from "@/lib/meeting-utils";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n/useTranslation";
import { getDateLocale } from "@/lib/date-utils";
import { useLanguage } from "@/i18n/LanguageContext";

interface ClassDetailModalProps {
  classItem: LiveClass | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClassDetailModal({ classItem, isOpen, onClose }: ClassDetailModalProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
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
    const locale = getDateLocale(String(currentLanguage));
    return date.toLocaleDateString(locale.code || 'vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const locale = getDateLocale(String(currentLanguage));
    return date.toLocaleTimeString(locale.code || 'vi-VN', {
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
              {classItem.category || t("liveClasses.classDetails")}
            </Badge>
            {classItem.status === 'live' && (
              <Badge variant="destructive" className="text-xs">
                🔴 {t("liveClasses.live")}
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
                {classItem.instructor?.full_name || t("liveClasses.noInstructor")}
              </p>
              <p className="text-sm text-muted-foreground">
                {classItem.instructor?.academic_title || t("liveClasses.instructor")}
              </p>
            </div>
          </div>

          {/* Description */}
          {classItem.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("globalSchools.philosophy.description") ? "Mô tả" : "Description"}</h4>
              <p className="text-foreground">{classItem.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/30 border border-border">
              <Calendar className="w-5 h-5 text-secondary mb-2" />
              <span className="text-xs text-muted-foreground">{t("liveClasses.scheduledAt")}</span>
              <span className="text-sm font-medium text-foreground text-center">
                {formatDate(classItem.scheduled_at).split(',')[0]}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/30 border border-border">
              <Clock className="w-5 h-5 text-secondary mb-2" />
              <span className="text-xs text-muted-foreground">{t("liveClasses.duration")}</span>
              <span className="text-sm font-medium text-foreground">
                {formatTime(classItem.scheduled_at)}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/30 border border-border">
              <Users className="w-5 h-5 text-secondary mb-2" />
              <span className="text-xs text-muted-foreground">{t("liveClasses.registered")}</span>
              <span className="text-sm font-medium text-foreground">
                {loading ? "..." : `${registrationCount}/${classItem.max_participants || "∞"}`}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{t("liveClasses.duration")}: {classItem.duration_minutes} {t("common.minutes")}</span>
          </div>

          {/* Location / Platform */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {classItem.meeting_platform ? getPlatformDisplayName(classItem.meeting_platform) : 'FUN Academy Online'}
            </span>
          </div>

          {/* Join Meeting Button - Show when class is live and has meeting URL */}
          {classItem.status === 'live' && classItem.meeting_url && isMeetingPlatform(classItem.meeting_platform) && (
            <Button 
              variant="gold"
              className="w-full"
              onClick={() => joinMeeting(classItem.meeting_url)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {classItem.meeting_platform === 'zoom' ? t("liveClasses.joinZoom") : t("liveClasses.joinMeet")}
            </Button>
          )}

          {/* Watch Livestream Button - Show for YouTube/Facebook */}
          {classItem.status === 'live' && classItem.livestream_url && isLivestreamPlatform(classItem.meeting_platform) && (
            <Button 
              variant="gold"
              className="w-full"
              onClick={() => window.open(classItem.livestream_url || '', '_blank')}
            >
              <Play className="w-4 h-4 mr-2" />
              {t("liveClasses.watchLive")} - {getPlatformDisplayName(classItem.meeting_platform)}
            </Button>
          )}

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
                {t("liveClasses.enableReminder")} ({t("liveClasses.reminderNote")})
              </label>
            </div>
          )}

          {/* Registration Status */}
          {isRegistered && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-secondary">{t("liveClasses.registered")}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!user ? (
              <Button className="w-full" variant="gold" disabled>
                {t("socialFeed.loginToPost")}
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
                    {t("common.loading")}
                  </>
                ) : (
                  t("liveClasses.unregister")
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
                    {t("common.loading")}
                  </>
                ) : isFull ? (
                  t("liveClasses.noClasses")
                ) : (
                  t("liveClasses.register")
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
                {t("liveClasses.addToCalendar")}
              </Button>
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={handleDownloadICS}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("liveClasses.downloadICS")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
