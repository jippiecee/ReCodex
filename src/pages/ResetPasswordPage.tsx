import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password minimal 6 karakter.");
    if (password !== confirm) return setError("Konfirmasi password tidak sama.");

    setBusy(true);
    const err = await updatePassword(password);
    if (err) setError(err);
    setBusy(false);
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <span className="logo-dot" aria-label="Logo ReCodex" />
        <h1>Buat password baru</h1>
        <p className="auth-sub">Masukkan password baru untuk akun kamu.</p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Password baru
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Ulangi password
            <input
              className="field"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>

          {error && <div className="auth-msg error" role="alert">{error}</div>}

          <button className="editor-button go auth-submit" disabled={busy}>
            {busy ? "Menyimpan..." : "Simpan password"}
          </button>
        </form>
      </div>
    </main>
  );
}