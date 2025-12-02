import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import PasswordLengthSelector from './PasswordLengthSelector';
import './Landing.css';

interface CreateAccountProps {
  onCreateAccount: (email: string, password: string) => void;
  onBackToLogin: () => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ onCreateAccount, onBackToLogin }) => {
  const { signup, login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [errors, setErrors] = useState<{email?: string; password?: string; confirmPassword?: string}>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: {email?: string; password?: string; confirmPassword?: string} = {};
    if (!email) e.email = t('landing.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('landing.emailInvalid');
    if (!password) e.password = t('landing.passwordRequired');
    else if (password.length < 6) e.password = t('landing.passwordWeak');
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    const success = await signup(email, password);
    
    if (success) {
      // Auto-login after successful signup
      await login(email, password);
      onCreateAccount(email, password);
    } else {
      setLoading(false);
      setErrors({ ...errors, email: 'Email already exists' });
    }
  };

  return (
    <div className="landing-root">
      <div className="container">
        <div className="pixel-corner pixel-corner-tl" />
        <div className="pixel-corner pixel-corner-tr" />
        <div className="pixel-corner pixel-corner-bl" />
        <div className="pixel-corner pixel-corner-br" />

        <h1 className="title">Create Account<span className="pixel-cursor" /></h1>

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
                autoComplete="new-password"
              />
              <div className="focus-effect" />
            </div>
            <div className="error-message" style={{opacity: errors.password ? 1 : 0}}>{errors.password || ' '}</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                className={`input-box ${errors.confirmPassword ? 'input-error' : ''}`}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <div className="focus-effect" />
            </div>
            <div className="error-message" style={{opacity: errors.confirmPassword ? 1 : 0}}>{errors.confirmPassword || ' '}</div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? t('landing.initializing') : 'Create Account'}
          </button>
        </form>
        
        <button className="link-like" onClick={onBackToLogin}>
          Already have an account? Sign in
        </button>
        
        <div className="divider">
          <span>{t('landing.orConnectVia')}</span>
        </div>
        
        <div className="social-buttons">
          <button 
            type="button" 
            className="social-btn social-btn-google"
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            <span className="social-icon">G</span>
            Sign up with Google
          </button>
          <button 
            type="button" 
            className="social-btn social-btn-linkedin"
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            <span className="social-icon">in</span>
            Sign up with LinkedIn
          </button>
        </div>
      </div>
      
      {/* Password Length Selector at bottom left */}
      <PasswordLengthSelector length={passwordLength} onChange={setPasswordLength} />
    </div>
  );
};

export default CreateAccount;
