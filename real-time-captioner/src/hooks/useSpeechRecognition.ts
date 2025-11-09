import { useState, useRef, useCallback, useEffect } from 'react';
import { SpeechRecognition, Caption } from '../types/speech';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onResult?: (caption: Caption) => void;
  onError?: (error: string) => void;
}

export const useSpeechRecognition = ({
  continuous = true,
  interimResults = true,
  language = 'en-US',
  onResult,
  onError
}: UseSpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const retryCountRef = useRef(0);
  const isManuallyStoppingRef = useRef(false);
  const maxRetries = 3;

  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    console.log('Creating new recognition instance');
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 1;
    
    // Add some additional settings that might help with network issues
    if ('serviceURI' in recognition) {
      recognition.serviceURI = '';  // Use default service
    }

    // Add debugging to track this instance
    (window as any).currentRecognition = recognition;
    console.log('Recognition instance stored in window.currentRecognition');

    return recognition;
  }, [continuous, interimResults, language]);

  useEffect(() => {
    // Check if we're on HTTPS (required for speech recognition in production)
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      setIsSupported(false);
      onError?.('Speech recognition requires HTTPS. Please use a secure connection.');
      return;
    }

    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Create recognition instance only if it doesn't exist
      if (!recognitionRef.current) {
        recognitionRef.current = createRecognition();
      }
      
      const recognition = recognitionRef.current;
      if (!recognition) {
        setIsSupported(false);
        onError?.('Failed to create speech recognition instance');
        return;
      }

      // Handle speech recognition results
      recognition.onresult = (event) => {
        const result = event.results[event.resultIndex];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        const caption: Caption = {
          id: `${Date.now()}-${Math.random()}`,
          text: transcript,
          timestamp: new Date(),
          confidence: confidence || 0,
          isFinal: result.isFinal
        };

        onResult?.(caption);
      };

      // Handle errors with better error messages and retry logic
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Speech recognition error occurred';
        let shouldRetry = false;
        
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error - check your internet connection and try again';
            shouldRetry = retryCountRef.current < maxRetries;
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied - please allow microphone permissions';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected - please speak louder or check your microphone';
            shouldRetry = retryCountRef.current < maxRetries;
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found - please check your microphone connection';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech service not allowed - try using HTTPS or check browser settings';
            break;
          case 'language-not-supported':
            errorMessage = 'Selected language is not supported';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        if (shouldRetry) {
          retryCountRef.current++;
          errorMessage += ` (Retry ${retryCountRef.current}/${maxRetries})`;
          // Retry after a short delay
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              try {
                recognitionRef.current.start();
              } catch (retryError) {
                console.error('Retry failed:', retryError);
              }
            }
          }, 1000);
        } else {
          retryCountRef.current = 0;
          setIsListening(false);
        }
        
        onError?.(errorMessage);
      };

      // Handle end of recognition
      recognition.onend = () => {
        console.log('Recognition ended, isManuallyStoppingRef:', isManuallyStoppingRef.current);
        
        // If we're NOT manually stopping and continuous mode is on, restart immediately
        if (!isManuallyStoppingRef.current && continuous) {
          console.log('🔄 Auto-restarting recognition (continuous mode)');
          setTimeout(() => {
            try {
              if (recognitionRef.current && !isManuallyStoppingRef.current) {
                console.log('▶️ Restarting recognition now...');
                recognitionRef.current.start();
                console.log('✅ Recognition restarted successfully');
              }
            } catch (error) {
              console.log('⚠️ Auto-restart failed:', error);
              // If it fails because it's already started, that's fine
              if ((error as Error).message?.includes('already started')) {
                console.log('✅ Recognition was already running');
              } else {
                console.error('❌ Failed to restart:', error);
                setIsListening(false);
                onError?.('Speech recognition stopped unexpectedly. Please click the microphone to restart.');
              }
            }
          }, 250); // Increased delay to 250ms for more reliable restart
        } else {
          // Only set to false if we're manually stopping
          console.log('⏹️ Stopping recognition (manual stop or not continuous)');
          setTimeout(() => {
            setIsListening(false);
          }, 50);
        }
      };

      // Handle start of recognition
      recognition.onstart = () => {
        setIsListening(true);
        retryCountRef.current = 0; // Reset retry counter on successful start
      };
    } else {
      setIsSupported(false);
      onError?.('Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, interimResults, language, onResult, onError, isListening, createRecognition]);

  const forceStop = useCallback(() => {
    console.log('ForceStop called - Current recognition:', recognitionRef.current);
    
    if (recognitionRef.current) {
      try {
        // Remove all event listeners to prevent any callbacks
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onaudiostart = null;
        recognitionRef.current.onaudioend = null;
        recognitionRef.current.onsoundstart = null;
        recognitionRef.current.onsoundend = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onspeechend = null;
        
        // Stop and abort
        recognitionRef.current.stop();
        recognitionRef.current.abort();
        
        console.log('Recognition stopped and aborted');
      } catch (error) {
        console.log('Force stop error:', error);
      }
      
      // Completely destroy the recognition instance
      recognitionRef.current = null;
    }
    
    setIsListening(false);
    retryCountRef.current = 0;
    isManuallyStoppingRef.current = false;
    console.log('ForceStop completed - isListening set to false');
  }, []);

  const startListening = useCallback(() => {
    if (!isListening) {
      try {
        console.log('StartListening called');
        
        // If recognition was destroyed, recreate it
        if (!recognitionRef.current) {
          console.log('Recreating recognition instance');
          recognitionRef.current = createRecognition();
        }
        
        if (recognitionRef.current) {
          retryCountRef.current = 0;
          isManuallyStoppingRef.current = false;
          console.log('Starting recognition');
          recognitionRef.current.start();
        } else {
          onError?.('Failed to create speech recognition instance');
        }
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        onError?.('Failed to start speech recognition');
      }
    }
  }, [isListening, onError, createRecognition]);

  const stopListening = useCallback(() => {
    if (isListening) {
      isManuallyStoppingRef.current = true;
      forceStop();
    }
  }, [isListening, forceStop]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  };
};