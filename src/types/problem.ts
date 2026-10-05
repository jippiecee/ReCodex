export type Language = "javascript" | "python";

export type TestCase = {
  input: string;
  output: string;
  hidden?: boolean;
};

export type Problem = {
  id: string;
  title: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  estimatedMinutes: number;
  description: string;
  hint: string;
  // "fn" = bikin fungsi (dites lewat pemanggilan), "print" = dinilai dari output program
  kind?: "fn" | "print";
  examples: { input: string; output: string }[];
  tests: TestCase[];
  starterCode: Record<Language, string>;
};