import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Web3Section } from "@/components/landing/Web3Section";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";

const Index = () => {
  const { isConnected, address, connectWallet } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnectWallet={connectWallet}
        isWalletConnected={isConnected}
        walletAddress={address ?? undefined}
      />
      <main>
        <HeroSection />
        <FeaturesSection />
        <Web3Section />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
