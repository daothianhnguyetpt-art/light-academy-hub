import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { LiveClass } from "@/hooks/useLiveClasses";

interface CountdownTimerProps {
  targetClass: LiveClass | null;
  onViewDetails: (classItem: LiveClass) => void;
  onJoinNow: (classItem: LiveClass) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetClass, onViewDetails, onJoinNow }: CountdownTimerProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarting, setIsStarting] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!targetClass) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetClass.scheduled_at).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsLive(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      // Less than 5 minutes = starting soon
      if (diff <= 5 * 60 * 1000) {
        setIsStarting(true);
      } else {
        setIsStarting(false);
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    setIsLive(targetClass.status === 'live');

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetClass]);

  if (!targetClass) return null;

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-xl sm:text-3xl font-bold ${
          isStarting 
            ? "bg-gradient-to-br from-gold to-gold-muted text-foreground shadow-lg shadow-gold/30" 
            : isLive
            ? "bg-destructive text-destructive-foreground"
            : "bg-card border border-border text-foreground"
        }`}
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <span className="text-[10px] sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 font-medium">{label}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${
        isLive 
          ? "bg-destructive/10 border-destructive/30" 
          : isStarting
          ? "bg-gradient-to-r from-gold/10 to-gold-muted/10 border-gold/30"
          : "bg-card border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        {isLive ? (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-destructive-foreground" />
            {t("liveClasses.countdown.happeningNow")}
          </span>
        ) : isStarting ? (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold text-foreground text-sm font-medium animate-pulse">
            <Sparkles className="w-4 h-4" />
            {t("liveClasses.countdown.starting")}
          </span>
        ) : (
          <span className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            {t("liveClasses.countdown.nextSession")}
          </span>
        )}
      </div>

      {/* Class Title */}
      <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-6">
        {targetClass.title}
      </h3>

      {/* Countdown Boxes */}
      {!isLive && (
        <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <TimeBox value={timeLeft.days} label={t("liveClasses.countdown.days")} />
          <TimeBox value={timeLeft.hours} label={t("liveClasses.countdown.hours")} />
          <TimeBox value={timeLeft.minutes} label={t("liveClasses.countdown.minutes")} />
          <TimeBox value={timeLeft.seconds} label={t("liveClasses.countdown.seconds")} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(targetClass)}
        >
          {t("liveClasses.classDetails")}
        </Button>
        {(isLive || isStarting) && targetClass.meeting_url && (
          <Button 
            variant="gold" 
            size="sm"
            onClick={() => onJoinNow(targetClass)}
          >
            {t("liveClasses.joinNow")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
