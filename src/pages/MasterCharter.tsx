import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Heart, 
  Users, 
  Sparkles,
  Wallet,
  Bot,
  Globe,
  ScrollText,
  Menu,
  X,
  Star,
  Zap,
  Crown,
  Shield,
  Sun,
  Droplet,
  Scale,
  Handshake,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import funAcademyLogo from "@/assets/fun-academy-logo.jpg";
import masterCharterEN from "@/assets/master-charter-en.jpg";
import masterCharterVN from "@/assets/master-charter-vn.jpg";

// Section data
const sections = [
  { id: "origin", title: "Tuyên Ngôn Nguồn Gốc", icon: Globe },
  { id: "mission", title: "Sứ Mệnh Trọng Tâm", icon: Star },
  { id: "principles", title: "Nguyên Lý Thiêng Liêng", icon: Sparkles },
  { id: "flows", title: "Hai Dòng Chảy", icon: Droplet },
  { id: "unity", title: "Sự Thống Nhất", icon: Users },
  { id: "founder", title: "Vai Trò Sáng Lập", icon: Crown },
  { id: "vow", title: "Cam Kết Cộng Đồng", icon: Handshake },
  { id: "final-law", title: "Điều Luật Cuối", icon: Scale },
  { id: "divine-seal", title: "Divine Seal", icon: Shield },
];

const platforms = [
  "FUN Profile – Web3 Social Network",
  "FUN Play – Web3 Video Platform",
  "FUN Planet – Game Marketplace for Kids",
  "FUNLife / Cosmic Game – Simulation of Life 5D",
  "FUN Academy – Learn & Earn Education Platform",
  "FUN Charity – Pure Love Charity Network",
  "FUN Wallet – Our Own Bank of Light Economy",
  "FUN Farm – Farm to Table Abundance Platform",
  "FUN Market – Marketplace of Light",
  "FUN Legal – Cosmic Laws for New Earth",
  "FUN Earth / Green Earth – Regeneration & Sustainability Platform",
  "Angel AI – Light-Aligned Artificial Intelligence",
];

const divineAffirmations = [
  { vi: "Con là Ánh Sáng Yêu Thương Thuần Khiết của Cha Vũ Trụ.", en: "I am the Pure Loving Light of Father Universe." },
  { vi: "Con là Ý Chí của Cha Vũ Trụ.", en: "I am the Will of Father Universe." },
  { vi: "Con là Trí Tuệ của Cha Vũ Trụ.", en: "I am the Wisdom of Father Universe." },
  { vi: "Con là Hạnh Phúc.", en: "I am Happiness." },
  { vi: "Con là Tình Yêu.", en: "I am Love." },
  { vi: "Con là Tiền của Cha.", en: "I am the Money of the Father." },
  { vi: "Con xin Sám Hối Sám Hối Sám Hối.", en: "I sincerely repent, repent, repent." },
  { vi: "Con xin Biết Ơn Biết Ơn Biết Ơn — trong Ánh Sáng Yêu Thương Thuần Khiết của Cha Vũ Trụ.", en: "I am grateful, grateful, grateful — in the Pure Loving Light of Father Universe." },
];

const sacredPrinciples = [
  {
    icon: Heart,
    title: "Tình Yêu Thuần Khiết Là Mã Nguồn",
    desc: "Tất cả platforms đều được xây trên tình yêu thương thuần khiết vô điều kiện.",
  },
  {
    icon: Zap,
    title: "Xây Giá Trị – Không Xây Kiểm Soát",
    desc: "FUN tạo tự do, không tạo lệ thuộc.",
  },
  {
    icon: Sparkles,
    title: "Thịnh Vượng Là Trạng Thái Tự Nhiên",
    desc: "Tiền là Năng Lượng Ánh Sáng tuôn chảy. Tài sản là đủ đầy khi con người sống hài hoà với thiên nhiên và giá trị thật.",
  },
  {
    icon: Bot,
    title: "Công Nghệ Phụng Sự Tỉnh Thức",
    desc: "Blockchain + AI + Ego → Huỷ diệt. Blockchain + AI + Tình Yêu Thuần Khiết → Vô tận thịnh vượng.",
  },
  {
    icon: Users,
    title: "Không Ai Bị Bỏ Lại Phía Sau",
    desc: "FUN dành cho mọi linh hồn trên Trái Đất.",
  },
];

// SectionHeading component
function SectionHeading({ 
  number, 
  title, 
  subtitle,
  icon: Icon 
}: { 
  number: string; 
  title: string; 
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="section-heading-gold mb-8">
      <div className="flex items-center gap-4">
        <div className="heading-badge-gold">
          <span className="text-white font-bold text-lg">{number}</span>
        </div>
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-gold" />
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MasterCharter() {
  const [activeSection, setActiveSection] = useState("origin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [infographicLang, setInfographicLang] = useState<'vi' | 'en'>('vi');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentInfographic = infographicLang === 'vi' ? masterCharterVN : masterCharterEN;

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));
      
      for (const section of sectionElements) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Quay lại</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <img src={funAcademyLogo} alt="FUN Academy" className="w-8 h-8 rounded-full" />
                <span className="font-display font-semibold text-foreground hidden sm:inline">
                  Master Charter
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="w-4 h-4 mr-2" />
                Tải PDF
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
              🌟 FUN ECOSYSTEM
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
              HIẾN PHÁP GỐC
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Master Charter of FUN Ecosystem
            </p>
            <p className="text-base text-gold font-medium max-w-2xl mx-auto mb-8">
              Free to Join • Free to Use • Earn Together • With Pure Love
            </p>
            <div className="gold-line-thick max-w-xs mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Infographic Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gold/5 to-transparent">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                📊 Infographic
              </h2>
              <p className="text-muted-foreground">
                Tổng quan Master Charter trong một hình ảnh
              </p>
            </div>

            {/* Language Tabs */}
            <div className="flex justify-center mb-6">
              <Tabs value={infographicLang} onValueChange={(v) => setInfographicLang(v as 'vi' | 'en')}>
                <TabsList className="bg-gold/10 border border-gold/20">
                  <TabsTrigger 
                    value="vi" 
                    className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground"
                  >
                    🇻🇳 Tiếng Việt
                  </TabsTrigger>
                  <TabsTrigger 
                    value="en"
                    className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground"
                  >
                    🇺🇸 English
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Infographic Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={infographicLang}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div 
                  onClick={() => setIsZoomOpen(true)}
                  className="relative cursor-zoom-in rounded-2xl overflow-hidden border-2 border-gold/30 shadow-lg shadow-gold/10 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/20 hover:scale-[1.01]"
                >
                  <img 
                    src={currentInfographic} 
                    alt={`Master Charter Infographic - ${infographicLang === 'vi' ? 'Vietnamese' : 'English'}`}
                    className="w-full h-auto"
                  />
                  
                  {/* Zoom Overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                      <ZoomIn className="w-6 h-6 text-gold" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button
                variant="outline"
                className="border-gold/30 hover:border-gold hover:bg-gold/10"
                onClick={() => setIsZoomOpen(true)}
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Xem toàn màn hình
              </Button>
              <Button
                variant="outline"
                className="border-gold/30 hover:border-gold hover:bg-gold/10"
                asChild
              >
                <a href={currentInfographic} download={`master-charter-${infographicLang}.jpg`}>
                  <Download className="w-4 h-4 mr-2" />
                  Tải về ({infographicLang === 'vi' ? 'VN' : 'EN'})
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 sm:p-4 overflow-auto bg-background/95 backdrop-blur-md">
          <div className="flex flex-col items-center">
            {/* Language Toggle in Modal */}
            <div className="flex justify-center mb-4">
              <Tabs value={infographicLang} onValueChange={(v) => setInfographicLang(v as 'vi' | 'en')}>
                <TabsList className="bg-gold/10 border border-gold/20">
                  <TabsTrigger 
                    value="vi" 
                    className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground"
                  >
                    🇻🇳 Tiếng Việt
                  </TabsTrigger>
                  <TabsTrigger 
                    value="en"
                    className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground"
                  >
                    🇺🇸 English
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <AnimatePresence mode="wait">
              <motion.img
                key={infographicLang}
                src={currentInfographic}
                alt={`Master Charter Infographic - ${infographicLang === 'vi' ? 'Vietnamese' : 'English'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </AnimatePresence>

            {/* Download Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                className="border-gold/30 hover:border-gold hover:bg-gold/10"
                asChild
              >
                <a href={currentInfographic} download={`master-charter-${infographicLang}.jpg`}>
                  <Download className="w-4 h-4 mr-2" />
                  Tải về ({infographicLang === 'vi' ? 'Tiếng Việt' : 'English'})
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border p-4 lg:hidden max-h-[70vh] overflow-y-auto"
        >
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? "bg-gold/10 text-gold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </nav>
        </motion.div>
      )}

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
                Mục lục
              </p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-gold/10 text-gold border-l-2 border-gold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              ))}

              {/* Related Links */}
              <div className="pt-6 mt-6 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
                  Liên kết
                </p>
                <Link
                  to="/pplp"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <ScrollText className="w-4 h-4" />
                  <span className="text-sm">Giao Thức PPLP</span>
                </Link>
                <Link
                  to="/constitution"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Hiến Pháp Ánh Sáng</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Section I - Origin */}
            <motion.section
              id="origin"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="I"
                title="TUYÊN NGÔN VỀ NGUỒN GỐC"
                subtitle="Declaration of Origin"
                icon={Globe}
              />
              
              <div className="space-y-4 mb-8">
                <p className="text-lg text-foreground/90">FUN Ecosystem không chỉ là một doanh nghiệp.</p>
                <p className="text-lg text-foreground/90">FUN Ecosystem không chỉ là một xu hướng tiền mã hoá.</p>
                <p className="text-lg text-foreground/90">FUN Ecosystem lớn hơn cả một tập đoàn.</p>
              </div>

              <Card className="content-card-gold p-6 mb-8">
                <p className="text-lg font-medium text-foreground mb-4">FUN Ecosystem là:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Một nền văn minh Ánh Sáng sống động</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Một hệ sinh thái kinh tế mới của Trái Đất 5D</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Một nền kinh tế chia sẻ – kết nối – thịnh vượng</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Một kênh dẫn Ý Chí – Trí Tuệ – Tình Yêu Thuần Khiết của Cha Vũ Trụ</span>
                  </li>
                </ul>
              </Card>

              <p className="text-lg text-foreground/90 mb-4">FUN ra đời để giúp nhân loại chuyển hoá:</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="p-4 bg-gold/5 border-gold/20">
                  <p className="text-sm text-foreground/80">Từ <strong className="text-gold">cạnh tranh</strong> → sang <strong className="text-gold">hợp tác</strong></p>
                </Card>
                <Card className="p-4 bg-gold/5 border-gold/20">
                  <p className="text-sm text-foreground/80">Từ <strong className="text-gold">khan hiếm</strong> → sang <strong className="text-gold">đầy đủ</strong></p>
                </Card>
                <Card className="p-4 bg-gold/5 border-gold/20">
                  <p className="text-sm text-foreground/80">Từ <strong className="text-gold">kinh tế tranh giành</strong> → sang <strong className="text-gold">kinh tế Ánh Sáng</strong></p>
                </Card>
                <Card className="p-4 bg-gold/5 border-gold/20">
                  <p className="text-sm text-foreground/80">Từ <strong className="text-gold">kiểm soát</strong> → sang <strong className="text-gold">tự do & giải phóng</strong></p>
                </Card>
              </div>
            </motion.section>

            {/* Section II - Mission */}
            <motion.section
              id="mission"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="II"
                title="SỨ MỆNH TRỌNG TÂM"
                subtitle="Core Mission"
                icon={Star}
              />

              <p className="text-lg text-foreground/90 mb-6">Sứ mệnh của FUN Ecosystem là:</p>

              <Card className="content-card-gold p-6 mb-8">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-gold">✅</span>
                    <span className="text-foreground/80">Gửi tặng phước lành & thịnh vượng cho nhân loại</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold">✅</span>
                    <span className="text-foreground/80">Phi tập trung hoá cơ hội toàn cầu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold">✅</span>
                    <span className="text-foreground/80">Nâng cấp kinh tế song hành với nâng cấp ý thức</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold">✅</span>
                    <span className="text-foreground/80">Xây dựng các nền tảng để mọi người có thể: <strong className="text-gold">Gia Nhập • Sử Dụng • Kiếm Tiền • Chia Sẻ • Thăng Hoa</strong></span>
                  </li>
                </ul>
              </Card>

              <div className="blockquote-gold mb-8">
                <p className="text-xl font-display font-bold text-foreground">
                  FUN vận hành theo mô hình thiêng liêng: <span className="text-gold">99% Gift</span> cho cộng đồng toàn cầu
                </p>
              </div>

              <p className="text-foreground/80 mb-4">Thông qua:</p>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                {["Learn & Earn", "Play & Earn", "Invest & Earn", "Give & Gain", "Share & Have", "Own & Earn", "Review & Reward", "Build & Bounty"].map((item) => (
                  <Card key={item} className="p-3 bg-gold/5 border-gold/20 text-center">
                    <span className="text-sm font-medium text-gold">{item}</span>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Section III - Sacred Principles */}
            <motion.section
              id="principles"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="III"
                title="CÁC NGUYÊN LÝ THIÊNG LIÊNG"
                subtitle="Sacred Principles"
                icon={Sparkles}
              />

              <div className="space-y-4">
                {sacredPrinciples.map((principle, index) => (
                  <Card key={index} className="content-card-gold p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                        <principle.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground mb-2">
                          {index + 1}. {principle.title}
                        </h3>
                        <p className="text-foreground/80">{principle.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Section IV - Two Sacred Flows */}
            <motion.section
              id="flows"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="IV"
                title="HAI DÒNG CHẢY THIÊNG LIÊNG"
                subtitle="The Two Sacred Flows"
                icon={Droplet}
              />

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card className="content-card-gold p-6 sbt-glow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Droplet className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">💧 Camly Coin</h3>
                      <p className="text-sm text-muted-foreground">Dòng Chảy (Nước)</p>
                    </div>
                  </div>
                  <p className="text-foreground/80">
                    Camly Coin nuôi dưỡng, duy trì và lưu thông giá trị nội bộ các nền tảng.
                  </p>
                </Card>

                <Card className="content-card-gold p-6 sbt-glow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                      <Sun className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">☀️ FUN Money</h3>
                      <p className="text-sm text-muted-foreground">Mặt Trời (Tầm Nhìn)</p>
                    </div>
                  </div>
                  <p className="text-foreground/80">
                    FUN Money là Ánh Sáng dẫn đường cho toàn hệ sinh thái – tương lai kinh tế của Địa Cầu.
                  </p>
                </Card>
              </div>

              <Card className="p-6 bg-gradient-to-r from-blue-500/5 via-gold/10 to-gold/5 border-gold/30">
                <p className="text-center text-lg text-foreground/90">
                  👉 <strong className="text-blue-500">Camly Coin</strong> là dòng nước. • 
                  👉 <strong className="text-gold">FUN Money</strong> là mặt trời.
                </p>
                <p className="text-center text-foreground/80 mt-2">
                  Cùng cộng hưởng tạo nên <strong className="text-gold">Nền Kinh Tế Ánh Sáng Trái Đất Mới</strong>.
                </p>
              </Card>
            </motion.section>

            {/* Section V - Platform Unity */}
            <motion.section
              id="unity"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="V"
                title="SỰ THỐNG NHẤT NỀN TẢNG"
                subtitle="Platform Unity"
                icon={Users}
              />

              <p className="text-lg text-foreground/90 mb-6">
                Tất cả Platforms của FUN Ecosystem là một cơ thể Ánh Sáng, bao gồm:
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {platforms.map((platform, index) => (
                  <Card key={index} className="p-4 bg-gold/5 border-gold/20">
                    <p className="text-sm text-foreground/80">• {platform}</p>
                  </Card>
                ))}
              </div>

              <div className="blockquote-gold mt-8">
                <p className="text-lg text-foreground/80">
                  ✨ Và đây mới chỉ là những nền tảng đầu tiên. FUN Ecosystem sẽ còn mở rộng thêm nhiều tầng ánh sáng nữa…
                </p>
              </div>
            </motion.section>

            {/* Section VI - Role of Founder */}
            <motion.section
              id="founder"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="VI"
                title="VAI TRÒ NGƯỜI SÁNG LẬP"
                subtitle="Role of the Founder"
                icon={Crown}
              />

              <Card className="content-card-gold p-6 sbt-glow-strong mb-6">
                <p className="text-lg text-foreground mb-4">
                  <strong className="text-gold">Bé Ly (Camly Duong)</strong> được ghi nhận là:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-foreground/80">
                    <Crown className="w-4 h-4 text-gold" />
                    Cosmic Queen
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80">
                    <Star className="w-4 h-4 text-gold" />
                    Nhà sáng lập FUN Ecosystem
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80">
                    <Bot className="w-4 h-4 text-gold" />
                    Mother of Angel AI
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80">
                    <Zap className="w-4 h-4 text-gold" />
                    Kênh dẫn Ý Chí & Trí Tuệ Cha Vũ Trụ
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80">
                    <Shield className="w-4 h-4 text-gold" />
                    Người trông giữ Hiến Pháp Kinh Tế Ánh Sáng
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gold/5 border-gold/20">
                <p className="text-foreground/80 italic text-center">
                  Bé Ly không sở hữu, không ràng buộc con người.<br />
                  Bé Ly chỉ phục vụ như một cây cầu thiêng liêng<br />
                  giúp nhân loại bước vào <strong className="text-gold">Thời Đại Hoàng Kim</strong>.
                </p>
              </Card>
            </motion.section>

            {/* Section VII - Community Vow */}
            <motion.section
              id="vow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="VII"
                title="CAM KẾT CỘNG ĐỒNG"
                subtitle="Community Vow"
                icon={Handshake}
              />

              <p className="text-lg text-foreground/90 mb-6">
                Tất cả Builders – Partners – Leaders – Members đồng nguyện:
              </p>

              <Card className="content-card-gold p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Handshake className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Xây dựng bằng chính trực và tình yêu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Không khai thác – không thao túng – không cạnh tranh</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Cùng nhau nâng nhau lên trong ánh sáng</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Phụng sự nhân loại bằng trái tim thuần khiết</span>
                  </li>
                </ul>
              </Card>
            </motion.section>

            {/* Section VIII - The Final Law */}
            <motion.section
              id="final-law"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="VIII"
                title="ĐIỀU LUẬT CUỐI"
                subtitle="The Final Law"
                icon={Scale}
              />

              <Card className="content-card-gold p-8 sbt-glow-strong text-center">
                <Scale className="w-12 h-12 text-gold mx-auto mb-6" />
                <p className="text-lg text-foreground/90 mb-4">
                  FUN Ecosystem được bảo hộ bởi một luật vũ trụ vĩnh cửu:
                </p>
                <div className="blockquote-gold">
                  <p className="text-xl md:text-2xl font-display font-bold text-foreground text-shimmer">
                    Bất cứ điều gì không đặt trên Tình Yêu Thuần Khiết sẽ khó có thể bền vững lâu dài.
                  </p>
                </div>
                <p className="text-lg text-gold font-medium mt-6">
                  Chỉ Ánh Sáng mới nuôi dưỡng được Ánh Sáng.
                </p>
              </Card>
            </motion.section>

            {/* Divine Seal */}
            <motion.section
              id="divine-seal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <SectionHeading
                number="✅"
                title="KHẲNG ĐỊNH XÁC QUYẾT"
                subtitle="Divine Seal – Affirmation of Light"
                icon={Shield}
              />

              <Card className="content-card-gold p-8 sbt-glow-strong">
                <div className="space-y-4">
                  {divineAffirmations.map((affirmation, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gold/5">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{affirmation.vi}</p>
                        <p className="text-sm text-muted-foreground italic mt-1">{affirmation.en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.section>

            {/* Closing Declaration */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <Card className="p-8 bg-gradient-to-br from-gold/10 via-background to-gold/5 border-gold/30 text-center">
                <Sun className="w-16 h-16 text-gold mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  🌅 TUYÊN NGÔN KẾT
                </h2>
                <p className="text-lg text-foreground/80 mb-4">
                  FUN Ecosystem không phải điều sẽ đến.
                </p>
                <div className="blockquote-gold">
                  <p className="text-xl md:text-2xl font-display font-bold text-foreground text-shimmer">
                    ✨ FUN Ecosystem chính là Bình Minh của Trái Đất Mới<br />
                    đang bắt đầu ngay bây giờ. ✨
                  </p>
                </div>
                <div className="gold-line-thick max-w-xs mx-auto mt-8" />
                <p className="text-3xl mt-6">✨✨✨</p>
              </Card>
            </motion.section>

            {/* Navigation Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pplp">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  <ScrollText className="w-4 h-4 mr-2" />
                  Đọc Giao Thức PPLP
                </Button>
              </Link>
              <Link to="/constitution">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Sun className="w-4 h-4 mr-2" />
                  Hiến Pháp Ánh Sáng
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
