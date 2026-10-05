import type { AppTab } from "../../App";
import { useAuth } from "../../context/AuthContext";

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
  const { profile, user, signOut } = useAuth();
  const name = profile?.username ?? user?.email?.split("@")[0] ?? "Pemain";

  return (
    <header className="sticky top-3 z-20 mx-auto mt-3 flex max-w-[760px] flex-wrap items-center gap-4 rounded-[18px] border border-line bg-[#0e0e10]/85 px-3.5 py-2.5 backdrop-blur-xl">
      <div className="mr-auto flex items-center">
        <span className="logo-dot" aria-label="Logo ReCodex" />
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

      <div className="flex items-center gap-2.5">
        <span className="text-sm text-muted">{name}</span>
        <button
          onClick={signOut}
          className="rounded-xl border border-line px-3.5 py-2 text-sm text-text hover:border-[#34353b]"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
