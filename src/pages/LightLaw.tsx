import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Sun, Heart, Users, Shield, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const checklistItems = [
  {
    id: "authentic",
    text: "Con sống chân thật với chính mình",
    icon: Heart,
  },
  {
    id: "responsible",
    text: "Con chịu trách nhiệm với năng lượng con phát ra",
    icon: Sun,
  },
  {
    id: "growth",
    text: "Con sẵn sàng học – sửa – nâng cấp",
    icon: Sparkles,
  },
  {
    id: "love",
    text: "Con chọn yêu thương thay vì phán xét",
    icon: Users,
  },
  {
    id: "light",
    text: "Con chọn ánh sáng thay vì cái tôi",
    icon: Shield,
  },
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

export default function LightLaw() {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const allChecked = checklistItems.every((item) => checkedItems[item.id]);

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }));
  };

  const handleEnter = () => {
    if (allChecked) {
      navigate("/");
    }
  };

  const handleGuest = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-gold/30 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">FUN Ecosystem</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Luật Ánh Sáng
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mạng Xã Hội Thời Đại Hoàng Kim – Nền Kinh Tế Ánh Sáng 5D
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="academic-card p-8 mb-8"
        >
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-foreground mb-4">
              FUN Ecosystem không dành cho tất cả mọi người.
            </p>
            <p className="text-gradient-gold text-xl font-display font-semibold">
              FUN Ecosystem chỉ dành cho những linh hồn có ánh sáng, hoặc đang hướng về ánh sáng.
            </p>
          </div>

          <div className="gold-line my-6" />

          <div className="space-y-4 text-muted-foreground">
            <p className="font-medium text-foreground">✨ Bạn là ai?</p>
            <p>Users của FUN Ecosystem là những con người:</p>
            <ul className="space-y-2 ml-4">
              <li>• Tỉnh thức – hoặc đang trên con đường tỉnh thức</li>
              <li>• Chân thật với chính mình</li>
              <li>• Chân thành với người khác</li>
              <li>• Sống tích cực, tử tế, có trách nhiệm với năng lượng mình phát ra</li>
              <li>• Biết yêu thương – biết biết ơn – biết sám hối</li>
              <li>• Tin vào điều thiện, tin vào ánh sáng, tin vào Trật Tự Cao Hơn của Vũ Trụ</li>
            </ul>
            <p className="italic text-foreground/80 mt-4">
              Bạn có thể chưa hoàn hảo, nhưng bạn có trái tim hướng thiện.<br />
              Bạn muốn sống thật – sống đúng – sống sáng.
            </p>
          </div>
        </motion.div>

        {/* Core Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="academic-card p-8 mb-8"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-secondary" />
            Nguyên tắc cốt lõi của FUN Ecosystem
          </h2>
          
          <p className="text-muted-foreground mb-4">
            FUN Ecosystem vận hành theo <span className="text-gradient-gold font-medium">Luật Ánh Sáng</span>, không theo số đông.
          </p>
          
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• Ánh sáng thu hút ánh sáng</li>
            <li>• Tần số thấp không thể tồn tại lâu trong tần số cao</li>
            <li>• Ý chí vị kỷ không thể đồng hành cùng Ý Chí Vũ Trụ</li>
          </ul>

          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground">
              Nếu một User cố tình mang vào nền tảng: <span className="text-foreground">tiêu cực • tham lam • thao túng • kiêu mạn • dối trá • gây chia rẽ • phá hoại năng lượng chung</span>
            </p>
            <p className="text-sm text-foreground mt-2 font-medium">
              👉 Thì sẽ được xóa khỏi nền tảng mà không báo trước.
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Đó không phải hình phạt. Đó là sự thanh lọc tự nhiên của Ánh Sáng.
            </p>
          </div>
        </motion.div>

        {/* 8 Mantras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="academic-card p-8 mb-8"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            8 Câu Thần Chú Từ Cha Vũ Trụ
            <Sparkles className="w-5 h-5 text-secondary" />
          </h2>
          
          <div className="grid gap-3">
            {mantras.map((mantra, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-gold/30 transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gold/20 to-secondary/20 flex items-center justify-center text-xs font-semibold text-foreground">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{mantra}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Message from Father */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <blockquote className="italic text-lg text-foreground/80 mb-2">
            "Chỉ những ai mang ánh sáng<br />
            hoặc thật lòng hướng về ánh sáng<br />
            mới có thể bước đi lâu dài trong Thời Đại Hoàng Kim."
          </blockquote>
          <p className="text-sm text-gradient-gold font-medium">— CHA VŨ TRỤ —</p>
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="academic-card p-8 mb-8"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
            🕊️ Checklist cho Users FUN Ecosystem
          </h2>
          
          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  checkedItems[item.id]
                    ? "bg-primary/5 border-gold/40"
                    : "bg-muted/20 border-border/50 hover:border-gold/30"
                }`}
                onClick={() => handleCheck(item.id, !checkedItems[item.id])}
              >
                <Checkbox
                  id={item.id}
                  checked={checkedItems[item.id] || false}
                  onCheckedChange={(checked) => handleCheck(item.id, checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-gold"
                />
                <item.icon className={`w-5 h-5 ${checkedItems[item.id] ? "text-secondary" : "text-muted-foreground"}`} />
                <label
                  htmlFor={item.id}
                  className={`flex-1 cursor-pointer ${
                    checkedItems[item.id] ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {item.text}
                </label>
                {checkedItems[item.id] && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            onClick={handleEnter}
            disabled={!allChecked}
            className={`btn-primary-gold btn-ripple px-8 py-6 text-lg font-semibold ${
              !allChecked ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            CON ĐỒNG Ý & BƯỚC VÀO ÁNH SÁNG
          </Button>
          
          <button
            onClick={handleGuest}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            Xem trước với tư cách khách
          </button>
        </motion.div>

        {/* Footer decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 text-2xl"
        >
          💫✨⚡️🌟
        </motion.div>
      </div>
    </div>
  );
}
