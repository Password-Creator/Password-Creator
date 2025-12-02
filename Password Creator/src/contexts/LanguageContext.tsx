import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.notes': 'Notes',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.title': 'CIPHERCRAFT LOGIN',
    'landing.subtitle': 'Capture and transcribe lectures in real-time',
    'landing.login': 'Login',
    'landing.signup': 'Sign Up',
    'landing.emailLabel': 'COMMUNICATION CHANNEL (EMAIL):',
    'landing.passwordLabel': 'SECRET CODE (PASSWORD):',
    'landing.emailRequired': 'COMM CHANNEL REQUIRED!',
    'landing.emailInvalid': 'INVALID CHANNEL FORMAT!',
    'landing.passwordRequired': 'SECRET CODE REQUIRED!',
    'landing.passwordWeak': 'CODE TOO WEAK!',
    'landing.initializing': 'INITIALIZING…',
    'landing.createAccount': 'CREATE NEW ACCOUNT',
    'landing.orConnectVia': 'OR CONNECT VIA',
    'landing.signInGoogle': 'SIGN IN WITH GOOGLE',
    'landing.signInLinkedin': 'SIGN IN WITH LINKEDIN',
    
    // Home Page
    'home.listening': 'Listening...',
    'home.notListening': 'Click microphone to start',
    'home.saveTooltip': 'Save your recording to notes',
    'home.start': 'START',
    'home.stop': 'STOP',
    'home.clear': 'CLEAR',
    'home.saveSession': 'SAVE SESSION',
    'home.stopped': 'Stopped',
    'home.recordFirst': 'Record some content first',
    'home.saveAndGenerate': 'Save session and generate AI summary',
    'home.readyToCapture': 'Ready to capture speech...',
    'home.clickToStart': 'Click the microphone button to start',
    'home.paused': 'Stopped - Click CLEAR to reset or START to continue',
    'home.aiProcessing': 'AI is generating your study notes...',
    
    // Subject Prompt
    'subject.title': 'What subject is this session about?',
    'subject.subtitle': 'This helps organize your notes (or skip for AI to detect)',
    'subject.skip': 'Skip (AI will detect)',
    'subject.computerScience': 'Computer Science',
    'subject.mathematics': 'Mathematics',
    'subject.physics': 'Physics',
    'subject.chemistry': 'Chemistry',
    'subject.biology': 'Biology',
    'subject.history': 'History',
    'subject.english': 'English',
    'subject.other': 'Other',
    
    // Notes Page
    'notes.title': 'My Lecture Notes',
    'notes.noSessions': 'No saved sessions yet',
    'notes.duration': 'Duration',
    'notes.minutes': 'min',
    'notes.summary': 'Summary',
    'notes.keyPoints': 'Key Points',
    'notes.topics': 'Topics',
    'notes.transcript': 'Full Transcript',
    'notes.processing': 'Processing...',
    'notes.delete': 'Delete',
    'notes.expand': 'EXPAND',
    'notes.collapse': 'COLLAPSE',
    'notes.share': 'SHARE',
    'notes.download': 'DOWNLOAD',
    'notes.totalSessions': 'Total Sessions',
    'notes.searchPlaceholder': 'Search notes...',
    'notes.allSubjects': 'All',
    
    // Captions
    'captions.original': 'English',
    'captions.translation': 'Translation',
    
    // Language Selector
    'language.button': 'Language',
    'language.english': 'English',
    'language.spanish': 'Spanish',
    
    // Chatbot
    'chatbot.title': 'Study Assistant',
    'chatbot.placeholder': 'Ask me about your lectures...',
    'chatbot.greeting': "Hi! I'm your study assistant. I can help you with your lecture notes, assignments, and answer questions about what your professor said. What would you like to know?",
    'chatbot.suggestions.assignments': 'What assignments did my professor mention?',
    'chatbot.suggestions.summary': "Summarize yesterday's lecture",
    'chatbot.suggestions.topics': 'What topics have I covered this week?',
    'chatbot.suggestions.review': 'Help me review for the exam',
    'chatbot.tryAsking': 'Try asking:',
  },
  es: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.notes': 'Notas',
    'nav.logout': 'Cerrar Sesión',
    
    // Landing Page
    'landing.title': 'CIPHERCRAFT LOGIN',
    'landing.subtitle': 'Captura y transcribe conferencias en tiempo real',
    'landing.login': 'Iniciar Sesión',
    'landing.signup': 'Registrarse',
    'landing.emailLabel': 'CANAL DE COMUNICACIÓN (CORREO):',
    'landing.passwordLabel': 'CÓDIGO SECRETO (CONTRASEÑA):',
    'landing.emailRequired': '¡CANAL DE COMUNICACIÓN REQUERIDO!',
    'landing.emailInvalid': '¡FORMATO DE CANAL INVÁLIDO!',
    'landing.passwordRequired': '¡CÓDIGO SECRETO REQUERIDO!',
    'landing.passwordWeak': '¡CÓDIGO MUY DÉBIL!',
    'landing.initializing': 'INICIALIZANDO…',
    'landing.createAccount': 'CREAR NUEVA CUENTA',
    'landing.orConnectVia': 'O CONECTAR VÍA',
    'landing.signInGoogle': 'INICIAR SESIÓN CON GOOGLE',
    'landing.signInLinkedin': 'INICIAR SESIÓN CON LINKEDIN',
    
    // Home Page
    'home.listening': 'Escuchando...',
    'home.notListening': 'Haz clic en el micrófono para comenzar',
    'home.saveTooltip': 'Guarda tu grabación en notas',
    'home.start': 'INICIAR',
    'home.stop': 'DETENER',
    'home.clear': 'BORRAR',
    'home.saveSession': 'GUARDAR SESIÓN',
    'home.stopped': 'Detenido',
    'home.recordFirst': 'Graba algo primero',
    'home.saveAndGenerate': 'Guardar sesión y generar resumen de IA',
    'home.readyToCapture': 'Listo para capturar voz...',
    'home.clickToStart': 'Haz clic en el botón del micrófono para comenzar',
    'home.paused': 'Detenido - Haz clic en BORRAR para reiniciar o INICIAR para continuar',
    'home.aiProcessing': 'La IA está generando tus notas de estudio...',
    
    // Subject Prompt
    'subject.title': '¿Sobre qué tema es esta sesión?',
    'subject.subtitle': 'Esto ayuda a organizar tus notas (o salta para que la IA lo detecte)',
    'subject.skip': 'Saltar (la IA lo detectará)',
    'subject.computerScience': 'Ciencias de la Computación',
    'subject.mathematics': 'Matemáticas',
    'subject.physics': 'Física',
    'subject.chemistry': 'Química',
    'subject.biology': 'Biología',
    'subject.history': 'Historia',
    'subject.english': 'Inglés',
    'subject.other': 'Otro',
    
    // Notes Page
    'notes.title': 'Mis Notas de Clase',
    'notes.noSessions': 'No hay sesiones guardadas aún',
    'notes.duration': 'Duración',
    'notes.minutes': 'min',
    'notes.summary': 'Resumen',
    'notes.keyPoints': 'Puntos Clave',
    'notes.topics': 'Temas',
    'notes.transcript': 'Transcripción Completa',
    'notes.processing': 'Procesando...',
    'notes.delete': 'Eliminar',
    'notes.expand': 'EXPANDIR',
    'notes.collapse': 'CONTRAER',
    'notes.share': 'COMPARTIR',
    'notes.download': 'DESCARGAR',
    'notes.totalSessions': 'Total de Sesiones',
    'notes.searchPlaceholder': 'Buscar notas...',
    'notes.allSubjects': 'Todos',
    
    // Captions
    'captions.original': 'Inglés',
    'captions.translation': 'Traducción',
    
    // Language Selector
    'language.button': 'Idioma',
    'language.english': 'Inglés',
    'language.spanish': 'Español',
    
    // Chatbot
    'chatbot.title': 'Asistente de Estudio',
    'chatbot.placeholder': 'Pregúntame sobre tus clases...',
    'chatbot.greeting': '¡Hola! Soy tu asistente de estudio. Puedo ayudarte con tus notas de clase, tareas y responder preguntas sobre lo que dijo tu profesor. ¿Qué te gustaría saber?',
    'chatbot.suggestions.assignments': '¿Qué tareas mencionó mi profesor?',
    'chatbot.suggestions.summary': 'Resume la clase de ayer',
    'chatbot.suggestions.topics': '¿Qué temas he cubierto esta semana?',
    'chatbot.suggestions.review': 'Ayúdame a repasar para el examen',
    'chatbot.tryAsking': 'Intenta preguntar:',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguage') as Language;
    if (saved && (saved === 'en' || saved === 'es')) {
      setLanguage(saved);
    }
  }, []);

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
