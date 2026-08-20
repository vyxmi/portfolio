import type { Metadata } from "next";

export const metadata: Metadata = { title: "Brain, Vyomi Seth" };

// Scaffold only. Brain Objects are designed separately, later. This
// route exists so the IA and rail nav are real, not so this page is.
export default function BrainPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center md:pl-[var(--rail-w)]"
      style={{ background: "var(--void)", color: "var(--void-soft)" }}
    >
      <div className="eyebrow mb-4">brain</div>
      <p className="max-w-sm text-[15px] leading-relaxed">
        Reserved for Brain Objects. Not designed yet on purpose.
      </p>
    </main>
  );
}
