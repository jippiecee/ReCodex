import { useEffect, useState } from "react";
import { problems, todayProblem } from "../data/problems";
import { formatTime } from "../hooks/useTimer";
import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../lib/scores";
import type { LeaderboardRow } from "../types/score";

const periods = [
  { label: "Minggu ini", days: 7 },
  { label: "Bulan ini", days: 30 },
  { label: "Semua", days: null },
] as const;

const langLabel: Record<string, string> = { javascript: "JavaScript", python: "Python" };

export function LeaderboardPage() {
  const { user } = useAuth();
  const [problemId, setProblemId] = useState(todayProblem.id);
  const [period, setPeriod] = useState(0);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    getLeaderboard(problemId, periods[period].days)
      .then((r) => {
        if (cancelled) return;
        setRows(r);
        setState("ok");
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
  }, [problemId, period]);

  return (
    <section>
      <div className="simple-card mx-auto max-w-[720px]">
        <div className="chips" style={{ justifyContent: "space-between" }}>
          <div className="chips" style={{ margin: 0 }}>
            {periods.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPeriod(i)}
                className={`chip chip-button ${i === period ? "hot" : ""}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <select
            aria-label="Soal"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
            className="rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-text outline-none"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {state === "loading" && <p className="empty">Memuat peringkat...</p>}
        {state === "error" && (
          <p className="empty">Gagal memuat peringkat. Pastikan schema.sql sudah dijalankan.</p>
        )}
        {state === "ok" && rows.length === 0 && (
          <p className="empty">Belum ada yang menyelesaikan soal ini. Jadilah yang pertama.</p>
        )}
        {state === "ok" && rows.length > 0 && (
          <table className="leaderboard">
            <thead>
              <tr><th>#</th><th>Pemain</th><th>Bahasa</th><th>Waktu</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.user_id} className={row.user_id === user?.id ? "me" : ""}>
                  <td>{row.rank}</td>
                  <td>{row.user_id === user?.id ? `${row.username} (kamu)` : row.username}</td>
                  <td>{langLabel[row.language] ?? row.language}</td>
                  <td className="mono blue">{formatTime(row.best_seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
