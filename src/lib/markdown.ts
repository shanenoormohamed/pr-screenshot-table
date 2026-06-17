import type { CellImage, TableState } from '../types';

function escapeCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function imageMarkdown(cell: CellImage | null, urlPrefix: string): string {
  if (!cell) return ' ';
  const url = urlPrefix
    ? `${urlPrefix.replace(/\/$/, '')}/${cell.file.name}`
    : cell.file.name;
  const alt = escapeCell(cell.alt || cell.file.name);
  return `![${alt}](${url})`;
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
      ...Array.from({ length: cols }, (_, colIndex) =>
        imageMarkdown(cells[rowIndex]?.[colIndex] ?? null, urlPrefix),
      ),
    ];
    return `| ${rowCells.join(' | ')} |`;
  });

  return [header, separator, ...body].join('\n');
}
