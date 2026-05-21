import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Plugins — Heads of dans Claude Code",
  description:
    "Marketplace privé de 16 personas Head of (Launch, Sales, Finance, Product...) pour Claude Code. Chaque persona orchestre plusieurs skills via une slash command.",
  openGraph: {
    title: "Team Plugins — Heads of dans Claude Code",
    description:
      "16 personas Head of pour Claude Code. Orchestrés par slash command, bundlés avec ~70 skills experts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
