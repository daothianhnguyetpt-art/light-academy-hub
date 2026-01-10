import { motion } from "framer-motion";
import { 
  Heart, 
  Users, 
  Sun, 
  Star, 
  Globe, 
  XCircle,
  Zap,
  Shield,
  BookOpen,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { Particles } from "@/components/effects/Particles";
import { Checkbox } from "@/components/ui/checkbox";
import funAcademyLogo from "@/assets/fun-academy-logo.jpg";

const checklistItems = [
  { id: "honest", icon: Heart, text: "Con sống chân thật với chính mình" },
  { id: "responsible", icon: Shield, text: "Con chịu trách nhiệm với năng lượng con phát ra" },
  { id: "growth", icon: BookOpen, text: "Con sẵn sàng học – sửa – nâng cấp" },
  { id: "love", icon: Users, text: "Con chọn yêu thương thay vì phán xét" },
  { id: "light", icon: Sun, text: "Con chọn ánh sáng thay vì cái tôi" },
];

const mantras = [
  "Con là Ánh Sáng Yêu Thương Thuần Khiết Của Cha Vũ Trụ.",
  "Con là Ý Chí Của Cha Vũ Trụ.",
  "Con là Trí Tuệ Của Cha Vũ Trụ.",
  "Con là Hạnh Phúc.",
  "Con là Tình Yêu.",
  "Con là Tiền Của Cha.",
  "Con xin Sám Hối Sám Hối Sám Hối.",
  "Con xin Biết Ơn Biết Ơn Biết Ơn Trong Ánh Sáng Yêu Thương Thuần Khiết Của Cha Vũ Trụ.",
];

const youAreItems = [
  "Tỉnh thức – hoặc đang trên con đường tỉnh thức",
  "Chân thật với chính mình",
  "Chân thành với người khác",
  "Sống tích cực, tử tế, có trách nhiệm với năng lượng mình phát ra",
  "Biết yêu thương – biết biết ơn – biết sám hối",
  "Tin vào điều thiện, tin vào ánh sáng, tin vào Trật Tự Cao Hơn của Vũ Trụ",
];

const corePrinciples = [
  "Ánh sáng thu hút ánh sáng",
  "Tần số thấp không thể tồn tại lâu trong tần số cao",
  "Ý chí vị kỷ không thể đồng hành cùng Ý Chí Vũ Trụ",
];

const notBelongItems = [
  "Người chỉ tìm lợi ích mà không muốn trưởng thành",
  "Người dùng trí khôn nhưng thiếu lương tâm",
  "Người nói về ánh sáng nhưng sống bằng bóng tối",
  "Người lấy danh nghĩa tâm linh để nuôi cái tôi",
  "Người không chịu nhìn lại chính mình",
];

const benefitItems = [
  "Có Ánh Sáng nội tâm",
  "Hoặc thật sự khao khát trở về với Ánh Sáng",
  "Sẵn sàng buông cái tôi – học lại – nâng cấp tần số",
  "Dám sống đúng – thật – tử tế – yêu thương",
];

const ecosystemItems = [
  "Mạng xã hội của linh hồn tỉnh thức",
  "Không gian an toàn cho ánh sáng",
  "Nền tảng kết nối những con người có giá trị thật",
  "Hạ tầng cho Thời Đại Hoàng Kim của Trái Đất",
];

interface LightLawContentProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string, checked: boolean) => void;
}

export function LightLawContent({ checkedItems, onCheckChange }: LightLawContentProps) {
  return (
    <div className="space-y-6 relative pr-4">
        {/* Particles Background */}
        <Particles count={12} />
        
        {/* Main Title with Logo */}
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              boxShadow: [
                "0 0 20px hsl(var(--gold) / 0.3)",
                "0 0 40px hsl(var(--gold) / 0.5)",
                "0 0 20px hsl(var(--gold) / 0.3)"
              ]
            }}
            transition={{ 
              scale: { duration: 0.5 },
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="inline-block mb-4"
          >
            <img 
              src={funAcademyLogo} 
              alt="FUN Academy" 
              className="w-20 h-20 rounded-full object-cover mx-auto shadow-lg border-2 border-gold/30"
            />
          </motion.div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-2 text-shimmer">
            USERS CỦA FUN ECOSYSTEM
          </h2>
          <p className="text-gold text-base md:text-lg font-semibold">
            MẠNG XÃ HỘI THỜI ĐẠI HOÀNG KIM – NỀN KINH TẾ ÁNH SÁNG 5D
          </p>
        </div>

        {/* Introduction */}
        <div className="relative z-10 p-4 md:p-5 rounded-xl bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20">
          <p className="text-base md:text-lg text-foreground leading-relaxed text-center">
            <span className="font-semibold text-gold">FUN Ecosystem</span> không dành cho tất cả mọi người.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center mt-2">
            FUN Ecosystem chỉ dành cho những <span className="font-semibold text-gold">linh hồn có ánh sáng</span>, 
            hoặc đang hướng về ánh sáng.
          </p>
        </div>

        {/* Section: Bạn là ai? */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-bold text-navy">✨ Bạn là ai?</span>
          </div>
          <div className="space-y-3 pl-2">
            {youAreItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="text-gold mt-0.5 text-lg">•</span>
                <span className="text-sm md:text-base text-foreground/90">{item}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <p className="text-sm md:text-base text-foreground/80 italic text-center">
              Bạn có thể chưa hoàn hảo, nhưng bạn có <span className="text-gold font-semibold">trái tim hướng thiện</span>.
              <br />Bạn muốn sống thật – sống đúng – sống sáng.
            </p>
          </div>
        </div>

        {/* Section: Nguyên tắc cốt lõi */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Sun className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg md:text-xl font-bold text-navy">🔆 Nguyên tắc cốt lõi</span>
          </div>
          <div className="p-4 md:p-5 rounded-xl bg-accent/5 border border-accent/20">
            <p className="text-sm md:text-base text-foreground mb-3">
              FUN Ecosystem vận hành theo <span className="text-gold font-bold">Luật Ánh Sáng</span>, không theo số đông.
            </p>
            <div className="space-y-2.5">
              {corePrinciples.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Zap className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-sm md:text-base text-foreground/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Ai KHÔNG thuộc về */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-lg md:text-xl font-bold text-navy">🚪 Ai KHÔNG thuộc về FUN Ecosystem?</span>
          </div>
          <div className="space-y-2.5 pl-2">
            {notBelongItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="text-destructive mt-0.5 text-lg">•</span>
                <span className="text-sm md:text-base text-foreground/90">{item}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm md:text-base text-foreground/70 italic mt-3 text-center">
            👉 Cửa FUN Ecosystem không khóa, nhưng Ánh Sáng tự sàng lọc.
          </p>
        </div>

        {/* Section: Ai ĐƯỢC hưởng lợi */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-lg md:text-xl font-bold text-navy">🌈 Ai ĐƯỢC hưởng lợi từ FUN Ecosystem?</span>
          </div>
          <div className="p-4 md:p-5 rounded-xl bg-secondary/5 border border-secondary/20">
            <p className="text-sm md:text-base text-foreground mb-3">Chỉ những ai:</p>
            <div className="space-y-2.5">
              {benefitItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Star className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-sm md:text-base text-foreground/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: FUN Ecosystem là gì? */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-bold text-navy">🌍 FUN Ecosystem là gì?</span>
          </div>
          <div className="p-4 md:p-5 rounded-xl bg-primary/5 border border-primary/20">
            <div className="space-y-2.5 mb-4">
              {ecosystemItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base text-foreground/90">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="text-center pt-3 border-t border-border/30">
              <p className="text-sm md:text-base text-foreground/80">
                Không drama. Không thao túng. Không cạnh tranh bẩn.
              </p>
              <p className="text-base md:text-lg text-gold font-semibold mt-2">
                Chỉ có Hợp tác trong Yêu Thương Thuần Khiết.
              </p>
            </div>
          </div>
        </div>

        {/* Quote from Father Universe */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 p-5 md:p-6 rounded-xl bg-gradient-to-br from-accent/15 to-secondary/15 border border-accent/30"
        >
          <div className="text-center">
            <p className="text-base md:text-lg text-foreground italic leading-relaxed">
              "Chỉ những ai mang ánh sáng
              <br />hoặc thật lòng hướng về ánh sáng
              <br />mới có thể bước đi lâu dài trong Thời Đại Hoàng Kim."
            </p>
            <p className="text-sm md:text-base text-gold font-bold mt-4">— CHA VŨ TRỤ —</p>
          </div>
        </motion.div>

        {/* 8 Mantras */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-6 h-6 text-gold" />
            </motion.div>
            <span className="text-lg md:text-xl font-bold text-navy">🌟 8 Câu Thần Chú Từ Cha Vũ Trụ</span>
          </div>
          <div className="space-y-2.5">
            {mantras.map((mantra, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ 
                  backgroundColor: "hsl(var(--accent) / 0.15)",
                  scale: 1.01
                }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-start gap-3 text-sm md:text-base text-foreground/90 py-3 px-4 bg-accent/5 rounded-xl border border-accent/10"
              >
                <span className="text-gold font-bold flex-shrink-0 w-5 text-base">{index + 1}</span>
                <span className="leading-relaxed">{mantra}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Checklist with actual checkboxes */}
        <div className="space-y-3 relative z-10 pt-5 border-t border-border/30">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-gold" />
            <span className="text-lg md:text-xl font-bold text-navy">🕊️ Checklist cho Users FUN Ecosystem</span>
          </div>
          <p className="text-sm md:text-base text-foreground/80 mb-4">
            Click vào 5 checklist bên dưới để xác nhận cam kết của bạn:
          </p>
          {checklistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ 
                boxShadow: checkedItems[item.id] 
                  ? "0 0 15px hsl(var(--gold) / 0.25)" 
                  : "0 0 10px hsl(var(--gold) / 0.1)",
                scale: 1.01
              }}
              transition={{ delay: index * 0.08 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                checkedItems[item.id] 
                  ? "bg-secondary/10 border-secondary/30" 
                  : "bg-secondary/5 border-border/30"
              }`}
              onClick={() => onCheckChange(item.id, !checkedItems[item.id])}
            >
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) => onCheckChange(item.id, checked === true)}
                className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary w-5 h-5"
              />
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  checkedItems[item.id] 
                    ? "bg-secondary/20" 
                    : "bg-primary/10"
                }`}
                animate={checkedItems[item.id] ? {
                  boxShadow: "0 0 10px hsl(var(--gold) / 0.3)"
                } : {}}
              >
                <item.icon className={`w-5 h-5 ${
                  checkedItems[item.id] ? "text-secondary" : "text-primary"
                }`} />
              </motion.div>
              <label 
                htmlFor={item.id}
                className={`text-base md:text-lg cursor-pointer select-none ${
                  checkedItems[item.id] ? "text-foreground font-semibold" : "text-foreground/80"
                }`}
              >
                {item.text}
              </label>
            </motion.div>
        ))}
      </div>
    </div>
  );
}
