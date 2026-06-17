import { useCallback, useMemo, useState } from 'react';
import { GridPicker } from './components/GridPicker';
import { MarkdownOutput } from './components/MarkdownOutput';
import { TableEditor } from './components/TableEditor';
import { generateMarkdown } from './lib/markdown';
import { createEmptyTable, resizeTable, type TableState } from './types';
import './App.css';

function App() {
  const [table, setTable] = useState<TableState>(() => createEmptyTable(2, 2));
  const [urlPrefix, setUrlPrefix] = useState('');

  const handleGridSelect = useCallback((rows: number, cols: number) => {
    setTable((prev) => resizeTable(prev, rows, cols));
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

      <TableEditor table={table} onChange={setTable} />

      <MarkdownOutput
        markdown={markdown}
        urlPrefix={urlPrefix}
        onUrlPrefixChange={setUrlPrefix}
      />
    </div>
  );
}

export default App;
