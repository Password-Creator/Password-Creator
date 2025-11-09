import React, { useState, useEffect } from 'react';
import { CaptureSession, SubjectFilter } from '../types/notes';
import { loadSessions, deleteSession } from '../services/sessionStorage';
import SessionSummary from './SessionSummary';
import './Notes.css';

const Notes: React.FC = () => {
  const [sessions, setSessions] = useState<CaptureSession[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  // Load sessions from storage on mount
  useEffect(() => {
    loadSessionsFromStorage();
  }, []);

  const loadSessionsFromStorage = () => {
    const loadedSessions = loadSessions();
    // Sort by timestamp, newest first
    loadedSessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setSessions(loadedSessions);
  };

  const subjects: SubjectFilter[] = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Psychology', 'Economics', 'Engineering', 'Other'];

  const filteredSessions = sessions.filter(session => {
    const matchesSubject = selectedSubject === 'All' || session.subject === selectedSubject;
    const matchesSearch = searchQuery === '' || 
      session.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleShare = async (session: CaptureSession) => {
    const text = `${session.subject} - ${formatDate(session.timestamp)}\n\n${session.rawText}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${session.subject} Notes`,
          text: text
        });
      } catch (error) {
        console.log('Share cancelled or failed', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Notes copied to clipboard!');
    }
  };

  const handleDownloadPDF = (session: CaptureSession) => {
    // Create a simple text file (PDF generation would require a library like jsPDF)
    let content = `${session.subject}\n${formatDate(session.timestamp)}\nDuration: ${session.duration} minutes\n\n`;
    
    if (session.aiSummary) {
      content += `AI SUMMARY\n${session.aiSummary}\n\n`;
    }
    
    if (session.keyPoints && session.keyPoints.length > 0) {
      content += `KEY POINTS\n${session.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n`;
    }
    
    if (session.topics && session.topics.length > 0) {
      content += `TOPICS\n${session.topics.join(', ')}\n\n`;
    }
    
    content += `FULL TRANSCRIPT\n${session.rawText}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.subject.replace(/\s+/g, '_')}_${session.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
      loadSessionsFromStorage();
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Computer Science': '#29adff',
      'Mathematics': '#ff77a8',
      'Physics': '#00e436',
      'Biology': '#ffcc4d',
      'History': '#ff6b35'
    };
    return colors[subject] || '#29adff';
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1 className="notes-title">SESSION NOTES<span className="pixel-cursor" /></h1>
        <p className="notes-subtitle">All your captured sessions in one place</p>
      </div>

      <div className="notes-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <label className="filter-label">FILTER BY SUBJECT:</label>
          <div className="subject-filters">
            {subjects.map(subject => (
              <button
                key={subject}
                className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sessions-container">
        {filteredSessions.length === 0 ? (
          <div className="no-sessions">
            <p>No sessions found</p>
            <p className="no-sessions-hint">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="sessions-grid">
            {filteredSessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div 
                    className="session-subject-badge"
                    style={{ backgroundColor: getSubjectColor(session.subject) }}
                  >
                    {session.subject}
                  </div>
                  <div className="session-meta">
                    <span className="session-timestamp">{formatDate(session.timestamp)}</span>
                    <span className="session-duration">{session.duration} min</span>
                  </div>
                </div>

                {/* Show AI summary if available, otherwise show preview */}
                {expandedSession === session.id ? (
                  <div className="session-expanded">
                    <SessionSummary
                      aiSummary={session.aiSummary}
                      keyPoints={session.keyPoints}
                      topics={session.topics}
                      rawText={session.rawText}
                    />
                  </div>
                ) : (
                  <div className="session-content">
                    <p className="session-text">
                      {session.aiSummary || session.rawText.substring(0, 200)}
                      {(!session.aiSummary && session.rawText.length > 200) && '...'}
                    </p>
                  </div>
                )}

                <div className="session-stats">
                  <span className="stat-item">
                    📝 {session.captions.length} captions
                  </span>
                  <span className={`stat-item ${session.isProcessed && session.aiSummary ? 'processed' : 'pending'}`}>
                    {session.isProcessed && session.aiSummary ? '✓ AI Processed' : session.isProcessed ? '✓ Saved' : '⏳ Pending'}
                  </span>
                </div>

                <div className="session-actions">
                  <button
                    className="action-btn expand-btn"
                    onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                  >
                    {expandedSession === session.id ? '▼ COLLAPSE' : '▶ EXPAND'}
                  </button>
                  <button
                    className="action-btn share-btn"
                    onClick={() => handleShare(session)}
                    title="Share via AirDrop or other methods"
                  >
                    ↗ SHARE
                  </button>
                  <button
                    className="action-btn download-btn"
                    onClick={() => handleDownloadPDF(session)}
                    title="Download as text file"
                  >
                    ⬇ DOWNLOAD
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(session.id)}
                    title="Delete this session"
                  >
                    🗑 DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="notes-footer">
        <p>Total Sessions: {filteredSessions.length}</p>
      </div>
    </div>
  );
};

export default Notes;
