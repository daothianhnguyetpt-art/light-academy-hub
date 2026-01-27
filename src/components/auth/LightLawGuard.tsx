import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface LightLawGuardProps {
  children: ReactNode;
}

export function LightLawGuard({ children }: LightLawGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait for auth and profile to finish loading
    if (authLoading || profileLoading) return;

    // User is logged in but hasn't accepted Light Law
    if (user && profile && !profile.light_law_accepted_at) {
      // Avoid redirect loop if already on /light-law page
      if (location.pathname !== "/light-law") {
        navigate("/light-law");
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate, location.pathname]);

  return <>{children}</>;
}
