import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import funAcademyLogo from "@/assets/fun-academy-logo.jpg";

interface HeaderProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
  walletAddress?: string;
}

const navLinks = [
  { href: "/", label: "Trang Chủ" },
  { href: "/social-feed", label: "Social Feed" },
  { href: "/video-library", label: "Video Library" },
  { href: "/live-classes", label: "Live Classes" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/profile", label: "Profile" },
];

export function Header({ onConnectWallet, isWalletConnected, walletAddress }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={funAcademyLogo} 
              alt="FUN Academy" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-display font-semibold text-xl text-foreground hidden sm:block">
              FUN Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Connect Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onConnectWallet}
              className={cn(
                "btn-primary-gold hidden sm:flex items-center gap-2",
                isWalletConnected && "bg-secondary text-secondary-foreground"
              )}
            >
              <Wallet className="w-4 h-4" />
              {isWalletConnected && walletAddress
                ? formatAddress(walletAddress)
                : "Connect Wallet"}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-accent/50 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pb-4 border-t border-border/50 mt-2"
          >
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                onClick={() => {
                  onConnectWallet();
                  setIsMobileMenuOpen(false);
                }}
                className="btn-primary-gold mt-2 flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {isWalletConnected && walletAddress
                  ? formatAddress(walletAddress)
                  : "Connect Wallet"}
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
