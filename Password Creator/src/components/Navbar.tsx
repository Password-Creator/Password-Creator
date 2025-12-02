import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

interface NavbarProps {
  showDiagnostics: boolean;
  onToggleDiagnostics: () => void;
  onForceReset: () => void;
  onLogout?: () => void;
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  showDiagnostics,
  onToggleDiagnostics,
  onForceReset,
  onLogout,
  userName,
}) => {
  const { t } = useLanguage();
  
  return (
    <header className="navbar">
      <h1 className="navbar-title">CipherCraft</h1>
      {userName && (
        <div className="navbar-welcome">
          Welcome, <span className="navbar-username">{userName}</span>
        </div>
      )}
      <div className="navbar-controls">
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