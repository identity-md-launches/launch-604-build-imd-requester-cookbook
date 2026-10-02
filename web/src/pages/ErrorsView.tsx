import { useId, useMemo, useState } from 'react';
import { SITE, errors } from '../content/index.ts';
import type { ErrorEntry } from '../content/types.ts';
import { DocsLinks } from '../components/Blocks.tsx';
import { renderInline } from '../lib/inline.tsx';

const WHERE: { value: ErrorEntry['where'] | 'all'; label: string }[] = [
  { value: 'all', label: 'Anywhere' },
  { value: 'check', label: 'At the check or quote' },
  { value: 'quote', label: 'At the quote only' },
  { value: 'submit', label: 'At submit (payment)' },
  { value: 'read', label: 'On a public read' },
  { value: 'run', label: 'While work runs' },
];

function matches(e: ErrorEntry, q: string, where: string): boolean {
  if (where !== 'all' && e.where !== where) return false;
  if (!q) return true;
  const hay = `${e.code} ${e.cause} ${e.fix} ${e.observed}`.toLowerCase();
  return hay.includes(q);
}

export function ErrorsView() {
  const [query, setQuery] = useState('');
  const [where, setWhere] = useState('all');
  const qId = useId();
  const wId = useId();
  const q = query.trim().toLowerCase();
  const shown = useMemo(() => errors.filter((e) => matches(e, q, where)), [q, where]);
  const required = shown.filter((e) => e.required);
  const rest = shown.filter((e) => !e.required);
  const filtered = q !== '' || where !== 'all';

  return (
    <article>
      <header className="page-head">
        <h1>Error catalog</h1>
        <p className="lead">
          Every refusal code a requester meets, with its cause and fix. Codes were probed through the free check and public reads on{' '}
          {SITE.checkedOn}; where a code needs a payment to appear, the entry says it was not reproduced.
        </p>
        <DocsLinks
          docs={[
            { label: 'Errors', href: `${SITE.docs}#errors` },
            { label: 'Errors and limits of paid requests', href: `${SITE.docs}#paid` },
          ]}
        />
      </header>

      <form className="filters" role="search" aria-label="Filter the catalog" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor={qId}>Find a code</label>
          <input
            id={qId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="invalid_plan"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="field">
          <label htmlFor={wId}>Where it appears</label>
          <select id={wId} value={where} onChange={(e) => setWhere(e.target.value)}>
            {WHERE.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
        <p role="status" className="filters-status">
          {shown.length === errors.length ? `${errors.length} codes` : `${shown.length} of ${errors.length} codes`}
        </p>
      </form>

      {shown.length === 0 ? (
        <div className="empty">
          <p className="empty-title">No codes match {query ? `"${query}"` : 'that place'}</p>
          <p>Codes are matched on their name, cause, fix and observation.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setQuery('');
              setWhere('all');
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {required.length > 0 && (
            <section aria-labelledby="s-required">
              <h2 id="s-required">Codes named by the assignment</h2>
              {required.map((e) => (
                <ErrorCard key={e.code} entry={e} />
              ))}
            </section>
          )}
          {rest.length > 0 && (
            <section aria-labelledby="s-other">
              <h2 id="s-other">Other codes you will meet</h2>
              {rest.map((e) => (
                <ErrorCard key={e.code} entry={e} />
              ))}
            </section>
          )}
          {filtered && (
            <p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setQuery('');
                  setWhere('all');
                }}
              >
                Clear filters
              </button>
            </p>
          )}
        </>
      )}
    </article>
  );
}

function ErrorCard({ entry }: { entry: ErrorEntry }) {
  const id = `e-${entry.code.replace(/[^a-z0-9_]/gi, '-')}`;
  return (
    <article className="error" aria-labelledby={`${id}-h`} id={id}>
      <h3 id={`${id}-h`}>
        <code>{entry.code}</code>
      </h3>
      <p className="error-where">
        <span className="pill">{entry.where}</span> {entry.status}
      </p>
      <dl className="error-body">
        <dt>Cause</dt>
        <dd>{renderInline(entry.cause)}</dd>
        <dt>Fix</dt>
        <dd>{renderInline(entry.fix)}</dd>
        <dt>Observed</dt>
        <dd>{renderInline(entry.observed)}</dd>
      </dl>
      <p className="error-docs">
        <a href={`${SITE.docs}#${entry.docs}`} rel="noreferrer">
          Read the docs section for {entry.code}
        </a>
      </p>
    </article>
  );
}
