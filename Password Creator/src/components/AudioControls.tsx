import React, { useState, useEffect } from 'react';
import TroubleshootingTips from './TroubleshootingTips';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useVolumeMonitor } from '../hooks/useVolumeMonitor';
import './AudioControls.css';

interface AudioControlsProps {
  isListening: boolean;
  isSupported: boolean;
  onToggleListening: () => void;
  onClearCaptions: () => void;
  onSaveSession: () => void;
  canSave: boolean;
  errorMessage?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isListening,
  isSupported,
  onToggleListening,
  onClearCaptions,
  onSaveSession,
  canSave,
  errorMessage
}) => {
  const { t } = useLanguage();
  const { volume, volumeLevel } = useVolumeMonitor({ isListening });
  const [showVolumeFeedback, setShowVolumeFeedback] = useState(false);
  const [lastShownLevel, setLastShownLevel] = useState<'silent' | 'low' | 'good' | 'excellent'>('silent');

  useEffect(() => {
    if (!isListening) {
      setShowVolumeFeedback(false);
      setLastShownLevel('silent');
      return;
    }

    // Show feedback after 2 seconds of listening (initial)
    const initialTimer = setTimeout(() => {
      if (volumeLevel !== 'silent' && volumeLevel !== 'good') {
        setShowVolumeFeedback(true);
        setLastShownLevel(volumeLevel);
        
        // Hide after 5 seconds
        setTimeout(() => {
          setShowVolumeFeedback(false);
        }, 5000);
      }
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, [isListening, volumeLevel]);

  // Show feedback when volume level changes between excellent and low
  useEffect(() => {
    if (!isListening || volumeLevel === 'silent' || volumeLevel === 'good') return;

    // Only show if the level changed between excellent and low
    const shouldShow = 
      (lastShownLevel === 'excellent' && volumeLevel === 'low') ||
      (lastShownLevel === 'low' && volumeLevel === 'excellent');

    if (shouldShow) {
      setShowVolumeFeedback(true);
      setLastShownLevel(volumeLevel);
      
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setShowVolumeFeedback(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [volumeLevel, isListening, lastShownLevel]);

  const getVolumeFeedback = () => {
    switch (volumeLevel) {
      case 'low':
        return {
          text: 'Poor Volume',
          className: 'volume-feedback-low'
        };
      case 'excellent':
        return {
          text: 'Excellent Volume',
          className: 'volume-feedback-excellent'
        };
      default:
        return {
          text: '',
          className: ''
        };
    }
  };

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
        <TroubleshootingTips />
      </div>
    );
  }

  return (
    <div className="audio-controls">
      {/* Language selector on the left */}
      <LanguageSelector />
      
      <div className="controls-section">
        <button
          className={`mic-button ${isListening ? 'listening' : 'stopped'}`}
          onClick={onToggleListening}
          onMouseDown={(e) => {
            // Immediate visual feedback
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = '';
          }}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <span className="button-text">
            {isListening ? t('home.stop') : t('home.start')}
          </span>
        </button>

        <button
          className="clear-button"
          onClick={onClearCaptions}
          aria-label="Clear all captions"
        >
          <span className="button-text">{t('home.clear')}</span>
        </button>

        <button
          className={`save-button ${canSave ? 'enabled' : 'disabled'}`}
          onClick={onSaveSession}
          disabled={!canSave}
          aria-label="Save session to notes"
          title={canSave ? t('home.saveAndGenerate') : t('home.recordFirst')}
        >
          <span className="button-text">💾 {t('home.saveSession')}</span>
        </button>
      </div>

      <div className="status-section">
        <div className={`status-indicator ${isListening ? 'active' : 'inactive'}`}>
          <div className="status-dot"></div>
          <span className="status-text">
            {isListening ? t('home.listening') : t('home.stopped')}
          </span>
        </div>

        {isListening && (
          <div className="volume-indicator-container">
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
            
            {showVolumeFeedback && (volumeLevel === 'low' || volumeLevel === 'excellent') && (
              <div className={`volume-feedback ${getVolumeFeedback().className}`}>
                {getVolumeFeedback().text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;