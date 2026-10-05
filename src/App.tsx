import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { isSupabaseConfigured } from "./lib/supabase";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { PracticePage } from "./pages/PracticePage";
import { DuelPage } from "./pages/DuelPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

export type AppTab = "practice" | "duel" | "leaderboard";

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

// Pertama masuk website: wajib login dulu.
function Gate() {
  const { loading, session, recovering } = useAuth();

  if (!isSupabaseConfigured) return <SetupNotice />;
  if (loading) return <div className="splash"><span className="logo-dot" /></div>;
  if (recovering) return <ResetPasswordPage />;
  if (!session) return <LoginPage />;
  return <Shell />;
}

function Shell() {
  const [tab, setTab] = useState<AppTab>("practice");

  return (
    <>
      <Navbar tab={tab} onTabChange={setTab} />
      <main className="mx-auto w-full max-w-[1040px] px-5 pb-12 pt-8">
        {tab === "practice" && <PracticePage />}
        {tab === "duel" && <DuelPage />}
        {tab === "leaderboard" && <LeaderboardPage />}
      </main>
    </>
  );
}

function SetupNotice() {
  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <h1>Supabase belum dikonfigurasi</h1>
        <p className="auth-sub">
          Salin <code>.env.example</code> jadi <code>.env</code>, isi{" "}
          <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>, lalu restart{" "}
          <code>npm run dev</code>.
        </p>
      </div>
    </main>
  );
}