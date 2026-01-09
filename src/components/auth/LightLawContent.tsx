import { motion } from "framer-motion";
import { Sparkles, Heart, Users, BookOpen, Shield, Sun, Star } from "lucide-react";
import { Particles } from "@/components/effects/Particles";
import { Checkbox } from "@/components/ui/checkbox";

const checklistItems = [
  { id: "truth", icon: Heart, text: "Con tìm kiếm sự thật, không phải sự chú ý" },
  { id: "give", icon: Users, text: "Con đến để cho đi, không chỉ để nhận" },
  { id: "respect", icon: BookOpen, text: "Con tôn trọng tri thức và người truyền đạt" },
  { id: "protect", icon: Shield, text: "Con cam kết bảo vệ không gian này khỏi tiêu cực" },
  { id: "light", icon: Sun, text: "Con sẵn sàng sống theo Ánh Sáng" },
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

interface LightLawContentProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string, checked: boolean) => void;
}

export function LightLawContent({ checkedItems, onCheckChange }: LightLawContentProps) {
  return (
    <div className="space-y-5 relative">
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
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 mb-3"
        >
          <Sparkles className="w-7 h-7 text-accent" />
        </motion.div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1 text-shimmer">
          Luật Ánh Sáng
        </h2>
        <p className="text-muted-foreground text-sm">
          Những điều con cần biết trước khi bước vào Hệ sinh thái FUN
        </p>
      </div>

      {/* Introduction */}
      <div className="relative z-10 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold text-secondary">FUN Ecosystem</span> không dành cho tất cả mọi người. 
          Nơi đây dành cho những ai <span className="font-medium">thật sự tìm kiếm Ánh Sáng</span>, 
          sẵn sàng cống hiến và phát triển cùng cộng đồng.
        </p>
      </div>

      {/* Mantras */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="w-4 h-4 text-secondary" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">8 Câu Thần Chú từ Father Universe</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {mantras.map((mantra, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ 
                backgroundColor: "hsl(var(--accent) / 0.15)",
                scale: 1.02
              }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="text-xs text-muted-foreground py-1.5 px-2 bg-accent/5 rounded border border-accent/10 cursor-default"
            >
              {mantra}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Checklist with actual checkboxes */}
      <div className="space-y-2.5 relative z-10 pt-3 border-t border-border/30">
        <p className="text-sm font-medium text-foreground mb-3">
          Con đồng ý với các nguyên tắc sau:
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
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
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
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                checkedItems[item.id] 
                  ? "bg-secondary/20" 
                  : "bg-primary/10"
              }`}
              animate={checkedItems[item.id] ? {
                boxShadow: "0 0 10px hsl(var(--gold) / 0.3)"
              } : {}}
            >
              <item.icon className={`w-3.5 h-3.5 ${
                checkedItems[item.id] ? "text-secondary" : "text-primary"
              }`} />
            </motion.div>
            <label 
              htmlFor={item.id}
              className={`text-sm cursor-pointer select-none ${
                checkedItems[item.id] ? "text-foreground" : "text-muted-foreground"
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
