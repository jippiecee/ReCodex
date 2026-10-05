import { useMemo, useState } from "react";
import type { AppTab } from "../App";
import { todayProblem } from "../data/problems";
import { useTimer } from "../hooks/useTimer";
import { CodeEditor } from "../components/editor/CodeEditor";
import { Terminal } from "../components/editor/Terminal";
import { ProblemPanel } from "../components/problem/ProblemPanel";
import { Timer } from "../components/ui/Timer";
import type { Language } from "../types/problem";

export function PracticePage({ tab }: { tab: AppTab }) {
  if (tab === "duel") return <DuelPreview />;
  if (tab === "leaderboard") return <LeaderboardPreview />;
  return <Practice />;
}

function Practice() {
  const problem = todayProblem;
  const seconds = useTimer(true);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [output, setOutput] = useState("Tekan Jalankan untuk melihat output.");
  const [hintOpen, setHintOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const best = "01:48";

  const starter = useMemo(
    () => problem.starterCode[language],
    [language, problem],
  );

  function changeLanguage(value: Language) {
    setLanguage(value);
    setCode(problem.starterCode[value]);
    setOutput("Tekan Jalankan untuk melihat output.");
  }

  function run() {
    setOutput("olah\nipok\n\n2 dari 2 test terbuka lolos");
  }

  function submit() {
    setOutput("olah\nipok\n\n4 dari 4 test lolos");
    setToast(true);
    window.setTimeout(() => setToast(false), 2800);
  }

  return (
    <>
      <section>
        <div className="hero">
          <div className="chips justify-center">
            <span className="chip hot">Best kamu {best}</span>
          </div>
        </div>

        <div className="practice-layout">
          <ProblemPanel
            problem={problem}
            best={best}
            hintOpen={hintOpen}
            onHint={() => setHintOpen(true)}
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

              <Timer seconds={seconds} />

              <button className="editor-button" onClick={() => setCode(starter)}>
                Reset
              </button>
              <button className="editor-button" onClick={run}>
                Jalankan
              </button>
              <button className="editor-button go" onClick={submit}>
                Kirim jawaban
              </button>
            </div>

            <div className="editor-frame">
              <CodeEditor language={language} value={code} onChange={setCode} />
              <Terminal output={output} />
            </div>
          </div>
        </div>
      </section>

      {toast && <div className="toast">Semua test lolos. Best baru 01:31</div>}
    </>
  );
}

function DuelPreview() {
  return (
    <section>
      <div className="duel-head">
        <Player name="Kamu" letter="K" />
        <div className="text-center">
          <div className="timer">01:12</div>
        </div>
        <Player name="Rani" letter="R" opponent />
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-10 max-[820px]:grid-cols-1 max-[820px]:gap-6">
        <div className="simple-card">
          <h2>Aktivitas</h2>
          <div className="feed">
            <div>Pertandingan dimulai. Soal sama untuk kalian berdua.</div>
            <div>Rani lolos 1 dari 4 test</div>
            <div>Kamu lolos 2 dari 4 test</div>
          </div>
        </div>
        <div>
          <CodeEditor language="javascript" value={'function balik(teks) {\n  // tulis kodemu\n}'} onChange={() => {}} />
          <div className="mt-6 flex items-center gap-3">
            <button className="editor-button go">Kirim jawaban</button>
            <span className="text-sm text-muted">Hasil dicek di server, bukan di browser.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Player({
  name,
  letter,
  opponent,
}: {
  name: string;
  letter: string;
  opponent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${opponent ? "flex-row-reverse text-right" : ""}`}>
      <div className={`avatar ${opponent ? "opponent" : ""}`}>{letter}</div>
      <div>
        <b>{name}</b>
        <div className="progress"><i style={{ width: opponent ? "45%" : "60%" }} /></div>
      </div>
    </div>
  );
}

function LeaderboardPreview() {
  const rows = [
    ["1", "Rani", "Python", "00:41"],
    ["2", "Dimas", "JavaScript", "00:53"],
    ["3", "Citra", "JavaScript", "01:02"],
    ["7", "Kamu", "JavaScript", "01:48"],
  ];

  return (
    <section>
      <div className="simple-card mx-auto max-w-[720px]">
        <div className="chips">
          <span className="chip hot">Minggu ini</span>
          <span className="chip">Bulan ini</span>
          <span className="chip">Semua</span>
        </div>
        <table className="leaderboard">
          <thead>
            <tr><th>#</th><th>Pemain</th><th>Bahasa</th><th>Waktu</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className={row[1] === "Kamu" ? "me" : ""}>
                {row.map((cell, i) => <td key={i} className={i === 3 ? "mono blue" : ""}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}