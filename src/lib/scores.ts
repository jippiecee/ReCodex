import { supabase } from "./supabase";
import type { LeaderboardRow, Score } from "../types/score";

export async function saveScore(score: Score) {
  if (!supabase) return { data: null, error: new Error("Supabase belum dikonfigurasi") };

  return supabase
    .from("scores")
    .insert({
      user_id: score.userId,
      problem_id: score.problemId,
      language: score.language,
      elapsed_seconds: Math.max(1, Math.round(score.elapsedSeconds)),
      source: score.source ?? "practice",
    })
    .select()
    .single();
}

export async function getBestScore(userId: string, problemId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("scores")
    .select("elapsed_seconds")
    .eq("user_id", userId)
    .eq("problem_id", problemId)
    .order("elapsed_seconds", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data.elapsed_seconds as number;
}

export async function getLeaderboard(
  problemId: string,
  days: number | null,
): Promise<LeaderboardRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_leaderboard", {
    p_problem: problemId,
    p_days: days,
  });
  if (error) throw error;
  return (data ?? []) as LeaderboardRow[];
}

export async function getProblemStats(problemId: string) {
  if (!supabase) return null;
  const { data } = await supabase.rpc("get_problem_stats", { p_problem: problemId });
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || row.avg_seconds == null) return null;
  return { avgSeconds: Number(row.avg_seconds), players: Number(row.players) };
}
