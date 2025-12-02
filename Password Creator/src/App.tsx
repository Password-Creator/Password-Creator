import React, { useState, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import CreateAccount from './components/CreateAccount';
import './App.css';

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '24px'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Render landing page when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="App">
        {showCreateAccount ? (
          <CreateAccount 
            onCreateAccount={(email, password) => {
              console.log('Creating account for:', email);
              setShowCreateAccount(false);
            }}
            onBackToLogin={() => setShowCreateAccount(false)}
          />
        ) : (
          <Landing 
            onLogin={() => {}} 
            onCreateAccount={() => setShowCreateAccount(true)} 
          />
        )}
      </div>
    );
  }

  // Main app - password creator interface
  return (
    <div className="App">
      <Navbar
        showDiagnostics={showDiagnostics}
        onToggleDiagnostics={() => setShowDiagnostics(!showDiagnostics)}
        onForceReset={() => window.location.reload()}
        onLogout={handleLogout}
        userName={user?.name || user?.email || 'User'}
      />
      
      <main className="app-main">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 80px)',
          color: '#00ff41',
          fontSize: '24px',
          fontFamily: 'Courier New, monospace'
        }}>
          Password Creator - Coming Soon
        </div>
      </main>
    </div>
  );
}

export default App;
