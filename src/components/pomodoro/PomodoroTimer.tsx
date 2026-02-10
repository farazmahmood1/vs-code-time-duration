import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import {
  useSavePomodoroSession,
  type PomodoroSettings,
} from "@/hooks/usePomodoro";

type Phase = "focus" | "shortBreak" | "longBreak";

interface PomodoroTimerProps {
  settings: PomodoroSettings;
}

export function PomodoroTimer({ settings }: PomodoroTimerProps) {
  const [phase, setPhase] = useState<Phase>("focus");
  const [round, setRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  const startedAtRef = useRef<string | null>(null);
  const saveSession = useSavePomodoroSession();

  const totalSeconds =
    phase === "focus"
      ? settings.focusDuration * 60
      : phase === "shortBreak"
        ? settings.breakDuration * 60
        : settings.longBreakDuration * 60;

  const progress =
    totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setPhase("focus");
    setRound(1);
    setSecondsLeft(settings.focusDuration * 60);
    setTotalFocusSeconds(0);
    startedAtRef.current = null;
  }, [settings.focusDuration]);

  const handlePhaseComplete = useCallback(() => {
    setIsRunning(false);
    if (phase === "focus") {
      if (round >= settings.roundsBeforeLongBreak) {
        // All rounds complete - go to long break
        setPhase("longBreak");
        setSecondsLeft(settings.longBreakDuration * 60);
      } else {
        setPhase("shortBreak");
        setSecondsLeft(settings.breakDuration * 60);
      }
    } else {
      // Break complete - next round or session complete
      if (round >= settings.roundsBeforeLongBreak) {
        // Session complete
        saveSession.mutate({
          focusDuration: settings.focusDuration,
          breakDuration: settings.breakDuration,
          longBreakDuration: settings.longBreakDuration,
          totalRounds: settings.roundsBeforeLongBreak,
          completedRounds: round,
          totalFocusMinutes: Math.round(totalFocusSeconds / 60),
          status: "COMPLETED",
          startedAt: startedAtRef.current || new Date().toISOString(),
          endedAt: new Date().toISOString(),
        });
        handleReset();
        return;
      }
      setRound((r) => r + 1);
      setPhase("focus");
      setSecondsLeft(settings.focusDuration * 60);
    }
  }, [
    phase,
    round,
    settings,
    totalFocusSeconds,
    saveSession,
    handleReset,
  ]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handlePhaseComplete();
          return 0;
        }
        if (phase === "focus") {
          setTotalFocusSeconds((f) => f + 1);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, phase, handlePhaseComplete]);

  const handleStart = () => {
    if (!startedAtRef.current) startedAtRef.current = new Date().toISOString();
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleSkip = () => {
    setIsRunning(false);
    handlePhaseComplete();
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const phaseLabel =
    phase === "focus"
      ? "Focus"
      : phase === "shortBreak"
        ? "Short Break"
        : "Long Break";
  const phaseColor = phase === "focus" ? "text-primary" : "text-green-500";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width="280" height="280" className="-rotate-90">
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={phase === "focus" ? "text-primary" : "text-green-500"}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 1s linear",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-sm font-medium ${phaseColor}`}>
            {phaseLabel}
          </span>
          <span className="text-5xl font-bold tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            Round {round} of {settings.roundsBeforeLongBreak}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button size="icon" variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        {isRunning ? (
          <Button size="lg" onClick={handlePause} className="w-24">
            <Pause className="h-5 w-5 mr-1" /> Pause
          </Button>
        ) : (
          <Button size="lg" onClick={handleStart} className="w-24">
            <Play className="h-5 w-5 mr-1" /> Start
          </Button>
        )}
        <Button size="icon" variant="outline" onClick={handleSkip}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
