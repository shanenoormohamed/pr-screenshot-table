import { ImageCell } from './ImageCell';
import type { CellImage, TableState } from '../types';

type TableEditorProps = {
  table: TableState;
  onChange: (table: TableState) => void;
};

export function TableEditor({ table, onChange }: TableEditorProps) {
  const updateColumnTitle = (index: number, value: string) => {
    const columnTitles = [...table.columnTitles];
    columnTitles[index] = value;
    onChange({ ...table, columnTitles });
  };

  const updateRowTitle = (index: number, value: string) => {
    const rowTitles = [...table.rowTitles];
    rowTitles[index] = value;
    onChange({ ...table, rowTitles });
  };

  const updateCell = (row: number, col: number, cell: CellImage | null) => {
    const cells = table.cells.map((rowCells, rowIndex) =>
      rowIndex === row
        ? rowCells.map((existing, colIndex) =>
            colIndex === col ? cell : existing,
          )
        : rowCells,
    );
    onChange({ ...table, cells });
  };

  const clearCell = (row: number, col: number) => {
    const existing = table.cells[row]?.[col];
    if (existing?.previewUrl) URL.revokeObjectURL(existing.previewUrl);
    updateCell(row, col, null);
  };

  const applyBeforeAfterColumns = () => {
    onChange({ ...table, columnTitles: ['Before', 'After'] });
  };

  return (
    <section className="table-editor">
      <h2>Table</h2>
      <p className="table-editor__hint">
        Edit column and row titles. Drop a screenshot into each cell.
      </p>
      {table.cols === 2 && (
        <span
          role="button"
          tabIndex={0}
          className="table-editor__preset"
          onClick={applyBeforeAfterColumns}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              applyBeforeAfterColumns();
            }
          }}
        >
          Set columns to Before / After
        </span>
      )}
      <div className="table-editor__scroll">
        <table>
          <thead>
            <tr>
              <th className="table-editor__corner" />
              {table.columnTitles.map((title, colIndex) => (
                <th key={colIndex}>
                  <input
                    type="text"
                    value={title}
                    aria-label={`Column ${colIndex + 1} title`}
                    onChange={(event) =>
                      updateColumnTitle(colIndex, event.target.value)
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rowTitles.map((rowTitle, rowIndex) => (
              <tr key={rowIndex}>
                <th>
                  <input
                    type="text"
                    value={rowTitle}
                    aria-label={`Row ${rowIndex + 1} title`}
                    onChange={(event) =>
                      updateRowTitle(rowIndex, event.target.value)
                    }
                  />
                </th>
                {Array.from({ length: table.cols }, (_, colIndex) => (
                  <td key={colIndex}>
                    <ImageCell
                      cell={table.cells[rowIndex]?.[colIndex] ?? null}
                      onSet={(cell) => updateCell(rowIndex, colIndex, cell)}
                      onClear={() => clearCell(rowIndex, colIndex)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
