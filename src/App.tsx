import { useState, useEffect } from 'react';
import { AccentColor, AppScreen, Language, SavedTv, ThemeMode } from './types';
import PhoneFrame from './components/PhoneFrame';
import WelcomeScreen from './components/WelcomeScreen';
import LogoScreen from './components/LogoScreen';
import HomeScreen from './components/HomeScreen';
import TvScreenSimulator from './components/TvScreenSimulator';
import TvSelectorModal from './components/TvSelectorModal';
import { getTranslation } from './data/translations';
import { playClickSound, playSuccessSound } from './utils/audio';

export default function App() {
  // Onboarding Screen state
  const [screen, setScreen] = useState<AppScreen>('WELCOME');

  // Preference states
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [savedTvs, setSavedTvs] = useState<SavedTv[]>([]);

  // Active Connection state
  const [connectedTv, setConnectedTv] = useState<SavedTv | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // TV Proxy feedback states
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [lastActionTimestamp, setLastActionTimestamp] = useState<number>(0);
  const [textBuffer, setTextBuffer] = useState<string>('');

  // 1. Initial sniffing and loading preferences
  useEffect(() => {
    // Check local storage
    const storedPrefs = localStorage.getItem('osama_remote_preferences');
    if (storedPrefs) {
      try {
        const parsed = JSON.parse(storedPrefs);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.enableVoice !== undefined) setEnableVoice(parsed.enableVoice);
        if (parsed.enableAnimations !== undefined) setEnableAnimations(parsed.enableAnimations);
        if (parsed.savedTvs) setSavedTvs(parsed.savedTvs);
      } catch (e) {
        // Fallback silently
      }
    } else {
      // Sniff browser language for first launch
      const browserLang = navigator.language.startsWith('en') ? 'en' : 'ar';
      setLanguage(browserLang);
      
      // Save default tvs
      const initialTvs: SavedTv[] = [
        {
          id: 'tv-default-1',
          name: browserLang === 'ar' ? 'شاشة سامسونج الرئيسية' : 'Master Samsung TV',
          brand: 'Samsung Smart TV',
          ipAddress: '192.168.1.50',
          isOnline: true,
        },
        {
          id: 'tv-default-2',
          name: browserLang === 'ar' ? 'تلفزيون الألعاب (LG)' : 'Gaming TV (LG)',
          brand: 'LG webOS',
          ipAddress: '192.168.1.60',
          isOnline: true,
        },
      ];
      setSavedTvs(initialTvs);
      saveToStorage({
        language: browserLang,
        theme: 'dark',
        accentColor: 'blue',
        enableVoice: true,
        enableAnimations: true,
        savedTvs: initialTvs,
      });
    }
  }, []);

  // Update root document styling for Light / Dark Mode theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0a0a0a';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f4f4f5';
    }
  }, [theme]);

  // Helper to save current state to localStorage
  const saveToStorage = (updates: Partial<{
    language: Language;
    theme: ThemeMode;
    accentColor: AccentColor;
    enableVoice: boolean;
    enableAnimations: boolean;
    savedTvs: SavedTv[];
  }>) => {
    const current = {
      language,
      theme,
      accentColor,
      enableVoice,
      enableAnimations,
      savedTvs,
      ...updates,
    };
    localStorage.setItem('osama_remote_preferences', JSON.stringify(current));
  };

  // Preference updates handlers
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    saveToStorage({ language: lang });
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveToStorage({ theme: newTheme });
  };

  const handleAccentChange = (color: AccentColor) => {
    setAccentColor(color);
    saveToStorage({ accentColor: color });
  };

  const handleToggleVoice = () => {
    setEnableVoice(!enableVoice);
    saveToStorage({ enableVoice: !enableVoice });
  };

  const handleToggleAnimations = () => {
    setEnableAnimations(!enableAnimations);
    saveToStorage({ enableAnimations: !enableAnimations });
  };

  const handleSaveTv = (tv: SavedTv) => {
    // Avoid duplicates
    const filtered = savedTvs.filter(t => t.ipAddress !== tv.ipAddress);
    const updated = [tv, ...filtered];
    setSavedTvs(updated);
    saveToStorage({ savedTvs: updated });
  };

  const handleDeleteTv = (id: string) => {
    const updated = savedTvs.filter(t => t.id !== id);
    setSavedTvs(updated);
    saveToStorage({ savedTvs: updated });
    if (connectedTv && connectedTv.id === id) {
      setConnectedTv(null);
    }
  };

  const handleConnectTv = (tv: SavedTv) => {
    setConnectedTv(tv);
    playSuccessSound();
    triggerAction('CONNECTED_TO_TV');
  };

  // Triggering actions back to the TV Screen simulator
  const triggerAction = (actionName: string) => {
    setLastAction(actionName);
    setLastActionTimestamp(Date.now());
  };

  const handleKeyClick = (keyName: string) => {
    triggerAction(keyName);
  };

  const handleTouchpadGesture = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'TAP') => {
    triggerAction(direction);
  };

  const handleSendText = (text: string) => {
    setTextBuffer(text);
    triggerAction('SEND_TEXT');
    setTimeout(() => {
      setTextBuffer('');
    }, 4000);
  };

  const isRtl = language === 'ar';

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'
    }`}>
      
      {/* GLOBAL BANNER HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b border-neutral-200/40 dark:border-neutral-900/40 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-2xl animate-pulse">📡</span>
          <div className="flex flex-col text-left rtl:text-right">
            <h1 className="text-lg font-black tracking-tight">{getTranslation(language, 'appName')}</h1>
            <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
              {getTranslation(language, 'demoMode')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={() => handleLanguageChange(language === 'ar' ? 'en' : 'ar')}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-800 text-xs font-bold bg-white dark:bg-neutral-900 shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
          >
            {language === 'ar' ? 'English 🇺🇸' : 'العربية 🇸🇦'}
          </button>
          
          <button
            onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-800 text-xs font-bold bg-white dark:bg-neutral-900 shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE BENTO GRID */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full">
          
          {/* LEFT SIDE: Simulated Smart TV Set (Desktop) */}
          <div className="lg:col-span-5 col-span-12 w-full flex flex-col justify-center order-2 lg:order-1">
            <div className="text-center lg:text-left rtl:lg:text-right pb-3">
              <h2 className="text-xs font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">
                {isRtl ? 'المحاكي التفاعلي للشاشة' : 'INTERACTIVE SMART TV SIMULATOR'}
              </h2>
              <p className="text-[11px] text-neutral-400 leading-normal max-w-sm mx-auto lg:mx-0">
                {isRtl
                  ? 'شاهد استجابة التلفاز الذكي في الوقت الفعلي عند ضغط أزرار الريموت أو استخدام لوحة اللمس والكتابة.'
                  : 'Watch the TV react in real-time as you press buttons, swipe on touchpad, or type queries.'}
              </p>
            </div>
            
            <TvScreenSimulator
              connectedTv={connectedTv}
              lastAction={lastAction}
              lastActionTimestamp={lastActionTimestamp}
              textBuffer={textBuffer}
            />
          </div>

          {/* RIGHT SIDE: Interactive Smartphone Shell hosting Osama Remote */}
          <div className="lg:col-span-7 col-span-12 w-full flex justify-center order-1 lg:order-2">
            <PhoneFrame
              accentColor={accentColor}
              theme={theme}
              connectedTvName={connectedTv ? connectedTv.name : undefined}
              isConnecting={isConnectModalOpen}
            >
              {/* ONBOARDING SCREEN CONTROLLER */}
              {screen === 'WELCOME' && (
                <WelcomeScreen
                  accentColor={accentColor}
                  enableVoice={enableVoice}
                  onComplete={() => setScreen('LOGO')}
                />
              )}

              {screen === 'LOGO' && (
                <LogoScreen
                  accentColor={accentColor}
                  theme={theme}
                  onContinue={() => {
                    playClickSound();
                    setScreen('MAIN');
                  }}
                />
              )}

              {screen === 'MAIN' && (
                <HomeScreen
                  accentColor={accentColor}
                  onChangeAccent={handleAccentChange}
                  language={language}
                  onChangeLanguage={handleLanguageChange}
                  theme={theme}
                  onChangeTheme={handleThemeChange}
                  enableVoice={enableVoice}
                  onToggleVoice={handleToggleVoice}
                  enableAnimations={enableAnimations}
                  onToggleAnimations={handleToggleAnimations}
                  connectedTv={connectedTv}
                  onOpenConnectModal={() => setIsConnectModalOpen(true)}
                  onKeyClick={handleKeyClick}
                  onGesture={handleTouchpadGesture}
                  onSendText={handleSendText}
                />
              )}

              {/* TV SELECTOR & PAIRING MODAL AS OVERLAY */}
              {isConnectModalOpen && (
                <TvSelectorModal
                  accentColor={accentColor}
                  savedTvs={savedTvs}
                  onConnect={handleConnectTv}
                  onSaveTv={handleSaveTv}
                  onDeleteTv={handleDeleteTv}
                  onClose={() => setIsConnectModalOpen(false)}
                  lang={language}
                />
              )}
            </PhoneFrame>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 border-t border-neutral-200/40 dark:border-neutral-900/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 space-y-2 sm:space-y-0 select-none">
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-neutral-500">
          <span>👨‍💻</span>
          <span>{isRtl ? 'تصميم وتطوير المصمم أسامة' : 'Designed & Developed by Osama'}</span>
        </div>
        <span className="font-mono tracking-wider">
          © 2026 OSAMA REMOTE CONTROL • OFFICIAL LOCAL NETWORK PROTOCOLS ONLY
        </span>
      </footer>

    </div>
  );
}
