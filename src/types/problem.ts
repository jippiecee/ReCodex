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
  examples: { input: string; output: string }[];
  tests: TestCase[];
  starterCode: Record<Language, string>;
};