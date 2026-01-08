import { motion } from "framer-motion";
import { Globe, University, MapPin, Users } from "lucide-react";

const democracyPoints = [
  {
    icon: University,
    title: "Đại học danh tiếng",
    description: "Hiện diện để tiếp cận sinh viên toàn cầu không giới hạn địa lý",
  },
  {
    icon: MapPin,
    title: "Vùng sâu vùng xa",
    description: "Có cơ hội tiếp cận tri thức thế giới như bất kỳ ai",
  },
  {
    icon: Users,
    title: "Người học mọi nơi",
    description: "Đều có quyền tiếp cận tri thức tinh hoa của nhân loại",
  },
];

export function DemocratizationSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/10 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-gold-muted mb-6">
            <Globe className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">Tri Thức Không Biên Giới</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Dân Chủ Hoá Tri Thức <br />
            <span className="text-gradient-gold">Toàn Cầu</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Vượt qua mọi biên giới địa lý, thể chế và hệ thống giáo dục truyền thống. 
            Tri thức là quyền của mọi người.
          </p>
        </motion.div>

        {/* Democracy Points Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {democracyPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/50 border border-gold-muted flex items-center justify-center">
                <point.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-muted-foreground">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Highlighted Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="academic-card p-8 text-center border-gold-muted">
            <p className="font-display text-lg sm:text-xl font-medium text-foreground leading-relaxed">
              FUN ACADEMY <span className="text-gradient-gold">không phân biệt</span>:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-foreground text-sm font-medium">
                Quốc gia
              </span>
              <span className="text-muted-foreground">–</span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-foreground text-sm font-medium">
                Giai cấp
              </span>
              <span className="text-muted-foreground">–</span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-foreground text-sm font-medium">
                Điều kiện kinh tế
              </span>
              <span className="text-muted-foreground">–</span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-foreground text-sm font-medium">
                Hệ thống giáo dục
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
