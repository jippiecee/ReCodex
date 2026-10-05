import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Profile = { id: string; username: string };

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  recovering: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthState | null>(null);

function translateError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email atau password salah.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Email ini sudah terdaftar. Coba masuk.";
  if (m.includes("email not confirmed")) return "Email belum dikonfirmasi. Cek inbox kamu.";
  if (m.includes("different from the old")) return "Password baru harus beda dari yang lama.";
  if (m.includes("password")) return "Password minimal 6 karakter.";
  if (m.includes("rate limit")) return "Terlalu banyak percobaan, coba lagi sebentar.";
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      setSession(next);
      if (!next) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Ambil profil (username) setiap user berubah
  const userId = session?.user.id;
  useEffect(() => {
    if (!supabase || !userId) return;
    let cancelled = false;

    (async () => {
      // trigger di DB membuat profil saat signup; retry sebentar kalau belum muncul
      for (let i = 0; i < 4; i++) {
        const { data } = await supabase!
          .from("profiles")
          .select("id, username")
          .eq("id", userId)
          .maybeSingle();
        if (cancelled) return;
        if (data) {
          setProfile(data as Profile);
          break;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return "Supabase belum dikonfigurasi.";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? translateError(error.message) : null;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, username: string) => {
      if (!supabase) return { error: "Supabase belum dikonfigurasi.", needsConfirm: false };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) return { error: translateError(error.message), needsConfirm: false };
      // kalau "Confirm email" aktif di Supabase, session kosong sampai user klik link
      return { error: null, needsConfirm: !data.session };
    },
    [],
  );

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) return "Supabase belum dikonfigurasi.";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return error ? translateError(error.message) : null;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return "Supabase belum dikonfigurasi.";
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return translateError(error.message);
    window.history.replaceState(null, "", window.location.pathname);
    setRecovering(false);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      recovering,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
    }),
    [loading, session, profile, recovering, signIn, signUp, signOut, resetPassword, updatePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}