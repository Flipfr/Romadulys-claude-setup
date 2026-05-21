import data from "../data/plugins.json";

export type PluginCategory =
  | "marketing"
  | "consulting"
  | "finance"
  | "sales"
  | "product"
  | "people"
  | "operations"
  | "engineering"
  | "design"
  | "analytics"
  | "growth"
  | "customer-success"
  | "communications"
  | "education";

export type SkillDetailed = {
  name: string;
  description: string;
  body: string;
};

export type Orchestration = {
  description: string;
  body: string;
};

export type Plugin = {
  name: string;
  description: string;
  category: PluginCategory;
  source: string;
  slashCommand: string;
  skills: string[];
  orchestration: Orchestration;
  skillsDetailed: SkillDetailed[];
  readme: string;
};

type MarketplaceManifest = {
  name: string;
  metadata?: { description?: string };
  owner: { name: string; email: string };
  plugins: Array<{
    name: string;
    description: string;
    category: PluginCategory;
    source: string;
  }>;
};

type GeneratedData = {
  manifest: MarketplaceManifest;
  plugins: Plugin[];
};

export function getMarketplace(): GeneratedData {
  return data as GeneratedData;
}

export function getPlugin(name: string): Plugin | undefined {
  return (data as GeneratedData).plugins.find((p) => p.name === name);
}

export function getAllPluginNames(): string[] {
  return (data as GeneratedData).plugins.map((p) => p.name);
}

export const CATEGORY_LABELS: Record<PluginCategory, string> = {
  marketing: "Marketing",
  consulting: "Consulting",
  finance: "Finance",
  sales: "Sales",
  product: "Product",
  people: "People",
  operations: "Operations",
  engineering: "Engineering",
  design: "Design",
  analytics: "Analytics",
  growth: "Growth",
  "customer-success": "Customer Success",
  communications: "Communications",
  education: "Education",
};

export const CATEGORY_EMOJI: Record<PluginCategory, string> = {
  marketing: "📣",
  consulting: "🤝",
  finance: "💰",
  sales: "🎯",
  product: "📦",
  people: "👥",
  operations: "⚙️",
  engineering: "💻",
  design: "🎨",
  analytics: "📊",
  growth: "📈",
  "customer-success": "💚",
  communications: "📰",
  education: "🎓",
};

export const PERSONA_EMOJI: Record<string, string> = {
  "head-of-launch": "🚀",
  "head-of-consulting": "🤝",
  "head-of-finance": "💰",
  "head-of-sales": "🎯",
  "head-of-content": "✍️",
  "head-of-seo": "🔍",
  "head-of-product": "📦",
  "head-of-people": "👥",
  "head-of-operations": "⚙️",
  "head-of-engineering": "💻",
  "head-of-design": "🎨",
  "head-of-data": "📊",
  "head-of-growth": "📈",
  "head-of-customer-success": "💚",
  "head-of-pr": "📰",
  "head-of-academy": "🎓",
};

export function cleanPersonaTitle(name: string): string {
  return name
    .replace("head-of-", "Head of ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
