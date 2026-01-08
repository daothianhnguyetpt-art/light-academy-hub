import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Globe, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        
        {/* Gold accent lines */}
        <div className="absolute top-1/3 left-0 right-0 gold-line opacity-30" />
        <div className="absolute bottom-1/3 left-0 right-0 gold-line opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-gold-muted mb-8"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">
              Web3 Academic Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
          >
            Nền Tảng Tri Thức
            <br />
            <span className="text-gradient-gold">Ánh Sáng Toàn Cầu</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Mạng xã hội học thuật thế hệ mới, kết nối tri thức toàn cầu với Web3 & AI. 
            Chứng nhận học tập bằng NFT Soulbound Token – vĩnh viễn, minh bạch, không thể làm giả.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/social-feed">
              <Button className="btn-primary-gold text-base px-8 py-6 h-auto">
                Khám Phá Ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/video-library">
              <Button variant="outline" className="text-base px-8 py-6 h-auto border-border hover:border-gold-muted hover:bg-accent/30">
                Xem Video Library
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-secondary mr-2" />
                <span className="font-display text-3xl font-bold text-foreground">150+</span>
              </div>
              <span className="text-sm text-muted-foreground">Quốc Gia</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-secondary mr-2" />
                <span className="font-display text-3xl font-bold text-foreground">10K+</span>
              </div>
              <span className="text-sm text-muted-foreground">Khoá Học</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-secondary mr-2" />
                <span className="font-display text-3xl font-bold text-foreground">50K+</span>
              </div>
              <span className="text-sm text-muted-foreground">NFT Chứng Chỉ</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
