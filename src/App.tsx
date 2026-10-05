import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { PracticePage } from "./pages/PracticePage";

export type AppTab = "practice" | "duel" | "leaderboard";

export default function App() {
  const [tab, setTab] = useState<AppTab>("practice");

  return (
    <>
      <Navbar tab={tab} onTabChange={setTab} />
      <main className="mx-auto w-full max-w-[1040px] px-5 pb-12 pt-8">
        <PracticePage tab={tab} />
      </main>
    </>
  );
}