import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Wallet, LogOut, User, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { WalletType } from "@/components/auth/WalletOptions";
import funAcademyLogo from "@/assets/fun-academy-logo.jpg";

interface HeaderProps {
  onConnectWallet: (walletType: WalletType) => Promise<void>;
  isWalletConnected: boolean;
  walletAddress?: string;
  isConnectingWallet?: boolean;
  connectingWalletType?: WalletType | null;
}

const navLinks = [
  { href: "/", label: "Trang Chủ" },
  { href: "/global-schools", label: "Global Schools" },
  { href: "/social-feed", label: "Social Feed" },
  { href: "/video-library", label: "Video Library" },
  { href: "/live-classes", label: "Live Classes" },
  { href: "/library", label: "Library" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/profile", label: "Profile" },
];

export function Header({ 
  onConnectWallet, 
  isWalletConnected, 
  walletAddress,
  isConnectingWallet = false,
  connectingWalletType = null,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Check if user is authenticated (either via Supabase or wallet)
  const isAuthenticated = user || isWalletConnected;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/30"
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

            {/* Auth Button */}
            <div className="flex items-center gap-2">
              {/* Desktop */}
              <div className="hidden sm:flex items-center gap-2">
                {loading ? (
                  <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
                ) : user ? (
                  // Logged in with Supabase
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 border border-primary/30 hover:bg-primary/5">
                        <User className="w-4 h-4" />
                        <span className="max-w-[120px] truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="w-4 h-4 mr-2" />
                        Hồ Sơ
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng Xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : isWalletConnected && walletAddress ? (
                  // Connected with wallet
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 border border-accent/50 bg-accent/5 hover:bg-accent/10">
                        <Wallet className="w-4 h-4 text-accent" />
                        <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="w-4 h-4 mr-2" />
                        Hồ Sơ
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.location.reload()}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Ngắt Kết Nối
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Not logged in - single login button
                  <Button
                    variant="gold"
                    onClick={() => setIsAuthDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Đăng Nhập
                  </Button>
                )}
              </div>

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

                {/* Mobile Auth Button */}
                <div className="pt-3 mt-2 border-t border-border/50">
                  {loading ? (
                    <div className="h-10 bg-muted animate-pulse rounded-md" />
                  ) : user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Hồ Sơ của tôi
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-2 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng Xuất
                      </Button>
                    </>
                  ) : isWalletConnected && walletAddress ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground">
                        <Wallet className="w-4 h-4 text-accent" />
                        <span className="font-mono">{formatAddress(walletAddress)}</span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Hồ Sơ
                      </Link>
                    </>
                  ) : (
                    <Button
                      variant="gold"
                      onClick={() => {
                        setIsAuthDialogOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Đăng Nhập
                    </Button>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </div>
      </motion.header>

      {/* Auth Dialog */}
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        onWalletConnect={onConnectWallet}
        isConnectingWallet={isConnectingWallet}
        connectingWalletType={connectingWalletType}
      />
    </>
  );
}
