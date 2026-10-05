import type { AppTab } from "../../App";

type Props = {
  tab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

const items: { label: string; value: AppTab }[] = [
  { label: "Latihan", value: "practice" },
  { label: "1v1", value: "duel" },
  { label: "Peringkat", value: "leaderboard" },
];

export function Navbar({ tab, onTabChange }: Props) {
  return (
    <header className="sticky top-3 z-20 mx-auto mt-3 flex max-w-[760px] flex-wrap items-center gap-4 rounded-[18px] border border-line bg-[#0e0e10]/85 px-3.5 py-2.5 backdrop-blur-xl">
      <div className="mr-auto flex items-center">
        <span className="logo-dot" aria-label="Logo 5 Menit" />
      </div>

      <nav className="flex gap-0.5" aria-label="Navigasi">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => onTabChange(item.value)}
            className={`rounded-[10px] px-3 py-1.5 text-sm transition ${
              tab === item.value
                ? "bg-[#18181b] text-text"
                : "text-muted hover:text-text"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
        Masuk
      </button>
    </header>
  );
}