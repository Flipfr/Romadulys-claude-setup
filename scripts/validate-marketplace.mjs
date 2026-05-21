#!/usr/bin/env node
/**
 * Validates the team-plugins marketplace structure.
 *
 * Checks performed:
 *  1. .claude-plugin/marketplace.json is valid JSON
 *  2. Top-level required fields are present
 *  3. Each plugin entry has the required fields
 *  4. No duplicate plugin names
 *  5. Each plugin's `source` folder exists on disk
 *  6. Each plugin has a .claude-plugin/plugin.json with at least name + description
 *  7. Each plugin's commands/<slash>.md exists
 *  8. All skills listed in package.json exist under skills/
 *
 * Exit code 0 = OK, 1 = errors found.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MARKETPLACE_PATH = path.join(
  REPO_ROOT,
  ".claude-plugin",
  "marketplace.json",
);

const errors = [];
const warnings = [];

function err(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

// 1. Read & parse marketplace.json
if (!fs.existsSync(MARKETPLACE_PATH)) {
  err(`marketplace.json not found at ${MARKETPLACE_PATH}`);
  finish();
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(MARKETPLACE_PATH, "utf-8"));
} catch (e) {
  err(`marketplace.json is not valid JSON: ${e.message}`);
  finish();
}

// 2. Top-level required fields
const requiredTop = ["name", "owner", "plugins"];
for (const field of requiredTop) {
  if (!(field in manifest)) err(`marketplace.json missing required field: "${field}"`);
}
if (!Array.isArray(manifest.plugins)) {
  err(`marketplace.json "plugins" must be an array`);
  finish();
}

// 3+4. Each plugin entry + no duplicates
const seenNames = new Set();
for (const [i, plugin] of manifest.plugins.entries()) {
  const ctx = `plugins[${i}]`;
  for (const field of ["name", "description", "category", "source"]) {
    if (!plugin[field]) err(`${ctx} missing required field: "${field}"`);
  }
  if (plugin.name) {
    if (seenNames.has(plugin.name)) err(`Duplicate plugin name: "${plugin.name}"`);
    seenNames.add(plugin.name);
  }

  if (!plugin.source) continue;
  const pluginDir = path.resolve(REPO_ROOT, plugin.source);

  // 5. Source folder exists
  if (!fs.existsSync(pluginDir)) {
    err(`${ctx} "${plugin.name}": source folder not found at ${plugin.source}`);
    continue;
  }

  // 6. .claude-plugin/plugin.json exists with name + description
  const pluginJsonPath = path.join(pluginDir, ".claude-plugin", "plugin.json");
  if (!fs.existsSync(pluginJsonPath)) {
    err(`${ctx} "${plugin.name}": missing .claude-plugin/plugin.json`);
  } else {
    try {
      const pj = JSON.parse(fs.readFileSync(pluginJsonPath, "utf-8"));
      if (!pj.name) err(`${plugin.name}/plugin.json: missing "name"`);
      if (!pj.description) warn(`${plugin.name}/plugin.json: missing "description"`);
      if (pj.name && pj.name !== plugin.name) {
        err(`${plugin.name}/plugin.json: name "${pj.name}" doesn't match marketplace entry "${plugin.name}"`);
      }
    } catch (e) {
      err(`${plugin.name}/plugin.json: invalid JSON (${e.message})`);
    }
  }

  // 7+8. package.json parsing for commands + skills
  const pkgJsonPath = path.join(pluginDir, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

      // 7. commands/<slash>.md exists
      for (const cmd of pkg.commands ?? []) {
        const cmdPath = path.join(pluginDir, "commands", `${cmd}.md`);
        if (!fs.existsSync(cmdPath)) {
          err(`${plugin.name}: declared command "${cmd}" but commands/${cmd}.md not found`);
        }
      }

      // 8. skills exist in skills/ folder
      for (const skill of pkg.skills ?? []) {
        const skillPath = path.join(pluginDir, "skills", skill, "SKILL.md");
        if (!fs.existsSync(skillPath)) {
          err(`${plugin.name}: declared skill "${skill}" but skills/${skill}/SKILL.md not found`);
        }
      }

      // Version sanity check
      if (pkg.version && !/^\d+\.\d+\.\d+/.test(pkg.version)) {
        warn(`${plugin.name}/package.json: version "${pkg.version}" doesn't follow semver`);
      }
    } catch (e) {
      err(`${plugin.name}/package.json: invalid JSON (${e.message})`);
    }
  } else {
    warn(`${plugin.name}: no package.json (skills/commands not validated)`);
  }
}

finish();

function finish() {
  console.log(`\n📋 Validating ${manifest?.plugins?.length ?? 0} plugins in marketplace "${manifest?.name ?? "?"}"\n`);

  if (warnings.length) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`   - ${w}`);
  }

  if (errors.length) {
    console.log(`\n❌ ${errors.length} error(s):`);
    for (const e of errors) console.log(`   - ${e}`);
    console.log(`\n✘ Validation failed.\n`);
    process.exit(1);
  }

  console.log(`\n✅ Validation passed (${manifest.plugins.length} plugins OK).\n`);
  process.exit(0);
}
