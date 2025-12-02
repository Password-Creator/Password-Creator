import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

interface NavbarProps {
  showDiagnostics: boolean;
  onToggleDiagnostics: () => void;
  onForceReset: () => void;
  onLogout?: () => void;
  userName?: string;
  onNavigateHome?: () => void;
  onNavigateNotes?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  showDiagnostics,
  onToggleDiagnostics,
  onForceReset,
  onLogout,
  userName,
  onNavigateHome,
  onNavigateNotes,
}) => {
  const { t } = useLanguage();
  
  return (
    <header className="navbar">
      <h1 className="navbar-title">SpeakEasy</h1>
      {userName && (
        <div className="navbar-welcome">
          Welcome, <span className="navbar-username">{userName}</span>
        </div>
      )}
      <div className="navbar-controls">
        <button 
          className="navbar-button navbar-button-home"
          onClick={onNavigateHome}
          aria-label="Home"
        >
          🏠 {t('nav.home')}
        </button>
        <button 
          className="navbar-button navbar-button-secondary"
          onClick={onNavigateNotes}
          aria-label="Notes"
        >
          📝 {t('nav.notes')}
        </button>
        <button 
          className="navbar-button navbar-button-secondary"
          onClick={onToggleDiagnostics}
          aria-label="Toggle diagnostics"
        >
          🐛 Debug
        </button>
        {showDiagnostics && (
          <button 
            className="navbar-button navbar-button-danger"
            onClick={onForceReset}
            aria-label="Force reset application"
          >
            🔄 Reset
          </button>
        )}
        {onLogout && (
          <button
            className="navbar-button navbar-button-home"
            onClick={onLogout}
            aria-label="Log out"
          >
            🚪 {t('nav.logout')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;