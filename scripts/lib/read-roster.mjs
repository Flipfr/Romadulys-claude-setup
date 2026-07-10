export function parseRoster(marketplace) {
  const plugins = marketplace.plugins || [];
  return plugins
    .filter((p) => (p.name || '').startsWith('head-of-'))
    .map((p) => ({
      name: p.name,
      domain: p.name.replace(/^head-of-/, ''),
      description: p.description || '',
      source: p.source || '',
    }));
}
