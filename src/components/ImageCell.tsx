import { useRef, useState, type DragEvent } from 'react';
import { ActionButton } from './ActionButton';
import type { CellImage } from '../types';

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp';

type ImageCellProps = {
  cell: CellImage | null;
  onSet: (cell: CellImage) => void;
  onClear: () => void;
};

export function ImageCell({ cell, onSet, onClear }: ImageCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (cell?.previewUrl) URL.revokeObjectURL(cell.previewUrl);
    onSet({
      file,
      previewUrl: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^.]+$/, ''),
    });
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <div
      className={`image-cell ${dragOver ? 'image-cell--drag' : ''} ${cell ? 'image-cell--filled' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {cell ? (
        <>
          <img src={cell.previewUrl} alt={cell.alt} />
          <input
            className="image-cell__alt"
            type="text"
            value={cell.alt}
            placeholder="Alt text"
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onSet({ ...cell, alt: event.target.value })}
          />
          <ActionButton
            className="image-cell__clear"
            onClick={(event) => {
              event.stopPropagation();
              onClear();
            }}
          >
            Clear
          </ActionButton>
        </>
      ) : (
        <span className="image-cell__placeholder">Drop image</span>
      )}
    </div>
  );
}
