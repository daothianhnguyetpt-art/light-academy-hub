import { motion } from "framer-motion";
import { Shield, Award, Lock, Infinity, CheckCircle } from "lucide-react";

const sbtFeatures = [
  {
    icon: Lock,
    title: "Không thể chỉnh sửa",
    description: "Dữ liệu học tập được ghi nhận vĩnh viễn trên blockchain",
  },
  {
    icon: Shield,
    title: "Không thể chuyển nhượng",
    description: "Token gắn liền với linh hồn, không thể bán hoặc trao đổi",
  },
  {
    icon: Shield,
    title: "Không thể làm giả",
    description: "Chứng chỉ được xác thực bởi smart contract",
  },
  {
    icon: Infinity,
    title: "Lưu giữ vĩnh viễn",
    description: "Giá trị học thuật của mỗi linh hồn được bảo toàn mãi mãi",
  },
];

export function Web3Section() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/20 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-gold/30 mb-6">
              <Award className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Soulbound Token (SBT)</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              NFT Học Thuật & <br />
              <span className="text-gradient-gold">Academic Passport</span>
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Mọi kết quả học tập, quá trình thực hành, bằng cấp và chứng chỉ đều được 
              ghi nhận bằng Soulbound Token (SBT) – loại NFT không thể chuyển nhượng, 
              đại diện cho giá trị học thuật thực sự của mỗi cá nhân.
            </p>

            <div className="space-y-4">
              {sbtFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - SBT Certificate Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-3xl animate-pulse-gold" />
              
              {/* Certificate Card */}
              <div className="relative academic-card p-8 w-full max-w-md sbt-glow">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Soulbound Token
                  </h3>
                  <p className="text-sm text-muted-foreground">Academic Certificate</p>
                </div>

                {/* Divider */}
                <div className="gold-line my-6" />

                {/* Certificate Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Holder</span>
                    <span className="text-sm font-medium text-foreground">0x7a3...f2e9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Course</span>
                    <span className="text-sm font-medium text-foreground">Web3 Fundamentals</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Issued</span>
                    <span className="text-sm font-medium text-foreground">Jan 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <span className="text-sm font-medium text-secondary">95/100</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="gold-line my-6" />

                {/* Verification Badge */}
                <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-muted/50 border border-gold/30">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium text-foreground">Verified on Blockchain</span>
                </div>

                {/* Token ID */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Token ID: #SBT-2026-0108-7A3F
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
