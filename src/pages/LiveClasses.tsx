import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useLiveClasses } from "@/hooks/useLiveClasses";
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
  User,
  ChevronRight,
  Circle,
  Loader2,
  Sparkles
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Fallback mock data when no classes in database
const mockUpcomingClasses = [
  {
    id: "1",
    title: "Web3 Development Workshop",
    instructor_name: "Dr. Vitalik B.",
    scheduled_at: new Date().toISOString(),
    duration_minutes: 120,
    max_participants: 200,
    category: "Workshop",
    status: "live",
    description: null,
    instructor_id: null,
    meeting_url: null,
    created_at: null,
  },
  {
    id: "2",
    title: "Machine Learning Office Hours",
    instructor_name: "Prof. Andrew N.",
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 60,
    max_participants: 100,
    category: "Office Hours",
    status: "scheduled",
    description: null,
    instructor_id: null,
    meeting_url: null,
    created_at: null,
  },
  {
    id: "3",
    title: "Research Methodology Seminar",
    instructor_name: "Dr. Sarah J.",
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 90,
    max_participants: 300,
    category: "Seminar",
    status: "scheduled",
    description: null,
    instructor_id: null,
    meeting_url: null,
    created_at: null,
  },
];

const meetingParticipants = [
  { name: "Giảng viên", initials: "GV", isSpeaking: true },
  { name: "Học viên 1", initials: "H1", isSpeaking: false },
  { name: "Học viên 2", initials: "H2", isSpeaking: false },
  { name: "Học viên 3", initials: "H3", isSpeaking: false },
];

const formatScheduledDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) {
    return `Hôm nay, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Ngày mai, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default function LiveClasses() {
  const { isConnected, address, connectWallet } = useWallet();
  const { classes, loading, error } = useLiveClasses();
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Use real data if available, otherwise fallback to mock
  const displayClasses = classes.length > 0 ? classes : mockUpcomingClasses;

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
                  Lớp Học Trực Tuyến
                </h1>
                <p className="text-muted-foreground">
                  Kết nối với giảng viên và học viên trên toàn thế giới
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
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                          GV
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-foreground">Giảng Viên</h3>
                      <p className="text-sm text-muted-foreground">Web3 Development Workshop</p>
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
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-destructive-foreground animate-pulse" />
                      TRỰC TIẾP
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-card/80 backdrop-blur text-sm text-foreground">
                      <Users className="w-4 h-4 inline mr-1" />
                      156 người tham gia
                    </span>
                  </div>
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
                          <p>{isMuted ? "Bật micro" : "Tắt micro"}</p>
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
                          <p>{isVideoOn ? "Tắt camera" : "Bật camera"}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="border-border">
                            <MonitorUp className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chia sẻ màn hình</p>
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
                          <p>{isHandRaised ? "Hạ tay" : "Giơ tay phát biểu"}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="border-border">
                            <MessageSquare className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mở chat</p>
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
                          <p>Ghi hình - Lưu vào thư viện học tập</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button variant="outline" size="icon" className="border-border">
                        <Settings className="w-5 h-5" />
                      </Button>
                      <Button variant="destructive" className="px-4">
                        <Phone className="w-4 h-4 mr-2" />
                        Rời khỏi
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
                <h3 className="font-semibold text-foreground mb-3">Tích hợp sẵn sàng</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      Z
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Zoom</p>
                      <p className="text-xs text-muted-foreground">Kết nối tài khoản của bạn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                      G
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Google Meet</p>
                      <p className="text-xs text-muted-foreground">Kết nối tài khoản của bạn</p>
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
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Lớp Học Sắp Tới
                </h2>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                  </div>
                )}

                {!loading && displayClasses.length === 0 && (
                  <div className="academic-card p-6 text-center">
                    <Sparkles className="w-10 h-10 text-gold mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Chưa có lớp học</h3>
                    <p className="text-sm text-muted-foreground">
                      Các lớp học mới sẽ được cập nhật sớm ✨
                    </p>
                  </div>
                )}

                {!loading && displayClasses.length > 0 && (
                  <div className="space-y-4">
                    {displayClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="academic-card p-4 cursor-pointer hover:border-gold-muted transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            classItem.status === 'live' 
                              ? "bg-destructive/10 text-destructive" 
                              : "bg-accent text-foreground"
                          }`}>
                            {classItem.status === 'live' ? "🔴 Đang diễn ra" : classItem.category || "Lớp học"}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>

                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                          {classItem.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {classItem.instructor_name || "Giảng viên"}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatScheduledDate(classItem.scheduled_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {classItem.max_participants || "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button variant="outline" className="w-full mt-4 border-gold-muted hover:bg-accent">
                  Xem tất cả lịch học
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
