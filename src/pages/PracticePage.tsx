import { useEffect, useRef, useState } from "react";
import { problems, getProblem } from "../data/problems";
import { useTimer, formatTime } from "../hooks/useTimer";
import { CodeEditor } from "../components/editor/CodeEditor";
import { Terminal } from "../components/editor/Terminal";
import { ProblemPanel } from "../components/problem/ProblemPanel";
import { Timer } from "../components/ui/Timer";
import { useAuth } from "../context/AuthContext";
import { formatRun, runCode, warmupPython } from "../lib/runner";
import { getBestScore, getProblemStats, saveScore } from "../lib/scores";
import type { Language } from "../types/problem";

const IDLE = "Tekan Jalankan untuk melihat output.";
const HINT_PENALTY = 15;

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PracticePage() {
  const queueRef = useRef<string[]>([]);
  const lastRef = useRef<string | null>(null);

  // Acak semua soal, habiskan dulu sebelum diacak ulang (tidak ada pengulangan beruntun)
  function pick(): string {
    if (queueRef.current.length === 0) {
      let q = shuffle(problems.map((p) => p.id));
      if (q[0] === lastRef.current) q = [...q.slice(1), q[0]];
      queueRef.current = q;
    }
    const id = queueRef.current.shift()!;
    lastRef.current = id;
    return id;
  }

  const [problemId, setProblemId] = useState(pick);

  return (
    <Practice
      key={problemId}
      problemId={problemId}
      onNext={() => setProblemId(pick())}
    />
  );
}

function Practice({
  problemId,
  onNext,
}: {
  problemId: string;
  onNext: () => void;
}) {
  const { user } = useAuth();
  const problem = getProblem(problemId);

  const [solved, setSolved] = useState(false);
  const seconds = useTimer(!solved);
  const [penalty, setPenalty] = useState(0);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [output, setOutput] = useState(IDLE);
  const [hintOpen, setHintOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [avg, setAvg] = useState<number | null>(null);

  const elapsed = seconds + penalty;

  useEffect(() => {
    if (!user) return;
    getBestScore(user.id, problem.id).then(setBest);
    getProblemStats(problem.id).then((s) => setAvg(s ? s.avgSeconds : null));
  }, [user, problem.id]);

  function changeLanguage(value: Language) {
    setLanguage(value);
    setCode(problem.starterCode[value]);
    setOutput(IDLE);
    if (value === "python") {
      setOutput("Menyiapkan Python (pertama kali agak lama)...");
      warmupPython().then(() => setOutput(IDLE));
    }
  }

  function openHint() {
    setHintOpen(true);
    setPenalty((p) => p + HINT_PENALTY);
  }

  async function run() {
    if (busy) return;
    setBusy(true);
    setOutput("Menjalankan...");
    const open = problem.tests.filter((t) => !t.hidden);
    const res = await runCode(language, code, open, problem.kind);
    setOutput(formatRun(res, true));
    setBusy(false);
  }

  async function submit() {
    if (busy || solved) return;
    setBusy(true);
    setOutput("Memeriksa semua test...");
    const res = await runCode(language, code, problem.tests, problem.kind);
    setOutput(formatRun(res, false));

    if (res.passed === res.total && user) {
      setSolved(true);
      const time = elapsed;
      const { error } = await saveScore({
        userId: user.id,
        problemId: problem.id,
        language,
        elapsedSeconds: time,
      });

      const isNewBest = best == null || time < best;
      if (isNewBest) setBest(time);
      setToast(
        error
          ? "Semua test lolos, tapi skor gagal disimpan."
          : isNewBest
            ? `Semua test lolos. Best baru ${formatTime(time)}`
            : `Semua test lolos. Waktu ${formatTime(time)}`,
      );
      window.setTimeout(() => setToast(null), 3200);
    }
    setBusy(false);
  }

  return (
    <>
      <section>
        <div className="hero">
          <div className="chips justify-center">
            <span className="chip">{problem.title}</span>
            <span className="chip">{problem.difficulty}</span>
            <span className="chip hot">
              Best kamu {best != null ? formatTime(best) : "-"}
            </span>
          </div>
        </div>

        <div className="practice-layout">
          <ProblemPanel
            problem={problem}
            best={best}
            avgSeconds={avg}
            hintOpen={hintOpen}
            onHint={openHint}
          />

          <div className="practice-editor-wrap">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
              <select
                aria-label="Bahasa"
                value={language}
                onChange={(e) => changeLanguage(e.target.value as Language)}
                className="rounded-lg border border-line bg-panel px-3.5 py-2 text-text outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>

              <Timer seconds={elapsed} />

              {solved ? (
                <button className="editor-button go" onClick={onNext}>
                  Soal berikutnya
                </button>
              ) : (
                <>
                  <button
                    className="editor-button"
                    onClick={() => setCode(problem.starterCode[language])}
                  >
                    Reset
                  </button>
                  <button className="editor-button" onClick={run} disabled={busy}>
                    Jalankan
                  </button>
                  <button className="editor-button go" onClick={submit} disabled={busy}>
                    Kirim jawaban
                  </button>
                </>
              )}
            </div>

            <div className="editor-frame">
              <CodeEditor language={language} value={code} onChange={setCode} />
              <Terminal output={output} />
            </div>
          </div>
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}