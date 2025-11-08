import React from 'react';
import './AudioControls.css';

interface AudioControlsProps {
  isListening: boolean;
  isSupported: boolean;
  onToggleListening: () => void;
  onClearCaptions: () => void;
  volume?: number;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isListening,
  isSupported,
  onToggleListening,
  onClearCaptions,
  volume = 0
}) => {
  if (!isSupported) {
    return (
      <div className="audio-controls error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>Speech recognition is not supported in this browser.</p>
          <p className="error-suggestion">
            Try using Chrome, Safari, or Edge for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-controls">
      <div className="controls-section">
        <button
          className={`mic-button ${isListening ? 'listening' : 'stopped'}`}
          onClick={onToggleListening}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <div className="mic-icon">
            {isListening ? '🛑' : '🎤'}
          </div>
          <span className="button-text">
            {isListening ? 'Stop' : 'Start'}
          </span>
        </button>

        <button
          className="clear-button"
          onClick={onClearCaptions}
          aria-label="Clear all captions"
        >
          <div className="clear-icon">🗑️</div>
          <span className="button-text">Clear</span>
        </button>
      </div>

      <div className="status-section">
        <div className={`status-indicator ${isListening ? 'active' : 'inactive'}`}>
          <div className="status-dot"></div>
          <span className="status-text">
            {isListening ? 'Listening...' : 'Stopped'}
          </span>
        </div>

        {isListening && (
          <div className="volume-indicator">
            <div className="volume-bars">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`volume-bar ${i < Math.floor(volume * 5) ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;