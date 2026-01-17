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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-gold/30 mb-8"
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
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight"
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
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Nền tảng Web3 kết nối & chia sẻ tri thức toàn cầu, nơi hội tụ những giá trị học thuật 
            tinh hoa của nhân loại. Chứng nhận học tập bằng NFT Soulbound Token – vĩnh viễn, 
            minh bạch, không thể làm giả.
          </motion.p>

          {/* Stakeholder Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-8 sm:mb-10"
          >
            <span className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 border border-border/50">🌍 Trường học</span>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 border border-border/50">🏢 Tổ chức</span>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 border border-border/50 hidden xs:inline-flex">💼 Doanh nghiệp</span>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 border border-border/50">👨‍🏫 Chuyên gia</span>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 border border-border/50">🎓 Người học</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/social-feed">
              <Button variant="gold" className="text-base px-8 py-6 h-auto">
                Khám Phá Ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/video-library">
              <Button variant="outline" className="text-base px-8 py-6 h-auto border-border/60 hover:border-gold/50 hover:bg-muted/30">
                Xem Video Library
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-16 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-1 sm:mb-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-secondary sm:mr-2 mb-1 sm:mb-0" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">150+</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Quốc Gia</span>
            </div>
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-1 sm:mb-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-secondary sm:mr-2 mb-1 sm:mb-0" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">10K+</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Khoá Học</span>
            </div>
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-1 sm:mb-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary sm:mr-2 mb-1 sm:mb-0" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">50K+</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">NFT Chứng Chỉ</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
