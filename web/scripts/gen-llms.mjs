// Writes public/llms.txt and public/llms-full.txt from the same content the site renders.
// Runs before every build and dev start (see package.json). Needs Node 22.18+ for .ts imports.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const { llmsIndex, llmsFull } = await import('../src/lib/markdown.ts');

const out = resolve(here, '../public');
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, 'llms.txt'), llmsIndex());
writeFileSync(resolve(out, 'llms-full.txt'), llmsFull());
console.log('wrote public/llms.txt and public/llms-full.txt');
