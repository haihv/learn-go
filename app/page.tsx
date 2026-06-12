import Link from "next/link";
import { curriculum } from "@/lib/curriculum";
import Badge from "@/components/ui/Badge";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function HomePage() {
  return (
    <main>
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-go-cyan text-sm font-mono mb-6 border border-navy-600 rounded-full px-4 py-1.5 bg-navy-800">
          🐹 Free & Open Source
        </p>
        <h1 className="text-stone-900 text-5xl md:text-7xl font-bold font-serif mb-6 tracking-tight">
          Learn Go Interactively
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto mb-10">
          Master Go through lessons, hands-on workshops, and coding labs — <strong>no setup required</strong>.
        </p>
        <Link
          href="/learn/intro"
          className="bg-stone-900 text-stone-50 font-bold font-mono px-8 py-3 rounded-full text-lg shadow-md hover:bg-stone-700 hover:shadow-lg transition"
        >
          Get Started →
        </Link>
      </section>

      <section className="py-20 px-4 bg-navy-900">
        <h2 className="text-center text-4xl font-bold font-serif text-stone-900 mb-12">
          Everything You Need to Learn Go
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-navy-800 border border-go-blue/30 hover:border-go-blue rounded-xl p-6 transition-all hover:-translate-y-1">
            <span className="text-4xl">📖</span>
            <h3 className="text-xl font-bold font-serif text-stone-900 mt-3 mb-2">Lessons</h3>
            <p className="text-stone-500 text-sm">
              Read concise theory with syntax-highlighted Go examples, then prove your understanding with a quick quiz.
            </p>
          </div>
          <div className="bg-navy-800 border border-go-purple/30 hover:border-go-purple rounded-xl p-6 transition-all hover:-translate-y-1">
            <span className="text-4xl">🔨</span>
            <h3 className="text-xl font-bold font-serif text-stone-900 mt-3 mb-2">Workshops</h3>
            <p className="text-stone-500 text-sm">
              Follow step-by-step guided exercises. Each step validates your code before you can move on.
            </p>
          </div>
          <div className="bg-navy-800 border border-go-green/30 hover:border-go-green rounded-xl p-6 transition-all hover:-translate-y-1">
            <span className="text-4xl">🧪</span>
            <h3 className="text-xl font-bold font-serif text-stone-900 mt-3 mb-2">Labs</h3>
            <p className="text-stone-500 text-sm">
              Solve open-ended challenges. An automated test suite checks your output and gives instant feedback.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-navy-950">
        <h2 className="text-center text-4xl font-bold font-serif text-stone-900 mb-12">
          Curriculum
        </h2>
        <div className="max-w-2xl mx-auto w-full border border-navy-600 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-navy-800">
              <tr>
                <th className="px-4 py-3 text-sm text-left text-stone-500">#</th>
                <th className="px-4 py-3 text-sm text-left text-stone-500">Module</th>
                <th className="px-4 py-3 text-sm text-left text-stone-500">Type</th>
                <th className="px-4 py-3 text-sm text-left text-stone-500">Time</th>
              </tr>
            </thead>
            <tbody>
              {curriculum.map((m, i) => (
                <tr key={m.slug} className="border-t border-navy-600 hover:bg-navy-800 transition-colors">
                  <td className="px-4 py-3 text-sm text-navy-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/learn/${m.slug}`} className="text-stone-800 hover:text-go-cyan transition-colors">
                      {m.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge type={m.type} />
                  </td>
                  <td className="px-4 py-3 text-sm text-navy-500">~{m.estimatedMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="py-8 text-center bg-navy-900 border-t border-navy-600">
        <p className="text-navy-500 text-sm">Free & open source · Inspired by freeCodeCamp</p>
      </footer>
    </main>
  );
}
