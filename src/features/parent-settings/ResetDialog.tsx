import { useId } from 'react';

interface ResetDialogProps {
  stickerCount: number;
  stickerTotal: number;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Asks once more before every saved thing is erased, because it cannot be undone. */
export function ResetDialog({ stickerCount, stickerTotal, onConfirm, onCancel }: ResetDialogProps) {
  const titleId = useId();
  const messageId = useId();

  return (
    <div
      className="parent-dialog-backdrop"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="parent-card parent-dialog"
      >
        <h2 id={titleId}>データを初期化しますか？</h2>
        {/* Japanese has no spaces, so each phrase is kept whole and the line breaks only between them. */}
        <p id={messageId}>
          <span className="parent-phrase">
            シール（{stickerCount} / {stickerTotal} 枚）と
          </span>
          <span className="parent-phrase">効果音の設定が</span>
          <span className="parent-phrase">消えます。</span>
          <br />
          元に戻せません。
        </p>
        <div className="parent-dialog-actions">
          {/* Focus starts on the safe choice, so a stray Enter keeps everything. */}
          <button type="button" className="parent-button" autoFocus onClick={onCancel}>
            やめる
          </button>
          <button type="button" className="parent-danger" onClick={onConfirm}>
            初期化する
          </button>
        </div>
      </div>
    </div>
  );
}
