import React from 'react';
import './Diagnostics.css';

interface DiagnosticsProps {
  isVisible: boolean;
}

const Diagnostics: React.FC<DiagnosticsProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  const isHTTPS = window.location.protocol === 'https:';
  const isLocalhost = window.location.hostname === 'localhost';
  const hasWebSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const userAgent = navigator.userAgent;
  const isChrome = userAgent.includes('Chrome');
  const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
  const isEdge = userAgent.includes('Edg');
  const isFirefox = userAgent.includes('Firefox');

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="diagnostics">
      <h3>🔍 System Diagnostics</h3>
      
      <div className="diagnostic-section">
        <h4>Connection & Security</h4>
        <div className="diagnostic-item">
          <span className={isHTTPS || isLocalhost ? 'status-good' : 'status-bad'}>
            {isHTTPS || isLocalhost ? '✅' : '❌'}
          </span>
          <span>Secure Connection (HTTPS): {isHTTPS ? 'Yes' : isLocalhost ? 'Localhost (OK)' : 'No - Required for speech recognition'}</span>
        </div>
        <div className="diagnostic-item">
          <span>🌐 URL: {window.location.href}</span>
        </div>
      </div>

      <div className="diagnostic-section">
        <h4>Browser Support</h4>
        <div className="diagnostic-item">
          <span className={hasWebSpeech ? 'status-good' : 'status-bad'}>
            {hasWebSpeech ? '✅' : '❌'}
          </span>
          <span>Web Speech API: {hasWebSpeech ? 'Supported' : 'Not supported'}</span>
        </div>
        <div className="diagnostic-item">
          <span className={isChrome || isSafari || isEdge ? 'status-good' : 'status-warning'}>
            {isChrome || isSafari || isEdge ? '✅' : '⚠️'}
          </span>
          <span>Browser: {
            isChrome ? 'Chrome (Recommended)' :
            isSafari ? 'Safari (Good)' :
            isEdge ? 'Edge (Good)' :
            isFirefox ? 'Firefox (Limited support)' :
            'Unknown browser'
          }</span>
        </div>
      </div>

      <div className="diagnostic-section">
        <h4>Microphone Test</h4>
        <button 
          className="test-mic-button"
          onClick={async () => {
            const micWorking = await checkMicrophone();
            alert(micWorking ? 'Microphone access granted!' : 'Microphone access denied or not available');
          }}
        >
          Test Microphone Access
        </button>
      </div>

      <div className="diagnostic-section">
        <h4>Quick Fixes</h4>
        <ul className="fix-list">
          <li>🔄 Refresh the page</li>
          <li>🔒 Ensure you're using HTTPS</li>
          <li>🎤 Allow microphone permissions</li>
          <li>🌐 Check your internet connection</li>
          <li>🚫 Disable VPN/proxy temporarily</li>
        </ul>
      </div>
    </div>
  );
};

export default Diagnostics;