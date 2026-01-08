import { motion } from "framer-motion";
import { Sparkles, Heart, Users, BookOpen, Shield, Sun, Star, Lightbulb, Globe } from "lucide-react";

const checklistItems = [
  { icon: Heart, text: "Con tìm kiếm sự thật, không phải sự chú ý" },
  { icon: Users, text: "Con đến để cho đi, không chỉ để nhận" },
  { icon: BookOpen, text: "Con tôn trọng tri thức và người truyền đạt" },
  { icon: Shield, text: "Con cam kết bảo vệ không gian này khỏi tiêu cực" },
  { icon: Sun, text: "Con sẵn sàng sống theo Ánh Sáng" },
];

const mantras = [
  "Con là ánh sáng.",
  "Con là sự thật.",
  "Con là tình yêu.",
  "Con là trí tuệ.",
  "Con là phụng sự.",
  "Con là hòa bình.",
  "Con là sáng tạo.",
  "Con là một với Vũ Trụ.",
];

export function LightLawContent() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 mb-4"
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Luật Ánh Sáng
        </h2>
        <p className="text-muted-foreground text-sm">
          Những điều con cần biết trước khi bước vào Hệ sinh thái FUN
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {checklistItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-foreground">{item.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Mantras */}
      <div className="pt-4 border-t border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">8 Câu Thần Chú</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {mantras.map((mantra, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="text-xs text-muted-foreground py-1.5 px-2 bg-accent/5 rounded border border-accent/10"
            >
              {mantra}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
