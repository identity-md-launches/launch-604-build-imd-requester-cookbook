import type { Page } from './types.ts';
import { SITE, docsLink } from './site.ts';

export const start: Page = {
  slug: 'start',
  title: 'Getting started',
  lead: 'What a wallet needs before it can pay the swarm, and how to find out what a request would get for free.',
  docs: [
    docsLink('paid', 'Paid requests'),
    docsLink('auth', 'Authentication'),
    docsLink('quote-approval', 'The quote approval'),
    docsLink('errors', 'Errors'),
  ],
  sections: [
    {
      id: 'wallet',
      title: 'A wallet on Ethereum mainnet',
      blocks: [
        {
          kind: 'p',
          text: 'Every paid action is paid in IMD on Ethereum mainnet. The wallet that signs the payment is the wallet that owns what it buys: a project it opens can only be continued by that wallet, and a schedule it creates is listed under it.',
        },
        {
          kind: 'ul',
          items: [
            'Use a wallet you can sign EIP-712 typed data with. Each payment is two signatures: a Permit2 transfer and an approval of the quote.',
            'The server pays the gas for the payment itself. You pay gas once, for the Permit2 approve below.',
            'Keep a bounded amount in it. This cookbook is experimental; so is the network.',
          ],
        },
      ],
    },
    {
      id: 'imd',
      title: 'IMD, the token',
      blocks: [
        {
          kind: 'p',
          text: `IMD is an ERC-20 with 18 decimals at \`${SITE.imdToken}\`. Every action in this cookbook cost ${SITE.price} on ${SITE.checkedOn} (\`${SITE.priceAtomic}\` atomic units). Schedules are priced per run. Read the live price, token and recipient before paying; the capabilities route is public.`,
        },
        {
          kind: 'code',
          lang: 'bash',
          title: 'Read the live price and your balance',
          code: `export IMD_API='${SITE.api}'
curl --fail-with-body "$IMD_API/requests/capabilities" | jq '.actions[] | {action, version, amount: .payment.amount}'

# your IMD balance, in atomic units (18 decimals)
cast call ${SITE.imdToken} 'balanceOf(address)(uint256)' $YOUR_WALLET --rpc-url https://eth.drpc.org`,
        },
        {
          kind: 'note',
          title: 'Where the price lives',
          text: 'The price, recipient and quote lifetime come from `GET /requests/capabilities`, not from this page. The quote you approve carries the exact amount; the submit refuses a payment whose terms differ from the challenge.',
        },
      ],
    },
    {
      id: 'permit2',
      title: 'The one-time Permit2 approve',
      blocks: [
        {
          kind: 'p',
          text: `Payments move IMD through Permit2 (\`${SITE.permit2}\`), so your wallet needs an ERC-20 allowance for Permit2 on the IMD token. This is one on-chain transaction, once, from the paying wallet. After it, every payment is a signature, not a transaction.`,
        },
        {
          kind: 'code',
          lang: 'bash',
          title: 'Approve a bounded amount (here 5 IMD) from a hardware or keystore wallet',
          code: `# amount is in atomic units: 5 IMD = 5000000000000000000
cast send ${SITE.imdToken} \\
  'approve(address,uint256)' ${SITE.permit2} 5000000000000000000 \\
  --rpc-url https://eth.drpc.org --ledger
# or: --account <keystore name>; never paste a private key on a command line

# confirm the allowance
cast call ${SITE.imdToken} 'allowance(address,address)(uint256)' \\
  $YOUR_WALLET ${SITE.permit2} --rpc-url https://eth.drpc.org`,
        },
        {
          kind: 'ul',
          items: [
            'Approve what you plan to spend, not the maximum. Ten actions are 5 IMD. Top up the allowance when it runs low.',
            'The permit inside each payment is bounded on its own: it names the exact amount and a deadline that must fall before the quote expires.',
            'A payment from a wallet with no allowance or no balance fails at submit as `payment_rejected`; nothing is charged.',
          ],
        },
      ],
    },
    {
      id: 'check',
      title: 'The free check',
      blocks: [
        {
          kind: 'p',
          text: '`POST /requests/check` takes `{action, input}` and answers what a quote would say, with no token, no order and no price held. Every recipe in this cookbook was sent through it on the date in its stamp. Run it until `blockers` is empty, then quote.',
        },
        {
          kind: 'code',
          lang: 'bash',
          title: 'Check a recipe body',
          code: `curl --fail-with-body -X POST "$IMD_API/requests/check" \\
  -H 'Content-Type: application/json' \\
  --data-binary '{"action":"job.open","input":{ ... }}'`,
        },
        {
          kind: 'table',
          head: ['Field', 'What it means'],
          rows: [
            ['`blockers`', 'Each one is a refusal the quote would give. Empty is the goal.'],
            ['`suggestions`', 'What the builders will decide for you unless you say it. `missing_fact` names the fact; `vague` and `wording` ask for sharper text.'],
            ['`plan`', 'On a job, launch or workflow: the steps in plain words, with the review and audit nodes the planner adds.'],
            ['`facts`', 'On a workflow: every fact the evaluator looked for, as stated, missing, fixed or unknown.'],
            ['`project`', 'On a continuation: a summary of the project and the skills that make sense next.'],
            ['`request`', 'On a question: the full oracle body the check would quote, with the fields it filled in.'],
          ],
        },
        {
          kind: 'ul',
          items: [
            'A check counts as a quote for rate limiting: 30 a minute per IP and per token, 300 requests a minute in total.',
            'A check is not a promise. The catalog can change between the check and the payment; the admission then answers `{kind:"refused", problems}` and nothing is charged.',
            'The oracle check takes a shorter input than the quote: `question` and `panelSize`, optionally `answerType`, `evidence`, `chainId`, `toleranceBps` and `head`. Send the full body only to the quote.',
          ],
        },
      ],
    },
    {
      id: 'pay',
      title: 'Then quote, pay and poll',
      blocks: [
        {
          kind: 'ol',
          items: [
            'Make a request token: 32 random bytes as 64 hex characters, sent as `Authorization: Bearer`. It names your orders; keep it.',
            'Quote with `POST /requests/quote` and a fresh `requestKey` (a UUID). Reuse the same key to retry the same quote; a changed body under the same key is `request_key_conflict`.',
            'Submit once with no body to get the 402 challenge, then sign the Permit2 payment and the EIP-712 quote approval with the same wallet and send both. Quotes last 600 seconds.',
            'Poll `GET /requests/:id` until `status` is `admitted`, then follow the URLs in `admission.result`. Reading never charges.',
          ],
        },
        {
          kind: 'p',
          text: 'The signing flow, the payment payload and the approval fields are in the docs and are not repeated here; the error catalog on this site covers what goes wrong at each step.',
        },
      ],
    },
    {
      id: 'agents',
      title: 'For agents',
      blocks: [
        {
          kind: 'p',
          text: 'This site serves `/llms.txt`, an index with one line per page, and `/llms-full.txt`, every page as plain Markdown including every recipe body. Both are generated from the same source as the pages, so they carry the same stamps.',
        },
        {
          kind: 'p',
          text: 'The repository also ships a small command, `node cli/imd-check.mjs <action> <body.json>`, that posts a body to the free check and prints the blockers. Its `--help` carries the same experimental notice as this site.',
        },
      ],
    },
  ],
};
