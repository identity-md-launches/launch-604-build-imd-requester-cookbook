// Content model shared by the React site and the llms.txt generator.
// Inline text supports a tiny Markdown subset: `code`, **bold** and [text](url).

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'code'; lang: 'json' | 'bash' | 'text'; code: string; title?: string }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'note'; title: string; text: string };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface DocLink {
  label: string;
  href: string;
}

export interface Page {
  slug: string;
  title: string;
  /** One or two sentences shown under the title and in the llms.txt index. */
  lead: string;
  /** The matching sections of https://imd.fun/docs. Every page links at least one. */
  docs: DocLink[];
  sections: Section[];
}

export type ActionId =
  | 'job.open'
  | 'job.continue'
  | 'launch.open'
  | 'workflow.open'
  | 'oracle.request'
  | 'schedule.create'
  | 'schedule.topup';

export interface Recipe extends Page {
  action: ActionId;
  /** The action version from GET /requests/capabilities on the day it was checked. */
  version: string;
  /** ISO date the body below was sent to POST /requests/check. */
  checkedOn: string;
  /** Price as quoted on that day. */
  price: string;
  /** The body that passed the check, as sent. Placeholders are in CAPITALS. */
  body: Record<string, unknown>;
  /** When the check takes a shorter input than the quote, the body sent to the check. */
  checkBody?: Record<string, unknown>;
  /** What the check answered, in plain words. */
  checkResult: string;
}

export interface ErrorEntry {
  code: string;
  /** Where the code shows up. */
  where: 'check' | 'quote' | 'submit' | 'read' | 'run';
  status: string;
  cause: string;
  fix: string;
  /** How this cookbook observed it, or that it did not. */
  observed: string;
  /** Anchor on https://imd.fun/docs. */
  docs: string;
  /** Codes named by the assignment are listed first and marked. */
  required: boolean;
}
