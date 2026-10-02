import type { Recipe } from '../content/types.ts';
import { SITE } from '../content/index.ts';
import { CodeBlock, DocsLinks, SectionView } from '../components/Blocks.tsx';

function curlFor(action: string, input: unknown, route: 'check' | 'quote'): string {
  const payload = route === 'check' ? { action, input } : { requestKey: 'REQUEST_KEY', action, input };
  const auth = route === 'quote' ? `  -H "Authorization: Bearer $IMD_PAID_TOKEN" \\\n` : '';
  return `curl --fail-with-body -X POST "${SITE.api}/requests/${route}" \\\n${auth}  -H 'Content-Type: application/json' \\\n  --data-binary @- <<'EOF'\n${JSON.stringify(payload, null, 2)}\nEOF`;
}

export function RecipeView({ recipe }: { recipe: Recipe }) {
  const quoteBody = { action: recipe.action, input: recipe.body };
  return (
    <article>
      <header className="page-head">
        <h1>{recipe.title}</h1>
        <p className="lead">{recipe.lead}</p>
        <dl className="stamp" role="group" aria-label="Recipe stamp">
          <div>
            <dt>Action</dt>
            <dd>
              <code>{recipe.action}</code>
            </dd>
          </div>
          <div>
            <dt>Version</dt>
            <dd>
              <code>{recipe.version}</code>
            </dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd className="num">{recipe.price}</dd>
          </div>
          <div>
            <dt>Checked</dt>
            <dd className="num">{recipe.checkedOn}</dd>
          </div>
          <div>
            <dt>Control plane</dt>
            <dd>
              <code>{SITE.controlPlaneCommit}</code>
            </dd>
          </div>
        </dl>
        <DocsLinks docs={recipe.docs} />
      </header>

      <section aria-labelledby="s-body">
        <h2 id="s-body">{recipe.checkBody ? 'The bodies' : 'The body that passed the check'}</h2>
        {recipe.checkBody ? (
          <>
            <p>
              The check takes a short form. Send this to <code>POST /requests/check</code>:
            </p>
            <CodeBlock lang="json" title="check input" code={JSON.stringify({ action: recipe.action, input: recipe.checkBody }, null, 2)} />
            <p>
              Send the full body the check returned to <code>POST /requests/quote</code>:
            </p>
            <CodeBlock lang="json" title="quote input" code={JSON.stringify(quoteBody, null, 2)} />
          </>
        ) : (
          <CodeBlock lang="json" title={`${recipe.action} input`} code={JSON.stringify(quoteBody, null, 2)} />
        )}
        <details className="disclosure">
          <summary>Run it as curl</summary>
          <CodeBlock lang="bash" title="free check" code={curlFor(recipe.action, recipe.checkBody ?? recipe.body, 'check')} />
          <CodeBlock lang="bash" title="quote (needs your request token and a fresh UUID)" code={curlFor(recipe.action, recipe.body, 'quote')} />
        </details>
        <aside className="note">
          <p>
            <strong>What the check said on {recipe.checkedOn}.</strong> {recipe.checkResult}
          </p>
        </aside>
      </section>

      {recipe.sections.map((s) => (
        <SectionView key={s.id} section={s} />
      ))}
    </article>
  );
}
