# ReCodex

Platform latihan ngoding multiplayer: soal singkat, adu cepat 1v1, waktu terbaik, dan peringkat.

## Setup

1. Buat project di Supabase, lalu jalankan seluruh isi `supabase/schema.sql` di **SQL Editor**.
2. `cp .env.example .env` dan isi `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
3. (Opsional, untuk testing) Supabase → Authentication → Providers → Email → matikan **Confirm email**.
4. `npm install && npm run dev`

## Alur

- Masuk website → wajib login/daftar (Supabase Auth). Username dibuat otomatis jadi profil lewat trigger.
- **Latihan**: pilih soal, kode dijalankan di Web Worker (JS langsung, Python via Pyodide), skor tersimpan ke `scores`.
- **1v1**: `find_duel` mencocokkan dua pemain, progres via Realtime (`duels`, `duel_events`), pemenang & waktu ditentukan server (`duel_finish`).
- **Peringkat**: `get_leaderboard` (waktu terbaik per pemain per soal; minggu/bulan/semua).

## Catatan keamanan

Pengecekan jawaban masih jalan di browser, jadi pemain yang paham bisa memalsukan hasil. Langkah berikutnya: judge di server (sandbox) dan pindahkan `duel_finish` / insert skor ke sana.
