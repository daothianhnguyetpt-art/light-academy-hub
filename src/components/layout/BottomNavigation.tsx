import { Link, useLocation } from "react-router-dom";
import { Home, Play, BookOpen, Radio, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  labelKey: string;
}

const navItems: NavItem[] = [
  { href: "/social-feed", icon: Home, labelKey: "nav.feed" },
  { href: "/video-library", icon: Play, labelKey: "nav.video" },
  { href: "/library", icon: BookOpen, labelKey: "nav.library" },
  { href: "/live-classes", icon: Radio, labelKey: "nav.live" },
  { href: "/profile", icon: User, labelKey: "nav.profile" },
];

export function BottomNavigation() {
  const location = useLocation();
  const { t } = useTranslation();

  // Don't show on landing page, auth pages, or admin
  const hiddenPaths = ["/", "/auth", "/admin", "/light-law"];
  if (hiddenPaths.some(path => location.pathname === path)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Backdrop blur and gradient */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-lg border-t border-border/50" />
      
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 gold-line" />
      
      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 mb-1 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "text-primary"
              )}>
                {t(item.labelKey) || item.labelKey.split('.').pop()}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-gradient-to-r from-primary via-gold to-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
