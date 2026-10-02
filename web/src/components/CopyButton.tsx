import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  label: string;
  /** What is being copied, so several copy buttons on one page read apart: "Copy JSON, check input". */
  subject?: string;
}

type State = 'idle' | 'copied' | 'failed';

/** Copies text to the clipboard. The outcome is announced through a stable status region. */
export function CopyButton({ text, label, subject }: Props) {
  const [state, setState] = useState<State>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2000);
  }

  const message = state === 'copied' ? 'Copied' : state === 'failed' ? 'Unable to copy. Select the text and copy it.' : '';

  return (
    <span className="copy">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={copy}
        data-state={state}
        aria-label={subject ? `${state === 'copied' ? 'Copied' : label}, ${subject}` : undefined}
      >
        {state === 'copied' ? 'Copied' : label}
      </button>
      <span role="status" className="copy-status">
        {message}
      </span>
    </span>
  );
}
