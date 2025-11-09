import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './Landing.css';

interface LandingProps {
  onLogin: (email: string) => void;
  onCreateAccount?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin, onCreateAccount }) => {
  const { loginWithRedirect } = useAuth0();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: {email?: string; password?: string} = {};
    if (!email) e.email = t('landing.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('landing.emailInvalid');
    if (!password) e.password = t('landing.passwordRequired');
    else if (password.length < 6) e.password = t('landing.passwordWeak');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 800);
  };

  return (
    <div className="landing-root">
      <div className="container">
        <div className="pixel-corner pixel-corner-tl" />
        <div className="pixel-corner pixel-corner-tr" />
        <div className="pixel-corner pixel-corner-bl" />
        <div className="pixel-corner pixel-corner-br" />

        <h1 className="title">{t('landing.title')}<span className="pixel-cursor" /></h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('landing.emailLabel')}</label>
            <div className="input-wrapper">
              <input
                id="email"
                className={`input-box ${errors.email ? 'input-error' : ''}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <div className="focus-effect" />
            </div>
            <div className="error-message" style={{opacity: errors.email ? 1 : 0}}>{errors.email || ' '}</div>
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('landing.passwordLabel')}</label>
            <div className="input-wrapper">
              <input
                id="password"
                className={`input-box ${errors.password ? 'input-error' : ''}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <div className="focus-effect" />
            </div>
            <div className="error-message" style={{opacity: errors.password ? 1 : 0}}>{errors.password || ' '}</div>
          </div>

          <button type="submit" disabled={loading}>{loading ? t('landing.initializing') : t('landing.login')}</button>
        </form>
        <button className="link-like" onClick={onCreateAccount}>{t('landing.createAccount')}</button>
        
        <div className="divider">
          <span>{t('landing.orConnectVia')}</span>
        </div>
        
        <div className="social-buttons">
          <button 
            type="button" 
            className="social-btn social-btn-google"
            onClick={() => loginWithRedirect({ 
              authorizationParams: { 
                connection: 'google-oauth2' 
              }
            })}
          >
            <span className="social-icon">G</span>
            {t('landing.signInGoogle')}
          </button>
          <button 
            type="button" 
            className="social-btn social-btn-linkedin"
            onClick={() => loginWithRedirect({ 
              authorizationParams: { 
                connection: 'linkedin' 
              }
            })}
          >
            <span className="social-icon">in</span>
            {t('landing.signInLinkedin')}
          </button>
        </div>
      </div>
      
      {/* Language Selector at bottom left */}
      <LanguageSelector />
    </div>
  );
};

export default Landing;
