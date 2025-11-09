import React, { useState } from 'react';
import { CaptionSettings } from '../types/speech';
import './Settings.css';

interface SettingsProps {
  settings: CaptionSettings;
  onSettingsChange: (settings: CaptionSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState<CaptionSettings>(settings);

  const handleChange = (key: keyof CaptionSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const presetColors = [
    { name: 'Dark', bg: '#000000', text: '#ffffff' },
    { name: 'Light', bg: '#ffffff', text: '#000000' },
    { name: 'High Contrast', bg: '#000000', text: '#ffff00' },
    { name: 'Blue', bg: '#1a237e', text: '#ffffff' },
    { name: 'Green', bg: '#1b5e20', text: '#ffffff' },
  ];

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
  ];

  const translationLanguages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ru', name: 'Russian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
  ];

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Caption Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Display</h3>
            
            <div className="setting-group">
              <label htmlFor="fontSize">Font Size: {localSettings.fontSize}px</label>
              <input
                id="fontSize"
                type="range"
                min="16"
                max="72"
                value={localSettings.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label htmlFor="maxLines">Max Lines: {localSettings.maxLines}</label>
              <input
                id="maxLines"
                type="range"
                min="3"
                max="20"
                value={localSettings.maxLines}
                onChange={(e) => handleChange('maxLines', parseInt(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select
                id="fontFamily"
                value={localSettings.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Colors</h3>
            
            <div className="color-presets">
              {presetColors.map((preset) => (
                <button
                  key={preset.name}
                  className="color-preset"
                  style={{
                    backgroundColor: preset.bg,
                    color: preset.text,
                    border: (localSettings.backgroundColor === preset.bg && 
                            localSettings.textColor === preset.text) 
                            ? '2px solid #4caf50' : '1px solid #ccc'
                  }}
                  onClick={() => {
                    handleChange('backgroundColor', preset.bg);
                    handleChange('textColor', preset.text);
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="custom-colors">
              <div className="setting-group">
                <label htmlFor="backgroundColor">Background Color</label>
                <input
                  id="backgroundColor"
                  type="color"
                  value={localSettings.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
              </div>

              <div className="setting-group">
                <label htmlFor="textColor">Text Color</label>
                <input
                  id="textColor"
                  type="color"
                  value={localSettings.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Speech Recognition</h3>
            
            <div className="setting-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={localSettings.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Real-Time Translation</h3>
            
            <div className="setting-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.enableTranslation}
                  onChange={(e) => handleChange('enableTranslation', e.target.checked)}
                />
                <strong>Enable real-time caption translation</strong>
              </label>
            </div>

            {localSettings.enableTranslation && (
              <div className="setting-group">
                <label htmlFor="targetLanguage">
                  <strong>Translate captions to:</strong>
                </label>
                <select
                  id="targetLanguage"
                  value={localSettings.targetLanguage || 'es'}
                  onChange={(e) => handleChange('targetLanguage', e.target.value)}
                  style={{ width: '100%', padding: '8px' }}
                >
                  {translationLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '0.85em', marginTop: '5px', opacity: 0.7 }}>
                  Captions will appear in two columns: English (left) and {translationLanguages.find(l => l.code === (localSettings.targetLanguage || 'es'))?.name} (right)
                </p>
              </div>
            )}

            {!localSettings.enableTranslation && (
              <p style={{ fontSize: '0.9em', opacity: 0.6, marginTop: '10px' }}>
                Enable translation to see captions in multiple languages simultaneously
              </p>
            )}
          </div>

          <div className="settings-section">
            <h3>Other Options</h3>
            
            <div className="setting-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.autoScroll}
                  onChange={(e) => handleChange('autoScroll', e.target.checked)}
                />
                Auto-scroll to latest captions
              </label>
            </div>

            <div className="setting-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.showConfidence}
                  onChange={(e) => handleChange('showConfidence', e.target.checked)}
                />
                Show confidence indicators
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;