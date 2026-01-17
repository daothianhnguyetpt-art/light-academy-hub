import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Globe } from "lucide-react";
import funAcademyLogo from "@/assets/fun-academy-logo.jpg";

const footerLinks = {
  platform: [
    { label: "Social Feed", href: "/social-feed" },
    { label: "Video Library", href: "/video-library" },
    { label: "Live Classes", href: "/live-classes" },
    { label: "Academic Profile", href: "/profile" },
  ],
  resources: [
    { label: "Whitepaper", href: "/whitepaper" },
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
  ],
  ecosystem: [
    { label: "FUN Token", href: "#" },
    { label: "FUN Marketplace", href: "#" },
    { label: "FUN DAO", href: "#" },
    { label: "Partners", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Globe, href: "#", label: "Website" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={funAcademyLogo} 
                alt="FUN Academy" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-display font-semibold text-xl text-foreground">
                FUN Academy
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Trái tim tri thức & khai sáng của FUN Ecosystem.
            </p>
            <p className="text-xs text-muted-foreground/80 italic mb-6">
              "Đây là Thư Viện Ánh Sáng của Nhân Loại trong Kỷ Nguyên 5D"
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-accent/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">FUN Ecosystem</h4>
            <ul className="space-y-3">
              {footerLinks.ecosystem.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="gold-line my-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © 2026 FUN Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
