import { formatTime } from "../../hooks/useTimer";

export function Timer({ seconds }: { seconds: number }) {
  return <span className="timer">{formatTime(seconds)}</span>;
}