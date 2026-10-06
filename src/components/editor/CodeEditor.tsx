import Editor from "@monaco-editor/react";
import type { Language } from "../../types/problem";

export function CodeEditor({
  language,
  value,
  onChange,
}: {
  language: Language;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div data-allow-contextmenu className="overflow-hidden rounded-2xl border border-line bg-[#17181d]">
      <Editor
        height="390px"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={(value) => onChange(value ?? "")}
        options={{
          fontFamily: '"Geist Mono", monospace',
          fontSize: 13.5,
          lineHeight: 23,
          minimap: { enabled: false },
          padding: { top: 14, bottom: 14 },
          scrollBeyondLastLine: false,
          roundedSelection: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}