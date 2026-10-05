import type { Problem } from "../../types/problem";

export function ProblemPanel({
  problem,
  best,
  onHint,
  hintOpen,
}: {
  problem: Problem;
  best: string;
  onHint: () => void;
  hintOpen: boolean;
}) {
  return (
    <aside className="problem-panel">
      <p className="mb-8 max-w-[46ch] leading-7 text-[#cfd2dc]">
        {problem.description}
      </p>

      <div className="section-label">Contoh</div>
      <table className="example-table">
        <thead>
          <tr>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {problem.examples.map((example) => (
            <tr key={example.input}>
              <td>{example.input}</td>
              <td>{example.output}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="section-label">Test case</div>
      <ul className="test-list">
        {problem.tests.map((test, index) => (
          <li key={`${test.input}-${index}`} className={test.hidden ? "locked" : ""}>
            <span className="font-mono">
              {test.hidden ? "Tersembunyi" : test.input}
            </span>
            <span>{test.hidden ? "terkunci" : "terbuka"}</span>
          </li>
        ))}
      </ul>

      {!hintOpen ? (
        <button className="hint-button" onClick={onHint}>
          Buka petunjuk, tambah 15 detik
        </button>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted">
          Pecah teks jadi array huruf, balik urutannya, lalu gabungkan lagi.
        </p>
      )}

      <div className="mt-8 text-[13px] text-muted">
        Best kamu <b className="font-medium text-text">{best}</b>. Rata-rata
        pemain 02:10.
      </div>
    </aside>
  );
}