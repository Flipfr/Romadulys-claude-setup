import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getPlugin,
  getAllPluginNames,
  CATEGORY_LABELS,
  PERSONA_EMOJI,
  cleanPersonaTitle,
} from "@/lib/plugins";
import { MarkdownContent } from "@/components/MarkdownContent";
import { CopyButton } from "@/components/CopyButton";

type PageProps = {
  params: Promise<{ name: string }>;
};

export async function generateStaticParams() {
  return getAllPluginNames().map((name) => ({ name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const plugin = getPlugin(name);
  if (!plugin) return { title: "Plugin introuvable" };
  const title = cleanPersonaTitle(plugin.name);
  return {
    title: `${title} — Team Plugins`,
    description: plugin.description,
  };
}

export default async function PluginDetailPage({ params }: PageProps) {
  const { name } = await params;
  const plugin = getPlugin(name);

  if (!plugin) {
    notFound();
  }

  const emoji = PERSONA_EMOJI[plugin.name] ?? "🧩";
  const title = cleanPersonaTitle(plugin.name);
  const installCmd = `claude plugin install ${plugin.name}@team-plugins`;
  const slashCmd = `/${plugin.slashCommand}`;
  const githubUrl = `https://github.com/Romadulys/Romadulys-claude-setup/tree/main/${plugin.source.replace(/^\.\//, "")}`;

  return (
    <main className="min-h-screen pb-20">
      {/* Top bar with back link */}
      <div className="border-b border-[var(--border)] sticky top-0 bg-[var(--bg)]/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)] flex items-center gap-1.5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Catalogue
          </Link>
          <CopyButton text={installCmd} label="Copy install" />
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-10 sm:py-14">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl sm:text-6xl shrink-0" aria-hidden>
              {emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">
                {CATEGORY_LABELS[plugin.category]} · {plugin.skills.length} skills
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
            </div>
          </div>

          <p className="text-lg text-[var(--muted)] leading-relaxed mb-6">
            {plugin.description.split("—")[1]?.trim() ?? plugin.description}
          </p>

          {/* Slash command + install */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-2.5">
              <span className="text-xs text-[var(--muted)] font-medium">Slash command :</span>
              <code className="text-sm font-mono text-[var(--accent)] font-semibold">{slashCmd}</code>
              <CopyButton text={slashCmd} label="" className="!ml-1" />
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-xs text-[var(--muted)] mb-2 font-medium">Installation :</div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs sm:text-sm font-mono text-[var(--fg)] truncate">
                {installCmd}
              </code>
              <CopyButton text={installCmd} label="" />
            </div>
          </div>
        </div>
      </section>

      {/* Orchestration */}
      {plugin.orchestration.body && (
        <section className="border-b border-[var(--border)]">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h2 className="text-2xl font-bold tracking-tight mb-2">🎭 Orchestration</h2>
            <p className="text-sm text-[var(--muted)] mb-6">
              Ce que le persona fait quand tu lances <code className="font-mono text-[var(--accent)]">{slashCmd}</code> :
              il enchaîne {plugin.skills.length} skills experts dans un ordre cohérent et te livre un pack consolidé.
            </p>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8">
              <MarkdownContent>{plugin.orchestration.body}</MarkdownContent>
            </div>
          </div>
        </section>
      )}

      {/* Skills incluses (détaillées) */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            🧠 {plugin.skillsDetailed.length} skills bundlées
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            Chaque skill est un prompt expert que le persona invoque automatiquement. Tu peux aussi
            les utiliser individuellement (sans passer par le persona) en les chargeant directement
            dans Claude.
          </p>

          <div className="space-y-4">
            {plugin.skillsDetailed.map((skill) => (
              <details
                key={skill.name}
                className="group bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden"
              >
                <summary className="cursor-pointer p-5 hover:bg-[var(--bg)]/50 transition-colors flex items-start gap-3 list-none">
                  <span className="text-sm font-mono text-[var(--accent)] shrink-0 mt-0.5 select-none group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-mono text-sm font-semibold text-[var(--fg)]">
                      {skill.name}
                    </h3>
                    {skill.description && (
                      <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed line-clamp-2 group-open:line-clamp-none">
                        {skill.description}
                      </p>
                    )}
                  </div>
                </summary>
                {skill.body && (
                  <div className="border-t border-[var(--border)] p-5 sm:p-6 bg-[var(--bg)]/30">
                    <MarkdownContent>{skill.body}</MarkdownContent>
                  </div>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer: links */}
      <section>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--accent)] hover:underline flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Voir tous les Heads of
            </Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] hover:underline flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Voir sur GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
