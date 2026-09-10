"use client";

type ARControlsProps = {
  onClose: () => void;
  showMute?: boolean;
  muted?: boolean;
  onToggleMute?: () => void;
};

export function ARControls({
  onClose,
  showMute = false,
  muted = true,
  onToggleMute,
}: ARControlsProps) {
  return (
    <div className="ar-controls">
      {showMute ? (
        <button
          type="button"
          className="ar-icon-button"
          onClick={onToggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      ) : null}
      <button
        type="button"
        className="ar-icon-button"
        onClick={onClose}
        aria-label="Close AR experience"
      >
        Close
      </button>
    </div>
  );
}
