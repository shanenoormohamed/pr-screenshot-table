export type CellImage = {
  file: File;
  previewUrl: string;
  alt: string;
};

export type TableState = {
  rows: number;
  cols: number;
  columnTitles: string[];
  rowTitles: string[];
  cells: (CellImage | null)[][];
};

export const MAX_GRID = 8;
export const MIN_GRID = 1;

export function createEmptyTable(rows: number, cols: number): TableState {
  return {
    rows,
    cols,
    columnTitles: Array.from({ length: cols }, (_, i) => `Column ${i + 1}`),
    rowTitles: Array.from({ length: rows }, (_, i) => `Screen ${i + 1}`),
    cells: Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    ),
  };
}

export function resizeTable(
  prev: TableState | null,
  rows: number,
  cols: number,
): TableState {
  const next = createEmptyTable(rows, cols);

  if (!prev) return next;

  for (let r = 0; r < Math.min(rows, prev.rows); r += 1) {
    next.rowTitles[r] = prev.rowTitles[r] ?? next.rowTitles[r];
    for (let c = 0; c < Math.min(cols, prev.cols); c += 1) {
      next.columnTitles[c] = prev.columnTitles[c] ?? next.columnTitles[c];
      next.cells[r][c] = prev.cells[r]?.[c] ?? null;
    }
  }

  return next;
}
