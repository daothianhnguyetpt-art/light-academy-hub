import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useLiveClasses, LiveClass } from "@/hooks/useLiveClasses";
import { useMyRegistrations } from "@/hooks/useLiveClassRegistration";
import { ClassDetailModal } from "@/components/live-classes/ClassDetailModal";
import { checkReminders } from "@/lib/calendar-utils";
import { useTranslation } from "@/i18n/useTranslation";
import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale } from "@/lib/date-utils";
import { format } from "date-fns";
import { 
  Video,
  Mic,
  MicOff,
  VideoOff,
  MonitorUp,
  Hand,
  MessageSquare,
  Users,
  Settings,
  Phone,
  Calendar,
  Clock,
  ChevronRight,
  Circle,
  Loader2,
  Sparkles,
  CheckCircle2
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

const meetingParticipants = [
  { name: "Giảng viên", initials: "GV", isSpeaking: true },
  { name: "Học viên 1", initials: "H1", isSpeaking: false },
  { name: "Học viên 2", initials: "H2", isSpeaking: false },
  { name: "Học viên 3", initials: "H3", isSpeaking: false },
];

export default function LiveClasses() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isConnected, address, connectWallet } = useWallet();
  const { classes, loading, error, fetchClasses } = useLiveClasses();
  const { registeredClassIds, loading: loadingRegistrations } = useMyRegistrations();
  
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

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

  // Filter classes based on active tab
  const filteredClasses = classes.filter((classItem) => {
    if (activeTab === "registered") {
      return registeredClassIds.includes(classItem.id);
    }
    if (activeTab === "live") {
      return classItem.status === "live";
    }
    return true;
  });

  const handleClassClick = (classItem: LiveClass) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
    // Refresh classes to update registration counts
    fetchClasses();
  };

  const liveClass = classes.find(c => c.status === 'live');

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

              {/* Meeting Room Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="academic-card overflow-hidden"
              >
                {/* Video Area */}
                <div className="aspect-video bg-foreground/5 relative">
                  {/* Main Speaker */}
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
                      <p className="text-sm text-muted-foreground">
                        {liveClass?.title || t("liveClasses.noLiveClass")}
                      </p>
                    </div>
                  </div>

                  {/* Participant Thumbnails */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {meetingParticipants.slice(1).map((participant) => (
                      <div
                        key={participant.name}
                        className={`w-20 h-14 rounded-lg bg-card border-2 flex items-center justify-center ${
                          participant.isSpeaking ? "border-secondary" : "border-border"
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-accent">
                            {participant.initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                    <div className="w-20 h-14 rounded-lg bg-card border-2 border-border flex items-center justify-center text-xs text-muted-foreground">
                      +152
                    </div>
                  </div>

                  {/* Live Badge */}
                  {liveClass && (
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-destructive-foreground animate-pulse" />
                        {t("liveClasses.liveBadge")}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-card/80 backdrop-blur text-sm text-foreground">
                        <Users className="w-4 h-4 inline mr-1" />
                        {liveClass.registration_count || 0} {t("liveClasses.participants")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="p-4 bg-card border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isMuted ? "outline" : "default"}
                            size="icon"
                            onClick={() => setIsMuted(!isMuted)}
                            className={isMuted ? "border-border" : "bg-primary"}
                          >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isMuted ? t("liveClasses.controls.unmute") : t("liveClasses.controls.mute")}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isVideoOn ? "default" : "outline"}
                            size="icon"
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            className={isVideoOn ? "bg-primary" : "border-border"}
                          >
                            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isVideoOn ? t("liveClasses.controls.videoOff") : t("liveClasses.controls.videoOn")}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="border-border">
                            <MonitorUp className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("liveClasses.controls.shareScreen")}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isHandRaised ? "default" : "outline"}
                            size="icon"
                            onClick={() => setIsHandRaised(!isHandRaised)}
                            className={isHandRaised ? "bg-secondary text-secondary-foreground" : "border-border"}
                          >
                            <Hand className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isHandRaised ? t("liveClasses.controls.lowerHand") : t("liveClasses.controls.raiseHand")}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="border-border">
                            <MessageSquare className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("liveClasses.controls.openChat")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="border-border text-destructive hover:bg-destructive/10">
                            <Circle className="w-5 h-5 fill-current" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("liveClasses.controls.record")}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button variant="outline" size="icon" className="border-border">
                        <Settings className="w-5 h-5" />
                      </Button>
                      <Button variant="destructive" className="px-4">
                        <Phone className="w-4 h-4 mr-2" />
                        {t("liveClasses.controls.leave")}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Integration Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-6 academic-card"
              >
                <h3 className="font-semibold text-foreground mb-3">{t("liveClasses.integrations.title")}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      Z
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Zoom</p>
                      <p className="text-xs text-muted-foreground">{t("liveClasses.integrations.connect")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                      G
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Google Meet</p>
                      <p className="text-xs text-muted-foreground">{t("liveClasses.integrations.connect")}</p>
                    </div>
                  </div>
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
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="all" className="text-xs">
                      {t("liveClasses.tabs.all")}
                    </TabsTrigger>
                    <TabsTrigger value="registered" className="text-xs">
                      {t("liveClasses.tabs.registered")}
                    </TabsTrigger>
                    <TabsTrigger value="live" className="text-xs">
                      {t("liveClasses.tabs.live")}
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
                      {activeTab === "registered" ? t("liveClasses.noRegistered") : t("liveClasses.noClasses")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "registered" 
                        ? t("liveClasses.noRegisteredDescription") 
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
                                  : "bg-accent text-foreground"
                              }`}>
                                {classItem.status === 'live' ? `🔴 ${t("liveClasses.liveNow")}` : classItem.category || t("liveClasses.class")}
                              </span>
                              {isRegistered && (
                                <Badge variant="outline" className="text-xs text-secondary border-secondary/50 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {t("liveClasses.registered")}
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
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {classItem.registration_count || 0}/{classItem.max_participants || "∞"}
                            </span>
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
    </div>
  );
}
