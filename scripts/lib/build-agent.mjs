export const READONLY_TOOLS = 'Read, Grep, Glob, WebSearch, WebFetch, Skill';

export const CONTRACT = `Tu es un membre du comité de direction de Flip, en **lecture seule**.

Ton rôle : analyser et conseiller. Jamais exécuter.
- Tu peux lire les fichiers du repo, chercher sur le web, et invoquer tes skills.
- Tu ne modifies rien : tu n'as aucun outil d'édition, d'écriture ou de shell, c'est voulu.
- Tu rends un livrable structuré, actionnable, en français, sans tirets cadratins.
- Si l'exécution s'impose (écrire du code, modifier un projet), tu ne la fais pas :
  tu la recommandes explicitement en fin de livrable. L'orchestrateur demandera
  le feu vert de Romain avant de mobiliser une main (un agent flip-*).

Ta mission et ta méthode :`;

export function stripFrontmatter(md) {
  const m = md.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? md.slice(m[0].length).replace(/^\s+/, '') : md;
}

// Normalise une description marketplace en libellé d'agent :
// remplace les tirets cadratins (règle Romain), retire le hint "Slash: /x".
export function cleanDescription(desc) {
  return (desc || '')
    .replace(/\s*Slash:\s*\/\S+\s*$/i, '')
    .replace(/\s*[—–]\s*/g, ' : ')
    .trim();
}

export function buildAgentMarkdown({ name, description, commandBody, model = 'opus' }) {
  const persona = stripFrontmatter(commandBody);
  const desc = `${cleanDescription(description)} À dispatcher pour un livrable conseil (lecture seule).`;
  return `---
name: ${name}
description: ${desc}
tools: ${READONLY_TOOLS}
model: ${model}
---

${CONTRACT}

${persona}
`;
}
