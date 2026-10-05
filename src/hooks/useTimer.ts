import { useEffect, useRef, useState } from "react";

export function useTimer(running = true) {
  const [seconds, setSeconds] = useState(0);
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      baseRef.current += 1;
      setSeconds(baseRef.current);
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  return seconds;
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}