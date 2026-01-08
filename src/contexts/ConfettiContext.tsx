import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Confetti } from "@/components/effects/Confetti";

interface ConfettiContextType {
  triggerConfetti: () => void;
}

const ConfettiContext = createContext<ConfettiContextType>({
  triggerConfetti: () => {},
});

export function useConfetti() {
  return useContext(ConfettiContext);
}

interface ConfettiProviderProps {
  children: ReactNode;
}

export function ConfettiProvider({ children }: ConfettiProviderProps) {
  const [isActive, setIsActive] = useState(false);

  const triggerConfetti = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleComplete = useCallback(() => {
    setIsActive(false);
  }, []);

  // Listen for auth celebration events (for Google login redirect)
  useEffect(() => {
    const handleCelebration = () => {
      triggerConfetti();
    };

    window.addEventListener("auth:celebration", handleCelebration);
    return () => window.removeEventListener("auth:celebration", handleCelebration);
  }, [triggerConfetti]);

  return (
    <ConfettiContext.Provider value={{ triggerConfetti }}>
      {children}
      <Confetti isActive={isActive} onComplete={handleComplete} />
    </ConfettiContext.Provider>
  );
}
