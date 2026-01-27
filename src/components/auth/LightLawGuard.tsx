import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { LightLawRedirectModal } from "./LightLawRedirectModal";

interface LightLawGuardProps {
  children: ReactNode;
}

export function LightLawGuard({ children }: LightLawGuardProps) {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Wait for auth and profile to finish loading
    if (authLoading || profileLoading) return;

    // User is logged in but hasn't accepted Light Law
    if (user && profile && !profile.light_law_accepted_at) {
      // Don't show modal if already on /light-law page
      if (location.pathname !== "/light-law") {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    } else {
      setShowModal(false);
    }
  }, [user, profile, authLoading, profileLoading, location.pathname]);

  const handleConfirm = () => {
    setShowModal(false);
    navigate("/light-law");
  };

  const handleContinueAsGuest = async () => {
    setShowModal(false);
    await signOut();
    // Stay on current page as guest
  };

  return (
    <>
      {children}
      <LightLawRedirectModal
        open={showModal}
        onConfirm={handleConfirm}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </>
  );
}
