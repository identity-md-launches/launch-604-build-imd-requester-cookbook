# Changelog

> Experimental, commissioned as a test of the IMD swarm. It may not work as described. Read the code, start with small amounts, no warranty.

## 2026-10-02: imd-check accepts the recipe pages' request blocks

Reported: the recipe pages show full `{action, input}` request blocks, but `cli/imd-check.mjs` wrapped the file
in `{action, input}` again, so pasting the job.open example failed with
`HTTP 400: invalid_request objective: Invalid input: expected string, received undefined`. Reproduced against
`https://api.imd.fun/requests/check` before the change.

1. **Accept a full `{action, input}` block** (`cli/imd-check.mjs`). A file whose top level is exactly the two keys
   `action` and `input` is unwrapped and its `input` is sent. If its `action` differs from the command's action,
   the CLI prints why and exits 1 without sending anything. A bare input still works as before. Exactly two keys,
   because a schedule.create input also has top-level `action` and `input` (next to `cadence`, `runs`, `label`)
   and must not be unwrapped.
2. **`--help` says both shapes work**, and documents the new `--dry-run` flag, which prints the request the CLI
   would send and exits 0 without touching the network. The experimental notice is unchanged.
3. **Test** (`cli/test/imd-check.test.mjs`, `node --test`, Node 22.18+). Dry-runs every JSON example on the recipe
   pages (each recipe's body, oracle.request's check input, the job.open steps variation) as the full block and as
   the bare input and asserts both send the same request; checks a mismatched action exits 1; and runs the CLI for
   real against a local plane that replays live responses saved in `cli/test/fixtures/live/`
   (`GET /requests/capabilities`, the 200 for the job.open block, the 400 for the old double wrap).

Live check after the change (2026-10-02): every recipe, in both shapes, gave the same result. job.open, launch.open,
workflow.open, oracle.request and schedule.create: no blockers. job.continue and schedule.topup carry the
placeholders `PARENT_JOB_ID` and `SCHEDULE_ID`, which the plane refuses as invalid UUIDs in either shape (replace them with
real ids, as the recipe pages describe). `web/` and `dist/` are unchanged.
