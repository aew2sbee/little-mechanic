import { useState } from 'react';
import './parent-settings.css';

interface ParentSettingsScreenProps {
  isSoundOn: boolean;
  onSoundChange: (isOn: boolean) => void;
  stickerCount: number;
  stickerTotal: number;
  onResetStickers: () => void;
  onClose: () => void;
}

/** For the grown-ups, so this screen uses ordinary Japanese instead of hiragana. */
export function ParentSettingsScreen({
  isSoundOn,
  onSoundChange,
  stickerCount,
  stickerTotal,
  onResetStickers,
  onClose,
}: ParentSettingsScreenProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="screen parent-settings" data-screen="parent-settings">
      <section className="parent-card" aria-labelledby="parent-title">
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
            シール
            <small>
              {stickerCount} / {stickerTotal} 枚
            </small>
          </span>
          {isConfirming ? (
            <span className="parent-confirm">
              <button
                type="button"
                className="parent-danger"
                onClick={() => {
                  onResetStickers();
                  setIsConfirming(false);
                }}
              >
                すべて消す
              </button>
              <button type="button" className="parent-button" onClick={() => setIsConfirming(false)}>
                やめる
              </button>
            </span>
          ) : (
            <button type="button" className="parent-button" onClick={() => setIsConfirming(true)}>
              リセット
            </button>
          )}
        </div>
        <button type="button" className="parent-button parent-close" onClick={onClose}>
          閉じる
        </button>
      </section>
    </div>
  );
}
