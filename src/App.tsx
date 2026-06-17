import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridPicker } from './components/GridPicker';
import { MarkdownOutput } from './components/MarkdownOutput';
import { TableEditor } from './components/TableEditor';
import { generateMarkdown } from './lib/markdown';
import { createEmptyTable, normalizeRowTitles, resizeTable, type TableState } from './types';
import './App.css';

function App() {
  const [table, setTable] = useState<TableState>(() =>
    normalizeRowTitles(createEmptyTable(2, 2)),
  );
  const [urlPrefix, setUrlPrefix] = useState('');

  const handleGridSelect = useCallback((rows: number, cols: number) => {
    setTable((prev) => normalizeRowTitles(resizeTable(prev, rows, cols)));
  }, []);

  useEffect(() => {
    setTable((current) => normalizeRowTitles(current));
  }, []);

  const markdown = useMemo(
    () => generateMarkdown(table, urlPrefix),
    [table, urlPrefix],
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>PR Screenshot Table</h1>
        <p>
          Build a markdown table for GitHub PRs — pick the grid size, label rows
          and columns, drop screenshots, copy the result.
        </p>
      </header>

      <GridPicker
        rows={table.rows}
        cols={table.cols}
        onSelect={handleGridSelect}
      />

      <TableEditor
        table={table}
        onChange={(next) => setTable(normalizeRowTitles(next))}
      />

      <MarkdownOutput
        markdown={markdown}
        urlPrefix={urlPrefix}
        onUrlPrefixChange={setUrlPrefix}
      />
    </div>
  );
}

export default App;
