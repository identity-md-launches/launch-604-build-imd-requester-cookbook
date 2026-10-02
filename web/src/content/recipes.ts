import type { Recipe } from './types.ts';
import { SITE, docsLink } from './site.ts';

const ORACLE_QUESTION =
  'How many Transfer(address,address,uint256) logs did the contract 0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7 emit on Ethereum mainnet in the pinned block window, every from and to address included?';

export const recipes: Recipe[] = [
  {
    slug: 'job-open',
    action: 'job.open',
    version: 'job-1',
    checkedOn: SITE.checkedOn,
    price: SITE.price,
    title: 'job.open: one job, one skill',
    lead: 'Open a job that runs one skill and leaves a named file. The smallest paid request there is.',
    docs: [docsLink('paid', 'Paid requests'), docsLink('job-body', 'Job body'), docsLink('compose', 'Composing work')],
    body: {
      objective:
        'Write a sourced report on how three EVM block explorers verify contract source, and where each one fails.',
      skill: 'research-report',
      outputs: [{ name: 'report', path: 'artifacts/report.md', mediaType: 'text/markdown' }],
      minCitations: 5,
      github: false,
    },
    checkResult:
      'No blockers. One suggestion, missing_fact report_sources: the researchers choose and cite sources unless the objective names them. Plan: one step, research-report.',
    sections: [
      {
        id: 'when',
        title: 'When to use it',
        blocks: [
          {
            kind: 'p',
            text: 'A report, an image, a video, a website or a contract project with no deployment. Name one runnable skill, or `steps` with a `shape`, or a `template`; never two of those at once. A job.open starts a project of its own, so `parentJobId` is refused here.',
          },
        ],
      },
      {
        id: 'why',
        title: 'Why this body passes',
        blocks: [
          {
            kind: 'ul',
            items: [
              '`objective` says what the report compares and what counts as a finding. Under 8,000 characters.',
              '`outputs` names exactly the file the job must leave, under `artifacts/`, with its media type. A skill with named outputs needs them.',
              '`github: false` keeps the report off GitHub; research-report defaults to publishing.',
              'No `onchain`: a launch is not covered by the job price, and the check says so as `invalid_input`.',
            ],
          },
        ],
      },
      {
        id: 'variations',
        title: 'Variations',
        blocks: [
          {
            kind: 'code',
            lang: 'json',
            title: 'A chain of steps instead of one skill',
            code: JSON.stringify(
              {
                objective: 'Build an ERC-4626 vault with a mock asset and meaningful tests. Do not deploy it.',
                shape: 'chain',
                references: ['defi-native', 'solidity-security-review'],
                steps: [
                  { skill: 'build-contract-project' },
                  { skill: 'write-foundry-tests', paths: ['test'], objective: 'Invariant tests for share accounting.' },
                  { skill: 'adversarial-review' },
                ],
                github: true,
              },
              null,
              2,
            ),
          },
          {
            kind: 'p',
            text: 'Steps that declare their own write budget (`write-readme-and-docs`, `gas-and-size-report`, `deploy-script`) must not name `paths`; see `unplannable_steps` in the error catalog. `foundry.toml` and `lib` can never be in `paths`.',
          },
        ],
      },
    ],
  },
  {
    slug: 'job-continue',
    action: 'job.continue',
    version: 'job-1',
    checkedOn: SITE.checkedOn,
    price: SITE.price,
    title: 'job.continue: the next version of your project',
    lead: 'Continue a project your wallet paid for. The result lands in the project repository as a fast-forward merge.',
    docs: [docsLink('continue', 'Continuing a project'), docsLink('jobs', 'Jobs'), docsLink('paid', 'Paid requests')],
    body: {
      parentJobId: 'PARENT_JOB_ID',
      objective: 'Add a footer with a link to the project repository and the build commit.',
      skill: 'build-website',
      ipfs: true,
    },
    checkResult:
      'No blockers, no suggestions, checked with a real project head in place of PARENT_JOB_ID (job 05d7f428-d786-44ed-906c-52a3dd9116be, version 4 of 4 of a hosted site). The check returned project.summary (four earlier build-website jobs, a hosted ENS name, nothing on chain) and project.next, the skills that make sense next.',
    sections: [
      {
        id: 'when',
        title: 'When to use it',
        blocks: [
          {
            kind: 'p',
            text: 'The project has a completed or blocked job at its head, nothing in it is running, and the wallet that will pay is the wallet that paid before. Read `project.head` from `GET /jobs/:id`; that is the `parentJobId`.',
          },
        ],
      },
      {
        id: 'why',
        title: 'Why this body passes',
        blocks: [
          {
            kind: 'ul',
            items: [
              '`parentJobId` is the only pointer. `repoUrl`, `baseCommit`, `projectId`, `deploymentLaunchId` and `onchain` are refused: the plane knows where the project starts, and nothing is deployed again.',
              '`ipfs: true` on a project with a site hosts the next version under the same name.',
              'With no `skill`, `steps` or `template`, a parent that ran one skill runs it again.',
            ],
          },
          {
            kind: 'note',
            title: 'Who can pay',
            text: 'Anyone can hold the quote. A payment from a wallet other than `paidBy` on the parent is refused at submit as 403 `payer_not_owner`, before anything moves. The free check does not know which wallet will pay, so it cannot warn you.',
          },
        ],
      },
      {
        id: 'read-first',
        title: 'Read the project first',
        blocks: [
          {
            kind: 'code',
            lang: 'bash',
            title: 'Find the head and who paid',
            code: `curl --fail-with-body "$IMD_API/jobs/$ANY_JOB_IN_THE_PROJECT" | jq '{paidBy, head: .project.head, running: .project.running}'`,
          },
        ],
      },
    ],
  },
  {
    slug: 'launch-open',
    action: 'launch.open',
    version: 'launch-1',
    checkedOn: SITE.checkedOn,
    price: SITE.price,
    title: 'launch.open: a job that ends on chain',
    lead: 'Build, test, audit and deploy a Solidity project on Sepolia with its fixed launch token and pool.',
    docs: [docsLink('job-body', 'Job body and what a launch is'), docsLink('launches', 'Launches'), docsLink('compose', 'A launch')],
    body: {
      objective:
        'Build and deploy a fixed-supply ERC-20 named Cookbook Coin with symbol COOK, with a Foundry test suite and an independent review. No owner, no mint, no pause.',
      shape: 'chain',
      steps: [{ skill: 'build-contract-project' }, { skill: 'adversarial-review' }],
      onchain: 'evm_project',
      github: true,
    },
    checkResult:
      'No blockers. One suggestion, missing_fact numbers. The plan the check returned replaces the final adversarial-review with write-foundry-tests, a deploy manifest, four audit-specialist nodes (math, permissions, economics, control flow) and an audit-judge.',
    sections: [
      {
        id: 'when',
        title: 'When to use it',
        blocks: [
          {
            kind: 'p',
            text: 'A Solidity project (`evm_project`), a Uniswap v4 hook with its pool (`univ4_hook`) or your own token terms (`custom_token`). Sepolia (11155111) was the only chain open on api.imd.fun on the check date; `chainId` can stay out.',
          },
        ],
      },
      {
        id: 'why',
        title: 'Why this body passes',
        blocks: [
          {
            kind: 'ul',
            items: [
              'The objective names the token and its symbol. Without them the check asks for `token_name` and `token_symbol` as blocking missing facts.',
              'It does not ask for a supply or decimals. A project or hook launch always deploys 1,000,000,000 with 18 decimals, minted once; asking for anything else is a `launch_token` blocker. For your own supply use `onchain: "custom_token"` with `economics`.',
              '`onchain` is set. The same body on job.open is `invalid_input`.',
              'The planner adds the audit panel itself. Do not name `audit-specialist` or `audit-judge` as steps.',
            ],
          },
        ],
      },
      {
        id: 'economics',
        title: 'What you get',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Ten percent of the supply to the swarm, ninety to you: `economics.poolBps` of it seeds the pool single-sided, the rest goes to `economics.remainderTo` (your paying wallet by default).',
              'The pool is paired with ETH and opens at the policy cap the check states. The trading fee was 1.25% per trade on the check date: 1% to the paying wallet, 0.25% to the network.',
              'Addresses, transactions and the reward tree are at `GET /launches/:id`.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'workflow-open',
    action: 'workflow.open',
    version: 'workflow-1',
    checkedOn: SITE.checkedOn,
    price: SITE.price,
    title: 'workflow.open: contracts to a hosted site in one payment',
    lead: 'A plain-language request, a strict draft and permissions. The evaluator rebuilds the release and pins it in the order.',
    docs: [docsLink('workflow-body', 'Workflow body'), docsLink('workflows', 'Workflows')],
    body: {
      request:
        'Release Cookbook Coin (symbol COOK), a fixed-supply ERC-20 with a total supply of 1,000,000,000 COOK and 18 decimals, minted once at deployment, with a Foundry test suite and an independent review; deploy it on Sepolia; then publish a one-page site that shows the token name, symbol, total supply and a connected wallet balance.',
      context:
        'Sepolia only. GitHub publication and IPFS hosting are approved. No owner, no mint after deployment, no pause, no upgrade.',
      draft: {
        objective:
          'Build the COOK ERC-20 with tests and an independent review, deploy it, then build the website against the live deployment.',
        shape: 'chain',
        onchain: 'evm_project',
        github: true,
        ipfs: true,
        contracts: ['CookbookCoin'],
        steps: [{ skill: 'build-contract-project' }, { skill: 'frontend-for-contract' }, { skill: 'adversarial-review' }],
      },
      permissions: { github: true, ipfs: true, onchain: { kind: 'evm_project', chainId: 11155111 } },
    },
    checkResult:
      'No blockers, no suggestions. Plan: build and test the contracts; audit them as another agent; deploy on Sepolia; build the site against the live contracts; host the site on IPFS with the source on GitHub. The facts list marked token_name and token_symbol as stated and token_supply as fixed.',
    sections: [
      {
        id: 'when',
        title: 'When to use it',
        blocks: [
          {
            kind: 'p',
            text: 'You want contracts, review, deployment, a site built against the live addresses, IPFS hosting and an ENS name as one record. Two jobs run with services between them; `GET /workflows/:id` follows all of it.',
          },
        ],
      },
      {
        id: 'why',
        title: 'Why this body passes',
        blocks: [
          {
            kind: 'ul',
            items: [
              'The request states the token name, symbol and total supply. The supply it states is the one every launch deploys, 1,000,000,000 with 18 decimals. A different number was refused with `launch_token` on the same day; a request that never mentions supply can be refused with `missing_fact token_supply`.',
              'The draft is strict: shape `chain`, `onchain` set, `ipfs` set, exactly one front-end step, and an adversarial-review of the contracts. The front end runs after deployment wherever it sits.',
              '`permissions.onchain` repeats the draft kind with the chain, 11155111.',
              'Request, context and draft objective are short. Folded together above about 7,000 characters the evaluator answers `invalid_plan`; the same text at 5,200 + 2,600 characters did on the check date.',
            ],
          },
        ],
      },
      {
        id: 'follow',
        title: 'Follow it',
        blocks: [
          {
            kind: 'code',
            lang: 'bash',
            code: `curl --fail-with-body "$IMD_API/workflows/$WORKFLOW_ID" | jq '{status, waitingForHosting, failure, launch, site}'`,
          },
          {
            kind: 'p',
            text: 'Statuses in order: contracts, deployment, frontend, publishing, validating, completed. Validation retries for up to a day while hosting settles.',
          },
        ],
      },
    ],
  },
  {
    slug: 'oracle-request',
    action: 'oracle.request',
    version: 'oracle-1',
    checkedOn: SITE.checkedOn,
    price: SITE.price,
    title: 'oracle.request: a typed question with a signed answer',
    lead: 'One question, a panel of seats, and an EIP-712 attestation a contract can verify.',
    docs: [docsLink('oracle-body', 'Oracle body'), docsLink('oracle', 'Oracle reads and the attestation')],
    checkBody: {
      question: ORACLE_QUESTION,
      panelSize: 5,
      answerType: 'uint256',
      evidence: 'chain',
      chainId: 1,
      toleranceBps: 0,
    },
    body: {
      v: 1,
      question: ORACLE_QUESTION,
      chainId: 1,
      window: { hours: 24 },
      answerType: 'uint256',
      evidence: 'chain',
      panelSize: 5,
      quorum: 4,
      validForSeconds: 86400,
    },
    checkResult:
      'No blockers. One suggestion, wording: it may be read more than one way, so name the period, unit or term. The check proposed answerType uint256, evidence chain and chainId 1 at confidence 1, and returned the quote body shown here with quorum 4 and validForSeconds 86400 filled in. A looser wording of the same question ("How many Transfer events did the IMD token emit in the window?") was refused with ambiguous_question.',
    sections: [
      {
        id: 'two-bodies',
        title: 'Two bodies: the check and the quote',
        blocks: [
          {
            kind: 'p',
            text: 'The check takes the short form (first block above): `question`, `panelSize` and the optional fields. It answers with `request`, the full body it would quote, and `proposed`, the fields it inferred with a confidence each. Send the full body (second block) to `POST /requests/quote`. Add `definitions`, `guards` and `toleranceBps` before quoting when the answer must be pinned; the check does not need them.',
          },
        ],
      },
      {
        id: 'why',
        title: 'Why this body passes',
        blocks: [
          {
            kind: 'ul',
            items: [
              'The question names the event signature, the contract, the chain and the window, and says what is included. The wording screen refuses a question with more than one reasonable reading; `allowAmbiguous: true` skips it, but pin the reading in `definitions` first.',
              '`evidence: "chain"`, the default: each member answers with a recipe, and the deployer reruns the agreed recipe at the pinned blocks before signing. A count of logs is a `log-count` recipe, which yields `uint256`.',
              '`panelSize` 5 is the floor on api.imd.fun; `quorum` is matching answers, not a majority.',
              'The window is pinned to exact blocks at the quote. `{hours: 24}` is the last day before the quote.',
            ],
          },
        ],
      },
      {
        id: 'answer',
        title: 'Read the answer',
        blocks: [
          {
            kind: 'code',
            lang: 'bash',
            code: `curl --fail-with-body "$IMD_API/oracle/requests/$REQUEST_ID" | jq '{status, computed, agreement}'
# once attested: the typed data and signature for your consumer contract
curl --fail-with-body "$IMD_API/oracle/requests/$REQUEST_ID/attestation"`,
          },
          {
            kind: 'p',
            text: 'Payment buys the question and its panel, not an answer: a panel that disagrees ends without one. The attestation domain is version 2 since 2026-09-30; a consumer built on the version 1 library needs the current library and a redeploy.',
          },
        ],
      },
    ],
  },
  {
    slug: 'schedule-create',
    action: 'schedule.create',
    version: 'schedule-1',
    checkedOn: SITE.checkedOn,
    price: `${SITE.price} per run`,
    title: 'schedule.create: the same question every day',
    lead: 'A standing order: one oracle question or one job, on a cadence, for as many runs as you buy in one payment.',
    docs: [docsLink('schedule-body', 'Schedule body'), docsLink('schedules', 'Schedules')],
    body: {
      label: 'daily IMD transfer count',
      action: 'oracle.request',
      cadence: { cron: '0 9 * * *', tz: 'UTC' },
      runs: 3,
      input: {
        v: 1,
        question: ORACLE_QUESTION,
        chainId: 1,
        window: { hours: 24 },
        answerType: 'uint256',
        evidence: 'chain',
        panelSize: 5,
        quorum: 4,
        toleranceBps: 0,
        validForSeconds: 86400,
        guards: { min: '0', max: '100000000' },
      },
    },
    checkResult:
      'No blockers, no suggestions. A job variant also passed on the same day: action job.open, cadence {every: "P1W"}, runs 2, continue true, with a research-report input. A cadence of {every: "PT5M"} was refused with invalid_cadence (at least 10 minutes between questions).',
    sections: [
      {
        id: 'why',
        title: 'Why this body passes',
        blocks: [
          {
            kind: 'ul',
            items: [
              'The inner `input` is a full oracle body, not the short check form, and it passes the same checks as one paid oracle.request. A relative window resolves to the blocks before each run, so `{hours: 24}` is always the last day.',
              '`runs: 3` buys three runs at 0.5 IMD each in one payment. Only a run that opens a question or a job spends one; skipped and failed runs cost nothing. Unused runs are not refunded.',
              'The cron fires once a day, above the ten-minute floor for questions (thirty for jobs).',
              'The question is the one that passed as a single oracle.request. The looser wording was refused inside a schedule too, as `ambiguous_question`.',
            ],
          },
        ],
      },
      {
        id: 'owner',
        title: 'Owner and controls',
        blocks: [
          {
            kind: 'p',
            text: 'The paying wallet owns the schedule and can list it with `GET /schedules?owner=0x…`. Owning gives no controls: pausing and cancelling stay with the IMD team. Three failed runs in a row pause a schedule until it is topped up; a paid schedule never expires.',
          },
        ],
      },
    ],
  },
  {
    slug: 'schedule-topup',
    action: 'schedule.topup',
    version: 'topup-1',
    checkedOn: SITE.checkedOn,
    price: `${SITE.price} per run`,
    title: 'schedule.topup: more runs on any schedule',
    lead: 'Add runs to a schedule, yours or anyone else’s, at today’s price per run.',
    docs: [docsLink('schedule-body', 'Topping up'), docsLink('schedules', 'Schedules')],
    body: { scheduleId: 'SCHEDULE_ID', runs: 1 },
    checkResult:
      'No blockers, no suggestions, checked with an active job.open schedule in place of SCHEDULE_ID (9d4b4168-b031-4cc6-880b-3f9cc40c9063). An id no schedule has was refused with unknown_schedule.',
    sections: [
      {
        id: 'why',
        title: 'Why this body passes',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Two fields, both required. `runs` is 1 to 1,000,000; the quote charges the per-run price once per run.',
              'Any wallet can top up any schedule. A schedule that ran out, or paused itself after three failed runs, is active again from its next slot.',
              'A cancelled or expired schedule is a 422 at the quote. One cancelled between the quote and the confirmed payment comes back as `{kind:"refused"}` and the runs are not refunded.',
            ],
          },
        ],
      },
      {
        id: 'find',
        title: 'Find the schedule',
        blocks: [
          {
            kind: 'code',
            lang: 'bash',
            code: `curl --fail-with-body "$IMD_API/schedules?owner=$YOUR_WALLET" | jq '.schedules[] | {id, label, status, runs}'
curl --fail-with-body "$IMD_API/schedules/$SCHEDULE_ID" | jq '{status, statusReason, runsRemaining, nextRunAt}'`,
          },
        ],
      },
    ],
  },
];
