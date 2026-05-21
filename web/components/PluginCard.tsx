import Link from "next/link";
import { Plugin, PERSONA_EMOJI, CATEGORY_LABELS, cleanPersonaTitle } from "@/lib/plugins";
import { CopyButton } from "./CopyButton";

type PluginCardProps = {
  plugin: Plugin;
};

export function PluginCard({ plugin }: PluginCardProps) {
  const emoji = PERSONA_EMOJI[plugin.name] ?? "🧩";
  const installCmd = `claude plugin install ${plugin.name}@team-plugins`;
  const slashCmd = `/${plugin.slashCommand}`;
  const title = cleanPersonaTitle(plugin.name);
  const shortDescription =
    plugin.description.split("—")[1]?.trim() ?? plugin.description;

  return (
    <article className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:border-[var(--accent)]/30 hover:shadow-lg hover:-translate-y-0.5">
      <Link
        href={`/p/${plugin.name}`}
        className="flex items-start gap-3 mb-3 hover:no-underline"
      >
        <div className="text-3xl shrink-0" aria-hidden>
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base leading-tight truncate group-hover:text-[var(--accent)] transition-colors">
            {title}
          </h3>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            {CATEGORY_LABELS[plugin.category]} · {plugin.skills.length} skills
          </div>
        </div>
      </Link>

      <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 line-clamp-3">
        {shortDescription}
      </p>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between gap-2">
          <code className="text-xs font-mono bg-[var(--bg)] px-2 py-1 rounded text-[var(--accent)] font-medium truncate">
            {slashCmd}
          </code>
          <CopyButton text={slashCmd} label="" className="!px-2 !py-1" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/p/${plugin.name}`}
            className="flex-1 text-xs font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            Voir le détail
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
          <CopyButton text={installCmd} label="Install" />
        </div>
      </div>

      {plugin.skills.length > 0 && (
        <details className="mt-3 pt-3 border-t border-[var(--border)]">
          <summary className="text-xs text-[var(--muted)] cursor-pointer hover:text-[var(--accent)] select-none">
            {plugin.skills.length} skills bundlées
          </summary>
          <ul className="mt-2 flex flex-wrap gap-1">
            {plugin.skills.map((skill) => (
              <li
                key={skill}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg)] text-[var(--muted)]"
              >
                {skill}
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
