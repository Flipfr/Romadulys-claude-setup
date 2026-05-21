#!/usr/bin/env node
/**
 * Best-effort: regenerates `data/plugins.json` from the repo's marketplace.json,
 * each plugin's package.json, the orchestration command markdown, and the SKILL.md
 * of every bundled skill.
 *
 * Output schema (per plugin):
 *   - name, description, category, source, slashCommand, skills (names)
 *   - orchestration: { description, body }   ← from commands/<slash>.md
 *   - skillsDetailed: [{ name, description, body }, ...]   ← from skills/<name>/SKILL.md
 *   - readme: string                          ← from README.md
 *
 * Skipped silently on Vercel (where the repo isn't fully uploaded) — falls back
 * to the committed data/plugins.json.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const MARKETPLACE_PATH = path.join(REPO_ROOT, ".claude-plugin", "marketplace.json");
const OUTPUT_PATH = path.join(WEB_ROOT, "data", "plugins.json");

if (!fs.existsSync(MARKETPLACE_PATH)) {
  if (fs.existsSync(OUTPUT_PATH)) {
    console.log(
      `ℹ️  Skipping regeneration (marketplace.json not reachable, using committed data/plugins.json)`,
    );
    process.exit(0);
  } else {
    console.error(
      `❌ No marketplace.json reachable AND no committed data/plugins.json — cannot build.`,
    );
    process.exit(1);
  }
}

/**
 * Parses a Markdown file with optional YAML-ish frontmatter (--- ... ---).
 * Returns { description, body } where description is the `description:` field
 * from the frontmatter (or first line of body) and body is the rest.
 */
function parseMarkdownWithFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) {
    return { description: "", body: "" };
  }
  // Normalize CRLF → LF (Windows files come with CRLF after git checkout)
  const raw = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) {
    return { description: "", body: raw.trim() };
  }
  const frontmatter = fmMatch[1];
  const body = (fmMatch[2] ?? "").trim();
  const descMatch = frontmatter.match(/^description:\s*(?:"([^"]+)"|(.+))$/m);
  const description = (descMatch?.[1] ?? descMatch?.[2] ?? "").trim();
  return { description, body };
}

const manifest = JSON.parse(fs.readFileSync(MARKETPLACE_PATH, "utf-8"));

const plugins = manifest.plugins.map((p) => {
  const pluginDir = path.resolve(REPO_ROOT, p.source);
  const pkgPath = path.join(pluginDir, "package.json");

  let skills = [];
  let slashCommand = p.name.replace("head-of-", "");

  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      skills = pkg.skills ?? [];
      if (pkg.commands?.[0]) slashCommand = pkg.commands[0];
    } catch (e) {
      console.warn(`⚠️  ${p.name}: failed to read package.json (${e.message})`);
    }
  }

  // Orchestration : commands/<slash>.md
  const orchestrationPath = path.join(pluginDir, "commands", `${slashCommand}.md`);
  const orchestration = parseMarkdownWithFrontmatter(orchestrationPath);

  // Skills détaillées
  const skillsDetailed = skills.map((skillName) => {
    const skillPath = path.join(pluginDir, "skills", skillName, "SKILL.md");
    const { description, body } = parseMarkdownWithFrontmatter(skillPath);
    return { name: skillName, description, body };
  });

  // README du plugin
  const readmePath = path.join(pluginDir, "README.md");
  const readme = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf-8")
    : "";

  return {
    name: p.name,
    description: p.description,
    category: p.category,
    source: p.source,
    slashCommand,
    skills,
    orchestration,
    skillsDetailed,
    readme,
  };
});

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify({ manifest, plugins }, null, 2),
);

const totalSize = fs.statSync(OUTPUT_PATH).size;
const sizeKb = (totalSize / 1024).toFixed(1);
console.log(`✅ Generated ${OUTPUT_PATH} with ${plugins.length} plugins (${sizeKb} KB)`);
