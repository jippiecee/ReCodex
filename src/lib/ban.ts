import { supabase } from "./supabase";

// Kembalikan waktu berakhirnya ban (ms) kalau masih dibanned, selain itu null
export async function fetchBannedUntil(userId: string): Promise<number | null> {
  const { data } = await supabase!
    .from("profiles")
    .select("banned_until")
    .eq("id", userId)
    .maybeSingle();
  const t = data?.banned_until ? new Date(data.banned_until as string).getTime() : 0;
  return t > Date.now() ? t : null;
}

// Lapor pelanggaran ke server: server yang menjatuhkan penalti (ban 5 jam + hilang dari peringkat)
export async function reportViolation(reason: string): Promise<number | null> {
  const { data, error } = await supabase!.rpc("report_violation", { p_reason: reason });
  if (error || !data) return null;
  return new Date(data as string).getTime();
}