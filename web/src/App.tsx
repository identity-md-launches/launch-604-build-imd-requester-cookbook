import { useEffect, useRef } from 'react';
import { SITE, findPage, findRecipe } from './content/index.ts';
import { Shell } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { PageView } from './pages/PageView.tsx';
import { RecipeView } from './pages/RecipeView.tsx';
import { ErrorsView } from './pages/ErrorsView.tsx';
import { useHashRoute } from './lib/router.ts';

function titleFor(route: string): string {
  if (route === '') return SITE.name;
  if (route === 'errors') return `Error catalog · ${SITE.name}`;
  const r = findRecipe(route) ?? findPage(route);
  return r ? `${r.title} · ${SITE.name}` : `Not found · ${SITE.name}`;
}

function NotFound({ route }: { route: string }) {
  return (
    <article>
      <header className="page-head">
        <h1>No page at “{route}”</h1>
        <p className="lead">The cookbook has a getting-started page, one recipe per action, an error catalog, limits and research links.</p>
      </header>
      <p>
        <a href="#/">Go to the overview</a>
      </p>
    </article>
  );
}

export default function App() {
  const route = useHashRoute();
  const first = useRef(true);

  useEffect(() => {
    document.title = titleFor(route);
    if (first.current) {
      first.current = false;
      return;
    }
    // Route change in a single page: scroll up and move focus to the new content.
    window.scrollTo({ top: 0 });
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [route]);

  let content;
  if (route === '') content = <Home />;
  else if (route === 'errors') content = <ErrorsView />;
  else {
    const recipe = findRecipe(route);
    const page = recipe ? undefined : findPage(route);
    content = recipe ? <RecipeView recipe={recipe} /> : page ? <PageView page={page} /> : <NotFound route={route} />;
  }

  return <Shell route={route}>{content}</Shell>;
}
