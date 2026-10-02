import type { Block, DocLink, Section } from '../content/types.ts';
import { renderInline } from '../lib/inline.tsx';
import { CopyButton } from './CopyButton.tsx';

export function CodeBlock({ code, lang, title }: { code: string; lang: string; title?: string }) {
  return (
    <figure className="code">
      <figcaption className="code-head">
        <span className="code-title">{title ?? lang}</span>
        <CopyButton text={code} label={lang === 'json' ? 'Copy JSON' : 'Copy'} subject={title ?? lang} />
      </figcaption>
      <pre>
        <code className={`lang-${lang}`}>{code}</code>
      </pre>
    </figure>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return <p>{renderInline(block.text)}</p>;
    case 'ul':
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ol>
      );
    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} title={block.title} />;
    case 'table':
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{renderInline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'note':
      return (
        <aside className="note">
          <p>
            <strong>{block.title}.</strong> {renderInline(block.text)}
          </p>
        </aside>
      );
  }
}

export function SectionView({ section }: { section: Section }) {
  return (
    <section aria-labelledby={`s-${section.id}`}>
      <h2 id={`s-${section.id}`}>{section.title}</h2>
      {section.blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </section>
  );
}

export function DocsLinks({ docs }: { docs: DocLink[] }) {
  return (
    <p className="docs-links">
      <span className="docs-links-label">In the docs:</span>{' '}
      {docs.map((d, i) => (
        <span key={d.href}>
          {i > 0 ? ', ' : ''}
          <a href={d.href} rel="noreferrer">
            {d.label}
          </a>
        </span>
      ))}
    </p>
  );
}
