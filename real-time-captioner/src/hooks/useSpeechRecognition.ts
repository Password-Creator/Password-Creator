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

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

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

      // Handle errors
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        onError?.(event.error);
        setIsListening(false);
      };

      // Handle end of recognition
      recognition.onend = () => {
        setIsListening(false);
      };

      // Handle start of recognition
      recognition.onstart = () => {
        setIsListening(true);
      };
    } else {
      setIsSupported(false);
      onError?.('Speech recognition is not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, interimResults, language, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        onError?.('Failed to start speech recognition');
      }
    }
  }, [isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

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