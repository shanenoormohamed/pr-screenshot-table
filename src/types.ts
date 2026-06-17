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

export function defaultRowTitle(index: number, totalRows: number): string {
  if (totalRows === 1) return 'Screen';
  return `Screen ${index + 1}`;
}

export function isAutoRowTitle(
  title: string,
  index: number,
  totalRows: number,
): boolean {
  if (!title) return true;
  if (title === `Row ${index + 1}`) return true;
  if (title === `Screen ${index + 1}`) return true;
  if (totalRows === 1 && (title === 'Screen 1' || title === 'Row 1')) return true;
  if (totalRows > 1 && index === 0 && title === 'Screen') return true;
  return false;
}

export function normalizeRowTitle(
  title: string | undefined,
  index: number,
  totalRows: number,
): string {
  if (isAutoRowTitle(title ?? '', index, totalRows)) {
    return defaultRowTitle(index, totalRows);
  }
  return title ?? defaultRowTitle(index, totalRows);
}

export function normalizeRowTitles(table: TableState): TableState {
  const rowTitles = Array.from({ length: table.rows }, (_, index) =>
    normalizeRowTitle(table.rowTitles[index], index, table.rows),
  );

  if (table.rows === 1 && isAutoRowTitle(rowTitles[0], 0, 1)) {
    rowTitles[0] = 'Screen';
  }
  const unchanged = rowTitles.every((title, i) => title === table.rowTitles[i]);
  return unchanged ? table : { ...table, rowTitles };
}

export function createEmptyTable(rows: number, cols: number): TableState {
  return {
    rows,
    cols,
    columnTitles: Array.from({ length: cols }, (_, i) => `Column ${i + 1}`),
    rowTitles: Array.from({ length: rows }, (_, i) => defaultRowTitle(i, rows)),
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
    next.rowTitles[r] = normalizeRowTitle(prev.rowTitles[r], r, rows);
    for (let c = 0; c < Math.min(cols, prev.cols); c += 1) {
      next.columnTitles[c] = prev.columnTitles[c] ?? next.columnTitles[c];
      next.cells[r][c] = prev.cells[r]?.[c] ?? null;
    }
  }

  return normalizeRowTitles(next);
}
