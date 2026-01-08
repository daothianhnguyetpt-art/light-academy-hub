import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  size: number;
  color: string;
  rotation: number;
  type: "circle" | "star";
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const COLORS = [
  "hsl(45 60% 52%)",    // gold
  "hsl(45 70% 60%)",    // light gold
  "hsl(38 75% 55%)",    // amber
  "hsl(48 80% 65%)",    // warm yellow
  "hsl(42 65% 50%)",    // darker gold
];

function generateConfettiPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    size: 8 + Math.random() * 12,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    type: Math.random() > 0.5 ? "circle" : "star",
  }));
}

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      setPieces(generateConfettiPieces(40));
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: piece.rotation,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: "110vh",
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0.8, 0],
                scale: [1, 1.1, 0.9, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 3 + Math.random() * 1.5,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute"
              style={{ willChange: "transform, opacity" }}
            >
              {piece.type === "circle" ? (
                <div
                  className="rounded-full"
                  style={{
                    width: piece.size,
                    height: piece.size,
                    backgroundColor: piece.color,
                    boxShadow: `0 0 ${piece.size / 2}px ${piece.color}`,
                  }}
                />
              ) : (
                <svg
                  width={piece.size}
                  height={piece.size}
                  viewBox="0 0 24 24"
                  fill={piece.color}
                  style={{ filter: `drop-shadow(0 0 ${piece.size / 3}px ${piece.color})` }}
                >
                  <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
