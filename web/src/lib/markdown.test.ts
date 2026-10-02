import { describe, expect, it } from 'vitest';
import { llmsFull, llmsIndex } from './markdown.ts';
import { SITE, errors, recipes } from '../content/index.ts';

describe('llms output', () => {
  it('indexes every page with its lead and recipe stamp', () => {
    const idx = llmsIndex();
    expect(idx.startsWith(`# ${SITE.name}`)).toBe(true);
    expect(idx).toContain(SITE.banner);
    for (const r of recipes) {
      expect(idx).toContain(`(#/${r.slug})`);
      expect(idx).toContain(`${r.action} ${r.version}, checked ${r.checkedOn}`);
    }
    expect(idx).toContain('(#/errors)');
    expect(idx).toContain('(#/limits)');
    expect(idx).toContain('(#/research)');
    expect(idx).toContain('llms-full.txt');
  });

  it('writes every recipe body, every error code and every docs link into the full file', () => {
    const full = llmsFull();
    for (const r of recipes) {
      expect(full).toContain(JSON.stringify({ action: r.action, input: r.body }, null, 2));
      expect(full).toContain(`version \`${r.version}\``);
      expect(full).toContain(`checked on ${r.checkedOn}`);
      for (const d of r.docs) expect(full).toContain(d.href);
    }
    for (const e of errors) expect(full).toContain(`### ${e.code}`);
    expect(full).toContain(SITE.research);
    expect(full).not.toMatch(/\bundefined\b/);
  });
});
