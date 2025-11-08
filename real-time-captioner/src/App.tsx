import React, { useState, useCallback } from 'react';
import CaptionDisplay from './components/CaptionDisplay';
import AudioControls from './components/AudioControls';
import Settings from './components/Settings';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { Caption, CaptionSettings } from './types/speech';
import './App.css';

const defaultSettings: CaptionSettings = {
  fontSize: 32,
  fontFamily: 'Arial',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  maxLines: 8,
  autoScroll: true,
  showConfidence: false,
  language: 'en-US',
  enableTranslation: false,
};

function App() {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [settings, setSettings] = useState<CaptionSettings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleResult = useCallback((caption: Caption) => {
    setCaptions(prev => {
      // If this is an interim result, replace the last interim result
      if (!caption.isFinal && prev.length > 0 && !prev[prev.length - 1].isFinal) {
        return [...prev.slice(0, -1), caption];
      }
      // Otherwise, add the new caption
      return [...prev, caption];
    });
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Speech recognition error:', error);
    // You could add a toast notification here
  }, []);

  const {
    isListening,
    isSupported,
    toggleListening,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    language: settings.language,
    onResult: handleResult,
    onError: handleError,
  });

  const clearCaptions = useCallback(() => {
    setCaptions([]);
  }, []);

  const handleSettingsChange = useCallback((newSettings: CaptionSettings) => {
    setSettings(newSettings);
  }, []);

  return (
    <div className="App" style={{ 
      backgroundColor: settings.backgroundColor,
      fontFamily: settings.fontFamily 
    }}>
      <header className="app-header">
        <h1>Real-Time Captioner</h1>
        <div className="header-controls">
          <button 
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      <main className="app-main">
        <CaptionDisplay
          captions={captions}
          fontSize={settings.fontSize}
          maxLines={settings.maxLines}
          showConfidence={settings.showConfidence}
          backgroundColor={settings.backgroundColor}
          textColor={settings.textColor}
          autoScroll={settings.autoScroll}
        />
      </main>

      <AudioControls
        isListening={isListening}
        isSupported={isSupported}
        onToggleListening={toggleListening}
        onClearCaptions={clearCaptions}
      />

      <Settings
        settings={settings}
        onSettingsChange={handleSettingsChange}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
