import type { TableState } from '../types';
import type { InputFile } from './resize/types';
import { toInputFile } from './resize/fileMeta';

export function collectTableInputs(table: TableState): InputFile[] {
  const inputs: InputFile[] = [];
  for (let r = 0; r < table.rows; r += 1) {
    for (let c = 0; c < table.cols; c += 1) {
      const cell = table.cells[r][c];
      if (!cell) continue;
      inputs.push(toInputFile(`${r}-${c}`, cell.file, cell.kind));
    }
  }
  return inputs;
}

export function tableHasVideo(table: TableState): boolean {
  return collectTableInputs(table).some((input) => input.kind === 'video');
}
