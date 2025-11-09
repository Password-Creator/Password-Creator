import React from 'react';
import './SessionSummary.css';

interface SessionSummaryProps {
  aiSummary?: string;
  keyPoints?: string[];
  topics?: string[];
  rawText: string;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  aiSummary,
  keyPoints,
  topics,
  rawText
}) => {
  const [showRawText, setShowRawText] = React.useState(false);

  return (
    <div className="session-summary">
      {aiSummary && (
        <div className="summary-section">
          <h3 className="section-title">📝 AI Summary</h3>
          <p className="summary-text">{aiSummary}</p>
        </div>
      )}

      {keyPoints && keyPoints.length > 0 && (
        <div className="summary-section">
          <h3 className="section-title">🔑 Key Points</h3>
          <ul className="key-points-list">
            {keyPoints.map((point, index) => (
              <li key={index} className="key-point">
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {topics && topics.length > 0 && (
        <div className="summary-section">
          <h3 className="section-title">📚 Topics Covered</h3>
          <div className="topics-tags">
            {topics.map((topic, index) => (
              <span key={index} className="topic-tag">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="summary-section">
        <button
          className="toggle-raw-btn"
          onClick={() => setShowRawText(!showRawText)}
        >
          {showRawText ? '▼ Hide' : '▶ View'} Full Transcript
        </button>
        
        {showRawText && (
          <div className="raw-text-container">
            <p className="raw-text">{rawText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSummary;
