import { useState, useEffect, useCallback, useRef } from "react";

export function useCountdown(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  const totalSeconds = initialSeconds;
  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  const start = useCallback(() => {
    if (seconds > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  }, [seconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds) => {
    const time = newSeconds ?? initialSeconds;
    setSeconds(time);
    setIsRunning(true);
    setIsCompleted(false);
  }, [initialSeconds]);

  const skip = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
    setIsCompleted(true);
  }, []);

  const formatTime = useCallback((secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  return {
    seconds,
    totalSeconds,
    progress,
    isRunning,
    isCompleted,
    start,
    pause,
    reset,
    skip,
    formatTime,
  };
}

export function calculateReadingTime(text) {
  if (!text) return 60;

  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeInlineRegex = /`[^`]+`/g;

  const codeBlocks = text.match(codeBlockRegex) || [];
  const codeInline = text.match(codeInlineRegex) || [];

  const codeText = codeBlocks.join(" ") + " " + codeInline.join(" ");
  const plainText = text.replace(codeBlockRegex, " ").replace(codeInlineRegex, " ");

  const plainCharCount = plainText.replace(/\s/g, "").length;
  const codeLineCount = codeText.split("\n").length;

  const plainTime = plainCharCount / 350;
  const codeTime = codeLineCount / 120;
  const totalMinutes = (plainTime + codeTime) * 1.3;

  const minutes = Math.ceil(totalMinutes);

  const thresholds = [
    { max: 500, time: 1 },
    { max: 1000, time: 2 },
    { max: 1500, time: 3 },
    { max: 2500, time: 4 },
    { max: 4000, time: 5 },
    { max: Infinity, time: 6 },
  ];

  for (const threshold of thresholds) {
    if (plainCharCount <= threshold.max) {
      return threshold.time * 60;
    }
  }

  return Math.max(60, Math.min(minutes * 60, 360));
}
