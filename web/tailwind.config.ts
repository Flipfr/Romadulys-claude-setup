import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Categories palette (OKLCH-inspired, matches Notion DB colors)
        meta: "oklch(62% 0.22 25)",        // red
        switch: "oklch(58% 0.12 50)",      // brown
        tech: "oklch(62% 0.18 250)",       // blue
        sales: "oklch(65% 0.18 145)",      // green
        marketing: "oklch(70% 0.18 340)",  // pink
        seo: "oklch(60% 0.20 305)",        // purple
        growth: "oklch(72% 0.18 60)",      // orange
        finance: "oklch(78% 0.18 95)",     // yellow
        ops: "oklch(60% 0.02 240)",        // default
        industry: "oklch(60% 0.02 0)",     // gray
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
