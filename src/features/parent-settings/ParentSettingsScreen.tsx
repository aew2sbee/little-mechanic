import { useState } from 'react';
import { ResetDialog } from './ResetDialog';
import './parent-settings.css';

interface ParentSettingsScreenProps {
  isSoundOn: boolean;
  onSoundChange: (isOn: boolean) => void;
  stickerCount: number;
  stickerTotal: number;
  /** Erases the stickers and the settings alike. Called only after the parent confirms. */
  onReset: () => void;
  onClose: () => void;
}

/** For the grown-ups, so this screen uses ordinary Japanese instead of hiragana. */
export function ParentSettingsScreen({
  isSoundOn,
  onSoundChange,
  stickerCount,
  stickerTotal,
  onReset,
  onClose,
}: ParentSettingsScreenProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="screen parent-settings" data-screen="parent-settings">
      {/* While the dialog asks, nothing behind it can be tapped or focused. */}
      <section className="parent-card" aria-labelledby="parent-title" inert={isConfirming}>
        <h1 id="parent-title">保護者設定</h1>
        <div className="parent-row">
          <span id="sound-label">効果音</span>
          <button
            type="button"
            role="switch"
            aria-checked={isSoundOn}
            aria-labelledby="sound-label"
            className={isSoundOn ? 'parent-switch parent-switch--on' : 'parent-switch'}
            onClick={() => onSoundChange(!isSoundOn)}
          >
            {isSoundOn ? 'オン' : 'オフ'}
          </button>
        </div>
        <div className="parent-row">
          <span>
            保存データ
            <small>
              シール {stickerCount} / {stickerTotal} 枚
            </small>
          </span>
          <button type="button" className="parent-button" onClick={() => setIsConfirming(true)}>
            初期化
          </button>
        </div>
        <button type="button" className="parent-button parent-close" onClick={onClose}>
          閉じる
        </button>
      </section>
      {isConfirming && (
        <ResetDialog
          stickerCount={stickerCount}
          stickerTotal={stickerTotal}
          onConfirm={() => {
            onReset();
            setIsConfirming(false);
          }}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}
