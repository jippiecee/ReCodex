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

// Soal ronde berikutnya: acak, tapi usahakan beda dari soal sekarang
function nextProblemId(currentId: string) {
  for (let i = 0; i < 5; i++) {
    const p = randomProblem();
    if (p.id !== currentId) return p.id;
  }
  return randomProblem().id;
}

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
  const [roundNote, setRoundNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const duelRef = useRef<Duel | null>(null);
  duelRef.current = duel;

  const problem = duel ? getProblem(duel.problem_id) : null;
  const oppId = duel ? (duel.player1 === me ? duel.player2 : duel.player1) : null;

  const mergeEvent = useCallback((e: DuelEvent) => {
    setEvents((prev) => (prev.some((x) => x.id === e.id) ? prev : [...prev, e].sort((a, b) => a.id - b.id)));
  }, []);

  // Abaikan data basi (ronde lebih lama / duel yang sudah selesai)
  const applyDuel = useCallback((d: Duel) => {
    setDuel((prev) => {
      if (prev && prev.id !== d.id) return prev;
      if (prev && (prev.status === "finished" || d.round < prev.round)) return prev;
      return d;
    });
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

  // Kode awal tiap ronde baru (soal berganti)
  const startedFor = useRef<string | null>(null);
  useEffect(() => {
    if (duel?.status !== "active" || !problem) return;
    const key = `${duel.id}:${duel.round}`;
    if (startedFor.current === key) return;
    startedFor.current = key;
    setCode(problem.starterCode[language]);
    setNote(null);
  }, [duel?.status, duel?.id, duel?.round, problem, language]);

  // Info "poin buat siapa" tiap kali skor berubah
  const prevScore = useRef<{ id: string; p1: number; p2: number } | null>(null);
  useEffect(() => {
    if (!duel) {
      prevScore.current = null;
      return;
    }
    const prev = prevScore.current;
    if (prev && prev.id === duel.id && duel.status === "active") {
      const p1Took = duel.p1_score > prev.p1;
      const p2Took = duel.p2_score > prev.p2;
      if (p1Took || p2Took) {
        const iTook = p1Took === (duel.player1 === me);
        setRoundNote(iTook ? "Poin buat kamu!" : `${oppName} ambil poin ronde ini`);
        window.setTimeout(() => setRoundNote(null), 3500);
      }
    }
    prevScore.current = { id: duel.id, p1: duel.p1_score, p2: duel.p2_score };
  }, [duel, me, oppName]);

  // Tick timer
  useEffect(() => {
    if (duel?.status !== "active") return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [duel?.status]);

  async function search() {
    setError(null);
    setEvents([]);
    setRoundNote(null);
    try {
      const d = await findDuel(randomProblem().id);
      setDuel(d);
    } catch {
      setError("Gagal mencari lawan. Pastikan migration-bo5.sql sudah dijalankan di Supabase.");
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

  const roundStartMs = duel
    ? new Date(duel.round_started_at ?? duel.started_at ?? Date.now()).getTime()
    : 0;
  const countdown = Math.ceil((roundStartMs - (now + offset)) / 1000);
  const inBreak = !!duel && duel.status === "active" && countdown > 0;

  async function submit() {
    if (!duel || !problem || busy || duel.status !== "active" || inBreak) return;
    const round = duel.round;
    setBusy(true);
    setNote("Memeriksa semua test...");
    const res = await runCode(language, code, problem.tests, problem.kind);
    await reportProgress(duel.id, res.passed, res.total, round);

    if (res.passed === res.total) {
      try {
        applyDuel(await finishDuel(duel.id, language, round, nextProblemId(problem.id)));
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

  // Progres test hanya untuk ronde yang sedang jalan
  const currentRound = duel?.round ?? 1;
  const progress = useMemo(() => {
    const latest: Record<string, number> = {};
    for (const e of events) {
      if (e.round === currentRound) latest[e.user_id] = Math.round((e.passed / e.total) * 100);
    }
    return latest;
  }, [events, currentRound]);

  if (booting) return <p className="empty">Memuat...</p>;

  // ---------- belum mulai ----------
  if (!duel || duel.status === "cancelled") {
    return (
      <section>
        <div className="simple-card mx-auto max-w-[560px] text-center">
          <h2>Duel 1v1</h2>
          <p className="auth-sub" style={{ margin: "0 auto 20px" }}>
            Kamu dan lawan mendapat soal yang sama tiap ronde. Siapa yang lolos semua test lebih
            dulu dapat 1 poin. Yang pertama mencapai 4 poin, menang.
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
  const imP1 = duel.player1 === me;
  const myScore = imP1 ? duel.p1_score : duel.p2_score;
  const oppScore = imP1 ? duel.p2_score : duel.p1_score;
  const elapsed = finished
    ? (duel.winner_seconds ?? 0)
    : Math.max(0, Math.floor((now + offset - roundStartMs) / 1000));

  const myPct = finished && iWon ? 100 : (progress[me] ?? 0);
  const oppPct = finished && !iWon ? 100 : (progress[oppId ?? ""] ?? 0);

  const feed = events
    .filter((e) => e.round === currentRound)
    .map((e) => {
      const who = e.user_id === me ? "Kamu" : oppName;
      return `${who} lolos ${e.passed} dari ${e.total} test`;
    });

  return (
    <section>
      <div className="duel-head">
        <Player name={myName} letter={myName[0]?.toUpperCase() ?? "K"} pct={myPct} />
        <div className="text-center">
          <div className="text-3xl font-bold tracking-wide">
            {myScore} : {oppScore}
          </div>
          <div className="mb-1 text-xs text-muted">
            {finished ? "Selesai" : `Ronde ${duel.round} · target ${duel.win_points} poin`}
          </div>
          <div className="timer" style={{ margin: 0 }}>{formatTime(elapsed)}</div>
          {finished && (
            <div className={`duel-result ${iWon ? "win" : "lose"}`}>
              {iWon ? `Kamu menang ${myScore}-${oppScore}` : `${oppName} menang ${oppScore}-${myScore}`}
            </div>
          )}
          {!finished && inBreak && (
            <div className="duel-result win">Ronde {duel.round} mulai dalam {countdown}</div>
          )}
          {!finished && !inBreak && roundNote && <div className="duel-result win">{roundNote}</div>}
        </div>
        <Player name={oppName} letter={oppName[0]?.toUpperCase() ?? "L"} pct={oppPct} opponent />
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
            <div>Ronde {duel.round} dimulai. Soal sama untuk kalian berdua.</div>
            {feed.map((line, i) => <div key={i}>{line}</div>)}
            {finished && (
              <div>
                {iWon
                  ? `Kamu menang match ${myScore}-${oppScore}`
                  : `${oppName} menang match ${oppScore}-${myScore}`}
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
                <button className="editor-button go" onClick={submit} disabled={busy || inBreak}>
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
                  setRoundNote(null);
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