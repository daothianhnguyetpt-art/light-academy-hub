import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useTranslation } from "@/i18n/useTranslation";
import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale } from "@/lib/date-utils";
import { format } from "date-fns";
import { 
  Award,
  BookOpen,
  GraduationCap,
  Star,
  CheckCircle,
  ExternalLink,
  Copy,
  Shield,
  Calendar,
  TrendingUp,
  LogOut,
  Loader2,
  Sparkles,
  Info,
  Clock,
  Heart,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Profile() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const { user, signOut } = useAuth();
  const { profile, certificates, stats, loading, updateProfile } = useProfile();
  const navigate = useNavigate();

  const dateLocale = getDateLocale(language);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success(t("profile.addressCopied"));
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(t("common.error"));
    } else {
      toast.success(t("profile.logoutSuccess"));
      navigate("/");
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast.success(t("profile.walletDisconnected"));
    navigate("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.slice(0, 2).toUpperCase() || "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || t("profile.defaultUser");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), 'd MMM yyyy', { locale: dateLocale });
  };

  const learningStatsDisplay = [
    { 
      label: t("profile.stats.coursesCompleted"), 
      value: stats.coursesCompleted, 
      icon: BookOpen,
      emptyMessage: t("profile.stats.readyToStart")
    },
    { 
      label: t("profile.stats.certificatesEarned"), 
      value: stats.certificatesEarned, 
      icon: Award,
      emptyMessage: t("profile.stats.waitingForYou")
    },
    { 
      label: t("profile.stats.hoursLearned"), 
      value: stats.learningHours, 
      icon: Clock,
      emptyMessage: t("profile.stats.journeyBegins")
    },
    { 
      label: t("profile.stats.knowledgeScore"), 
      value: stats.knowledgeScore, 
      icon: TrendingUp,
      emptyMessage: t("profile.stats.accumulating")
    },
  ];

  const skills = profile?.bio?.split(",").map(s => s.trim()).filter(Boolean) || [
    "Blockchain", "Web3", "Smart Contracts", "Machine Learning"
  ];

  // Soul Journey milestones
  const soulJourney = [
    { 
      title: t("profile.soulJourney.joinedAcademy"), 
      date: formatDate(profile?.created_at ?? null),
      completed: !!profile?.created_at,
      icon: Heart
    },
    { 
      title: t("profile.soulJourney.acceptedLightLaw"), 
      date: formatDate(profile?.light_law_accepted_at ?? null),
      completed: !!profile?.light_law_accepted_at,
      icon: Sparkles
    },
    { 
      title: t("profile.soulJourney.firstCourse"), 
      date: null,
      completed: stats.coursesCompleted > 0,
      icon: BookOpen
    },
    { 
      title: t("profile.soulJourney.firstCertificate"), 
      date: formatDate(certificates[0]?.issued_at ?? null),
      completed: certificates.length > 0,
      icon: Award
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnectWallet={connectWallet}
          isWalletConnected={isConnected}
          walletAddress={address ?? undefined}
        />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t("common.loading")}</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnectWallet={connectWallet}
        isWalletConnected={isConnected}
        walletAddress={address ?? undefined}
      />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="academic-card p-8 mb-8"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-28 h-28 border-4 border-gold-muted">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-3xl font-bold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  {profile?.verification_level === 'verified' && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      {displayName}
                    </h1>
                    {profile?.verification_level === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        {t("profile.verifiedScholar")}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {profile?.academic_title || t("profile.defaultTitle")}
                  </p>

                  {/* Wallet Address */}
                  {isConnected && address ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/50 border border-border">
                      <span className="text-sm font-mono text-foreground">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </span>
                      <button
                        onClick={copyAddress}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://etherscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : profile?.wallet_address ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/50 border border-border">
                      <span className="text-sm font-mono text-foreground">
                        {profile.wallet_address.slice(0, 6)}...{profile.wallet_address.slice(-4)}
                      </span>
                    </div>
                  ) : (
                    <Button onClick={() => connectWallet()} className="btn-primary-gold">
                      {t("profile.connectWalletFull")}
                    </Button>
                  )}

                  {/* Edit Profile Button */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Button
                      onClick={() => setIsEditModalOpen(true)}
                      variant="outline"
                      className="border-gold-muted hover:bg-accent"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      {t("profile.editProfile")}
                    </Button>

                    {/* Logout / Disconnect Button */}
                    {(user || isConnected) && (
                      <Button 
                        onClick={user ? handleSignOut : handleDisconnectWallet}
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {user ? t("common.logout") : t("common.disconnect")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                {learningStatsDisplay.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-5 h-5 text-secondary mr-2" />
                      <span className="font-display text-2xl font-bold text-foreground">
                        {stat.value > 0 ? stat.value : "—"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground block">
                      {stat.label}
                    </span>
                    {stat.value === 0 && (
                      <span className="text-xs text-gold mt-1 block">
                        {stat.emptyMessage}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Soul Journey Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="academic-card p-6 mb-8"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                {t("profile.soulJourney.title")}
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-4">
                  {soulJourney.map((milestone, index) => (
                    <div key={milestone.title} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        milestone.completed 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <milestone.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {milestone.title}
                        </p>
                        {milestone.date && (
                          <p className="text-xs text-muted-foreground">{milestone.date}</p>
                        )}
                        {!milestone.completed && (
                          <p className="text-xs text-gold">{t("profile.soulJourney.waiting")}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="academic-card p-6 mb-8"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-secondary" />
                {t("profile.skills")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-accent text-sm text-foreground border border-border hover:border-gold-muted transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Soulbound Token Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="academic-card p-6 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gold" />
                {t("profile.sbt.title")}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-background/50 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t("profile.sbt.permanent")}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.sbt.permanentDesc")}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50 border border-border">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t("profile.sbt.nonTransferable")}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.sbt.nonTransferableDesc")}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50 border border-border">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2">
                    <ExternalLink className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t("profile.sbt.transparent")}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.sbt.transparentDesc")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Soulbound Token Certificates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-secondary" />
                {t("profile.certificates")}
              </h2>

              {certificates.length === 0 ? (
                <div className="academic-card p-8 text-center">
                  <Award className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("profile.noCertificates")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("profile.noCertificatesDesc")}
                  </p>
                  <Button onClick={() => navigate('/video-library')} variant="outline" className="border-gold-muted hover:bg-accent">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {t("profile.exploreCourses")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="academic-card p-6 sbt-glow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                            <Award className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {cert.course_name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {cert.institution || "FUN Academy"}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {cert.issued_at && (
                                <span>{t("profile.issuedAt")}: {formatDate(cert.issued_at)}</span>
                              )}
                              {cert.score && <span>{t("profile.score")}: {cert.score}/100</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {cert.verified && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium cursor-help">
                                  <CheckCircle className="w-3 h-3" />
                                  {t("profile.verified")}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("profile.verifiedTooltip")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {cert.token_id && (
                            <Button variant="outline" size="sm" className="border-gold-muted hover:bg-accent">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              {t("profile.viewOnChain")}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Token ID */}
                      {cert.token_id && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground font-mono">
                            Token ID: #{cert.token_id}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profile={profile}
        onUpdate={updateProfile}
        onConnectWallet={connectWallet}
        currentWalletAddress={address ?? undefined}
      />
    </div>
  );
}
