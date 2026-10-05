import type { Language, TestCase } from "../types/problem";

export type TestResult = {
  passed: boolean;
  hidden: boolean;
  input: string;
  expected: string;
  got: string;
  error?: string;
};

export type RunResult = {
  stdout: string;
  error?: string;
  tests: TestResult[];
  passed: number;
  total: number;
};

type WorkerRes = {
  id: number;
  stdout: string;
  error?: string;
  results: { got: string; error?: string }[];
};

const JS_TIMEOUT = 4000;
const PY_TIMEOUT = 8000;
const PY_BOOT_TIMEOUT = 60000;

let seq = 0;
let pyWorker: Worker | null = null;
let pyReady: Promise<void> | null = null;

function newWorker() {
  return new Worker(new URL("../workers/runner.worker.ts", import.meta.url), {
    type: "module",
  });
}

// Python butuh download runtime (Pyodide) sekali saja; panggil lebih awal biar terasa cepat.
export function warmupPython() {
  if (pyReady) return pyReady;
  pyWorker = newWorker();
  const w = pyWorker;
  pyReady = new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, PY_BOOT_TIMEOUT);
    w.onmessage = (ev) => {
      if (ev.data?.type === "ready") {
        window.clearTimeout(timer);
        w.onmessage = null;
        resolve();
      }
    };
    w.postMessage({ type: "warmup" });
  });
  return pyReady;
}

function resetPython() {
  pyWorker?.terminate();
  pyWorker = null;
  pyReady = null;
}

function same(got: string, expected: string) {
  const a = got.trim();
  const b = expected.trim();
  if (a === b) return true;
  return /^(true|false)$/i.test(b) && a.toLowerCase() === b.toLowerCase();
}

function norm(s: string) {
  return s
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();
}

function call(language: Language, code: string, exprs: string[]): Promise<WorkerRes> {
  const id = ++seq;

  return new Promise(async (resolve) => {
    let worker: Worker;
    let timeout: number;
    const isPy = language === "python";

    if (isPy) {
      await warmupPython();
      worker = pyWorker!;
      timeout = PY_TIMEOUT;
    } else {
      worker = newWorker();
      timeout = JS_TIMEOUT;
    }

    const fail = (error: string) =>
      resolve({
        id,
        stdout: "",
        error,
        results: exprs.map(() => ({ got: "", error })),
      });

    const timer = window.setTimeout(() => {
      if (isPy) resetPython();
      else worker.terminate();
      fail("Waktu habis, kemungkinan ada infinite loop.");
    }, timeout);

    worker.onmessage = (ev: MessageEvent<WorkerRes>) => {
      if (ev.data.id !== id) return;
      window.clearTimeout(timer);
      if (!isPy) worker.terminate();
      resolve(ev.data);
    };
    worker.onerror = () => {
      window.clearTimeout(timer);
      if (isPy) resetPython();
      else worker.terminate();
      fail("Runner gagal dijalankan.");
    };

    worker.postMessage({ id, language, code, exprs });
  });
}

export async function runCode(
  language: Language,
  code: string,
  tests: TestCase[],
  kind: "fn" | "print" = "fn",
): Promise<RunResult> {
  // Soal cetak output: bandingkan stdout programnya
  if (kind === "print") {
    const res = await call(language, code, []);
    const expected = tests[0]?.output ?? "";
    const passed = !res.error && norm(res.stdout) === norm(expected);
    const t: TestResult = {
      passed,
      hidden: false,
      input: "Output program",
      expected,
      got: res.stdout,
      error: res.error,
    };
    return {
      stdout: res.stdout,
      error: res.error,
      tests: [t],
      passed: passed ? 1 : 0,
      total: 1,
    };
  }

  const res = await call(
    language,
    code,
    tests.map((t) => t.input),
  );

  const results: TestResult[] = tests.map((t, i) => {
    const r = res.results[i] ?? { got: "", error: "Tidak ada hasil" };
    return {
      passed: !r.error && same(r.got, t.output),
      hidden: !!t.hidden,
      input: t.input,
      expected: t.output,
      got: r.got,
      error: r.error,
    };
  });

  return {
    stdout: res.stdout,
    error: res.error,
    tests: results,
    passed: results.filter((t) => t.passed).length,
    total: results.length,
  };
}

// Ringkasan untuk Terminal
export function formatRun(run: RunResult, onlyOpen: boolean) {
  const lines: string[] = [];
  if (run.stdout) lines.push(run.stdout, "");
  if (run.error) lines.push(`Error: ${run.error}`, "");

  const shown = onlyOpen ? run.tests.filter((t) => !t.hidden) : run.tests;
  for (const t of shown) {
    if (t.passed) continue;
    lines.push(
      t.hidden
        ? "Test tersembunyi gagal"
        : `Gagal ${t.input}\n  harusnya: ${t.expected}\n  hasilmu : ${t.error ?? t.got}`,
    );
  }

  const pass = shown.filter((t) => t.passed).length;
  lines.push(
    "",
    onlyOpen
      ? `${pass} dari ${shown.length} test terbuka lolos`
      : `${pass} dari ${shown.length} test lolos`,
  );
  return lines.join("\n").trim();
}