import { getMarketplace } from "@/lib/plugins";
import { PluginCard } from "@/components/PluginCard";
import { CopyButton } from "@/components/CopyButton";

export default function Home() {
  const { plugins } = getMarketplace();
  const totalSkills = plugins.reduce((acc, p) => acc + p.skills.length, 0);

  const addMarketplaceCmd = "claude plugin marketplace add github:Romadulys/Romadulys-claude-setup";

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-4">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            {plugins.length} plugins · {totalSkills} skills bundlées · marketplace privé
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Ton équipe virtuelle
            <br />
            <span className="text-[var(--accent)]">dans Claude Code.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl leading-relaxed mb-8">
            16 personas <strong className="text-[var(--fg)]">Head of</strong> (Launch, Sales,
            Finance, Product, Engineering...) — chacun orchestre plusieurs skills experts via
            une slash command. Installation en 1 commande.
          </p>

          {/* Install banner */}
          <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-2 pl-4 max-w-full">
            <code className="text-sm font-mono text-[var(--fg)] truncate">
              {addMarketplaceCmd}
            </code>
            <CopyButton text={addMarketplaceCmd} label="Copy install command" className="!px-3 !py-2" />
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            Lance cette commande dans ton terminal, puis <code className="font-mono">/plugin</code> dans Claude Code pour activer ceux que tu veux.
          </p>
        </div>
      </section>

      {/* Plugins grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            L&apos;équipe complète
          </h2>
          <span className="text-sm text-[var(--muted)]">
            {plugins.length} personas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plugins.map((plugin) => (
            <PluginCard key={plugin.name} plugin={plugin} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-12">
            Comment ça marche
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Ajoute le marketplace</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
                Une seule commande dans ton terminal, une seule fois. Tu reçois ensuite
                tous les updates automatiquement.
              </p>
              <code className="block text-xs font-mono bg-[var(--bg)] px-3 py-2 rounded border border-[var(--border)] break-all">
                {addMarketplaceCmd}
              </code>
            </div>

            <div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Installe les personas</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
                Choisis ceux qui te servent. Chaque persona est indépendant — installe
                seulement ceux que tu vas vraiment utiliser.
              </p>
              <code className="block text-xs font-mono bg-[var(--bg)] px-3 py-2 rounded border border-[var(--border)] break-all">
                claude plugin install head-of-sales@team-plugins
              </code>
            </div>

            <div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Utilise via slash command</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
                Redémarre Claude Code, puis tape la slash command du persona. Il
                orchestre les bonnes skills dans le bon ordre, te livre un pack complet.
              </p>
              <code className="block text-xs font-mono bg-[var(--bg)] px-3 py-2 rounded border border-[var(--border)] break-all">
                /sales · /seo · /fundraising ...
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Contribute */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Contribuer un nouveau Head of
          </h2>
          <p className="text-[var(--muted)] max-w-2xl leading-relaxed mb-6">
            Tu identifies un manque dans l&apos;équipe ? Tu veux ajouter un Head of Legal,
            Head of Hardware, Head of Pricing ? Propose-le via Pull Request sur GitHub.
          </p>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 max-w-2xl">
            <h3 className="font-semibold mb-3">Procédure</h3>
            <ol className="space-y-2 text-sm text-[var(--muted)] list-decimal list-inside">
              <li>Fork le repo GitHub</li>
              <li>
                Utilise le skill <code className="font-mono text-[var(--accent)]">plugin-bundler</code> pour générer ton plugin
              </li>
              <li>
                Drop ton plugin dans <code className="font-mono">plugins/</code> + ajoute-le au{" "}
                <code className="font-mono">.claude-plugin/marketplace.json</code>
              </li>
              <li>Ouvre une Pull Request avec un titre clair et une description du cas d&apos;usage</li>
            </ol>
            <a
              href="https://github.com/Romadulys/Romadulys-claude-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Voir sur GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <div>
            Team Plugins — marketplace open source pour Claude Code.
          </div>
          <div>
            Powered by{" "}
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              Claude Code
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
