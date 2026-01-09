import { motion } from "framer-motion";
import { 
  Sparkles, 
  Heart, 
  Users, 
  Sun, 
  Star, 
  Globe, 
  XCircle,
  Zap,
  Shield,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { Particles } from "@/components/effects/Particles";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="space-y-5 relative pr-4">
        {/* Particles Background */}
        <Particles count={12} />
        
        {/* Main Title */}
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              boxShadow: [
                "0 0 20px hsl(var(--gold) / 0.2)",
                "0 0 40px hsl(var(--gold) / 0.4)",
                "0 0 20px hsl(var(--gold) / 0.2)"
              ]
            }}
            transition={{ 
              scale: { duration: 0.5 },
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 mb-3"
          >
            <Sparkles className="w-8 h-8 text-accent" />
          </motion.div>
          <h2 className="font-display text-xl font-bold text-foreground mb-1 text-shimmer">
            USERS CỦA FUN ECOSYSTEM
          </h2>
          <p className="text-secondary text-sm font-medium">
            MẠNG XÃ HỘI THỜI ĐẠI HOÀNG KIM – NỀN KINH TẾ ÁNH SÁNG 5D
          </p>
        </div>

        {/* Introduction */}
        <div className="relative z-10 p-4 rounded-lg bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20">
          <p className="text-sm text-foreground leading-relaxed text-center">
            <span className="font-semibold text-accent">FUN Ecosystem</span> không dành cho tất cả mọi người.
          </p>
          <p className="text-sm text-foreground leading-relaxed text-center mt-2">
            FUN Ecosystem chỉ dành cho những <span className="font-medium text-secondary">linh hồn có ánh sáng</span>, 
            hoặc đang hướng về ánh sáng.
          </p>
        </div>

        {/* Section: Bạn là ai? */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">✨ Bạn là ai?</span>
          </div>
          <div className="space-y-2 pl-2">
            {youAreItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2"
              >
                <span className="text-secondary mt-0.5">•</span>
                <span className="text-xs text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
            <p className="text-xs text-muted-foreground italic text-center">
              Bạn có thể chưa hoàn hảo, nhưng bạn có <span className="text-secondary font-medium">trái tim hướng thiện</span>.
              <br />Bạn muốn sống thật – sống đúng – sống sáng.
            </p>
          </div>
        </div>

        {/* Section: Nguyên tắc cốt lõi */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Sun className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground">🔆 Nguyên tắc cốt lõi</span>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-xs text-foreground mb-2">
              FUN Ecosystem vận hành theo <span className="text-accent font-semibold">Luật Ánh Sáng</span>, không theo số đông.
            </p>
            <div className="space-y-1.5">
              {corePrinciples.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-3 h-3 text-accent flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Ai KHÔNG thuộc về */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-destructive" />
            </div>
            <span className="text-sm font-semibold text-foreground">🚪 Ai KHÔNG thuộc về FUN Ecosystem?</span>
          </div>
          <div className="space-y-1.5 pl-2">
            {notBelongItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2"
              >
                <span className="text-destructive/60 mt-0.5">•</span>
                <span className="text-xs text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 italic mt-2 text-center">
            👉 Cửa FUN Ecosystem không khóa, nhưng Ánh Sáng tự sàng lọc.
          </p>
        </div>

        {/* Section: Ai ĐƯỢC hưởng lợi */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-sm font-semibold text-foreground">🌈 Ai ĐƯỢC hưởng lợi từ FUN Ecosystem?</span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
            <p className="text-xs text-foreground mb-2">Chỉ những ai:</p>
            <div className="space-y-1.5">
              {benefitItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <Star className="w-3 h-3 text-secondary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: FUN Ecosystem là gì? */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">🌍 FUN Ecosystem là gì?</span>
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="space-y-1.5 mb-3">
              {ecosystemItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="text-center pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground/80">
                Không drama. Không thao túng. Không cạnh tranh bẩn.
              </p>
              <p className="text-xs text-secondary font-medium mt-1">
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
          className="relative z-10 p-4 rounded-lg bg-gradient-to-br from-accent/15 to-secondary/15 border border-accent/30"
        >
          <div className="text-center">
            <p className="text-sm text-foreground italic leading-relaxed">
              "Chỉ những ai mang ánh sáng
              <br />hoặc thật lòng hướng về ánh sáng
              <br />mới có thể bước đi lâu dài trong Thời Đại Hoàng Kim."
            </p>
            <p className="text-xs text-accent font-semibold mt-3">— CHA VŨ TRỤ —</p>
          </div>
        </motion.div>

        {/* 8 Mantras */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-5 h-5 text-secondary" />
            </motion.div>
            <span className="text-sm font-semibold text-foreground">🌟 8 Câu Thần Chú Từ Cha Vũ Trụ</span>
          </div>
          <div className="space-y-1.5">
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
                className="flex items-start gap-2 text-xs text-muted-foreground py-2 px-3 bg-accent/5 rounded-lg border border-accent/10"
              >
                <span className="text-accent font-bold flex-shrink-0 w-4">{index + 1}</span>
                <span className="leading-relaxed">{mantra}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Checklist with actual checkboxes */}
        <div className="space-y-2.5 relative z-10 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-foreground">🕊️ Checklist cho Users FUN Ecosystem</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
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
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
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
                className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
              />
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  checkedItems[item.id] 
                    ? "bg-secondary/20" 
                    : "bg-primary/10"
                }`}
                animate={checkedItems[item.id] ? {
                  boxShadow: "0 0 10px hsl(var(--gold) / 0.3)"
                } : {}}
              >
                <item.icon className={`w-4 h-4 ${
                  checkedItems[item.id] ? "text-secondary" : "text-primary"
                }`} />
              </motion.div>
              <label 
                htmlFor={item.id}
                className={`text-sm cursor-pointer select-none ${
                  checkedItems[item.id] ? "text-foreground font-medium" : "text-muted-foreground"
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
