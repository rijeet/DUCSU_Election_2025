import PanelSummary from "@/components/PanelSummary";
import WinnerListPage from "@/app/winnerlist/page";

export default function Home() {
  return (
    <main className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">DUCSU Election 2025</h1>
        <div className="flex gap-4">
        <a className="underline" href="/candidates-by-position">All Candidates</a>
        <a className="underline" href="/candidates">Browse Candidates</a>
        </div>
      </header>
      <WinnerListPage />
    </main>
  );
}
