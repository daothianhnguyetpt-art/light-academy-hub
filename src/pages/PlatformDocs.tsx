import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Code,
  Cpu,
  Database,
  HardDrive,
  Shield,
  Lock,
  Route,
  Palette,
  Languages,
  Rocket,
  ChevronDown,
  Menu,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Section definitions
const sections = [
  { id: "overview", label: "Tổng Quan", icon: Code },
  { id: "tech-stack", label: "Tech Stack", icon: Cpu },
  { id: "database", label: "Database Schema", icon: Database },
  { id: "storage", label: "File Storage", icon: HardDrive },
  { id: "auth", label: "Authentication", icon: Shield },
  { id: "security", label: "Security & RLS", icon: Lock },
  { id: "routing", label: "Routing Structure", icon: Route },
  { id: "design", label: "Design System", icon: Palette },
  { id: "i18n", label: "Internationalization", icon: Languages },
  { id: "roadmap", label: "Gaps & Roadmap", icon: Rocket },
];

// Reusable Section Heading Component
const SectionHeading = ({
  number,
  icon: Icon,
  title,
  subtitle,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) => (
  <div className="section-card-gold mb-6">
    <div className="flex items-center gap-4">
      <span className="heading-badge-gold">{number}</span>
      <Icon className="w-6 h-6 text-primary" />
      <div>
        <h2 className="text-2xl font-bold text-foreground section-heading-gold inline-block">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// Code Block Component
const CodeBlock = ({ children, title }: { children: string; title?: string }) => (
  <div className="my-4">
    {title && (
      <div className="bg-muted/50 px-4 py-2 rounded-t-lg border border-b-0 border-primary/20">
        <span className="text-sm font-mono text-muted-foreground">{title}</span>
      </div>
    )}
    <pre className={`bg-card border border-primary/20 p-4 overflow-x-auto text-sm font-mono ${title ? 'rounded-b-lg' : 'rounded-lg'}`}>
      <code className="text-foreground">{children}</code>
    </pre>
  </div>
);

// Info Card Component
const InfoCard = ({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "success" | "warning";
  title: string;
  children: React.ReactNode;
}) => {
  const styles = {
    info: { icon: Info, bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    success: { icon: CheckCircle2, bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" },
    warning: { icon: AlertTriangle, bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" },
  };
  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 my-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${style.text}`} />
        <span className={`font-semibold ${style.text}`}>{title}</span>
      </div>
      <div className="text-muted-foreground text-sm">{children}</div>
    </div>
  );
};

// Table Component
const DataTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full border border-primary/20 rounded-lg overflow-hidden">
      <thead className="bg-primary/10">
        <tr>
          {headers.map((header, i) => (
            <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-primary/20">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-primary/10 last:border-0 hover:bg-muted/30 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 text-sm text-muted-foreground">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PlatformDocs = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => ({
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
      setMobileNavOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-primary/20" />
            <h1 className="text-lg font-semibold text-primary">Platform Docs</h1>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            v1.0.0
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              TECHNICAL DOCUMENTATION
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">FUN ACADEMY</span>
              <br />
              <span className="text-foreground">Platform Documentation</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Tài liệu kỹ thuật toàn diện về kiến trúc, database, và tính năng của FUN Academy Platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-120px)]">
                <nav className="space-y-1 pr-4">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                          activeSection === section.id
                            ? "bg-primary/20 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {section.label}
                      </button>
                    );
                  })}
                </nav>
              </ScrollArea>
            </div>
          </aside>

          {/* Mobile Navigation */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
            <Collapsible open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <CollapsibleTrigger asChild>
                <Button className="w-full gap-2 bg-primary text-primary-foreground">
                  <Menu className="w-4 h-4" />
                  {sections.find((s) => s.id === activeSection)?.label}
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${mobileNavOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-card border border-primary/20 rounded-lg p-2 space-y-1 max-h-64 overflow-y-auto">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                          activeSection === section.id
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Content */}
          <main className="flex-1 max-w-4xl">
            {/* Section 1: Overview */}
            <motion.section
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="01"
                icon={Code}
                title="Tổng Quan Kỹ Thuật"
                subtitle="Architecture Overview"
              />
              <div className="content-card-gold p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">1.0.0</div>
                    <div className="text-sm text-muted-foreground">Version</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">21</div>
                    <div className="text-sm text-muted-foreground">Database Tables</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">16</div>
                    <div className="text-sm text-muted-foreground">Routes</div>
                  </div>
                </div>

                <div className="blockquote-gold">
                  <p className="italic">
                    "FUN Academy - Nền tảng giáo dục phi tập trung kết hợp Web2 và Web3, 
                    xây dựng trên triết lý 'Light Academic Space' trong hệ sinh thái FUN Ecosystem."
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mt-6">Kiến Trúc Tổng Quan</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Frontend:</strong> React SPA với Vite bundler</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Backend:</strong> Lovable Cloud (Supabase-powered)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Authentication:</strong> Email, OAuth, Web3 Wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Design:</strong> Tailwind CSS + Framer Motion</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Section 2: Tech Stack */}
            <motion.section
              id="tech-stack"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="02"
                icon={Cpu}
                title="Tech Stack"
                subtitle="Core Technologies"
              />
              <div className="content-card-gold p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Frontend</h3>
                <DataTable
                  headers={["Technology", "Version", "Purpose"]}
                  rows={[
                    ["React", "18.3.1", "UI Framework - Component-based architecture"],
                    ["Vite", "Latest", "Build tool - Fast HMR và bundling"],
                    ["TypeScript", "Strict Mode", "Type safety và developer experience"],
                    ["Tailwind CSS", "3.x", "Utility-first CSS framework"],
                    ["Framer Motion", "10.18.0", "Animation library"],
                    ["TanStack Query", "5.x", "Server state management"],
                    ["React Router", "6.30.1", "Client-side routing"],
                  ]}
                />

                <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Web3 Integration</h3>
                <DataTable
                  headers={["Technology", "Version", "Purpose"]}
                  rows={[
                    ["ethers.js", "6.16.0", "Ethereum wallet connection (MetaMask)"],
                  ]}
                />

                <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Backend (Lovable Cloud)</h3>
                <DataTable
                  headers={["Service", "Purpose"]}
                  rows={[
                    ["PostgreSQL Database", "Relational data storage với RLS"],
                    ["Authentication", "Email, OAuth, Anonymous sessions"],
                    ["Storage", "File uploads (images, videos, documents)"],
                    ["Edge Functions", "Serverless backend logic"],
                    ["Realtime", "WebSocket subscriptions (available)"],
                  ]}
                />

                <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">UI Components</h3>
                <DataTable
                  headers={["Library", "Purpose"]}
                  rows={[
                    ["shadcn/ui", "Radix-based accessible components"],
                    ["Lucide React", "Icon library"],
                    ["Recharts", "Data visualization"],
                    ["Sonner", "Toast notifications"],
                  ]}
                />
              </div>
            </motion.section>

            {/* Section 3: Database */}
            <motion.section
              id="database"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="03"
                icon={Database}
                title="Database Schema"
                subtitle="21 Tables Architecture"
              />
              <div className="content-card-gold p-6 space-y-6">
                <InfoCard type="info" title="Database Engine">
                  PostgreSQL với Row-Level Security (RLS) enabled trên tất cả tables.
                </InfoCard>

                <h3 className="text-lg font-semibold text-foreground">Core Tables (5)</h3>
                <CodeBlock title="User & Identity">{`profiles          - User profiles với wallet_address, knowledge_score
user_roles        - Role assignments (owner, admin, moderator, educator, learner)
user_rewards      - Points và badges tracking
academic_verifications - Academic credential verification
certificates      - Soulbound certificates (NFT-ready)`}</CodeBlock>

                <h3 className="text-lg font-semibold text-foreground">Social Tables (4)</h3>
                <CodeBlock title="Social Feed">{`posts       - User posts với media support
comments    - Post comments
appreciates - "Appreciate" reactions (non-addictive design)
bookmarks   - Saved posts`}</CodeBlock>

                <h3 className="text-lg font-semibold text-foreground">Video & Course Tables (5)</h3>
                <CodeBlock title="Learning Content">{`courses         - Course definitions với accreditation_status
videos          - Individual video lessons
video_comments  - Video discussions
video_ratings   - 1-5 star ratings
video_bookmarks - Saved videos`}</CodeBlock>

                <h3 className="text-lg font-semibold text-foreground">Live Classes Tables (2)</h3>
                <CodeBlock title="Live Learning">{`live_classes        - Scheduled classes với Zoom/YouTube integration
class_registrations - User registrations với reminder settings`}</CodeBlock>

                <h3 className="text-lg font-semibold text-foreground">Global Schools Tables (4)</h3>
                <CodeBlock title="Institution Network">{`institutions          - Educational institutions worldwide
institution_members   - Faculty và staff memberships
partnerships          - Inter-institution agreements
cross_border_recognitions - Credential recognition across borders`}</CodeBlock>

                <h3 className="text-lg font-semibold text-foreground">Resource Tables (1)</h3>
                <CodeBlock title="Library">{`library_resources - Books, documents, và learning materials`}</CodeBlock>
              </div>
            </motion.section>

            {/* Section 4: Storage */}
            <motion.section
              id="storage"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="04"
                icon={HardDrive}
                title="File Storage"
                subtitle="Supabase Storage Buckets"
              />
              <div className="content-card-gold p-6">
                <DataTable
                  headers={["Bucket", "Access", "Max Size", "Allowed Types"]}
                  rows={[
                    ["post-images", "Public", "10MB", "image/jpeg, image/png, image/gif, image/webp"],
                    ["post-videos", "Public", "10MB", "video/mp4, video/webm"],
                    ["video-library", "Public", "10MB", "video/mp4, video/webm"],
                    ["avatars", "Public", "10MB", "image/jpeg, image/png, image/webp"],
                    ["library-files", "Public", "10MB", "application/pdf, image/*"],
                  ]}
                />

                <InfoCard type="warning" title="File Size Limit">
                  Hiện tại giới hạn 10MB cho tất cả file types. Có thể cần tăng cho video uploads trong production.
                </InfoCard>

                <CodeBlock title="File Validation (src/lib/file-validation.ts)">{`// MIME type validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB`}</CodeBlock>
              </div>
            </motion.section>

            {/* Section 5: Authentication */}
            <motion.section
              id="auth"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="05"
                icon={Shield}
                title="Authentication"
                subtitle="Multi-method Auth System"
              />
              <div className="content-card-gold p-6 space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Authentication Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-primary font-semibold mb-2">📧 Email/Password</div>
                    <p className="text-sm text-muted-foreground">Traditional signup với auto-confirm enabled</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-primary font-semibold mb-2">🔐 Google OAuth</div>
                    <p className="text-sm text-muted-foreground">One-click login với Google account</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-primary font-semibold mb-2">🦊 Web3 Wallet</div>
                    <p className="text-sm text-muted-foreground">MetaMask connection via ethers.js</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mt-8">Light Law Acceptance Flow</h3>
                <div className="blockquote-gold">
                  <p>
                    Sau khi đăng nhập lần đầu, users được yêu cầu đọc và chấp nhận "8 Thần Chú Ánh Sáng" 
                    tại <code>/light-law</code>. Timestamp được lưu trong <code>profiles.light_law_accepted_at</code>.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mt-8">Role Hierarchy</h3>
                <CodeBlock>{`Owner     → Full system control, can assign all roles
  ↓
Admin     → Manage content, users, rewards (except Owner role)
  ↓
Moderator → Moderate posts, comments, live classes
  ↓
Educator  → Create courses, videos, live classes
  ↓
Learner   → Default role, consume content`}</CodeBlock>

                <InfoCard type="success" title="Database Functions">
                  <code>has_role(user_id, role)</code> và <code>is_owner(user_id)</code> functions 
                  được sử dụng trong RLS policies để check permissions.
                </InfoCard>
              </div>
            </motion.section>

            {/* Section 6: Security */}
            <motion.section
              id="security"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="06"
                icon={Lock}
                title="Security & RLS"
                subtitle="Row-Level Security Policies"
              />
              <div className="content-card-gold p-6 space-y-6">
                <InfoCard type="success" title="RLS Status">
                  ✅ Row-Level Security enabled trên tất cả 21 tables với policies phù hợp.
                </InfoCard>

                <h3 className="text-lg font-semibold text-foreground">Common RLS Patterns</h3>
                <CodeBlock title="Example: Posts Table Policies">{`-- SELECT: Everyone can view
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT USING (true);

-- INSERT: Only authenticated authors
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);

-- UPDATE/DELETE: Only post author
CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = author_id);`}</CodeBlock>

                <h3 className="text-lg font-semibold text-foreground mt-8">Credential Protection</h3>
                <p className="text-muted-foreground mb-4">
                  Meeting credentials (Zoom ID, Password) được bảo vệ qua database function:
                </p>
                <CodeBlock title="Secure Credential Access">{`-- Function: get_live_class_with_credentials(class_id)
-- Returns meeting_id và meeting_password CHỈ KHI:
-- 1. User là instructor của class
-- 2. User đã registered cho class
-- 3. User có role admin/moderator`}</CodeBlock>

                <InfoCard type="warning" title="Action Required">
                  <strong>Leaked Password Protection</strong> cần được enable thủ công trong Auth settings 
                  để check passwords against HaveIBeenPwned database.
                </InfoCard>
              </div>
            </motion.section>

            {/* Section 7: Routing */}
            <motion.section
              id="routing"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="07"
                icon={Route}
                title="Routing Structure"
                subtitle="16 Application Routes"
              />
              <div className="content-card-gold p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Public Routes</h3>
                <DataTable
                  headers={["Route", "Page", "Description"]}
                  rows={[
                    ["/", "Index", "Landing page - Ecosystem overview"],
                    ["/auth", "Auth", "Login/Register (Email, Google, Web3)"],
                    ["/light-law", "LightLaw", "8 Thần Chú Ánh Sáng acceptance"],
                    ["/whitepaper", "Whitepaper", "Project vision và philosophy"],
                    ["/constitution", "Constitution", "Hiến Pháp Ánh Sáng"],
                    ["/global-schools", "GlobalSchools", "Institution directory"],
                    ["/institution/:id", "InstitutionDetail", "Institution profile"],
                  ]}
                />

                <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Learning Routes</h3>
                <DataTable
                  headers={["Route", "Page", "Description"]}
                  rows={[
                    ["/video-library", "VideoLibrary", "Browse all videos"],
                    ["/video/:id", "VideoDetail", "Video player với comments"],
                    ["/course/:id", "CourseDetail", "Course overview và lessons"],
                    ["/live-classes", "LiveClasses", "Scheduled live sessions"],
                    ["/library", "Library", "Books và documents"],
                    ["/library/:id", "LibraryDetail", "Resource viewer"],
                  ]}
                />

                <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">User Routes</h3>
                <DataTable
                  headers={["Route", "Page", "Access"]}
                  rows={[
                    ["/social-feed", "SocialFeed", "Authenticated users"],
                    ["/profile", "Profile", "Authenticated users"],
                    ["/admin", "AdminDashboard", "Admin/Owner only"],
                    ["/docs/platform", "PlatformDocs", "Public (this page)"],
                  ]}
                />
              </div>
            </motion.section>

            {/* Section 8: Design System */}
            <motion.section
              id="design"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="08"
                icon={Palette}
                title="Design System"
                subtitle="Light Academic Space Philosophy"
              />
              <div className="content-card-gold p-6 space-y-6">
                <div className="blockquote-gold">
                  <p className="italic">
                    "Light Academic Space - Không gian học thuật ánh sáng với màu sắc Navy/Gold/Ivory, 
                    thiết kế non-addictive patterns phản ánh giá trị của FUN Ecosystem."
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground">Color Palette</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-full h-16 rounded-lg bg-primary mb-2" />
                    <div className="text-sm font-medium">Primary (Gold)</div>
                    <div className="text-xs text-muted-foreground">HSL 43 74% 49%</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 rounded-lg bg-background border border-primary/20 mb-2" />
                    <div className="text-sm font-medium">Background (Navy)</div>
                    <div className="text-xs text-muted-foreground">HSL 222 47% 11%</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 rounded-lg bg-card mb-2" />
                    <div className="text-sm font-medium">Card</div>
                    <div className="text-xs text-muted-foreground">HSL 222 47% 15%</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 rounded-lg bg-muted mb-2" />
                    <div className="text-sm font-medium">Muted</div>
                    <div className="text-xs text-muted-foreground">HSL 217 33% 20%</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mt-8">Non-Addictive Patterns</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>"Appreciate"</strong> thay vì "Like" - Khuyến khích gratitude</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>No infinite scroll</strong> - Pagination rõ ràng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Knowledge Score</strong> - Đo lường sự phát triển, không phải engagement</span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-8">Typography</h3>
                <CodeBlock>{`font-display: System font stack cho headings
font-sans: System font stack cho body text

Headings: Bold, tracking-tight
Body: Normal weight, relaxed line-height`}</CodeBlock>
              </div>
            </motion.section>

            {/* Section 9: i18n */}
            <motion.section
              id="i18n"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="09"
                icon={Languages}
                title="Internationalization"
                subtitle="Multi-language Support"
              />
              <div className="content-card-gold p-6 space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Supported Languages</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { flag: "🇻🇳", code: "vi", name: "Tiếng Việt", status: "Master" },
                    { flag: "🇺🇸", code: "en", name: "English", status: "Complete" },
                    { flag: "🇨🇳", code: "zh", name: "简体中文", status: "Complete" },
                    { flag: "🇯🇵", code: "ja", name: "日本語", status: "Complete" },
                    { flag: "🇰🇷", code: "ko", name: "한국어", status: "Complete" },
                  ].map((lang) => (
                    <div key={lang.code} className="bg-muted/30 rounded-lg p-4 text-center">
                      <div className="text-3xl mb-2">{lang.flag}</div>
                      <div className="font-medium text-foreground">{lang.name}</div>
                      <div className="text-xs text-muted-foreground">{lang.status}</div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-foreground mt-8">Architecture</h3>
                <CodeBlock title="src/i18n/">{`index.ts              - Exports LanguageProvider, useTranslation
LanguageContext.tsx   - Context provider với localStorage persistence
useTranslation.ts     - Hook for translations

locales/
  ├── vi.json         - Vietnamese (master file)
  ├── en.json         - English
  ├── zh.json         - Chinese
  ├── ja.json         - Japanese
  └── ko.json         - Korean`}</CodeBlock>

                <h3 className="text-lg font-semibold text-foreground mt-8">Usage</h3>
                <CodeBlock title="Component Example">{`import { useTranslation } from "@/i18n";

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t("common.welcome")}</h1>
      <p>{t("landing.hero.title")}</p>
      <button onClick={() => setLanguage("en")}>
        Switch to English
      </button>
    </div>
  );
}`}</CodeBlock>
              </div>
            </motion.section>

            {/* Section 10: Roadmap */}
            <motion.section
              id="roadmap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SectionHeading
                number="10"
                icon={Rocket}
                title="Gaps & Roadmap"
                subtitle="Improvements & Future Features"
              />
              <div className="content-card-gold p-6 space-y-6">
                <InfoCard type="warning" title="High Priority Gaps">
                  Các tính năng cần triển khai ngay để hoàn thiện platform.
                </InfoCard>

                <h3 className="text-lg font-semibold text-foreground">🔴 High Priority</h3>
                <DataTable
                  headers={["Feature", "Description", "Complexity"]}
                  rows={[
                    ["Global Search", "Tìm kiếm videos, posts, users, institutions", "Medium"],
                    ["Notifications System", "Real-time alerts via Supabase Realtime", "Medium"],
                    ["Leaked Password Protection", "Enable trong Auth settings", "Low"],
                    ["Email Verification Flow", "Confirmation emails cho security", "Low"],
                  ]}
                />

                <h3 className="text-lg font-semibold text-foreground mt-8">🟡 Feature Expansion</h3>
                <DataTable
                  headers={["Feature", "Description", "Complexity"]}
                  rows={[
                    ["My Learning Dashboard", "/my-learning - Progress tracking", "Medium"],
                    ["Quiz/Assessment System", "Questions sau mỗi video/course", "High"],
                    ["Certificate Generation", "PDF/NFT certificates automated", "High"],
                    ["Leaderboard", "/leaderboard - Points ranking", "Low"],
                    ["Direct Messaging", "User-to-user communication", "High"],
                  ]}
                />

                <h3 className="text-lg font-semibold text-foreground mt-8">🟢 Technical Improvements</h3>
                <DataTable
                  headers={["Area", "Improvement", "Benefit"]}
                  rows={[
                    ["Pagination", "Cursor-based thay vì offset", "Better performance at scale"],
                    ["Testing", "E2E tests với Playwright", "Reliability"],
                    ["Error Boundaries", "Global error handling", "User experience"],
                    ["Analytics", "Usage tracking dashboard", "Insights"],
                    ["PWA", "Offline support, installable", "Mobile experience"],
                  ]}
                />

                <div className="blockquote-gold mt-8">
                  <p className="italic">
                    "FUN Academy đang trong giai đoạn MVP với foundation vững chắc. 
                    Các tính năng tiếp theo sẽ được phát triển dựa trên feedback từ cộng đồng 
                    và định hướng của Hiến Pháp Ánh Sáng."
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12 border-t border-primary/20"
            >
              <p className="text-muted-foreground mb-4">
                Tài liệu được tạo bởi Angel AI • FUN Academy Platform
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/whitepaper">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Whitepaper
                  </Button>
                </Link>
                <Link to="/constitution">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Constitution
                  </Button>
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PlatformDocs;
