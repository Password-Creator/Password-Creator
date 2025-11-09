import { CaptureSession } from '../types/notes';

const STORAGE_KEY = 'captioner_sessions';

/**
 * Save sessions to localStorage
 */
export function saveSessions(sessions: CaptureSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving sessions to localStorage:', error);
  }
}

/**
 * Load sessions from localStorage
 */
export function loadSessions(): CaptureSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((session: any) => ({
      ...session,
      timestamp: new Date(session.timestamp)
    }));
  } catch (error) {
    console.error('Error loading sessions from localStorage:', error);
    return [];
  }
}

/**
 * Save a new session
 */
export function saveSession(session: CaptureSession): void {
  const sessions = loadSessions();
  sessions.push(session);
  saveSessions(sessions);
}

/**
 * Update an existing session
 */
export function updateSession(sessionId: string, updates: Partial<CaptureSession>): void {
  const sessions = loadSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    saveSessions(sessions);
  }
}

/**
 * Delete a session
 */
export function deleteSession(sessionId: string): void {
  const sessions = loadSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  saveSessions(filtered);
}

/**
 * Get a single session by ID
 */
export function getSession(sessionId: string): CaptureSession | undefined {
  const sessions = loadSessions();
  return sessions.find(s => s.id === sessionId);
}

/**
 * Clear all sessions
 */
export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
