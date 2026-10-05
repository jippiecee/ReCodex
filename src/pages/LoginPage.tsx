import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "register" | "forgot";

export function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function go(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "forgot") {
      setBusy(true);
      const err = await resetPassword(email.trim());
      if (err) setError(err);
      else setInfo("Kalau email terdaftar, link reset sudah dikirim. Cek inbox dan folder spam.");
      setBusy(false);
      return;
    }

    if (mode === "register" && !/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      setError("Username 3-16 karakter: huruf, angka, atau underscore.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setBusy(true);
    if (mode === "login") {
      const err = await signIn(email.trim(), password);
      if (err) setError(err);
    } else {
      const res = await signUp(email.trim(), password, username);
      if (res.error) setError(res.error);
      else if (res.needsConfirm) {
        setInfo("Akun dibuat. Cek email kamu untuk konfirmasi, lalu masuk.");
        setMode("login");
      }
    }
    setBusy(false);
  }

  const title =
    mode === "login" ? "Masuk ke ReCodex" : mode === "register" ? "Buat akun ReCodex" : "Lupa password";

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <span className="logo-dot" aria-label="Logo ReCodex" />
        <h1>{title}</h1>
        <p className="auth-sub">
          {mode === "forgot"
            ? "Masukkan email akunmu, kami kirim link untuk membuat password baru."
            : "Latihan ngoding, adu cepat 1v1, dan kejar waktu terbaikmu."}
        </p>

        <form onSubmit={submit} className="auth-form">
          {mode === "register" && (
            <label>
              Username
              <input
                className="field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="rani_dev"
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="kamu@email.com"
              required
            />
          </label>
          {mode !== "forgot" && (
            <label>
              Password
              <input
                className="field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="Minimal 6 karakter"
                required
              />
            </label>
          )}

          {mode === "login" && (
            <button type="button" className="hint-button" style={{ justifySelf: "start" }} onClick={() => go("forgot")}>
              Lupa password?
            </button>
          )}

          {error && <div className="auth-msg error" role="alert">{error}</div>}
          {info && <div className="auth-msg info">{info}</div>}

          <button className="editor-button go auth-submit" disabled={busy}>
            {busy
              ? "Tunggu sebentar..."
              : mode === "login"
                ? "Masuk"
                : mode === "register"
                  ? "Daftar"
                  : "Kirim link reset"}
          </button>
        </form>

        <button
          type="button"
          className="hint-button auth-switch"
          onClick={() => go(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Belum punya akun? Daftar"
            : mode === "register"
              ? "Sudah punya akun? Masuk"
              : "Kembali ke halaman masuk"}
        </button>
      </div>
    </main>
  );
}