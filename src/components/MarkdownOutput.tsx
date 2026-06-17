import { useState } from 'react';
import { ActionButton } from './ActionButton';

type MarkdownOutputProps = {
  markdown: string;
  urlPrefix: string;
  onUrlPrefixChange: (value: string) => void;
};

export function MarkdownOutput({
  markdown,
  urlPrefix,
  onUrlPrefixChange,
}: MarkdownOutputProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="markdown-output">
      <h2>Markdown</h2>
      <div className="markdown-output__field">
        <label htmlFor="url-prefix">Image URL prefix (optional)</label>
        <input
          id="url-prefix"
          type="url"
          value={urlPrefix}
          placeholder="https://github.com/org/repo/raw/ci-screenshots/12345"
          onChange={(event) => onUrlPrefixChange(event.target.value)}
        />
        <p className="markdown-output__help">
          References use numbered placeholders (e.g. <code>[1]: Screenshot 1</code>).
          Add a URL prefix to output full image URLs in the reference block instead.
        </p>
      </div>
      <pre className="markdown-output__preview">{markdown}</pre>
      <ActionButton className="copy-btn" onClick={() => void copy()}>
        {copied ? 'Copied!' : 'Copy markdown'}
      </ActionButton>
    </section>
  );
}
