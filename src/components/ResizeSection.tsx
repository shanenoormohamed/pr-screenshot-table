import { useCallback, useMemo, useState } from 'react';
import { ActionButton } from './ActionButton';
import { ResizeSettingsPanel } from './ResizeSettingsPanel';
import { collectTableInputs, tableHasVideo } from '../lib/collectInputs';
import {
  downloadAllAsZip,
  downloadBlob,
  formatBytes,
} from '../lib/resize/download';
import { processFile } from '../lib/resize/processFile';
import { getFfmpeg } from '../hooks/useFfmpeg';
import {
  DEFAULT_RESIZE_SETTINGS,
  type FileResult,
  type ProcessedOutput,
  type ResizeSettings,
} from '../lib/resize/types';
import type { TableState } from '../types';

type ResizeSectionProps = {
  table: TableState;
};

export function ResizeSection({ table }: ResizeSectionProps) {
  const [settings, setSettings] = useState<ResizeSettings>(DEFAULT_RESIZE_SETTINGS);
  const [results, setResults] = useState<FileResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);

  const inputs = useMemo(() => collectTableInputs(table), [table]);
  const hasVideo = useMemo(() => tableHasVideo(table), [table]);
  const allOutputs = useMemo(
    () => results.flatMap((result) => result.outputs),
    [results],
  );

  const updateResult = useCallback(
    (inputId: string, patch: Partial<FileResult>) => {
      setResults((prev) => {
        const index = prev.findIndex((result) => result.inputId === inputId);
        if (index === -1) {
          return [
            ...prev,
            {
              inputId,
              status: 'pending',
              progress: 0,
              outputs: [],
              ...patch,
            },
          ];
        }
        const next = [...prev];
        next[index] = { ...next[index], ...patch };
        return next;
      });
    },
    [],
  );

  const processAll = useCallback(async () => {
    if (inputs.length === 0 || processing) return;

    setProcessing(true);
    setResults(
      inputs.map((input) => ({
        inputId: input.id,
        status: 'pending',
        progress: 0,
        outputs: [],
      })),
    );

    let ffmpeg = null;
    if (inputs.some((input) => input.kind === 'video')) {
      setFfmpegLoading(true);
      try {
        ffmpeg = await getFfmpeg();
      } catch {
        setFfmpegLoading(false);
        setProcessing(false);
        for (const input of inputs) {
          updateResult(input.id, {
            status: 'error',
            error: 'Failed to load video processor',
          });
        }
        return;
      }
      setFfmpegLoading(false);
    }

    for (const input of inputs) {
      updateResult(input.id, { status: 'processing', progress: 0.05 });
      try {
        const outputs = await processFile(
          input,
          settings,
          ffmpeg,
          (progress) => updateResult(input.id, { progress }),
        );
        updateResult(input.id, { status: 'done', progress: 1, outputs });
      } catch (error) {
        updateResult(input.id, {
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Processing failed',
        });
      }
    }

    setProcessing(false);
  }, [inputs, processing, settings, updateResult]);

  const handleZip = useCallback(async () => {
    const outputs: ProcessedOutput[] = results.flatMap((r) => r.outputs);
    await downloadAllAsZip(outputs);
  }, [results]);

  if (inputs.length === 0) return null;

  return (
    <section className="resize-section">
      <ResizeSettingsPanel
        settings={settings}
        onChange={setSettings}
        hasVideo={hasVideo}
      />

      <div className="resize-section__actions">
        <ActionButton
          className={`copy-btn ${processing ? 'copy-btn--disabled' : ''}`}
          onClick={() => {
            if (!processing) void processAll();
          }}
        >
          {processing
            ? ffmpegLoading
              ? 'Loading video tools…'
              : 'Resizing…'
            : 'Resize all'}
        </ActionButton>

        {allOutputs.length > 1 && (
          <ActionButton className="table-editor__preset" onClick={() => void handleZip()}>
            Download all (.zip)
          </ActionButton>
        )}
      </div>

      {results.length > 0 && (
        <ul className="resize-results">
          {results.map((result) => {
            const input = inputs.find((item) => item.id === result.inputId);
            const statusLabel =
              result.status === 'processing'
                ? `Processing… ${Math.round(result.progress * 100)}%`
                : result.status === 'done'
                  ? 'Done'
                  : result.status === 'error'
                    ? (result.error ?? 'Failed')
                    : 'Pending';

            return (
              <li
                key={result.inputId}
                className={`resize-results__item resize-results__item--${result.status}`}
              >
                <div className="resize-results__header">
                  <span>{input?.file.name ?? result.inputId}</span>
                  <span>{statusLabel}</span>
                </div>
                {result.outputs.length > 0 && (
                  <ul>
                    {result.outputs.map((output) => (
                      <li key={output.filename}>
                        <span>
                          {output.filename} ({formatBytes(output.blob.size)})
                        </span>
                        <ActionButton
                          className="image-cell__clear"
                          onClick={() => downloadBlob(output.blob, output.filename)}
                        >
                          Download
                        </ActionButton>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
