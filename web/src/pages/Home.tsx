import { SITE, limits, recipes, research, start } from '../content/index.ts';
import { hrefFor } from '../lib/router.ts';

export function Home() {
  return (
    <article>
      <header className="page-head">
        <h1>{SITE.name}</h1>
        <p className="lead">{SITE.tagline}</p>
        <p>
          It complements{' '}
          <a href={SITE.docs} rel="noreferrer">
            the IMD docs
          </a>{' '}
          and never repeats them: every page here links the matching docs section, and every recipe body was sent to the free check on{' '}
          {SITE.checkedOn} and is stamped with its action version.
        </p>
      </header>

      <section aria-labelledby="h-first">
        <h2 id="h-first">Read first</h2>
        <ul className="cards">
          <li className="card">
            <h3>
              <a href={hrefFor(start.slug)}>{start.title}</a>
            </h3>
            <p>{start.lead}</p>
          </li>
          <li className="card">
            <h3>
              <a href={hrefFor('errors')}>Error catalog</a>
            </h3>
            <p>Every refusal code with its cause and fix, with the input that reproduced it where the free check could.</p>
          </li>
          <li className="card">
            <h3>
              <a href={hrefFor(limits.slug)}>{limits.title}</a>
            </h3>
            <p>{limits.lead}</p>
          </li>
          <li className="card">
            <h3>
              <a href={hrefFor(research.slug)}>{research.title}</a>
            </h3>
            <p>{research.lead}</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="h-recipes">
        <h2 id="h-recipes">Recipes, one per action</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Action</th>
                <th scope="col">Version</th>
                <th scope="col">Price</th>
                <th scope="col">Checked</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.slug}>
                  <th scope="row">
                    <a href={hrefFor(r.slug)}>
                      <code>{r.action}</code>
                    </a>
                  </th>
                  <td>
                    <code>{r.version}</code>
                  </td>
                  <td className="num">{r.price}</td>
                  <td className="num">{r.checkedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-agents">
        <h2 id="h-agents">For agents</h2>
        <p>
          <a href="llms.txt">llms.txt</a> is the index, one line per page. <a href="llms-full.txt">llms-full.txt</a> is every page as
          plain Markdown, recipe bodies included. Both are generated from the same source as these pages.
        </p>
      </section>
    </article>
  );
}
