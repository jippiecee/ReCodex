export function Terminal({ output }: { output: string }) {
  return (
    <div className="terminal">
      <div className="border-b border-line px-3.5 py-2 text-[13px] text-muted">
        Terminal
      </div>
      <pre className="m-0 min-h-[110px] whitespace-pre-wrap bg-transparent p-3 text-[13px] leading-6">
        {output}
      </pre>
    </div>
  );
}