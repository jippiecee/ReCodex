import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CodeEditor } from "../components/editor/CodeEditor";
import { useAuth } from "../context/AuthContext";
import { getProblem, randomProblem } from "../data/problems";
import { formatTime } from "../hooks/useTimer";
import {
  cancelDuel,
  fetchEvents,
  fetchMyOpenDuel,
  fetchUsername,
  findDuel,
  finishDuel,
  forfeitDuel,
  getServerOffset,
  reportProgress,
  subscribeDuel,
} from "../lib/duels";
import { runCode, warmupPython } from "../lib/runner";
import type { Language } from "../types/problem";
import type { Duel, DuelEvent } from "../types/score";

export function DuelPage() {
  const { user, profile } = useAuth();
  const me = user!.id;
  const myName = profile?.username ?? "Kamu";

  const [duel, setDuel] = useState<Duel | null>(null);
  const [booting, setBooting] = useState(true);
  const [events, setEvents] = useState<DuelEvent[]>([]);
  const [oppName, setOppName] = useState("Lawan");
  const [offset, setOffset] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const duelRef = useRef<Duel | null>(null);
  duelRef.current = duel;

  const problem = duel ? getProblem(duel.problem_id) : null;
  const oppId = duel ? (duel.player1 === me ? duel.player2 : duel.player1) : null;

  const mergeEvent = useCallback((e: DuelEvent) => {
    setEvents((prev) => (prev.some((x) => x.id === e.id) ? prev : [...prev, e].sort((a, b) => a.id - b.id)));
  }, []);

  const applyDuel = useCallback((d: Duel) => {
    setDuel((prev) => (prev && prev.id !== d.id ? prev : d));
  }, []);

  // Lanjutkan duel yang masih jalan (misal habis refresh)
  useEffect(() => {
    fetchMyOpenDuel()
      .then((d) => {
        if (d && d.status === "active") setDuel(d);
        else if (d && d.status === "waiting") cancelDuel(d.id);
      })
      .finally(() => setBooting(false));
  }, []);

  // Batalkan antrean kalau pindah tab saat masih mencari lawan
  useEffect(() => {
    return () => {
      const d = duelRef.current;
      if (d && d.status === "waiting") cancelDuel(d.id);
    };
  }, []);

  // Realtime + data pendukung untuk satu duel
  const duelId = duel?.id;
  useEffect(() => {
    if (!duelId) return;
    setEvents([]);
    fetchEvents(duelId).then((evs) => evs.forEach(mergeEvent));
    getServerOffset().then(setOffset);
    return subscribeDuel(duelId, applyDuel, mergeEvent);
  }, [duelId, applyDuel, mergeEvent]);

  useEffect(() => {
    if (oppId) fetchUsername(oppId).then(setOppName);
  }, [oppId]);

  // Kode awal saat duel mulai
  const startedFor = useRef<string | null>(null);
  useEffect(() => {
    if (duel?.status === "active" && problem && startedFor.current !== duel.id) {
      startedFor.current = duel.id;
      setCode(problem.starterCode[language]);
      setNote(null);
    }
  }, [duel?.status, duel?.id, problem, language]);

  // Tick timer
  useEffect(() => {
    if (duel?.status !== "active") return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [duel?.status]);

  async function search() {
    setError(null);
    setEvents([]);
    try {
      const d = await findDuel(randomProblem().id);
      setDuel(d);
    } catch {
      setError("Gagal mencari lawan. Pastikan schema.sql sudah dijalankan di Supabase.");
    }
  }

  async function cancel() {
    if (duel) await cancelDuel(duel.id);
    setDuel(null);
  }

  async function giveUp() {
    if (!duel) return;
    try {
      applyDuel(await forfeitDuel(duel.id));
    } catch {
      setError("Gagal menyerah, coba lagi.");
    }
  }

  function changeLanguage(value: Language) {
    setLanguage(value);
    if (problem) setCode(problem.starterCode[value]);
    if (value === "python") warmupPython();
  }

  async function submit() {
    if (!duel || !problem || busy || duel.status !== "active") return;
    setBusy(true);
    setNote("Memeriksa semua test...");
    const res = await runCode(language, code, problem.tests, problem.kind);
    await reportProgress(duel.id, res.passed, res.total);

    if (res.passed === res.total) {
      try {
        applyDuel(await finishDuel(duel.id, language));
        setNote(null);
      } catch {
        setNote("Gagal mengirim hasil, coba kirim lagi.");
      }
    } else {
      setNote(
        res.error
          ? `Error: ${res.error}`
          : `Lolos ${res.passed} dari ${res.total} test. Coba lagi.`,
      );
    }
    setBusy(false);
  }

  const progress = useMemo(() => {
    const latest: Record<string, number> = {};
    for (const e of events) latest[e.user_id] = Math.round((e.passed / e.total) * 100);
    if (duel?.status === "finished" && duel.winner) latest[duel.winner] = 100;
    return latest;
  }, [events, duel]);

  if (booting) return <p className="empty">Memuat...</p>;

  // ---------- belum mulai ----------
  if (!duel || duel.status === "cancelled") {
    return (
      <section>
        <div className="simple-card mx-auto max-w-[560px] text-center">
          <h2>Duel 1v1</h2>
          <p className="auth-sub" style={{ margin: "0 auto 20px" }}>
            Kamu dan lawan mendapat soal yang sama. Siapa yang lolos semua test lebih dulu, menang.
          </p>
          {error && <div className="auth-msg error">{error}</div>}
          <button className="editor-button go" onClick={search}>Cari lawan</button>
        </div>
      </section>
    );
  }

  // ---------- mencari lawan ----------
  if (duel.status === "waiting") {
    return (
      <section>
        <div className="simple-card mx-auto max-w-[560px] text-center">
          <h2>Mencari lawan...</h2>
          <p className="auth-sub" style={{ margin: "0 auto 20px" }}>
            Tetap di halaman ini. Pertandingan mulai begitu ada pemain lain yang masuk.
          </p>
          <button className="editor-button" onClick={cancel}>Batal</button>
        </div>
      </section>
    );
  }

  // ---------- main / selesai ----------
  const finished = duel.status === "finished";
  const iWon = duel.winner === me;
  const startMs = duel.started_at ? new Date(duel.started_at).getTime() : now;
  const elapsed = finished
    ? (duel.winner_seconds ?? 0)
    : Math.max(0, Math.floor((now + offset - startMs) / 1000));

  const feed = events.map((e) => {
    const who = e.user_id === me ? "Kamu" : oppName;
    return `${who} lolos ${e.passed} dari ${e.total} test`;
  });

  return (
    <section>
      <div className="duel-head">
        <Player name={myName} letter={myName[0]?.toUpperCase() ?? "K"} pct={progress[me] ?? 0} />
        <div className="text-center">
          <div className="timer" style={{ margin: 0 }}>{formatTime(elapsed)}</div>
          {finished && (
            <div className={`duel-result ${iWon ? "win" : "lose"}`}>
              {iWon ? "Kamu menang" : `${oppName} menang`}
            </div>
          )}
        </div>
        <Player
          name={oppName}
          letter={oppName[0]?.toUpperCase() ?? "L"}
          pct={progress[oppId ?? ""] ?? 0}
          opponent
        />
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-10 max-[820px]:grid-cols-1 max-[820px]:gap-6">
        <div className="simple-card">
          <h2>{problem!.title}</h2>
          <p className="mb-5 text-sm leading-6 text-[#cfd2dc]">{problem!.description}</p>
          <div className="section-label">Contoh</div>
          <div className="feed" style={{ marginBottom: 20 }}>
            {problem!.examples.map((ex) => (
              <div key={ex.input} className="font-mono">{ex.input} → {ex.output}</div>
            ))}
          </div>
          <div className="section-label">Aktivitas</div>
          <div className="feed">
            <div>Pertandingan dimulai. Soal sama untuk kalian berdua.</div>
            {feed.map((line, i) => <div key={i}>{line}</div>)}
            {finished && (
              <div>
                {iWon
                  ? `Kamu menang dalam ${formatTime(duel.winner_seconds ?? 0)}`
                  : `${oppName} menang`}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <select
              aria-label="Bahasa"
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              disabled={finished}
              className="rounded-lg border border-line bg-panel px-3.5 py-2 text-text outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          <CodeEditor language={language} value={code} onChange={setCode} />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!finished ? (
              <>
                <button className="editor-button go" onClick={submit} disabled={busy}>
                  Kirim jawaban
                </button>
                <button className="editor-button" onClick={giveUp} disabled={busy}>
                  Menyerah
                </button>
              </>
            ) : (
              <button
                className="editor-button go"
                onClick={() => {
                  setDuel(null);
                  setEvents([]);
                  setNote(null);
                }}
              >
                Main lagi
              </button>
            )}
            <span className="text-sm text-muted">{note ?? "Lawanmu melihat progres test, bukan kodemu."}</span>
          </div>
          {error && <div className="auth-msg error" style={{ marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </section>
  );
}

function Player({
  name,
  letter,
  pct,
  opponent,
}: {
  name: string;
  letter: string;
  pct: number;
  opponent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${opponent ? "flex-row-reverse text-right" : ""}`}>
      <div className={`avatar ${opponent ? "opponent" : ""}`}>{letter}</div>
      <div>
        <b>{name}</b>
        <div className="progress"><i style={{ width: `${pct}%` }} /></div>
      </div>
    </div>
  );
}