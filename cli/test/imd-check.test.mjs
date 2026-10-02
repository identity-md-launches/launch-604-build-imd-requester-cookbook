// node --test cli/test/imd-check.test.mjs   (Node 22.18+: imports the recipe content as TypeScript)
// Runs the CLI with --dry-run on every example block of the recipe pages, as the full {action, input}
// block the page shows and as the bare input, then once against a local plane built from the live
// responses saved in fixtures/live/ (api.imd.fun, 2026-10-02).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { recipes } from '../../web/src/content/recipes.ts';

const CLI = new URL('../imd-check.mjs', import.meta.url).pathname;
const live = (name) => JSON.parse(readFileSync(new URL(`fixtures/live/${name}`, import.meta.url), 'utf8'));
const dir = mkdtempSync(join(tmpdir(), 'imd-check-'));

function run(args, env = {}) {
  return new Promise((resolve) => {
    execFile(process.execPath, [CLI, ...args], { env: { ...process.env, ...env } }, (err, stdout, stderr) =>
      resolve({ code: err ? err.code : 0, stdout, stderr }),
    );
  });
}

function file(name, value) {
  const path = join(dir, name);
  writeFileSync(path, JSON.stringify(value, null, 2));
  return path;
}

// Every request example a recipe page renders: the body block(s) and the JSON variations.
const examples = recipes.flatMap((r) => [
  ...(r.checkBody ? [{ name: `${r.slug} check input`, action: r.action, input: r.checkBody }] : []),
  { name: `${r.slug} input`, action: r.action, input: r.body },
  ...r.sections
    .flatMap((s) => s.blocks)
    .filter((b) => b.kind === 'code' && b.lang === 'json')
    .map((b) => ({ name: `${r.slug} ${b.title}`, action: r.action, input: JSON.parse(b.code) })),
]);

test('the recipe pages have examples for all seven actions', () => {
  assert.equal(new Set(examples.map((e) => e.action)).size, 7);
  const liveActions = live('capabilities.json').actions.map((a) => a.action);
  for (const e of examples) assert.ok(liveActions.includes(e.action), `${e.action} not in live capabilities`);
});

for (const e of examples) {
  test(`dry run: ${e.name}, full block and bare input send the same request`, async () => {
    const want = { action: e.action, input: e.input };
    const slug = e.name.replace(/\W+/g, '-');
    for (const path of [file(`${slug}.full.json`, want), file(`${slug}.bare.json`, e.input)]) {
      const { code, stdout, stderr } = await run(['--dry-run', e.action, path]);
      assert.equal(code, 0, stderr);
      assert.deepEqual(JSON.parse(stdout), want);
    }
  });
}

test('a full block for another action exits 1 and sends nothing', async () => {
  const path = file('mismatch.json', { action: 'job.open', input: recipes[0].body });
  const { code, stdout, stderr } = await run(['--dry-run', 'job.continue', path]);
  assert.equal(code, 1);
  assert.equal(stdout, '');
  assert.match(stderr, /"job\.open" block, not job\.continue/);
});

test('against a plane replaying the live responses: the job.open block passes, the old double wrap would not', async () => {
  const ok = live('check-job-open.json');
  const wrapped = live('check-job-open-wrapped-twice.json');
  const seen = [];
  const server = createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      const body = JSON.parse(raw);
      seen.push(body);
      // What api.imd.fun answered on 2026-10-02: 400 when job.open's objective is not a string.
      const bad = typeof body.input?.objective !== 'string';
      res.writeHead(bad ? 400 : 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(bad ? wrapped : ok));
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const IMD_API = `http://127.0.0.1:${server.address().port}`;
  try {
    const job = recipes.find((r) => r.action === 'job.open');
    const want = { action: 'job.open', input: job.body };
    for (const path of [file('live-full.json', want), file('live-bare.json', job.body)]) {
      const { code, stdout, stderr } = await run(['job.open', path], { IMD_API });
      assert.equal(code, 0, stderr);
      assert.match(stdout, /^job\.open: 0 blocker\(s\), 1 suggestion\(s\)/);
    }
    assert.deepEqual(seen, [want, want]);
  } finally {
    server.close();
  }
});
