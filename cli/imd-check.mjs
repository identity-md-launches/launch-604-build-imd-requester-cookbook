#!/usr/bin/env node
// imd-check: post a request body to the IMD free check and print what it says.
// No token, no payment, no order. Node 22+. Network: https://api.imd.fun only.
import { readFileSync } from 'node:fs';

const BANNER =
  'Experimental, commissioned as a test of the IMD swarm. It may not work as described. Read the code, start with small amounts, no warranty.';
const ACTIONS = ['job.open', 'job.continue', 'launch.open', 'workflow.open', 'oracle.request', 'schedule.create', 'schedule.topup'];
const API = process.env.IMD_API || 'https://api.imd.fun';

function help() {
  console.log(`imd-check: run the IMD free check on a request body

${BANNER}

Usage:
  node cli/imd-check.mjs <action> <body.json>
  node cli/imd-check.mjs <action> - < body.json

Actions: ${ACTIONS.join(', ')}

The file holds the action's input (the "input" of a quote), as on the recipe pages.
Prints the check's blockers and suggestions; exits 0 when there are no blockers,
2 when there are, 1 on a transport or usage error. Reads IMD_API to target another plane.
`);
}

const [action, file] = process.argv.slice(2);
if (!action || action === '--help' || action === '-h' || !file) {
  help();
  process.exit(action && action !== '--help' && action !== '-h' ? 1 : 0);
}
if (!ACTIONS.includes(action)) {
  console.error(`unknown action "${action}". One of: ${ACTIONS.join(', ')}`);
  process.exit(1);
}

let input;
try {
  input = JSON.parse(readFileSync(file === '-' ? 0 : file, 'utf8'));
} catch (e) {
  console.error(`cannot read ${file}: ${e.message}`);
  process.exit(1);
}

let res;
let text;
try {
  res = await fetch(`${API}/requests/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, input }),
    signal: AbortSignal.timeout(180000),
  });
  text = await res.text();
} catch (e) {
  console.error(`check failed: ${e.message}`);
  process.exit(1);
}

let body;
try {
  body = JSON.parse(text);
} catch {
  console.error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  process.exit(1);
}

if (!res.ok) {
  console.error(`HTTP ${res.status}: ${body.error ?? ''} ${body.detail ?? ''}`.trim());
  process.exit(1);
}

const blockers = body.blockers ?? [];
const suggestions = body.suggestions ?? [];
console.log(`${action}: ${blockers.length} blocker(s), ${suggestions.length} suggestion(s)`);
for (const b of blockers) console.log(`  blocker  ${b.code}${b.fact ? ` ${b.fact}` : ''}: ${b.detail}`);
for (const s of suggestions) console.log(`  suggest  ${s.code}${s.fact ? ` ${s.fact}` : ''}: ${s.detail}`);
if (body.plan?.length) console.log(`  plan     ${body.plan.map((p) => p.skill ?? p.short ?? p.title).join(' -> ')}`);
if (body.request) console.log(`  request  ${JSON.stringify(body.request)}`);
process.exit(blockers.length ? 2 : 0);
