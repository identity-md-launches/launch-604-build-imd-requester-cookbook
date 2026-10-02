// Serialises the content model to plain Markdown for llms.txt and llms-full.txt.
// Used by scripts/gen-llms.mjs (Node, type-stripped) and by the tests.
import type { Block, ErrorEntry, Page, Recipe } from '../content/types.ts';
import { SITE, errors, limits, nav, recipes, research, start } from '../content/index.ts';

function blockToMd(b: Block): string {
  switch (b.kind) {
    case 'p':
      return b.text;
    case 'ul':
      return b.items.map((i) => `- ${i}`).join('\n');
    case 'ol':
      return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n');
    case 'code':
      return `${b.title ? `${b.title}:\n\n` : ''}\`\`\`${b.lang}\n${b.code}\n\`\`\``;
    case 'table':
      return [
        `| ${b.head.join(' | ')} |`,
        `| ${b.head.map(() => '---').join(' | ')} |`,
        ...b.rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`),
      ].join('\n');
    case 'note':
      return `> **${b.title}.** ${b.text}`;
  }
}

function docsLines(p: Page): string {
  return `Matching docs: ${p.docs.map((d) => `[${d.label}](${d.href})`).join(', ')}`;
}

export function pageToMd(p: Page): string {
  const out: string[] = [`# ${p.title}`, '', p.lead, '', docsLines(p), ''];
  for (const s of p.sections) {
    out.push(`## ${s.title}`, '');
    for (const b of s.blocks) out.push(blockToMd(b), '');
  }
  return out.join('\n').trimEnd() + '\n';
}

export function recipeToMd(r: Recipe): string {
  const out: string[] = [
    `# ${r.title}`,
    '',
    r.lead,
    '',
    `Action: \`${r.action}\` · version \`${r.version}\` · price ${r.price} · checked on ${r.checkedOn} against control plane \`${SITE.controlPlaneCommit}\``,
    '',
    docsLines(r),
    '',
  ];
  if (r.checkBody) {
    out.push('## Body sent to POST /requests/check', '', '```json', JSON.stringify(r.checkBody, null, 2), '```', '');
    out.push('## Body to send to POST /requests/quote', '');
  } else {
    out.push('## Body that passed the check', '');
  }
  out.push('```json', JSON.stringify({ action: r.action, input: r.body }, null, 2), '```', '');
  out.push('## What the check said', '', r.checkResult, '');
  for (const s of r.sections) {
    out.push(`## ${s.title}`, '');
    for (const b of s.blocks) out.push(blockToMd(b), '');
  }
  return out.join('\n').trimEnd() + '\n';
}

function errorToMd(e: ErrorEntry): string {
  return [
    `### ${e.code}`,
    '',
    `Where: ${e.where} · ${e.status}`,
    '',
    `Cause: ${e.cause}`,
    '',
    `Fix: ${e.fix}`,
    '',
    `Observed: ${e.observed}`,
    '',
    `Docs: ${SITE.docs}#${e.docs}`,
  ].join('\n');
}

export function errorsToMd(): string {
  const req = errors.filter((e) => e.required);
  const rest = errors.filter((e) => !e.required);
  return [
    '# Error catalog',
    '',
    `Every refusal code a requester meets, with its cause and fix. Codes were probed through the free check and public reads on ${SITE.checkedOn}; where a code needs a payment to appear, the entry says it was not reproduced.`,
    '',
    `Matching docs: [Errors](${SITE.docs}#errors), [Errors and limits of paid requests](${SITE.docs}#paid)`,
    '',
    '## Codes named by the assignment',
    '',
    req.map(errorToMd).join('\n\n'),
    '',
    '## Other codes you will meet',
    '',
    rest.map(errorToMd).join('\n\n'),
    '',
  ].join('\n');
}

function overviewMd(): string {
  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.banner}`,
    '',
    SITE.tagline,
    '',
    `This cookbook complements ${SITE.docs}; every page links the matching docs section and none of it repeats the reference. Every recipe body was sent to POST /requests/check on ${SITE.checkedOn} (control plane \`${SITE.controlPlaneCommit}\`) and is stamped with its action version from GET /requests/capabilities.`,
    '',
    'Site root: index.html (hash routes: #/start, #/job-open, #/errors, ...). Machine-readable: /llms.txt (this index) and /llms-full.txt (every page).',
    '',
  ].join('\n');
}

/** The index file: one line per page. */
export function llmsIndex(base = ''): string {
  const lines: string[] = [overviewMd(), '## Pages', ''];
  for (const g of nav) {
    for (const it of g.items) {
      if (it.slug === '') continue;
      const page = recipes.find((r) => r.slug === it.slug) ?? (it.slug === 'errors' ? null : [start, limits, research].find((p) => p.slug === it.slug));
      const lead = page ? page.lead : 'Every refusal code with its cause and fix.';
      const stamp = page && 'version' in page ? ` (${(page as Recipe).action} ${(page as Recipe).version}, checked ${(page as Recipe).checkedOn})` : '';
      lines.push(`- [${it.title}](${base}#/${it.slug}): ${lead}${stamp}`);
    }
  }
  lines.push('', '## Optional', '', `- [Full text](${base}llms-full.txt): all pages as Markdown`, `- [IMD docs](${SITE.docs})`, `- [Research repository](${SITE.research})`, '');
  return lines.join('\n');
}

/** Every page as Markdown, separated by rules. */
export function llmsFull(): string {
  const parts = [overviewMd(), pageToMd(start), ...recipes.map(recipeToMd), errorsToMd(), pageToMd(limits), pageToMd(research)];
  return parts.join('\n---\n\n');
}
