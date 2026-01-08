import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DemocratizationSection } from "@/components/landing/DemocratizationSection";
import { Web3Section } from "@/components/landing/Web3Section";
import { EcosystemRoleSection } from "@/components/landing/EcosystemRoleSection";
import { Footer } from "@/components/landing/Footer";
import { useWallet } from "@/hooks/useWallet";

const Index = () => {
  const { isConnected, address, isConnecting, connectingWallet, connectWallet } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnectWallet={connectWallet}
        isWalletConnected={isConnected}
        walletAddress={address ?? undefined}
        isConnectingWallet={isConnecting}
        connectingWalletType={connectingWallet}
      />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DemocratizationSection />
        <Web3Section />
        <EcosystemRoleSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
