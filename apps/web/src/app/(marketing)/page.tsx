export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-16">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          VertexPM
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Production-ready monorepo foundation
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          The web experience is scaffolded with a feature-oriented layout for future boards,
          collaboration flows, and AI-powered workspaces.
        </p>
      </section>
    </main>
  );
}
