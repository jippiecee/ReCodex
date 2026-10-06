import { supabase } from "./supabase";
import type { Duel, DuelEvent } from "../types/score";

export async function findDuel(problemId: string): Promise<Duel> {
  const { data, error } = await supabase!.rpc("find_duel", { p_problem: problemId });
  if (error) throw error;
  return data as Duel;
}

export async function cancelDuel(duelId: string) {
  await supabase?.rpc("cancel_duel", { p_duel: duelId });
}

export async function reportProgress(duelId: string, passed: number, total: number, round: number) {
  await supabase?.rpc("duel_progress", {
    p_duel: duelId,
    p_passed: passed,
    p_total: total,
    p_round: round,
  });
}

export async function finishDuel(
  duelId: string,
  language: string,
  round: number,
  nextProblem: string,
): Promise<Duel> {
  const { data, error } = await supabase!.rpc("duel_finish", {
    p_duel: duelId,
    p_language: language,
    p_round: round,
    p_next_problem: nextProblem,
  });
  if (error) throw error;
  return data as Duel;
}

export async function forfeitDuel(duelId: string): Promise<Duel> {
  const { data, error } = await supabase!.rpc("duel_forfeit", { p_duel: duelId });
  if (error) throw error;
  return data as Duel;
}

export async function fetchMyOpenDuel(): Promise<Duel | null> {
  const { data } = await supabase!
    .from("duels")
    .select("*")
    .in("status", ["waiting", "active"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Duel) ?? null;
}

export async function fetchDuel(duelId: string): Promise<Duel | null> {
  const { data } = await supabase!.from("duels").select("*").eq("id", duelId).maybeSingle();
  return (data as Duel) ?? null;
}

export async function fetchEvents(duelId: string): Promise<DuelEvent[]> {
  const { data } = await supabase!
    .from("duel_events")
    .select("*")
    .eq("duel_id", duelId)
    .order("id", { ascending: true });
  return (data ?? []) as DuelEvent[];
}

export async function fetchUsername(userId: string): Promise<string> {
  const { data } = await supabase!
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();
  return data?.username ?? "Lawan";
}

// Selisih jam server vs jam browser (ms), supaya timer duel sinkron
export async function getServerOffset(): Promise<number> {
  const t0 = Date.now();
  const { data } = await supabase!.rpc("server_now");
  const t1 = Date.now();
  if (!data) return 0;
  return new Date(data as string).getTime() - (t0 + t1) / 2;
}

// Realtime + polling cadangan (kalau Realtime belum diaktifkan di tabel)
export function subscribeDuel(
  duelId: string,
  onDuel: (d: Duel) => void,
  onEvent: (e: DuelEvent) => void,
) {
  const channel = supabase!
    .channel(`duel:${duelId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "duels", filter: `id=eq.${duelId}` },
      (payload) => onDuel(payload.new as Duel),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "duel_events", filter: `duel_id=eq.${duelId}` },
      (payload) => onEvent(payload.new as DuelEvent),
    )
    .subscribe();

  const poll = window.setInterval(async () => {
    const [d, evs] = await Promise.all([fetchDuel(duelId), fetchEvents(duelId)]);
    if (d) onDuel(d);
    evs.forEach(onEvent);
  }, 3000);

  return () => {
    window.clearInterval(poll);
    supabase!.removeChannel(channel);
  };
}