import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Wallet, LogOut, User, ChevronDown, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { WalletType } from "@/components/auth/WalletOptions";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/i18n";
import funAcademyLogo from "@/assets/fun-academy-logo.jpg";

interface HeaderProps {
  onConnectWallet: (walletType: WalletType) => Promise<void>;
  isWalletConnected: boolean;
  walletAddress?: string;
  isConnectingWallet?: boolean;
  connectingWalletType?: WalletType | null;
}

// FUN Academy dropdown items
const funAcademyItems = [
  { href: "/", key: "aboutFunAcademy" },
  { href: "/light-law", key: "lightLaw" },
  { href: "/whitepaper", key: "whitepaper" },
];

// Main navigation links
const mainNavLinks = [
  { href: "/social-feed", key: "socialFeed" },
  { href: "/video-library", key: "videoLibrary" },
  { href: "/live-classes", key: "liveClasses" },
  { href: "/library", key: "library" },
  { href: "/global-schools", key: "globalSchools" },
];

export function Header({ 
  onConnectWallet, 
  isWalletConnected, 
  walletAddress,
  isConnectingWallet = false,
  connectingWalletType = null,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFunAcademyOpen, setIsFunAcademyOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { t } = useTranslation();
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
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <span className="font-display font-semibold text-base sm:text-xl text-foreground">
                FUN Academy
              </span>
            </Link>

            {/* Mobile Menu Button - Right side */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* FUN Academy Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-accent/50">
                      {t("nav.funAcademy")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-1 p-2 w-[200px]">
                        {funAcademyItems.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {t(`nav.${item.key}`)}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Main Links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </nav>

            {/* Language Selector + Auth Button */}
            <div className="flex items-center gap-2">
              <LanguageSelector />
              
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
                        {t("common.myProfile")}
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate("/admin")}>
                            <Shield className="w-4 h-4 mr-2" />
                            {t("admin.dashboard")}
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("common.logout")}
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
                        {t("common.myProfile")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.location.reload()}>
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("common.disconnect")}
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
                    {t("common.login")}
                  </Button>
                )}
              </div>

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
                {/* FUN Academy Collapsible */}
                <Collapsible open={isFunAcademyOpen} onOpenChange={setIsFunAcademyOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors">
                    <span>{t("nav.funAcademy")}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      isFunAcademyOpen && "rotate-180"
                    )} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4">
                    {funAcademyItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        {t(`nav.${item.key}`)}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Main Links */}
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                  >
                    {t(`nav.${link.key}`)}
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
                        {t("common.myProfile")}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          {t("admin.dashboard")}
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-2 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("common.logout")}
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
                        {t("common.myProfile")}
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
                      {t("common.login")}
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
