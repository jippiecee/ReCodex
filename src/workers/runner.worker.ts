/// <reference lib="webworker" />
// Worker ini mengeksekusi kode user (JS / Python) terpisah dari UI thread.

type Req = {
  id: number;
  language: "javascript" | "python";
  code: string;
  exprs: string[];
};

type Res = {
  id: number;
  stdout: string;
  error?: string;
  results: { got: string; error?: string }[];
};

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodidePromise: Promise<any> | null = null;

function loadPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const mod = await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`);
      return mod.loadPyodide({ indexURL: PYODIDE_URL });
    })();
  }
  return pyodidePromise;
}

function fmt(v: unknown): string {
  if (typeof v === "string") return v;
  if (v === undefined) return "undefined";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

function runJs(req: Req): Res {
  const out: string[] = [];
  const fakeConsole = {
    log: (...a: unknown[]) => out.push(a.map(fmt).join(" ")),
    info: (...a: unknown[]) => out.push(a.map(fmt).join(" ")),
    warn: (...a: unknown[]) => out.push(a.map(fmt).join(" ")),
    error: (...a: unknown[]) => out.push(a.map(fmt).join(" ")),
  };

  let thunks: (() => unknown)[] = [];
  try {
    const factory = new Function(
      "console",
      `${req.code}\n;return [${req.exprs.map((e) => `() => (${e})`).join(",")}];`,
    );
    thunks = factory(fakeConsole);
  } catch (e) {
    return {
      id: req.id,
      stdout: out.join("\n"),
      error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
      results: req.exprs.map(() => ({ got: "", error: "Kode gagal dijalankan" })),
    };
  }

  const results = thunks.map((t) => {
    try {
      return { got: fmt(t()) };
    } catch (e) {
      return { got: "", error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
    }
  });
  return { id: req.id, stdout: out.join("\n"), results };
}

async function runPython(req: Req): Promise<Res> {
  const py = await loadPyodide();
  const out: string[] = [];
  py.setStdout({ batched: (s: string) => out.push(s) });
  py.setStderr({ batched: (s: string) => out.push(s) });

  const globals = py.globals.get("dict")();
  try {
    try {
      await py.runPythonAsync(req.code, { globals });
    } catch (e) {
      const msg = e instanceof Error ? e.message.trim().split("\n").slice(-1)[0] : String(e);
      return {
        id: req.id,
        stdout: out.join("\n"),
        error: msg,
        results: req.exprs.map(() => ({ got: "", error: "Kode gagal dijalankan" })),
      };
    }

    const results = req.exprs.map((expr) => {
      try {
        const got = py.runPython(`str(${expr})`, { globals });
        return { got: String(got) };
      } catch (e) {
        const msg = e instanceof Error ? e.message.trim().split("\n").slice(-1)[0] : String(e);
        return { got: "", error: msg };
      }
    });
    return { id: req.id, stdout: out.join("\n"), results };
  } finally {
    globals.destroy();
  }
}

self.onmessage = async (ev: MessageEvent<Req | { type: "warmup" }>) => {
  const data = ev.data;
  if ("type" in data) {
    try {
      await loadPyodide();
      self.postMessage({ type: "ready" });
    } catch {
      self.postMessage({ type: "ready" });
    }
    return;
  }
  const res = data.language === "python" ? await runPython(data) : runJs(data);
  self.postMessage(res);
};
