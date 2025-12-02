import React from 'react';
import './TroubleshootingTips.css';

interface TroubleshootingTipsProps {
  errorType?: string;
}

const TroubleshootingTips: React.FC<TroubleshootingTipsProps> = ({ errorType }) => {
  const getTips = () => {
    switch (errorType) {
      case 'network':
        return [
          'Check your internet connection',
          'Make sure you\'re using HTTPS (not HTTP)',
          'Try refreshing the page',
          'Disable VPN or proxy if using one',
          'Check if your firewall is blocking the connection'
        ];
      case 'not-allowed':
        return [
          'Click the microphone icon in your browser\'s address bar',
          'Select "Allow" for microphone permissions',
          'Check if another app is using your microphone',
          'Try refreshing the page and allow permissions again'
        ];
      case 'no-speech':
        return [
          'Speak closer to your microphone',
          'Check if your microphone is muted',
          'Increase your microphone volume',
          'Try speaking louder and clearer'
        ];
      case 'audio-capture':
        return [
          'Check if your microphone is connected properly',
          'Make sure no other app is using the microphone',
          'Try unplugging and reconnecting your microphone',
          'Check your system audio settings'
        ];
      default:
        return [
          'Use Chrome, Safari, or Edge browsers for best compatibility',
          'Make sure you\'re on HTTPS (secure connection)',
          'Allow microphone permissions when prompted',
          'Check your internet connection',
          'Speak clearly and close to the microphone'
        ];
    }
  };

  return (
    <div className="troubleshooting-tips">
      <h3>💡 Troubleshooting Tips</h3>
      <ul>
        {getTips().map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
      <div className="browser-requirements">
        <h4>Browser Requirements:</h4>
        <div className="browser-list">
          <span className="browser supported">✅ Chrome</span>
          <span className="browser supported">✅ Safari</span>
          <span className="browser supported">✅ Edge</span>
          <span className="browser not-supported">❌ Firefox</span>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingTips;