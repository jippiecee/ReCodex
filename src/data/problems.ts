import type { Problem } from "../types/problem";

type Pair = [expr: string, out: string];
type Diff = Problem["difficulty"];

// Soal "bikin fungsi": 2 test pertama terbuka, sisanya tersembunyi
function fn(
  id: string,
  title: string,
  difficulty: Diff,
  description: string,
  name: string,
  params: string,
  hint: string,
  tests: Pair[],
): Problem {
  return {
    id,
    title,
    difficulty,
    description,
    hint,
    kind: "fn",
    estimatedMinutes: difficulty === "Mudah" ? 2 : 4,
    examples: tests.slice(0, 2).map(([e, o]) => ({
      input: e.slice(name.length + 1, -1),
      output: o,
    })),
    tests: tests.map(([input, output], i) => ({ input, output, hidden: i >= 2 })),
    starterCode: {
      javascript: `function ${name}(${params}) {\n  // tulis kodemu di sini\n}`,
      python: `def ${name}(${params}):\n    # tulis kodemu di sini\n    pass`,
    },
  };
}

// Soal "cetak output": dinilai dari apa yang dicetak programmu
function out(
  id: string,
  title: string,
  difficulty: Diff,
  description: string,
  expected: string,
  hint: string,
): Problem {
  return {
    id,
    title,
    difficulty,
    description,
    hint,
    kind: "print",
    estimatedMinutes: 2,
    examples: [{ input: "(tanpa input)", output: expected.replace(/\n/g, " / ") }],
    tests: [{ input: "Output program", output: expected }],
    starterCode: {
      javascript: "// tulis kodemu di sini",
      python: "# tulis kodemu di sini",
    },
  };
}

const VAR_HINT = 'Simpan nilainya ke variabel, lalu cetak variabel itu (console.log / print).';

export const problems: Problem[] = [
  // ---------- Cetak output ----------
  out("var-nama", "Variabel Nama", "Mudah", 'Buat variabel bernama nama berisi "Budi", lalu cetak variabelnya.', "Budi", VAR_HINT),
  out("var-umur", "Variabel Umur", "Mudah", "Buat variabel bernama umur berisi angka 17, lalu cetak variabelnya.", "17", VAR_HINT),
  out("var-kota", "Variabel Kota", "Mudah", 'Buat variabel bernama kota berisi "Jakarta", lalu cetak variabelnya.', "Jakarta", VAR_HINT),
  out("var-hobi", "Variabel Hobi", "Mudah", 'Buat variabel bernama hobi berisi "membaca", lalu cetak variabelnya.', "membaca", VAR_HINT),
  out("var-warna", "Variabel Warna", "Mudah", 'Buat variabel bernama warna berisi "biru", lalu cetak variabelnya.', "biru", VAR_HINT),
  out("var-hewan", "Variabel Hewan", "Mudah", 'Buat variabel bernama hewan berisi "kucing", lalu cetak variabelnya.', "kucing", VAR_HINT),
  out("var-tambah", "Tambah Dua Variabel", "Mudah", "Buat variabel a berisi 5 dan b berisi 7, lalu cetak hasil a ditambah b.", "12", "Cetak a + b."),
  out("var-kurang", "Kurang Dua Variabel", "Mudah", "Buat variabel x berisi 30 dan y berisi 8, lalu cetak hasil x dikurangi y.", "22", "Cetak x - y."),
  out("var-kali", "Kali Dua Variabel", "Mudah", "Buat variabel p berisi 6 dan q berisi 7, lalu cetak hasil p dikali q.", "42", "Operator kali adalah *."),
  out("var-bagi", "Bagi Dua Variabel", "Mudah", "Buat variabel m berisi 20 dan n berisi 4, lalu cetak hasil m dibagi n.", "5", "Operator bagi adalah /."),
  out("var-sisa", "Sisa Bagi", "Mudah", "Cetak sisa hasil bagi 17 dengan 5.", "2", "Operator sisa bagi adalah %."),
  out("var-pangkat", "Pangkat", "Mudah", "Cetak hasil 2 pangkat 5.", "32", "Operator pangkat adalah ** (di JavaScript dan Python)."),
  out("gabung-teks", "Gabung Teks", "Mudah", 'Buat variabel depan berisi "Halo" dan belakang berisi "Dunia", lalu cetak keduanya digabung dengan satu spasi di tengah.', "Halo Dunia", 'Gabungkan: depan + " " + belakang.'),
  out("dua-baris", "Cetak Dua Baris", "Mudah", 'Cetak "Satu" lalu "Dua", masing-masing di baris sendiri.', "Satu\nDua", "Panggil cetak dua kali."),
  out("ubah-nilai", "Ubah Nilai Variabel", "Mudah", "Buat variabel skor berisi 10, ubah nilainya jadi 25, lalu cetak skor.", "25", "Isi ulang variabel yang sama dengan nilai baru."),
  out("panjang-var", "Panjang Teks", "Mudah", 'Buat variabel kata berisi "programmer", lalu cetak jumlah hurufnya.', "10", "Pakai .length di JavaScript atau len() di Python."),
  out("huruf-besar-var", "Huruf Besar", "Mudah", 'Buat variabel kata berisi "kopi", lalu cetak kata itu dalam huruf besar.', "KOPI", "Pakai .toUpperCase() di JavaScript atau .upper() di Python."),
  out("loop-1-5", "Cetak 1 sampai 5", "Mudah", "Cetak angka 1 sampai 5, masing-masing di baris sendiri.", "1\n2\n3\n4\n5", "Pakai perulangan for."),
  out("loop-genap", "Cetak Angka Genap", "Mudah", "Cetak angka genap 2, 4, 6, 8, 10, masing-masing di baris sendiri.", "2\n4\n6\n8\n10", "Loop dari 1 sampai 10 lalu cek i % 2, atau loncat 2 angka sekali jalan."),
  out("kondisi-umur", "Cek Umur", "Mudah", 'Buat variabel umur berisi 20. Jika umur 17 atau lebih, cetak "Dewasa", jika tidak cetak "Anak".', "Dewasa", "Pakai if / else."),
  out("luas-persegi", "Luas Persegi", "Mudah", "Buat variabel sisi berisi 9, lalu cetak luas persegi (sisi dikali sisi).", "81", "sisi * sisi."),
  out("total-belanja", "Total Belanja", "Mudah", "Buat variabel harga berisi 15000 dan jumlah berisi 3, lalu cetak total belanja.", "45000", "harga * jumlah."),
  out("jumlah-tiga", "Jumlah Tiga Angka", "Mudah", "Buat variabel a=10, b=20, c=30, lalu cetak jumlah ketiganya.", "60", "a + b + c."),
  out("jumlah-1-10", "Jumlah 1 sampai 10", "Sedang", "Hitung jumlah semua angka dari 1 sampai 10 dengan perulangan, lalu cetak hasilnya.", "55", "Siapkan variabel total = 0, tambahkan tiap angka di dalam loop."),

  // ---------- Bikin fungsi ----------
  fn("balikin-string", "Balikin String", "Mudah", "Tulis fungsi balik(teks) yang mengembalikan teks dengan urutan huruf terbalik.", "balik", "teks", "Pecah teks jadi array huruf, balik urutannya, lalu gabungkan lagi.", [
    ['balik("halo")', "olah"], ['balik("kopi")', "ipok"], ['balik("ReCodex")', "xedoCeR"], ['balik("a b c")', "c b a"],
  ]),
  fn("jumlah-array", "Jumlah Array", "Mudah", "Tulis fungsi jumlah(angka) yang mengembalikan total semua angka di dalam list.", "jumlah", "angka", "Pakai reduce di JavaScript, atau fungsi sum di Python.", [
    ["jumlah([1, 2, 3])", "6"], ["jumlah([10, -4])", "6"], ["jumlah([])", "0"], ["jumlah([5, 5, 5, 5])", "20"],
  ]),
  fn("palindrom", "Cek Palindrom", "Mudah", "Tulis fungsi cekPalindrom(teks) yang mengembalikan true jika teks dibaca sama dari depan dan belakang, selain itu false.", "cekPalindrom", "teks", "Bandingkan teks dengan versi terbaliknya.", [
    ['cekPalindrom("katak")', "true"], ['cekPalindrom("kopi")', "false"], ['cekPalindrom("a")', "true"], ['cekPalindrom("malam")', "true"],
  ]),
  fn("hitung-vokal", "Hitung Vokal", "Sedang", "Tulis fungsi hitungVokal(teks) yang mengembalikan jumlah huruf vokal (a, i, u, e, o). Huruf besar juga dihitung.", "hitungVokal", "teks", 'Ubah ke huruf kecil dulu, lalu hitung huruf yang ada di "aiueo".', [
    ['hitungVokal("kopi")', "2"], ['hitungVokal("Jakarta")', "3"], ['hitungVokal("xyz")', "0"], ['hitungVokal("AIUEO")', "5"],
  ]),
  fn("kuadrat", "Kuadrat", "Mudah", "Tulis fungsi kuadrat(n) yang mengembalikan n dikali n.", "kuadrat", "n", "n * n.", [
    ["kuadrat(4)", "16"], ["kuadrat(9)", "81"], ["kuadrat(0)", "0"], ["kuadrat(12)", "144"],
  ]),
  fn("tambah", "Tambah", "Mudah", "Tulis fungsi tambah(a, b) yang mengembalikan hasil a ditambah b.", "tambah", "a, b", "Kembalikan a + b.", [
    ["tambah(2, 3)", "5"], ["tambah(10, 15)", "25"], ["tambah(-4, 4)", "0"], ["tambah(100, 1)", "101"],
  ]),
  fn("cek-genap", "Cek Genap", "Mudah", "Tulis fungsi cekGenap(n) yang mengembalikan true jika n genap, selain itu false.", "cekGenap", "n", "Angka genap habis dibagi 2 (n % 2 == 0).", [
    ["cekGenap(4)", "true"], ["cekGenap(7)", "false"], ["cekGenap(0)", "true"], ["cekGenap(13)", "false"],
  ]),
  fn("cek-ganjil", "Cek Ganjil", "Mudah", "Tulis fungsi cekGanjil(n) yang mengembalikan true jika n ganjil, selain itu false.", "cekGanjil", "n", "Angka ganjil bersisa 1 jika dibagi 2.", [
    ["cekGanjil(3)", "true"], ["cekGanjil(8)", "false"], ["cekGanjil(1)", "true"], ["cekGanjil(100)", "false"],
  ]),
  fn("terbesar", "Angka Terbesar", "Mudah", "Tulis fungsi terbesar(a, b) yang mengembalikan angka yang lebih besar.", "terbesar", "a, b", "Pakai if, atau fungsi max.", [
    ["terbesar(3, 8)", "8"], ["terbesar(10, 2)", "10"], ["terbesar(5, 5)", "5"], ["terbesar(-1, -9)", "-1"],
  ]),
  fn("sapa", "Sapa", "Mudah", 'Tulis fungsi sapa(nama) yang mengembalikan teks "Halo, <nama>!".', "sapa", "nama", 'Gabungkan "Halo, " + nama + "!".', [
    ['sapa("Budi")', "Halo, Budi!"], ['sapa("Rani")', "Halo, Rani!"], ['sapa("Dimas")', "Halo, Dimas!"], ['sapa("A")', "Halo, A!"],
  ]),
  fn("keliling-persegi", "Keliling Persegi", "Mudah", "Tulis fungsi kelilingPersegi(sisi) yang mengembalikan keliling persegi.", "kelilingPersegi", "sisi", "Keliling = 4 * sisi.", [
    ["kelilingPersegi(4)", "16"], ["kelilingPersegi(10)", "40"], ["kelilingPersegi(1)", "4"], ["kelilingPersegi(25)", "100"],
  ]),
  fn("luas-pp", "Luas Persegi Panjang", "Mudah", "Tulis fungsi luasPersegiPanjang(p, l) yang mengembalikan luasnya.", "luasPersegiPanjang", "p, l", "Luas = p * l.", [
    ["luasPersegiPanjang(3, 4)", "12"], ["luasPersegiPanjang(5, 5)", "25"], ["luasPersegiPanjang(10, 2)", "20"], ["luasPersegiPanjang(7, 1)", "7"],
  ]),
  fn("ulang-teks", "Ulang Teks", "Mudah", "Tulis fungsi ulangTeks(teks, n) yang mengembalikan teks diulang sebanyak n kali.", "ulangTeks", "teks, n", "JavaScript: teks.repeat(n). Python: teks * n.", [
    ['ulangTeks("ha", 3)', "hahaha"], ['ulangTeks("ab", 2)', "abab"], ['ulangTeks("x", 5)', "xxxxx"], ['ulangTeks("go", 1)', "go"],
  ]),
  fn("panjang-teks", "Panjang Teks", "Mudah", "Tulis fungsi panjangTeks(teks) yang mengembalikan jumlah karakter teks.", "panjangTeks", "teks", ".length di JavaScript, len() di Python.", [
    ['panjangTeks("halo")', "4"], ['panjangTeks("kopi susu")', "9"], ['panjangTeks("")', "0"], ['panjangTeks("a")', "1"],
  ]),
  fn("huruf-besar", "Huruf Besar", "Mudah", "Tulis fungsi hurufBesar(teks) yang mengembalikan teks dalam huruf kapital semua.", "hurufBesar", "teks", ".toUpperCase() di JavaScript, .upper() di Python.", [
    ['hurufBesar("kopi")', "KOPI"], ['hurufBesar("halo")', "HALO"], ['hurufBesar("Aku")', "AKU"], ['hurufBesar("x1")', "X1"],
  ]),
  fn("huruf-pertama", "Huruf Pertama", "Mudah", "Tulis fungsi hurufPertama(teks) yang mengembalikan huruf pertama dari teks.", "hurufPertama", "teks", "Ambil karakter dengan indeks 0.", [
    ['hurufPertama("kopi")', "k"], ['hurufPertama("Budi")', "B"], ['hurufPertama("z")', "z"], ['hurufPertama("halo dunia")', "h"],
  ]),
  fn("huruf-terakhir", "Huruf Terakhir", "Mudah", "Tulis fungsi hurufTerakhir(teks) yang mengembalikan huruf terakhir dari teks.", "hurufTerakhir", "teks", "Indeks terakhir = panjang teks dikurangi 1 (di Python bisa teks[-1]).", [
    ['hurufTerakhir("kopi")', "i"], ['hurufTerakhir("Budi")', "i"], ['hurufTerakhir("z")', "z"], ['hurufTerakhir("halo")', "o"],
  ]),
  fn("jumlah-tiga-fn", "Jumlah Tiga Angka", "Mudah", "Tulis fungsi jumlahTiga(a, b, c) yang mengembalikan jumlah ketiga angka.", "jumlahTiga", "a, b, c", "a + b + c.", [
    ["jumlahTiga(1, 2, 3)", "6"], ["jumlahTiga(10, 20, 30)", "60"], ["jumlahTiga(0, 0, 0)", "0"], ["jumlahTiga(-1, -2, -3)", "-6"],
  ]),
  fn("faktorial", "Faktorial", "Sedang", "Tulis fungsi faktorial(n) yang mengembalikan n! (1 x 2 x ... x n). Faktorial 0 adalah 1.", "faktorial", "n", "Mulai dari hasil = 1, lalu kalikan dengan 1 sampai n di dalam loop.", [
    ["faktorial(5)", "120"], ["faktorial(3)", "6"], ["faktorial(0)", "1"], ["faktorial(6)", "720"],
  ]),
  fn("mutlak", "Nilai Mutlak", "Mudah", "Tulis fungsi mutlak(n) yang mengembalikan nilai mutlak n (angka negatif jadi positif).", "mutlak", "n", "Jika n < 0, kembalikan -n.", [
    ["mutlak(-5)", "5"], ["mutlak(7)", "7"], ["mutlak(0)", "0"], ["mutlak(-100)", "100"],
  ]),
  fn("terkecil", "Angka Terkecil", "Mudah", "Tulis fungsi terkecil(a, b, c) yang mengembalikan angka paling kecil dari ketiganya.", "terkecil", "a, b, c", "Bandingkan satu per satu, atau pakai fungsi min.", [
    ["terkecil(3, 1, 2)", "1"], ["terkecil(10, 20, 5)", "5"], ["terkecil(7, 7, 7)", "7"], ["terkecil(-3, 0, 3)", "-3"],
  ]),
  fn("kelipatan-tiga", "Kelipatan Tiga", "Mudah", "Tulis fungsi kelipatanTiga(n) yang mengembalikan true jika n kelipatan 3, selain itu false.", "kelipatanTiga", "n", "Cek n % 3 sama dengan 0.", [
    ["kelipatanTiga(9)", "true"], ["kelipatanTiga(10)", "false"], ["kelipatanTiga(0)", "true"], ["kelipatanTiga(33)", "true"],
  ]),
  fn("selisih", "Selisih", "Mudah", "Tulis fungsi selisih(a, b) yang mengembalikan selisih positif kedua angka (selalu tidak negatif).", "selisih", "a, b", "Kurangi yang besar dengan yang kecil.", [
    ["selisih(10, 4)", "6"], ["selisih(4, 10)", "6"], ["selisih(5, 5)", "0"], ["selisih(-2, 3)", "5"],
  ]),
  fn("total-harga", "Total Harga", "Mudah", "Tulis fungsi totalHarga(harga, jumlah) yang mengembalikan total yang harus dibayar.", "totalHarga", "harga, jumlah", "harga * jumlah.", [
    ["totalHarga(5000, 3)", "15000"], ["totalHarga(2000, 10)", "20000"], ["totalHarga(750, 0)", "0"], ["totalHarga(100, 1)", "100"],
  ]),
  fn("gabung", "Gabung Kata", "Mudah", "Tulis fungsi gabung(a, b) yang mengembalikan dua kata digabung dengan satu spasi di tengah.", "gabung", "a, b", 'a + " " + b.', [
    ['gabung("Halo", "Dunia")', "Halo Dunia"], ['gabung("kopi", "susu")', "kopi susu"], ['gabung("saya", "suka")', "saya suka"], ['gabung("a", "b")', "a b"],
  ]),
  fn("jumlah-digit", "Jumlah Digit", "Sedang", "Tulis fungsi jumlahDigit(n) yang mengembalikan jumlah semua digit pada angka n.", "jumlahDigit", "n", "Ubah angka jadi teks, lalu jumlahkan tiap karakternya sebagai angka.", [
    ["jumlahDigit(123)", "6"], ["jumlahDigit(45)", "9"], ["jumlahDigit(7)", "7"], ["jumlahDigit(1000)", "1"],
  ]),
  fn("cek-umur", "Cek Umur", "Mudah", 'Tulis fungsi cekUmur(umur) yang mengembalikan "Dewasa" jika umur 17 atau lebih, selain itu "Anak".', "cekUmur", "umur", "Pakai if / else.", [
    ["cekUmur(20)", "Dewasa"], ["cekUmur(10)", "Anak"], ["cekUmur(17)", "Dewasa"], ["cekUmur(16)", "Anak"],
  ]),
];

export function getProblem(id: string) {
  return problems.find((p) => p.id === id) ?? problems[0];
}

export function randomProblem() {
  return problems[Math.floor(Math.random() * problems.length)];
}

// Dipakai sebagai pilihan awal di halaman Peringkat
export const todayProblem = problems[
  Math.floor(Date.now() / 86_400_000) % problems.length
];