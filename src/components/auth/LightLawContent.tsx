import { motion } from "framer-motion";
import { Sparkles, Heart, Users, BookOpen, Shield, Sun, Star } from "lucide-react";
import { Particles } from "@/components/effects/Particles";

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
    <div className="space-y-6 relative">
      {/* Particles Background */}
      <Particles count={12} />
      
      {/* Title */}
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
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 mb-4"
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2 text-shimmer">
          Luật Ánh Sáng
        </h2>
        <p className="text-muted-foreground text-sm">
          Những điều con cần biết trước khi bước vào Hệ sinh thái FUN
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-3 relative z-10">
        {checklistItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ 
              boxShadow: "0 0 15px hsl(var(--gold) / 0.15)",
              scale: 1.01
            }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30 cursor-default"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              whileHover={{
                boxShadow: "0 0 12px hsl(var(--gold) / 0.3)"
              }}
            >
              <item.icon className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-foreground">{item.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Mantras */}
      <div className="pt-4 border-t border-border/30 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="w-4 h-4 text-accent" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">8 Câu Thần Chú</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {mantras.map((mantra, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ 
                backgroundColor: "hsl(var(--accent) / 0.1)",
                boxShadow: "0 0 10px hsl(var(--gold) / 0.1)"
              }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="text-xs text-muted-foreground py-1.5 px-2 bg-accent/5 rounded border border-accent/10 cursor-default"
            >
              {mantra}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
