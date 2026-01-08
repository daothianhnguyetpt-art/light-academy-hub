import { motion } from "framer-motion";
import { Sparkles, Heart, Users, Lightbulb, Star } from "lucide-react";

const ecosystemRoles = [
  {
    icon: Heart,
    title: "Trái tim tri thức",
    description: "Khai sáng của FUN Ecosystem",
  },
  {
    icon: Users,
    title: "Nuôi dưỡng con người tỉnh thức",
    description: "Có năng lực – có giá trị",
  },
  {
    icon: Lightbulb,
    title: "Nền móng cho Thế Giới Mới",
    description: "Tri thức là ánh sáng, không phải công cụ kiểm soát",
  },
];

const ecosystemPlatforms = [
  "FUN Profile",
  "FUN Play",
  "FUN Planet",
  "FUN Invest",
  "FUN Life",
];

export function EcosystemRoleSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-gold/30 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">FUN Ecosystem</span>
          </div>
          
          <blockquote className="max-w-4xl mx-auto">
            <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              "Đây không chỉ là một platform giáo dục.
            </p>
            <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-gradient-gold">Đây là Thư Viện Ánh Sáng của Nhân Loại</span>
              <br />
              <span className="text-foreground">trong Kỷ Nguyên 5D."</span>
            </p>
          </blockquote>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {ecosystemRoles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="academic-card p-6 text-center transition-colors"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <role.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {role.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Ecosystem Connection */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="academic-card p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                Kết nối với FUN Ecosystem
              </h3>
              <Star className="w-5 h-5 text-secondary" />
            </div>
            
            {/* Platform Connection Diagram */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {ecosystemPlatforms.map((platform, index) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="px-4 py-2 rounded-full bg-muted/30 border border-border/50 hover:border-gold/40 transition-colors">
                    <span className="text-sm font-medium text-foreground">{platform}</span>
                  </div>
                  {index < ecosystemPlatforms.length - 1 && (
                    <div className="w-8 h-px bg-gold-muted hidden sm:block" />
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Central Hub */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border border-gold/30">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="font-display font-semibold text-foreground">FUN Academy</span>
                <span className="text-muted-foreground">– Trái tim của Ecosystem</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
