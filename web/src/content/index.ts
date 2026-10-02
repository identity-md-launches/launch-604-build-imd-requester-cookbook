import type { Page, Recipe } from './types.ts';
import { start } from './start.ts';
import { recipes } from './recipes.ts';
import { errors } from './errors.ts';
import { limits } from './limits.ts';
import { research } from './research.ts';
import { SITE } from './site.ts';

export { SITE, start, recipes, errors, limits, research };
export type { Page, Recipe };

export interface NavGroup {
  title: string;
  items: { slug: string; title: string; short: string }[];
}

export const nav: NavGroup[] = [
  {
    title: 'Start',
    items: [
      { slug: '', title: 'Overview', short: 'Overview' },
      { slug: 'start', title: start.title, short: 'Getting started' },
    ],
  },
  {
    title: 'Recipes',
    items: recipes.map((r) => ({ slug: r.slug, title: r.title, short: r.action })),
  },
  {
    title: 'Reference',
    items: [
      { slug: 'errors', title: 'Error catalog', short: 'Error catalog' },
      { slug: 'limits', title: limits.title, short: 'Limits' },
      { slug: 'research', title: research.title, short: 'Research on wording' },
    ],
  },
];

export function findRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function findPage(slug: string): Page | undefined {
  if (slug === 'start') return start;
  if (slug === 'limits') return limits;
  if (slug === 'research') return research;
  return undefined;
}
