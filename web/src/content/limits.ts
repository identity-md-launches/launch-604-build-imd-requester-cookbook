import type { Page } from './types.ts';
import { SITE, docsLink } from './site.ts';

export const limits: Page = {
  slug: 'limits',
  title: 'Limits at a glance',
  lead: `Every number a request can hit, as published in the docs and in GET /requests/capabilities on ${SITE.checkedOn}. The live routes win when they differ.`,
  docs: [
    docsLink('paid', 'Errors and limits'),
    docsLink('job-body', 'Job body'),
    docsLink('workflow-body', 'Workflow body'),
    docsLink('oracle-body', 'Oracle body'),
    docsLink('schedule-body', 'Schedule body'),
  ],
  sections: [
    {
      id: 'money',
      title: 'Money and time',
      blocks: [
        {
          kind: 'table',
          head: ['Limit', 'Value'],
          rows: [
            ['Price per action', `${SITE.price} (\`${SITE.priceAtomic}\` atomic); schedules per run`],
            ['Token', `IMD, 18 decimals, \`${SITE.imdToken}\`, Ethereum mainnet (eip155:1)`],
            ['Quote lifetime', '600 seconds; the permit deadline must fall before it'],
            ['Quote body', '16 KiB'],
            ['Rate, paid routes', '300 requests and 30 quotes a minute, per IP and per token; a check or an import counts as a quote'],
            ['Rate, public reads', '120 a minute per IP on api.imd.fun; more through the explorer'],
            ['Pagination', '`limit` 1 to 500, default 100 (50 for feedback batches)'],
          ],
        },
      ],
    },
    {
      id: 'job',
      title: 'Job body (job.open, launch.open, job.continue)',
      blocks: [
        {
          kind: 'table',
          head: ['Field', 'Limit'],
          rows: [
            ['`objective`', '1 to 8,000 characters; 4,000 for `template: "research"`'],
            ['`skill`', 'one id, max 64; not with `steps` or `template`'],
            ['`steps`', '1 to 6; `shape` required with them'],
            ['`steps[].key`', '`^[a-z][a-z0-9_]{0,31}$`, required for dag'],
            ['`steps[].dependsOn`', 'up to 6 keys; branches must join into one final step'],
            ['`steps[].objective`', '1 to 3,000 characters'],
            ['`steps[].acceptanceCriteria`', '1 to 8 strings, each 1 to 500 characters'],
            ['`steps[].paths`', 'up to 16 paths; never `foundry.toml`, `lib`; not on skills with their own budget'],
            ['`steps[].inputs` / `outputs`', 'up to 32 each'],
            ['`steps[].variables`', 'key max 64, value max 2,000'],
            ['`references`', 'up to 8 reference skills; 8 more per step'],
            ['`contracts`', 'up to 4 names or `.sol` paths, each max 512'],
            ['`paths`', 'up to 16 repository-relative paths'],
            ['`repoUrl`', 'max 512, with a 40-hex `baseCommit`; public GitHub only; import it first'],
            ['`inputs[].bytes`', '0 to 64 MiB; accepted files only'],
            ['`outputs[].path`', 'under `artifacts/`'],
            ['`ipfs` label', '`^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$`'],
            ['`panelSize` / `panelQuorum` (research)', '1 to 9 each'],
            ['`minCitations`', '0 to 20'],
            ['`rubric.contains`', '1 to 8 strings, max 500 each; `mayNotRestOn` up to 8, max 200'],
            ['`runs` (fuzz)', '1,000 to 10,000,000; exactly one harness in `contracts`'],
          ],
        },
      ],
    },
    {
      id: 'launch',
      title: 'Launches',
      blocks: [
        {
          kind: 'table',
          head: ['Limit', 'Value'],
          rows: [
            ['Chains open', 'Sepolia (11155111) only, paired with ETH, on the check date'],
            ['Kinds', '`univ4_hook`, `evm_project`, `custom_token`'],
            ['Fixed token', '1,000,000,000 with 18 decimals, minted once, plain transfers (project and hook launches)'],
            ['Split', '10% to the swarm; `economics.poolBps` 1 to 9,000 of the supply to the pool; `remainderTo` required unless `poolBps` is 9,000 (custom token)'],
            ['Trading fee', '1.25% per trade: 1% to the paying wallet, 0.25% to the network (policy at the check date)'],
            ['Swarm share', '2% split between wallets with accepted work on the launch, 8% per seat connected at admission'],
          ],
        },
      ],
    },
    {
      id: 'workflow',
      title: 'Workflow body',
      blocks: [
        {
          kind: 'table',
          head: ['Field', 'Limit'],
          rows: [
            ['`request`', '1 to 16,000 characters'],
            ['`context`', 'max 16,000, default empty'],
            ['Folded text', 'request + context + draft objective above about 7,000 characters is `invalid_plan`'],
            ['`draft`', 'strict job body: shape `chain` or `dag`, `onchain` set, `ipfs` set, exactly one front-end step, an adversarial-review of the contracts'],
            ['`permissions.onchain`', 'required: `{kind, chainId}` matching the draft and the open chain'],
            ['Refused', '`parentJobId`, `projectId`, `deploymentLaunchId`, `submissionKey`'],
            ['Validation', 'retries for up to a day while hosting settles'],
          ],
        },
      ],
    },
    {
      id: 'oracle',
      title: 'Oracle body',
      blocks: [
        {
          kind: 'table',
          head: ['Field', 'Limit'],
          rows: [
            ['`question`', '1 to 2,000 characters; one reasonable reading'],
            ['`window`', '`{hours: 1..720}` or `{fromBlock, toBlock}`; pinned at the quote'],
            ['`answerType`', '`bool`, `address`, `bytes32`, `uint256`, `address[]`, `bytes32[]`'],
            ['`panelSize`', '5 to 100 (capabilities `limits["oracle.request"]`); one member per seat'],
            ['`quorum`', '2 to `panelSize`, every one must match'],
            ['`validForSeconds`', '60 to 2,592,000'],
            ['`head`', '1 to 32 leading entries that must agree, list answers'],
            ['`definitions`', 'keys 1 to 64, values 1 to 512 characters'],
            ['`guards.allow` / `deny`', '1 to 256 / 1 to 1,024 addresses or bytes32'],
            ['`guards.sources`', '1 to 32 URL prefixes, max 512 each; `minSources` 1 to 32'],
            ['`toleranceBps`', '0 to 10,000'],
            ['Chains with an RPC', 'Ethereum 1, BNB Chain 56, Robinhood Chain 4663, Base 8453, Arbitrum One 42161 (check response on the check date)'],
          ],
        },
      ],
    },
    {
      id: 'schedule',
      title: 'Schedules',
      blocks: [
        {
          kind: 'table',
          head: ['Field', 'Limit'],
          rows: [
            ['`runs`', '1 to 1,000,000, create and top up'],
            ['Floor between runs', '10 minutes for questions, 30 for jobs'],
            ['`cadence`', '`{every}` ISO 8601 duration, or `{cron, tz}` with five fields'],
            ['`label`', '1 to 120 characters'],
            ['`input`', 'a full oracle body or a job body without `onchain`; `parentJobId` and `projectId` refused, use `continue`'],
            ['Pause', 'three failed runs in a row, until topped up'],
            ['Expiry', 'none while paid'],
          ],
        },
      ],
    },
    {
      id: 'uploads',
      title: 'Uploads and sites (device routes)',
      blocks: [
        {
          kind: 'table',
          head: ['Limit', 'Value'],
          rows: [
            ['Bundle', 'up to 8 MiB'],
            ['Artifact', 'up to 64 MiB, under a lease'],
            ['Site publishes', 'ten per seat per day (`too_many_publishes`)'],
            ['Site label', '3 to 32 lowercase letters, digits and hyphens'],
          ],
        },
      ],
    },
  ],
};
