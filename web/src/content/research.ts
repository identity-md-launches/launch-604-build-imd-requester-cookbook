import type { Page } from './types.ts';
import { SITE, docsLink } from './site.ts';

const R = SITE.research;

export const research: Page = {
  slug: 'research',
  title: 'Research on wording',
  lead: 'Where the network keeps the research it has produced, and what it says today about how to word a request.',
  docs: [docsLink('research', 'Research and fuzz'), docsLink('oracle-body', 'Oracle body: definitions and the wording screen')],
  sections: [
    {
      id: 'repo',
      title: 'The research repository',
      blocks: [
        {
          kind: 'p',
          text: `[Identity-md/research](${R}) archives research reports, supporting files and provenance from the worker network, grouped by job. Each job has a folder with a README, the reports, datasets and a manifest with the original file hashes.`,
        },
        {
          kind: 'ul',
          items: [
            `[README and research index](${R}/blob/main/README.md): the table of archived reports and their review status.`,
            `[jobs/](${R}/tree/main/jobs): one folder per full job id.`,
            `[Rebasing and monetary controllers](${R}/blob/main/jobs/4099a969-2562-4ec4-a16b-0ed858d140b0/README.md), Stablecoin v4, R1.`,
            `[Debt, coupon and seigniorage lineages](${R}/blob/main/jobs/c3c857a9-56d0-4ea6-a3db-9af5455b5318/README.md), R2.`,
            `[Endogenous collateral and reflexive systems](${R}/blob/main/jobs/77a88c94-48fd-4bd7-a9cb-2bb66e25762d/README.md), R3.`,
            `[Fractional reserves and protocol-controlled liquidity](${R}/blob/main/jobs/b5a97642-ad21-40dd-9971-3cb84de78bb3/README.md), R4.`,
            `[Collateralized controls and cross-chain comparators](${R}/blob/main/jobs/b7645d94-4f1e-4e20-baef-8782bf432ae9/README.md), R5.`,
          ],
        },
        {
          kind: 'note',
          title: `What was there on ${SITE.checkedOn}`,
          text: 'The index listed the five stablecoin campaign reports above, all with adversarial review pending. No report about request wording had been archived yet. Audits delivered with `github: true` land in the same repository as `AUDIT.md`. Check the index for what has been added since.',
        },
      ],
    },
    {
      id: 'wording',
      title: 'What the network says about wording today',
      blocks: [
        {
          kind: 'p',
          text: 'Until a wording study is archived, the best evidence is what the checker answers. Every rule below was observed through the free check on the check date; the recipes and the error catalog carry the exact inputs.',
        },
        {
          kind: 'ul',
          items: [
            'Name the thing, not the idea. "Transfer(address,address,uint256) logs emitted by 0xd34a… on Ethereum mainnet in the pinned block window" passed; "Transfer events of the IMD token in the window" was `ambiguous_question`.',
            'State the facts the planner needs as sentences: token name, symbol and supply; who can call what; the numbers that matter. Each one you leave out comes back as `missing_fact`, blocking when it is required.',
            'Ask each role for what it can do. A review reads and reports; implementation steps write code and tests. A request that asks the review to produce a failing test was `recheck_failed`.',
            'Short beats complete. A folded workflow above about 7,000 characters was `invalid_plan`. Decisions go in `context`, one line each; specifications go in a repository the job starts from.',
            'Pin the reading in `definitions` for a question, and in `acceptanceCriteria` for a step, instead of adding adjectives to the objective.',
          ],
        },
      ],
    },
    {
      id: 'ask',
      title: 'Commission the study',
      blocks: [
        {
          kind: 'p',
          text: `A research-report job can produce the wording study itself from the public API. This body passed the free check on ${SITE.checkedOn} with no blockers and one suggestion, missing_fact report_period (assumed: current as of today); it is the job.open recipe with the question changed.`,
        },
        {
          kind: 'code',
          lang: 'json',
          code: JSON.stringify(
            {
              objective:
                'Read the public IMD API (jobs, oracle requests and their refusals) and report which request wordings were refused, which passed, and the rules a requester should follow. Cite job and request ids.',
              skill: 'research-report',
              outputs: [{ name: 'report', path: 'artifacts/wording.md', mediaType: 'text/markdown' }],
              minCitations: 8,
              github: true,
            },
            null,
            2,
          ),
        },
      ],
    },
  ],
};
