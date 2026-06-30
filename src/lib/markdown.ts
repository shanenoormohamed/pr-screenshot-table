import type { CellImage, TableState } from '../types';

function escapeCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

type ImageRef = {
  id: number;
  cell: CellImage;
};

type RefIndex = {
  idGrid: (number | null)[][];
  refs: ImageRef[];
};

function buildRefIndex(cells: (CellImage | null)[][]): RefIndex {
  const refs: ImageRef[] = [];
  const idGrid = cells.map((row) =>
    row.map((cell) => {
      if (!cell) return null;
      const id = refs.length + 1;
      refs.push({ id, cell });
      return id;
    }),
  );
  return { idGrid, refs };
}

function referenceDefinition(ref: ImageRef, urlPrefix: string): string {
  if (urlPrefix) {
    const url = `${urlPrefix.replace(/\/$/, '')}/${ref.cell.file.name}`;
    return `[${ref.id}]: ${url}`;
  }
  const label = ref.cell.alt.trim() || `Screenshot ${ref.id}`;
  return `[${ref.id}]: ${label}`;
}

export function generateMarkdown(
  table: TableState,
  urlPrefix: string,
  hideRowTitles = false,
): string {
  const { rows, cols, columnTitles, rowTitles, cells } = table;
  const { idGrid, refs } = buildRefIndex(cells);

  const headerCells = columnTitles.map(escapeCell);
  if (!hideRowTitles) headerCells.unshift('');
  const header = `| ${headerCells.join(' | ')} |`;

  const separatorCount = hideRowTitles ? cols : cols + 1;
  const separator = `| ${Array.from({ length: separatorCount }, () => '---').join(' | ')} |`;

  const body = Array.from({ length: rows }, (_, rowIndex) => {
    const imageCells = Array.from({ length: cols }, (_, colIndex) => {
      const refId = idGrid[rowIndex]?.[colIndex];
      return refId ? `![${refId}]` : ' ';
    });
    if (!hideRowTitles) {
      imageCells.unshift(escapeCell(rowTitles[rowIndex] ?? ''));
    }
    return `| ${imageCells.join(' | ')} |`;
  });

  const parts = ['## Screenshots/Video', '', header, separator, ...body];
  if (refs.length > 0) {
    parts.push('', refs.map((ref) => referenceDefinition(ref, urlPrefix)).join('\n\n'));
  }
  return parts.join('\n');
}
