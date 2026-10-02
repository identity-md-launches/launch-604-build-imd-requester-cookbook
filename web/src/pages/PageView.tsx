import type { Page } from '../content/types.ts';
import { DocsLinks, SectionView } from '../components/Blocks.tsx';

export function PageView({ page }: { page: Page }) {
  return (
    <article>
      <header className="page-head">
        <h1>{page.title}</h1>
        <p className="lead">{page.lead}</p>
        <DocsLinks docs={page.docs} />
      </header>
      {page.sections.map((s) => (
        <SectionView key={s.id} section={s} />
      ))}
    </article>
  );
}
