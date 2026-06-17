import type { CellImage, TableState } from '../types';

function escapeCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

type ImageRef = {
  id: number;
  cell: CellImage;
};

function collectImageRefs(cells: (CellImage | null)[][]): ImageRef[] {
  const refs: ImageRef[] = [];
  let id = 1;

  for (const row of cells) {
    for (const cell of row) {
      if (cell) {
        refs.push({ id, cell });
        id += 1;
      }
    }
  }

  return refs;
}

function refIdByPosition(
  cells: (CellImage | null)[][],
  rowIndex: number,
  colIndex: number,
): number | null {
  let id = 1;
  for (let r = 0; r < cells.length; r += 1) {
    for (let c = 0; c < (cells[r]?.length ?? 0); c += 1) {
      const cell = cells[r]?.[c];
      if (!cell) continue;
      if (r === rowIndex && c === colIndex) return id;
      id += 1;
    }
  }
  return null;
}

function cellImageMarkdown(refId: number | null): string {
  if (refId === null) return ' ';
  return `![${refId}]`;
}

function referenceDefinition(
  ref: ImageRef,
  urlPrefix: string,
): string {
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
): string {
  const { rows, cols, columnTitles, rowTitles, cells } = table;

  const headerCells = ['', ...columnTitles.map(escapeCell)];
  const header = `| ${headerCells.join(' | ')} |`;
  const separator = `| ${Array.from({ length: cols + 1 }, () => '---').join(' | ')} |`;

  const body = Array.from({ length: rows }, (_, rowIndex) => {
    const rowCells = [
      escapeCell(rowTitles[rowIndex] ?? ''),
      ...Array.from({ length: cols }, (_, colIndex) => {
        const refId = refIdByPosition(cells, rowIndex, colIndex);
        return cellImageMarkdown(refId);
      }),
    ];
    return `| ${rowCells.join(' | ')} |`;
  });

  const refs = collectImageRefs(cells);
  const definitions =
    refs.length > 0
      ? ['', refs.map((ref) => referenceDefinition(ref, urlPrefix)).join('\n\n')]
      : [];

  return [...[header, separator, ...body], ...definitions].join('\n');
}
