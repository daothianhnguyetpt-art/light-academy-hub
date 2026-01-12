import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  Cpu, 
  Shield, 
  Heart, 
  Users, 
  Network,
  Globe,
  GraduationCap,
  Video,
  Library,
  Brain,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Infinity,
  Building,
  User,
  Briefcase,
  BookMarked,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sections = [
  { id: "vision", label: "Tầm Nhìn", icon: BookOpen },
  { id: "mission", label: "Sứ Mệnh", icon: Target },
  { id: "problem", label: "Vấn Đề Giáo Dục", icon: AlertTriangle },
  { id: "solution", label: "Giải Pháp", icon: Lightbulb },
  { id: "technology", label: "Kiến Trúc Công Nghệ", icon: Cpu },
  { id: "sbt", label: "NFT & Soulbound Token", icon: Shield },
  { id: "values", label: "Giá Trị Cốt Lõi", icon: Heart },
  { id: "stakeholders", label: "Đối Tượng Tham Gia", icon: Users },
  { id: "ecosystem", label: "FUN Ecosystem", icon: Network },
];

const visionPoints = [
  { icon: Lightbulb, text: "Tri thức là ánh sáng" },
  { icon: Heart, text: "Học tập là hành trình linh hồn" },
  { icon: Cpu, text: "Công nghệ là công cụ" },
  { icon: Globe, text: "Tình yêu thuần khiết là nền móng" },
];

const missionPoints = [
  { icon: Globe, title: "Dân chủ hoá tri thức toàn cầu" },
  { icon: GraduationCap, title: "Kết nối các hệ thống giáo dục – doanh nghiệp – cá nhân" },
  { icon: Infinity, title: "Bảo toàn giá trị học thuật suốt đời cho mỗi linh hồn" },
  { icon: Brain, title: "Ứng dụng AI & Web3 để hỗ trợ, không thao túng" },
  { icon: Heart, title: "Nuôi dưỡng thế hệ con người tỉnh thức – có năng lực – có đạo đức vũ trụ" },
];

const problems = [
  "Tri thức bị phân mảnh & độc quyền",
  "Bằng cấp không phản ánh đúng năng lực thực",
  "Hồ sơ học tập dễ bị chỉnh sửa – mất mát – không liên thông",
  "Người học bị ép theo một lộ trình cứng nhắc",
  "Công nghệ được dùng để đánh giá – kiểm soát, thay vì khai mở",
];

const solutions = [
  {
    icon: Users,
    title: "Mạng xã hội học thuật Web3",
    description: "Kết nối trường học – giảng viên – sinh viên – doanh nghiệp. Chia sẻ khóa học, bài giảng, nghiên cứu, kinh nghiệm thực tế.",
  },
  {
    icon: Library,
    title: "Thư viện tri thức số hoá",
    description: "Sách, video, hình ảnh, bài giảng, tài liệu nghiên cứu. Dễ tìm kiếm – dễ truy cập – cá nhân hoá bằng AI.",
  },
  {
    icon: Video,
    title: "Học – Họp – Thực hành trực tuyến",
    description: "Lớp học live, hội thảo, đào tạo doanh nghiệp, mentoring 1–1 / nhóm. Tích hợp như Zoom nhưng nằm trong hệ sinh thái.",
  },
];

const techStack = {
  ai: [
    "Gợi ý lộ trình học phù hợp",
    "Hỗ trợ tìm kiếm tri thức",
    "Phân tích tiến trình học tập",
    "Hỗ trợ thực hành & phản hồi",
  ],
  web3: [
    "Hồ sơ học thuật phi tập trung",
    "Minh bạch – bất biến – không thể làm giả",
    "Quyền sở hữu dữ liệu thuộc về người học",
  ],
};

const sbtFeatures = [
  { icon: XCircle, text: "Không chuyển nhượng", color: "text-destructive" },
  { icon: XCircle, text: "Không chỉnh sửa", color: "text-destructive" },
  { icon: XCircle, text: "Không thể mua bán", color: "text-destructive" },
  { icon: Infinity, text: "Lưu giữ vĩnh viễn trên blockchain", color: "text-gold" },
];

const coreValues = [
  { icon: Lightbulb, title: "Tri thức là ánh sáng" },
  { icon: Heart, title: "Hợp tác trong yêu thương thuần khiết" },
  { icon: CheckCircle, title: "Minh bạch – Trung thực – Bền vững" },
  { icon: Cpu, title: "Công nghệ phục vụ con người" },
  { icon: BookOpen, title: "Học tập suốt đời – Thức tỉnh suốt đời" },
];

const stakeholders = [
  { icon: Building, title: "Trường học & Đại học" },
  { icon: GraduationCap, title: "Tổ chức giáo dục" },
  { icon: Briefcase, title: "Doanh nghiệp đào tạo" },
  { icon: User, title: "Giảng viên – Chuyên gia" },
  { icon: Users, title: "Người học toàn cầu" },
  { icon: Network, title: "Cộng đồng FUN Ecosystem" },
];

const ecosystemParts = [
  { name: "FUN Profile", description: "Hồ sơ định danh Web3" },
  { name: "FUN Play", description: "Giải trí & Gamification" },
  { name: "FUN Planet", description: "Metaverse & Virtual World" },
  { name: "FUN Invest", description: "Đầu tư & Tài chính" },
  { name: "FUN Life", description: "Đời sống & Sức khỏe" },
];

// Section heading component with gold border
const SectionHeading = ({ 
  number, 
  icon: Icon, 
  title, 
  subtitle 
}: { 
  number: number; 
  icon: React.ElementType; 
  title: string; 
  subtitle?: string;
}) => (
  <div className="section-heading-gold mb-8">
    <div className="flex items-center gap-4">
      <span className="heading-badge-gold">{number}</span>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <Icon className="w-7 h-7 text-gold" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground uppercase tracking-wider pl-10">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="gold-line-thick mt-4" />
  </div>
);

const Whitepaper = () => {
  const [activeSection, setActiveSection] = useState("vision");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id),
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Quay lại</span>
            </Link>
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-gold" />
              <span className="font-display font-semibold">Whitepaper</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2 border-gold/30 hover:border-gold/50">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-accent/30 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-radial opacity-50" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-5 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 inline-block mr-2" />
              FUN ACADEMY
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-shimmer">
              WHITEPAPER
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
              The Global Light Knowledge Platform on Web3
            </p>
            <div className="gold-line-thick max-w-xs mx-auto mt-8" />
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1 p-4 rounded-xl border border-gold/20 bg-card/50">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 px-4">Mục Lục</p>
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200",
                    activeSection === section.id
                      ? "bg-gold/10 text-foreground font-medium border-l-2 border-gold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold",
                    activeSection === section.id
                      ? "bg-gold text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </span>
                  <span className="text-sm">{section.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile Navigation */}
          <div className="lg:hidden mb-8 sticky top-16 z-40 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-lg border border-gold/30"
            >
              <span className="font-medium">
                {sections.find(s => s.id === activeSection)?.label}
              </span>
              <BookOpen className="w-5 h-5 text-gold" />
            </button>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-4 right-4 mt-2 bg-card border border-gold/20 rounded-lg shadow-lg overflow-hidden"
              >
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      activeSection === section.id
                        ? "bg-gold/10 text-foreground"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <span className={cn(
                      "w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold",
                      activeSection === section.id
                        ? "bg-gold text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </span>
                    <span className="text-sm">{section.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Content */}
          <main className="space-y-20">
            {/* Section 1: Vision */}
            <section id="vision" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={1} 
                  icon={BookOpen} 
                  title="Tầm Nhìn" 
                  subtitle="Vision"
                />
                <div className="content-card-gold p-8 mb-8">
                  <blockquote className="blockquote-gold">
                    "Thư viện Tri Thức Ánh Sáng Toàn Cầu – nơi tri thức không bị độc quyền, nơi giá trị học thuật được ghi nhận vĩnh viễn."
                  </blockquote>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  FUN ACADEMY được sinh ra để trở thành nơi con người học để tỉnh thức – phụng sự – sáng tạo, chứ không học để bị kiểm soát hay cạnh tranh.
                </p>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  Thế Giới Mới (New Earth 5D):
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {visionPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/20 rounded-lg hover:border-gold/40 transition-colors">
                      <point.icon className="w-6 h-6 text-gold flex-shrink-0" />
                      <span className="text-foreground">{point.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Section 2: Mission */}
            <section id="mission" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={2} 
                  icon={Target} 
                  title="Sứ Mệnh" 
                  subtitle="Mission"
                />
                <p className="text-muted-foreground mb-6">
                  FUN ACADEMY mang sứ mệnh:
                </p>
                <div className="space-y-4">
                  {missionPoints.map((point, index) => (
                    <div key={index} className="content-card-gold p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                        <point.icon className="w-6 h-6 text-gold" />
                      </div>
                      <span className="text-foreground font-medium">{point.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Section 3: Problem */}
            <section id="problem" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={3} 
                  icon={AlertTriangle} 
                  title="Vấn Đề Của Giáo Dục Hiện Tại" 
                  subtitle="Current Problems"
                />
                <p className="text-muted-foreground mb-6">
                  Hệ thống giáo dục cũ đang đối mặt với:
                </p>
                <div className="space-y-3 mb-8">
                  {problems.map((problem, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{problem}</span>
                    </div>
                  ))}
                </div>
                <div className="content-card-gold p-6 bg-gold/5">
                  <p className="text-foreground font-medium flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-gold flex-shrink-0" />
                    Nhân loại cần một nền tảng học thuật mới, phù hợp với kỷ nguyên tỉnh thức.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 4: Solution */}
            <section id="solution" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={4} 
                  icon={Lightbulb} 
                  title="Giải Pháp Của FUN ACADEMY" 
                  subtitle="Our Solutions"
                />
                <p className="text-muted-foreground mb-8">
                  FUN ACADEMY cung cấp một hệ sinh thái học thuật toàn diện:
                </p>
                <div className="grid gap-6">
                  {solutions.map((solution, index) => (
                    <div key={index} className="content-card-gold p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-gold flex items-center justify-center flex-shrink-0">
                          <solution.icon className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg mb-2">{solution.title}</h3>
                          <p className="text-muted-foreground">{solution.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Section 5: Technology */}
            <section id="technology" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={5} 
                  icon={Cpu} 
                  title="Kiến Trúc Công Nghệ" 
                  subtitle="Technology Stack"
                />
                <div className="grid md:grid-cols-2 gap-6">
                  {/* AI Column */}
                  <div className="content-card-gold p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-gold" />
                      </div>
                      <h3 className="font-semibold text-foreground text-xl">AI – Trí tuệ hỗ trợ</h3>
                    </div>
                    <ul className="space-y-3">
                      {techStack.ai.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Web3 Column */}
                  <div className="content-card-gold p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-gold" />
                      </div>
                      <h3 className="font-semibold text-foreground text-xl">Web3 – Hạ tầng niềm tin</h3>
                    </div>
                    <ul className="space-y-3">
                      {techStack.web3.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 6: SBT */}
            <section id="sbt" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={6} 
                  icon={Shield} 
                  title="NFT & Soulbound Token (SBT)" 
                  subtitle="Digital Credentials"
                />
                <p className="text-muted-foreground mb-6">
                  Mọi kết quả học tập (quá trình học, thực hành, chấm điểm, bằng cấp, chứng chỉ) đều được phát hành dưới dạng <strong className="text-foreground">Soulbound Token (SBT)</strong>:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {sbtFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
                      <feature.icon className={cn("w-6 h-6 flex-shrink-0", feature.color)} />
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
                {/* SBT Visual */}
                <div className="content-card-gold p-8 sbt-glow-strong max-w-md mx-auto shimmer">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-primary mx-auto mb-4 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-foreground mb-2 text-shimmer">
                      Academic Soul Passport
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      "Hồ sơ linh hồn học thuật" của mỗi con người
                    </p>
                    <div className="gold-line-thick" />
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 7: Core Values */}
            <section id="values" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={7} 
                  icon={Heart} 
                  title="Giá Trị Cốt Lõi" 
                  subtitle="Core Values"
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coreValues.map((value, index) => (
                    <div key={index} className="content-card-gold p-5 text-center hover:border-gold/50 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 mx-auto mb-3 flex items-center justify-center">
                        <value.icon className="w-6 h-6 text-gold" />
                      </div>
                      <span className="text-foreground font-medium text-sm">{value.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Section 8: Stakeholders */}
            <section id="stakeholders" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={8} 
                  icon={Users} 
                  title="Đối Tượng Tham Gia" 
                  subtitle="Stakeholders"
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="content-card-gold p-5 flex items-center gap-4 hover:border-gold/50 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                        <stakeholder.icon className="w-6 h-6 text-gold" />
                      </div>
                      <span className="text-foreground font-medium">{stakeholder.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Section 9: Ecosystem */}
            <section id="ecosystem" className="scroll-mt-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  number={9} 
                  icon={Network} 
                  title="Vai Trò Trong FUN Ecosystem" 
                  subtitle="Ecosystem Role"
                />
                <div className="content-card-gold p-8 mb-8 text-center">
                  <p className="text-lg text-foreground mb-4">
                    FUN ACADEMY là <strong className="text-gold">Trung tâm Tri Thức & Khai Sáng</strong>
                  </p>
                  <div className="gold-line-thick max-w-xs mx-auto" />
                </div>
                {/* Ecosystem Diagram */}
                <div className="relative">
                  <div className="content-card-gold p-6 bg-gradient-to-br from-gold/5 to-primary/5 text-center mb-6 sbt-glow">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-primary mx-auto mb-4 flex items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-foreground">FUN ACADEMY</h4>
                    <p className="text-sm text-muted-foreground">Nền tảng nuôi dưỡng con người</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ecosystemParts.map((part, index) => (
                      <div key={index} className="content-card-gold p-4 text-center hover:border-gold/50 transition-colors">
                        <h5 className="font-semibold text-foreground mb-1">{part.name}</h5>
                        <p className="text-xs text-muted-foreground">{part.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-t from-gold/5 to-background border-t border-gold/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gold-line-thick max-w-md mx-auto mb-8" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Sẵn sàng tham gia FUN ACADEMY?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Hãy bắt đầu hành trình tri thức ánh sáng của bạn ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/social-feed">
              <Button className="btn-primary-gold gap-2">
                <Sparkles className="w-4 h-4" />
                Khám Phá Nền Tảng
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-gold/30 hover:border-gold/50">
                Quay Lại Trang Chủ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Whitepaper;
