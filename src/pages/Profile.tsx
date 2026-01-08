import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";
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
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const certificates = [
  {
    id: "SBT-2026-0108-7A3F",
    course: "Web3 Development Fundamentals",
    institution: "Ethereum Foundation",
    issuedDate: "Jan 2026",
    score: "95/100",
    status: "verified",
  },
  {
    id: "SBT-2025-1215-8B4E",
    course: "Machine Learning Specialization",
    institution: "Stanford University",
    issuedDate: "Dec 2025",
    score: "92/100",
    status: "verified",
  },
  {
    id: "SBT-2025-0920-2C1D",
    course: "Blockchain for Business",
    institution: "MIT Sloan",
    issuedDate: "Sep 2025",
    score: "88/100",
    status: "verified",
  },
];

const learningStats = [
  { label: "Courses Completed", value: "24", icon: BookOpen },
  { label: "Certificates Earned", value: "12", icon: Award },
  { label: "Learning Hours", value: "342", icon: Calendar },
  { label: "Knowledge Score", value: "89", icon: TrendingUp },
];

const skills = [
  "Blockchain", "Web3", "Smart Contracts", "Machine Learning", 
  "Python", "JavaScript", "Data Science", "Research Methods"
];

export default function Profile() {
  const { isConnected, address, connectWallet } = useWallet();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    }
  };

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
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-3xl font-bold">
                      NL
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-secondary-foreground" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      Nguyễn Ly
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                      <Shield className="w-3 h-3" />
                      Verified Scholar
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Blockchain Researcher | FUN Academy Pioneer
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
                  ) : (
                    <Button onClick={() => connectWallet()} className="btn-primary-gold">
                      Connect Wallet to View Full Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                {learningStats.map((stat) => (
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
                            {cert.course}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {cert.institution}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Issued: {cert.issuedDate}</span>
                            <span>Score: {cert.score}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                        <Button variant="outline" size="sm" className="border-gold-muted hover:bg-accent">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View on Chain
                        </Button>
                      </div>
                    </div>

                    {/* Token ID */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground font-mono">
                        Token ID: #{cert.id}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
