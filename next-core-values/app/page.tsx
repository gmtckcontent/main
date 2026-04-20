import { CoreValuesSection } from "@/components/CoreValuesSection";
import { HistoryScrollSection } from "@/components/HistoryScrollSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HistoryScrollSection />
      <CoreValuesSection />
      <footer className="border-t border-neutral-100 bg-white px-6 py-12 text-center text-sm text-neutral-400">
        GM Technical Center Korea , TCK Vision
      </footer>
    </main>
  );
}
