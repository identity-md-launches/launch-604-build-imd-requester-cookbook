import type { ReactNode } from 'react';

// Renders the inline subset used in content: `code`, **bold**, [text](url).
const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function renderInline(text: string): ReactNode[] {
  const parts = text.split(TOKEN);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (m) {
      const external = /^https?:/.test(m[2]);
      return (
        <a key={i} href={m[2]} {...(external ? { rel: 'noreferrer' } : {})}>
          {m[1]}
        </a>
      );
    }
    return part;
  });
}
