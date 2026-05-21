export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-lg text-[var(--muted)]">Page introuvable.</p>
        <a href="/" className="inline-block mt-6 text-sm font-medium text-[var(--accent)] hover:underline">
          ← Retour au catalogue
        </a>
      </div>
    </main>
  );
}
