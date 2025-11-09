import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CaptionDisplay from './components/CaptionDisplay';
import AudioControls from './components/AudioControls';
import Settings from './components/Settings';
import Diagnostics from './components/Diagnostics';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Notes from './components/Notes';
import ChatbotTrigger from './components/ChatbotTrigger';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { Caption, CaptionSettings } from './types/speech';
import { CaptureSession } from './types/notes';
import { saveSession, updateSession } from './services/sessionStorage';
import { generateSessionSummary } from './services/aiService';
import './App.css';

const defaultSettings: CaptionSettings = {
  fontSize: 32,
  fontFamily: 'Arial',
  backgroundColor: 'transparent',
  textColor: '#ffffff',
  maxLines: 8,
  autoScroll: true,
  showConfidence: false,
  language: 'en-US',
  enableTranslation: false,
};

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth0();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [settings, setSettings] = useState<CaptionSettings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'notes'>('home');
  
  // Session tracking
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const [sessionSubject, setSessionSubject] = useState<string>('');
  const [showSubjectPrompt, setShowSubjectPrompt] = useState(false);
  const sessionCaptionsRef = useRef<Caption[]>([]); // Store captions during session
  const [canSaveSession, setCanSaveSession] = useState(false); // Can save if we have captions

  const handleResult = useCallback((caption: Caption) => {
    console.log('📥 Caption received:', { 
      text: caption.text.substring(0, 50), 
      isFinal: caption.isFinal,
      confidence: caption.confidence 
    });
    
    setCaptions(prev => {
      const updated = (() => {
        // Only keep final results to avoid duplicates
        if (caption.isFinal) {
          // Remove any interim results and add the final one
          const withoutInterim = prev.filter(c => c.isFinal);
          return [...withoutInterim, caption];
        } else {
          // For interim results, replace the last interim result
          const finalResults = prev.filter(c => c.isFinal);
          return [...finalResults, caption];
        }
      })();
      
      // Also store in ref for session saving (survives state changes)
      if (sessionStartTimeRef.current) {
        sessionCaptionsRef.current = updated;
        // Enable save button if we have captions
        setCanSaveSession(updated.length > 0);
      }
      
      return updated;
    });
    // Clear any previous error when we get successful results
    setErrorMessage('');
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Speech recognition error:', error);
    setErrorMessage(error);
    // Clear error after 10 seconds
    setTimeout(() => setErrorMessage(''), 10000);
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

  // Manual save session function (triggered by button click)
  const saveCurrentSession = useCallback(async () => {
    console.log('💾 Manual save triggered');
    console.log('📊 Session start time:', sessionStartTimeRef.current);
    console.log('📊 Captions from ref:', sessionCaptionsRef.current.length);
    
    if (!sessionStartTimeRef.current || sessionCaptionsRef.current.length === 0) {
      console.log('❌ No session to save - missing start time or no captions');
      setErrorMessage('No captions to save. Please record something first.');
      return;
    }

    const endTime = new Date();
    const durationMinutes = Math.round(
      (endTime.getTime() - sessionStartTimeRef.current.getTime()) / 60000
    );

    // Use captions from ref
    const sessionCaptions = sessionCaptionsRef.current;
    
    // Combine all final captions into raw text
    let finalCaptions = sessionCaptions.filter(c => c.isFinal);
    
    // If no final captions but we have interim ones, use those
    if (finalCaptions.length === 0 && sessionCaptions.length > 0) {
      console.log('⚠️ No final captions, using all captions (including interim)');
      finalCaptions = sessionCaptions;
    }
    
    const captionTexts = finalCaptions.map(c => c.text);
    const rawText = captionTexts.join(' ');

    console.log('📝 Raw text length:', rawText.length);
    console.log('📝 Raw text preview:', rawText.substring(0, 100));

    if (rawText.trim().length === 0) {
      console.log('❌ No text to save');
      setErrorMessage('No text captured. Please try recording again.');
      return;
    }

    // Create the session object (initially without AI summary)
    const session: CaptureSession = {
      id: `session-${Date.now()}`,
      subject: sessionSubject || 'Unclassified',
      timestamp: sessionStartTimeRef.current,
      duration: durationMinutes,
      captions: captionTexts,
      rawText: rawText,
      isProcessed: false, // Will be true after AI processing
    };

    console.log('✅ Saving session:', session.id);
    // Save immediately to storage (shows in Notes as "Processing...")
    saveSession(session);

    // Show success message
    setErrorMessage(''); // Clear any errors
    
    // Reset session tracking so user can start a new one
    sessionStartTimeRef.current = null;
    sessionCaptionsRef.current = [];
    setSessionSubject('');
    setCanSaveSession(false);
    
    // Clear the display
    setCaptions([]);

    // Generate AI summary in background
    if (rawText.length > 50) {
      console.log('🤖 Starting AI processing...');
      setIsProcessingAI(true);
      
      try {
        const aiSummary = await generateSessionSummary(rawText, durationMinutes);
        
        console.log('✅ AI summary received:', aiSummary);
        
        // Update the session with AI-generated content
        updateSession(session.id, {
          aiSummary: aiSummary.summary,
          keyPoints: aiSummary.keyPoints,
          topics: aiSummary.topics,
          subject: aiSummary.suggestedSubject,
          isProcessed: true,
        });

        console.log('✅ AI summary generated successfully for session:', session.id);
      } catch (error) {
        console.error('❌ Failed to generate AI summary:', error);
        setErrorMessage('Session saved, but AI summary failed. You can still view the transcript in Notes.');
        // Mark as processed even if AI fails
        updateSession(session.id, { isProcessed: true });
      } finally {
        setIsProcessingAI(false);
      }
    } else {
      console.log('⚠️ Text too short for AI processing (need >50 chars)');
      setErrorMessage('Session saved, but text is too short for AI summary.');
      updateSession(session.id, { isProcessed: true });
    }
  }, [sessionSubject]);

  // Start a new session when listening begins
  useEffect(() => {
    console.log('🔄 useEffect triggered - isListening:', isListening, 'sessionStartTime:', !!sessionStartTimeRef.current);
    
    if (isListening && !sessionStartTimeRef.current) {
      console.log('▶️ Starting new session');
      sessionStartTimeRef.current = new Date();
      sessionCaptionsRef.current = []; // Clear caption ref for new session
      setCanSaveSession(false); // Reset save button state
      setShowSubjectPrompt(true);
    }
  }, [isListening]);

  // No longer automatically save on stop - user must click "Save Session" button

  // Add keyboard shortcut for quick stop (Spacebar)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only if spacebar is pressed and we're not typing in an input
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        if (isListening) {
          toggleListening(); // Stop immediately on spacebar
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isListening, toggleListening]);

  const clearCaptions = useCallback(() => {
    console.log('🗑️ Clearing captions from display');
    setCaptions([]);
    // Note: We don't clear sessionCaptionsRef here because we need it for saving
  }, []);

  const handleSettingsChange = useCallback((newSettings: CaptionSettings) => {
    setSettings(newSettings);
  }, []);

  const handleLogout = useCallback(() => {
    // Clear sensitive state (captions) on logout for privacy
    clearCaptions();
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [clearCaptions, logout]);

  // Show loading state while Auth0 is checking authentication
  if (isLoading) {
    return (
      <div className="App" style={{ fontFamily: settings.fontFamily }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '24px'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Render landing page when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="App" style={{ fontFamily: settings.fontFamily }}>
        <Landing onLogin={() => {}} onCreateAccount={() => {}} />
      </div>
    );
  }

  return (
    <div className="App" style={{ fontFamily: settings.fontFamily }}>
      {/* Background removed as requested */}
      <Navbar
        showDiagnostics={showDiagnostics}
        onToggleDiagnostics={() => setShowDiagnostics(!showDiagnostics)}
        onForceReset={() => window.location.reload()}
        onLogout={handleLogout}
        userName={user?.name || user?.nickname || user?.given_name || 'User'}
        onNavigateHome={() => setCurrentPage('home')}
        onNavigateNotes={() => setCurrentPage('notes')}
      />
      {/* Pixel frame overlay that expands to the browser edges between navbar and controls */}
      <div className="pixel-frame" aria-hidden="true" />

      {currentPage === 'notes' ? (
        <Notes />
      ) : (
        <>
          <main className="app-main">
            {/* Subject selection prompt */}
            {showSubjectPrompt && (
              <div className="subject-prompt-overlay">
                <div className="subject-prompt-modal">
                  <h2>What subject is this session about?</h2>
                  <p>This helps organize your notes (or skip for AI to detect)</p>
                  <div className="subject-buttons">
                    {['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Other'].map(subject => (
                      <button
                        key={subject}
                        className="subject-btn"
                        onClick={() => {
                          setSessionSubject(subject);
                          setShowSubjectPrompt(false);
                        }}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                  <button
                    className="skip-btn"
                    onClick={() => setShowSubjectPrompt(false)}
                  >
                    Skip (AI will detect)
                  </button>
                </div>
              </div>
            )}
            {errorMessage && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{errorMessage}</span>
                <button
                  className="error-close"
                  onClick={() => setErrorMessage('')}
                  aria-label="Close error message"
                >
                  ×
                </button>
              </div>
            )}
            {isProcessingAI && (
              <div className="ai-processing-banner">
                <span className="processing-icon">🤖</span>
                <span className="processing-text">AI is generating your study notes...</span>
              </div>
            )}
            {showDiagnostics && <Diagnostics isVisible={showDiagnostics} />}
            {showDiagnostics && (
              <div style={{
                position: 'fixed',
                top: '120px',
                right: '20px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 1000
              }}>
                <div>Is Listening: {isListening ? 'YES' : 'NO'}</div>
                <div>Is Supported: {isSupported ? 'YES' : 'NO'}</div>
                <div>Total Captions: {captions.length}</div>
                <div>Last Caption: {captions[captions.length - 1]?.text?.substring(0, 30) || 'None'}</div>
              </div>
            )}
            <CaptionDisplay
              captions={captions}
              fontSize={settings.fontSize}
              backgroundColor={settings.backgroundColor}
              textColor={settings.textColor}
              autoScroll={settings.autoScroll}
              isListening={isListening}
            />
          </main>

          <AudioControls
            isListening={isListening}
            isSupported={isSupported}
            onToggleListening={toggleListening}
            onClearCaptions={clearCaptions}
            onSaveSession={saveCurrentSession}
            canSave={canSaveSession}
            errorMessage={errorMessage}
          />

          <Settings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />

          <ChatbotTrigger />
        </>
      )}
    </div>
  );
}

export default App;
