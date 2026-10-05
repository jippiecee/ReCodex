import { supabase } from "./supabase";
import type { Score } from "../types/score";

export async function saveScore(score: Score) {
  if (!supabase) {
    console.warn("Supabase belum dikonfigurasi.");
    return { data: null, error: null };
  }

  return supabase.from("scores").insert(score).select().single();
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