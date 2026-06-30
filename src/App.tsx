import { useCallback, useMemo, useState } from 'react';
import { GridPicker } from './components/GridPicker';
import { MarkdownOutput } from './components/MarkdownOutput';
import { ResizeSection } from './components/ResizeSection';
import { TableEditor } from './components/TableEditor';
import { generateMarkdown } from './lib/markdown';
import {
  createEmptyTable,
  normalizeRowTitles,
  resizeTable,
} from './lib/table';
import type { TableState } from './types';
import './App.css';

function App() {
  const [table, setTable] = useState<TableState>(() => createEmptyTable(2, 2));

  const updateTable = useCallback(
    (updater: TableState | ((prev: TableState) => TableState)) => {
      setTable((prev) =>
        normalizeRowTitles(
          typeof updater === 'function' ? updater(prev) : updater,
        ),
      );
    },
    [],
  );

  const handleGridSelect = useCallback(
    (rows: number, cols: number) => {
      updateTable((prev) => resizeTable(prev, rows, cols));
    },
    [updateTable],
  );

  const [urlPrefix, setUrlPrefix] = useState('');
  const [hideRowTitles, setHideRowTitles] = useState(false);

  const markdown = useMemo(
    () => generateMarkdown(table, urlPrefix, hideRowTitles),
    [table, urlPrefix, hideRowTitles],
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
        onChange={updateTable}
        hideRowTitles={hideRowTitles}
        onHideRowTitlesChange={setHideRowTitles}
      />

      <ResizeSection table={table} />

      <MarkdownOutput
        markdown={markdown}
        urlPrefix={urlPrefix}
        onUrlPrefixChange={setUrlPrefix}
      />
    </div>
  );
}

export default App;
