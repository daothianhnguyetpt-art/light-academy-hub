import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Profile() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const { user, signOut } = useAuth();
  const { profile, certificates, stats, loading } = useProfile();
  const navigate = useNavigate();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    } else {
      toast.success("Đã đăng xuất thành công!");
      navigate("/");
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast.success("Đã ngắt kết nối ví!");
    navigate("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.slice(0, 2).toUpperCase() || "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Người dùng";

  const learningStatsDisplay = [
    { label: "Courses Completed", value: stats.coursesCompleted.toString(), icon: BookOpen },
    { label: "Certificates Earned", value: stats.certificatesEarned.toString(), icon: Award },
    { label: "Learning Hours", value: stats.learningHours.toString(), icon: Calendar },
    { label: "Knowledge Score", value: stats.knowledgeScore.toString(), icon: TrendingUp },
  ];

  const skills = profile?.bio?.split(",").map(s => s.trim()).filter(Boolean) || [
    "Blockchain", "Web3", "Smart Contracts", "Machine Learning"
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
            <span className="ml-2 text-muted-foreground">Đang tải hồ sơ...</span>
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
                        Verified Scholar
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {profile?.academic_title || "FUN Academy Pioneer"}
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
                      Connect Wallet to View Full Profile
                    </Button>
                  )}

                  {/* Logout / Disconnect Button */}
                  {(user || isConnected) && (
                    <div className="mt-4">
                      <Button 
                        onClick={user ? handleSignOut : handleDisconnectWallet}
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {user ? "Đăng Xuất" : "Ngắt Kết Nối Ví"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                {learningStatsDisplay.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-5 h-5 text-secondary mr-2" />
                      <span className="font-display text-2xl font-bold text-foreground">
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="academic-card p-6 mb-8"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-secondary" />
                Knowledge Areas
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

            {/* Soulbound Token Certificates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-secondary" />
                Soulbound Token Certificates
              </h2>

              {certificates.length === 0 ? (
                <div className="academic-card p-8 text-center">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Chưa có chứng chỉ nào
                  </h3>
                  <p className="text-muted-foreground">
                    Hoàn thành các khóa học để nhận Soulbound Token Certificate!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
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
                                <span>Issued: {new Date(cert.issued_at).toLocaleDateString('vi-VN')}</span>
                              )}
                              {cert.score && <span>Score: {cert.score}/100</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {cert.verified && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                          {cert.token_id && (
                            <Button variant="outline" size="sm" className="border-gold-muted hover:bg-accent">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View on Chain
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
    </div>
  );
}
