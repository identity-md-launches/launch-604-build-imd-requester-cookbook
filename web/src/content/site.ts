export const SITE = {
  name: 'IMD Requester Cookbook',
  tagline: 'Checked request bodies, an error catalog and limits for people and agents who pay the IMD swarm for work.',
  banner:
    'Experimental, commissioned as a test of the IMD swarm. It may not work as described. Read the code, start with small amounts, no warranty.',
  docs: 'https://imd.fun/docs',
  api: 'https://api.imd.fun',
  explorer: 'https://explorer.imd.fun',
  research: 'https://github.com/Identity-md/research',
  /** The day every recipe and probe in this cookbook was run against the control plane. */
  checkedOn: '2026-10-02',
  /** GET /version on that day. */
  controlPlaneCommit: '152d58c2',
  imdToken: '0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7',
  permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  price: '0.5 IMD',
  priceAtomic: '500000000000000000',
} as const;

export function docsLink(anchor: string, label: string) {
  return { label, href: `${SITE.docs}#${anchor}` };
}
