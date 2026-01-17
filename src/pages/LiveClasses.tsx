import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useLiveClasses, LiveClass } from "@/hooks/useLiveClasses";
import { useMyRegistrations } from "@/hooks/useLiveClassRegistration";
import { useAdmin } from "@/hooks/useAdmin";
import { ClassDetailModal } from "@/components/live-classes/ClassDetailModal";
import { AdminQuickPanel } from "@/components/live-classes/AdminQuickPanel";
import { CountdownTimer } from "@/components/live-classes/CountdownTimer";
import { ZoomInfoPanel } from "@/components/live-classes/ZoomInfoPanel";
import { checkReminders } from "@/lib/calendar-utils";
import { 
  joinMeeting, 
  getYoutubeEmbedUrl, 
  getFacebookEmbedUrl,
  getPlatformDisplayName,
  getPlatformColorClass,
  getPlatformIcon,
  isLivestreamPlatform,
  isMeetingPlatform
} from "@/lib/meeting-utils";
import { useTranslation } from "@/i18n/useTranslation";
import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale } from "@/lib/date-utils";
import { format } from "date-fns";
import { 
  Video,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Play,
  ExternalLink,
  Film
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";


export default function LiveClasses() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isConnected, address, connectWallet } = useWallet();
  const { classes, loading, error, fetchClasses, fetchCompletedClasses } = useLiveClasses();
  const { registeredClassIds, loading: loadingRegistrations } = useMyRegistrations();
  const { isAdmin } = useAdmin();
  
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedLivestream, setSelectedLivestream] = useState<LiveClass | null>(null);
  const [completedClasses, setCompletedClasses] = useState<LiveClass[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<LiveClass | null>(null);

  const dateLocale = getDateLocale(language);

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `${t("liveClasses.today")}, ${format(date, 'HH:mm', { locale: dateLocale })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `${t("liveClasses.tomorrow")}, ${format(date, 'HH:mm', { locale: dateLocale })}`;
    } else {
      return format(date, 'd MMM, HH:mm', { locale: dateLocale });
    }
  };

  // Check for reminders on load
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Auto-select active livestream when page loads
  useEffect(() => {
    if (classes.length > 0 && !selectedLivestream) {
      const activeLivestream = classes.find(
        c => c.status === 'live' && isLivestreamPlatform(c.meeting_platform)
      );
      if (activeLivestream) {
        setSelectedLivestream(activeLivestream);
      }
    }
  }, [classes, selectedLivestream]);

  // Fetch completed classes when tab changes
  useEffect(() => {
    if (activeTab === "completed") {
      fetchCompletedClasses().then((data) => setCompletedClasses(data as LiveClass[]));
    }
  }, [activeTab, fetchCompletedClasses]);

  // Filter classes based on active tab
  const filteredClasses = activeTab === "completed" 
    ? completedClasses
    : classes.filter((classItem) => {
        if (activeTab === "registered") {
          return registeredClassIds.includes(classItem.id);
        }
        if (activeTab === "live") {
          return classItem.status === "live";
        }
        if (activeTab === "livestream") {
          return isLivestreamPlatform(classItem.meeting_platform);
        }
        return true;
      });

  // Get livestream classes for the embed section
  const livestreamClasses = classes.filter((c) => 
    isLivestreamPlatform(c.meeting_platform) && c.status === 'live'
  );

  // Handle joining a meeting
  const handleJoinMeeting = (classItem: LiveClass | null) => {
    if (!classItem?.meeting_url) return;
    
    if (isLivestreamPlatform(classItem.meeting_platform)) {
      setSelectedLivestream(classItem);
    } else {
      joinMeeting(classItem.meeting_url);
    }
  };

  const handleClassClick = (classItem: LiveClass) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
    // Refresh classes to update registration counts
    fetchClasses();
    if (activeTab === "completed") {
      fetchCompletedClasses().then((data) => setCompletedClasses(data as LiveClass[]));
    }
  };

  // Handle watching a recording
  const handleWatchRecording = (classItem: LiveClass) => {
    if (!classItem.recording_url) return;
    
    // Check if it's a YouTube/Facebook video that can be embedded
    if (classItem.recording_url.includes('youtube.com') || 
        classItem.recording_url.includes('youtu.be') ||
        classItem.recording_url.includes('facebook.com')) {
      setSelectedRecording(classItem);
    } else {
      window.open(classItem.recording_url, '_blank');
    }
  };

  const liveClass = classes.find(c => c.status === 'live');

  // Find the next upcoming class (for countdown)
  const nextUpcomingClass = useMemo(() => {
    const now = new Date();
    const upcomingClasses = classes
      .filter(c => c.status === 'scheduled' && new Date(c.scheduled_at) > now)
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    return upcomingClasses[0] || null;
  }, [classes]);

  // Find active Zoom class (live or about to start)
  const activeZoomClass = useMemo(() => {
    const now = new Date();
    // First check for live Zoom class
    const liveZoom = classes.find(c => c.status === 'live' && c.meeting_platform === 'zoom');
    if (liveZoom) return liveZoom;
    
    // Then check for Zoom class starting within 30 minutes
    const soonZoom = classes.find(c => {
      if (c.meeting_platform !== 'zoom' || c.status !== 'scheduled') return false;
      const scheduledTime = new Date(c.scheduled_at);
      const diffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
      return diffMinutes >= 0 && diffMinutes <= 30;
    });
    return soonZoom || null;
  }, [classes]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnectWallet={connectWallet}
        isWalletConnected={isConnected}
        walletAddress={address ?? undefined}
      />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Meeting Preview */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  {t("liveClasses.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("liveClasses.subtitle")}
                </p>
              </motion.div>

              {/* Admin Quick Panel */}
              {isAdmin && (
                <AdminQuickPanel liveClass={liveClass} onRefresh={fetchClasses} />
              )}

              {/* Countdown Timer - Show when no live class */}
              {!liveClass && nextUpcomingClass && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="mb-6"
                >
                  <CountdownTimer
                    targetClass={nextUpcomingClass}
                    onViewDetails={(c) => {
                      setSelectedClass(c);
                      setIsModalOpen(true);
                    }}
                    onJoinNow={(c) => handleJoinMeeting(c)}
                  />
                </motion.div>
              )}

              {/* Zoom Info Panel - Show when Zoom class is active/starting soon */}
              {activeZoomClass && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="mb-6"
                >
                  <ZoomInfoPanel classItem={activeZoomClass} />
                </motion.div>
              )}

              {/* Main Livestream Player - Show YouTube/Facebook embed when live */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="academic-card overflow-hidden"
              >
                {/* Header with Live Badge */}
                {(selectedLivestream || liveClass) && (
                  <div className="p-4 border-b border-border bg-gradient-to-r from-destructive/10 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-sm font-medium animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-destructive-foreground" />
                          {t("liveClasses.liveBadge")}
                        </span>
                        <span className="font-semibold text-foreground">
                          {selectedLivestream?.title || liveClass?.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-card text-sm text-foreground flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {(selectedLivestream?.registration_count || liveClass?.registration_count) || 0} {t("liveClasses.participants")}
                        </span>
                        {selectedLivestream && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedLivestream(null)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Video Area - YouTube/Facebook Embed or Placeholder */}
                <div className="aspect-video bg-foreground/5 relative">
                  {/* YouTube Embed */}
                  {(selectedLivestream?.meeting_platform === 'youtube' || 
                    (!selectedLivestream && liveClass?.meeting_platform === 'youtube')) && 
                   (selectedLivestream?.livestream_url || liveClass?.livestream_url) ? (
                    <iframe 
                      src={getYoutubeEmbedUrl(selectedLivestream?.livestream_url || liveClass?.livestream_url || '') || ''}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Livestream"
                    />
                  ) : (selectedLivestream?.meeting_platform === 'facebook' || 
                       (!selectedLivestream && liveClass?.meeting_platform === 'facebook')) && 
                      (selectedLivestream?.livestream_url || liveClass?.livestream_url) ? (
                    <iframe 
                      src={getFacebookEmbedUrl(selectedLivestream?.livestream_url || liveClass?.livestream_url || '')}
                      className="w-full h-full"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      title="Livestream"
                    />
                  ) : (
                    /* Fallback - Instructor Info when no livestream */
                    <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gold-muted">
                          <AvatarImage src={liveClass?.instructor?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                            {liveClass?.instructor?.full_name?.charAt(0) || "GV"}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-foreground">
                          {liveClass?.instructor?.full_name || t("liveClasses.instructor")}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {liveClass?.title || t("liveClasses.noLiveClass")}
                        </p>
                        {liveClass && (
                          <p className="text-xs text-muted-foreground">
                            {t("liveClasses.clickLivestreamBelow")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Bar */}
                {(selectedLivestream || liveClass) && (
                  <div className="p-4 bg-card border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-gold-muted">
                          <AvatarImage src={(selectedLivestream?.instructor || liveClass?.instructor)?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {(selectedLivestream?.instructor || liveClass?.instructor)?.full_name?.charAt(0) || "GV"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {(selectedLivestream?.instructor || liveClass?.instructor)?.full_name || t("liveClasses.instructor")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedLivestream?.instructor || liveClass?.instructor)?.academic_title || t("liveClasses.instructor")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(selectedLivestream?.meeting_url || liveClass?.meeting_url) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => joinMeeting(selectedLivestream?.meeting_url || liveClass?.meeting_url)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {t("liveClasses.openExternal")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Integration Info - Now Clickable */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-6 academic-card"
              >
                <h3 className="font-semibold text-foreground mb-3">{t("liveClasses.integrations.title")}</h3>
                
                {/* Meeting Platforms */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <button 
                    onClick={() => handleJoinMeeting(liveClass?.meeting_platform === 'zoom' ? liveClass : null)}
                    disabled={!liveClass || liveClass.meeting_platform !== 'zoom'}
                    className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border hover:border-blue-500 hover:bg-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                      Z
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">Zoom</p>
                      <p className="text-xs text-muted-foreground">
                        {liveClass?.meeting_platform === 'zoom' ? t("liveClasses.clickToJoin") : t("liveClasses.noActiveClass")}
                      </p>
                    </div>
                    {liveClass?.meeting_platform === 'zoom' && (
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleJoinMeeting(liveClass?.meeting_platform === 'google_meet' ? liveClass : null)}
                    disabled={!liveClass || liveClass.meeting_platform !== 'google_meet'}
                    className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border hover:border-green-500 hover:bg-green-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold">
                      G
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">Google Meet</p>
                      <p className="text-xs text-muted-foreground">
                        {liveClass?.meeting_platform === 'google_meet' ? t("liveClasses.clickToJoin") : t("liveClasses.noActiveClass")}
                      </p>
                    </div>
                    {liveClass?.meeting_platform === 'google_meet' && (
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
                    )}
                  </button>
                </div>

                {/* Livestream Platforms */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      const ytClass = classes.find(c => c.meeting_platform === 'youtube' && c.status === 'live');
                      if (ytClass) setSelectedLivestream(ytClass);
                    }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border hover:border-red-500 hover:bg-red-500/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white">
                      <Play className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">{t("liveClasses.platforms.youtube")}</p>
                      <p className="text-xs text-muted-foreground">{t("liveClasses.integrations.watchLive")}</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const fbClass = classes.find(c => c.meeting_platform === 'facebook' && c.status === 'live');
                      if (fbClass) setSelectedLivestream(fbClass);
                    }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border hover:border-blue-600 hover:bg-blue-600/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                      f
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">{t("liveClasses.platforms.facebook")}</p>
                      <p className="text-xs text-muted-foreground">{t("liveClasses.integrations.watchLive")}</p>
                    </div>
                  </button>
                </div>
              </motion.div>

            </div>

            {/* Sidebar - Upcoming Classes */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    {t("liveClasses.upcomingClasses")}
                  </h2>
                </div>

                {/* Filter Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="w-full h-auto flex flex-wrap sm:grid sm:grid-cols-5 gap-1 p-1">
                    <TabsTrigger value="all" className="text-[10px] sm:text-xs flex-1 sm:flex-none">
                      {t("liveClasses.tabs.all")}
                    </TabsTrigger>
                    <TabsTrigger value="registered" className="text-[10px] sm:text-xs flex-1 sm:flex-none">
                      {t("liveClasses.tabs.registered")}
                    </TabsTrigger>
                    <TabsTrigger value="live" className="text-[10px] sm:text-xs flex-1 sm:flex-none">
                      {t("liveClasses.tabs.live")}
                    </TabsTrigger>
                    <TabsTrigger value="livestream" className="text-[10px] sm:text-xs flex-1 sm:flex-none">
                      {t("liveClasses.tabs.livestream")}
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="text-[10px] sm:text-xs flex-1 sm:flex-none flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      <span className="hidden xs:inline">{t("liveClasses.tabs.completed")}</span>
                      <span className="xs:hidden">📹</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {(loading || loadingRegistrations) && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">{t("common.loading")}</span>
                  </div>
                )}

                {!loading && !loadingRegistrations && filteredClasses.length === 0 && (
                  <div className="academic-card p-6 text-center">
                    <Sparkles className="w-10 h-10 text-gold mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">
                      {activeTab === "registered" 
                        ? t("liveClasses.noRegistered") 
                        : activeTab === "completed"
                        ? t("liveClasses.noCompletedClasses")
                        : t("liveClasses.noClasses")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "registered" 
                        ? t("liveClasses.noRegisteredDescription") 
                        : activeTab === "completed"
                        ? t("liveClasses.noCompletedDescription")
                        : t("liveClasses.noClassesDescription")}
                    </p>
                  </div>
                )}

                {!loading && !loadingRegistrations && filteredClasses.length > 0 && (
                  <div className="space-y-4">
                    {filteredClasses.map((classItem) => {
                      const isRegistered = registeredClassIds.includes(classItem.id);
                      
                      return (
                        <div
                          key={classItem.id}
                          onClick={() => handleClassClick(classItem)}
                          className="academic-card p-4 cursor-pointer hover:border-gold-muted transition-all hover:shadow-md"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                classItem.status === 'live' 
                                  ? "bg-destructive/10 text-destructive" 
                                  : classItem.status === 'completed'
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-accent text-foreground"
                              }`}>
                                {classItem.status === 'live' 
                                  ? `🔴 ${t("liveClasses.liveNow")}` 
                                  : classItem.status === 'completed'
                                  ? `📹 ${t("liveClasses.completedBadge")}`
                                  : classItem.category || t("liveClasses.class")}
                              </span>
                              {isRegistered && classItem.status !== 'completed' && (
                                <Badge variant="outline" className="text-xs text-secondary border-secondary/50 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {t("liveClasses.registered")}
                                </Badge>
                              )}
                              {classItem.status === 'completed' && classItem.recording_url && (
                                <Badge variant="outline" className="text-xs text-primary border-primary/50 flex items-center gap-1">
                                  <Film className="w-3 h-3" />
                                  {t("liveClasses.hasRecording")}
                                </Badge>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>

                          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                            {classItem.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={classItem.instructor?.avatar_url || undefined} />
                              <AvatarFallback className="text-[10px] bg-accent">
                                {classItem.instructor?.full_name?.charAt(0) || "G"}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm text-muted-foreground">
                              {classItem.instructor?.full_name || t("liveClasses.instructor")}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatScheduledDate(classItem.scheduled_at)}
                            </span>
                            {classItem.status === 'completed' && classItem.recording_url ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 border-primary/50 text-primary hover:bg-primary/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWatchRecording(classItem);
                                }}
                              >
                                <Play className="w-3 h-3" />
                                {t("liveClasses.watchRecording")}
                              </Button>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {classItem.registration_count || 0}/{classItem.max_participants || "∞"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-gold-muted hover:bg-accent"
                  onClick={() => setActiveTab("all")}
                >
                  {t("liveClasses.viewAll")}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Class Detail Modal */}
      <ClassDetailModal 
        classItem={selectedClass}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      {/* Recording Embed Player */}
      {selectedRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedRecording(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl bg-card rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  📹 {t("liveClasses.recording")}
                </Badge>
                <span className="font-medium text-foreground">{selectedRecording.title}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedRecording(null)}
              >
                ✕
              </Button>
            </div>
            <div className="aspect-video bg-foreground/5">
              {(selectedRecording.recording_url?.includes('youtube.com') || 
                selectedRecording.recording_url?.includes('youtu.be')) && (
                <iframe 
                  src={getYoutubeEmbedUrl(selectedRecording.recording_url) || ''}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {selectedRecording.recording_url?.includes('facebook.com') && (
                <iframe 
                  src={getFacebookEmbedUrl(selectedRecording.recording_url)}
                  className="w-full h-full"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
