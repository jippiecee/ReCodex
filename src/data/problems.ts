import type { Problem } from "../types/problem";

export const problems: Problem[] = [
  {
    id: "balikin-string",
    title: "Balikin String",
    difficulty: "Mudah",
    estimatedMinutes: 3,
    description:
      'Tulis fungsi balik(teks) yang mengembalikan teks dengan urutan huruf terbalik, lalu cetak hasilnya.',
    examples: [
      { input: '"halo"', output: "olah" },
      { input: '"kopi"', output: "ipok" },
    ],
    tests: [
      { input: 'balik("halo")', output: "olah" },
      { input: 'balik("kopi")', output: "ipok" },
      { input: "hidden-1", output: "hidden", hidden: true },
      { input: "hidden-2", output: "hidden", hidden: true },
    ],
    starterCode: {
      javascript: `function balik(teks) {
  return teks.split("").reverse().join("");
}

console.log(balik("halo"));
console.log(balik("kopi"));

// tulis kodemu di sini`,
      python: `def balik(teks):
    return teks[::-1]

print(balik("halo"))
print(balik("kopi"))

# tulis kodemu di sini`,
    },
  },
];

export const todayProblem = problems[0];