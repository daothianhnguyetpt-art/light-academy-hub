import { motion } from "framer-motion";
import { Users, Video, BookOpen, MonitorPlay, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Social Academic Feed",
    description: "Như Facebook cho học thuật – kết nối cộng đồng học tập toàn cầu. Chia sẻ nghiên cứu, bài giảng và tri thức một cách trang nhã.",
    href: "/social-feed",
    color: "text-primary",
  },
  {
    icon: Video,
    title: "Video Library",
    description: "Như YouTube thuần khiết cho giáo dục – thư viện video bài giảng, khoá học chất lượng cao. Không giật gân – chỉ có tri thức.",
    href: "/video-library",
    color: "text-secondary",
  },
  {
    icon: MonitorPlay,
    title: "Live Classes",
    description: "Tích hợp cho lớp học, hội thảo, đào tạo doanh nghiệp, phỏng vấn, mentoring. Học và hợp tác trong không gian trang nhã.",
    href: "/live-classes",
    color: "text-primary",
  },
  {
    icon: BookOpen,
    title: "Academic Library",
    description: "Thư viện học thuật đầy đủ: sách, hình ảnh, video, tài liệu nghiên cứu 📚📖 – Tri thức tinh hoa của nhân loại.",
    href: "/video-library",
    color: "text-secondary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-gold/30 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">Tính Năng Nổi Bật</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Mạng Xã Hội Học Thuật Thế Hệ Mới
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kết hợp tinh tế giữa <span className="text-foreground font-medium">Facebook</span> – kết nối cộng đồng, 
            <span className="text-foreground font-medium"> YouTube</span> – chia sẻ video bài giảng, 
            và <span className="text-foreground font-medium">Thư viện học thuật</span> – sách, hình ảnh, tài liệu nghiên cứu. 
            Tất cả trong một nền tảng duy nhất, phục vụ trọn vẹn cho học tập, giảng dạy, đào tạo và phát triển năng lực con người.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Link to={feature.href}>
                <div className="academic-card p-8 h-full group cursor-pointer transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="p-3 rounded-xl bg-muted/50 border border-border/50 group-hover:border-gold/40 transition-colors">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Web3 Secured</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">AI Powered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
            <span className="text-sm text-muted-foreground">NFT Certificates</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
