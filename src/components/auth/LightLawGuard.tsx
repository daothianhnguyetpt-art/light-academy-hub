import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useConfetti } from "@/contexts/ConfettiContext";
import { LightLawModal } from "./LightLawModal";

interface LightLawGuardProps {
  children: ReactNode;
}

export function LightLawGuard({ children }: LightLawGuardProps) {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, acceptLightLaw } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    // Only check when auth and profile have finished loading
    if (authLoading || profileLoading) return;

    // User is logged in but hasn't accepted Light Law
    if (user && profile && !profile.light_law_accepted_at) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [user, profile, authLoading, profileLoading]);

  const handleAccept = async () => {
    const success = await acceptLightLaw();
    if (success) {
      localStorage.setItem("light_law_accepted", "true");
      setShowModal(false);
      // Trigger celebration after accepting Light Law
      triggerConfetti();
    }
  };

  const handleContinueAsGuest = async () => {
    await signOut();
    setShowModal(false);
  };

  const handleClose = async () => {
    // Closing modal = choosing guest mode
    await signOut();
    setShowModal(false);
  };

  return (
    <>
      {children}
      <LightLawModal
        open={showModal}
        onAccept={handleAccept}
        onContinueAsGuest={handleContinueAsGuest}
        onClose={handleClose}
      />
    </>
  );
}
