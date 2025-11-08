import React from 'react';
import { Caption } from '../types/speech';
import './CaptionDisplay.css';

interface CaptionDisplayProps {
  captions: Caption[];
  fontSize?: number;
  maxLines?: number;
  showConfidence?: boolean;
  backgroundColor?: string;
  textColor?: string;
  autoScroll?: boolean;
}

const CaptionDisplay: React.FC<CaptionDisplayProps> = ({
  captions,
  fontSize = 24,
  maxLines = 10,
  showConfidence = false,
  backgroundColor = '#000000',
  textColor = '#ffffff',
  autoScroll = true
}) => {
  const displayCaptions = captions.slice(-maxLines);

  React.useEffect(() => {
    if (autoScroll) {
      const captionContainer = document.getElementById('caption-container');
      if (captionContainer) {
        captionContainer.scrollTop = captionContainer.scrollHeight;
      }
    }
  }, [captions, autoScroll]);

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#4CAF50'; // Green - high confidence
    if (confidence >= 0.6) return '#FF9800'; // Orange - medium confidence
    return '#F44336'; // Red - low confidence
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div 
      id="caption-container"
      className="caption-display"
      style={{
        backgroundColor,
        color: textColor,
        fontSize: `${fontSize}px`
      }}
    >
      {displayCaptions.length === 0 ? (
        <div className="no-captions">
          <p>Ready to capture speech...</p>
          <p className="subtitle">Click the microphone button to start</p>
        </div>
      ) : (
        displayCaptions.map((caption) => (
          <div 
            key={caption.id} 
            className={`caption-line ${caption.isFinal ? 'final' : 'interim'}`}
            style={{
              borderLeft: showConfidence 
                ? `4px solid ${getConfidenceColor(caption.confidence)}` 
                : 'none'
            }}
          >
            <div className="caption-content">
              <span className="caption-text">{caption.text}</span>
              {showConfidence && (
                <span 
                  className="confidence-indicator"
                  style={{ color: getConfidenceColor(caption.confidence) }}
                >
                  {Math.round(caption.confidence * 100)}%
                </span>
              )}
            </div>
            <div className="caption-timestamp">
              {formatTime(caption.timestamp)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CaptionDisplay;