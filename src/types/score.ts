export type Score = {
  userId: string;
  problemId: string;
  language: string;
  elapsedSeconds: number;
  source?: "practice" | "duel";
};

export type LeaderboardRow = {
  rank: number;
  user_id: string;
  username: string;
  language: string;
  best_seconds: number;
};

export type Duel = {
  id: string;
  problem_id: string;
  player1: string;
  player2: string | null;
  status: "waiting" | "active" | "finished" | "cancelled";
  started_at: string | null;
  finished_at: string | null;
  winner: string | null;
  winner_seconds: number | null;
};

export type DuelEvent = {
  id: number;
  duel_id: string;
  user_id: string;
  passed: number;
  total: number;
};
