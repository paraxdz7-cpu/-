import { useState } from 'react';
import { AccentColor, ActiveTab, Language, SavedTv, ThemeMode, TvBrand } from '../types';
import { getAccentBgClass, getAccentColorClass, getAccentTextClass } from './PhoneFrame';
import RemoteControlPanel from './RemoteControlPanel';
import TouchpadPanel from './TouchpadPanel';
import KeyboardInputPanel from './KeyboardInputPanel';
import SettingsPanel from './SettingsPanel';
import { playClickSound } from '../utils/audio';

interface HomeScreenProps {
  accentColor: AccentColor;
  onChangeAccent: (color: AccentColor) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  enableVoice: boolean;
  onToggleVoice: () => void;
  enableAnimations: boolean;
  onToggleAnimations: () => void;
  connectedTv: SavedTv | null;
  onOpenConnectModal: () => void;
  onKeyClick: (key: string) => void;
  onGesture: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'TAP') => void;
  onSendText: (text: string) => void;
}

export default function HomeScreen({
  accentColor,
  onChangeAccent,
  language,
  onChangeLanguage,
  theme,
  onChangeTheme,
  enableVoice,
  onToggleVoice,
  enableAnimations,
  onToggleAnimations,
  connectedTv,
  onOpenConnectModal,
  onKeyClick,
  onGesture,
  onSendText,
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('REMOTE');

  const isRtl = language === 'ar';
  const activeColorHex = getAccentColorClass(accentColor);
  const accentText = getAccentTextClass(accentColor);
  const accentBg = getAccentBgClass(accentColor);
  
  // Rotating Avatar Image
  const avatarPath = "/src/assets/images/osama_avatar_1784630993382.jpg";

  const handleTabChange = (tab: ActiveTab) => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
      {/* HEADER SECTION WITH DESIGNER PROFILE PICTURE (slowly rotating continuously) */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-100 dark:border-[#2a2a30] bg-neutral-50/80 dark:bg-[#0a0a0c]/85 backdrop-blur-xs relative z-40">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Circular profile picture with glowing blue border */}
          <div className="relative">
            {/* Continuous rotating glowing ring - Sleek Interface Style */}
            <div
              className={`absolute -inset-1.5 rounded-full border border-transparent ${
                enableAnimations ? 'animate-spin-slow' : ''
              }`}
              style={{
                borderTopColor: activeColorHex,
                borderBottomColor: activeColorHex,
                boxShadow: `0 0 15px ${activeColorHex}66`,
              }}
            ></div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-300 dark:border-[#2a2a30] bg-neutral-200">
              <img
                src={avatarPath}
                alt="المصمم أسامة"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${
                  enableAnimations ? 'animate-spin-extra-slow' : ''
                }`}
              />
            </div>
          </div>

          {/* Designer signature text */}
          <div className="flex flex-col text-left rtl:text-right">
            <span 
              className="text-xs font-black dark:text-white text-neutral-900 tracking-tight"
              style={{ fontFamily: '"Inter", "Cairo", sans-serif' }}
            >
              {isRtl ? 'المصمم أسامة' : 'Designer Osama'}
            </span>
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
              {isRtl ? 'مطور التطبيق' : 'Application Creator'}
            </span>
          </div>
        </div>

        {/* Quick Connect Indicator */}
        <button
          onClick={() => { playClickSound(); onOpenConnectModal(); }}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl border text-[10px] font-bold tracking-tight transition-all ${
            connectedTv
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/25 shadow-[0_0_8px_rgba(52,199,89,0.2)]'
              : 'bg-neutral-100 dark:bg-[#232328] border-neutral-200 dark:border-[#2a2a30] text-neutral-500 hover:bg-neutral-200/50 dark:hover:border-neutral-700'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${connectedTv ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`}></span>
          <span>{connectedTv ? connectedTv.brand : (isRtl ? 'توصيل شاشة' : 'Connect TV')}</span>
        </button>
      </div>

      {/* ACTIVE SCREEN WORK AREA */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-neutral-50 dark:bg-[#16161a]">
        {activeTab === 'REMOTE' && (
          <RemoteControlPanel
            activeBrand={connectedTv ? connectedTv.brand : null}
            accentColor={accentColor}
            onKeyClick={onKeyClick}
            lang={language}
          />
        )}

        {activeTab === 'TOUCHPAD' && (
          <TouchpadPanel
            accentColor={accentColor}
            onGesture={onGesture}
            lang={language}
          />
        )}

        {activeTab === 'KEYBOARD' && (
          <KeyboardInputPanel
            accentColor={accentColor}
            onSendText={onSendText}
            lang={language}
          />
        )}

        {activeTab === 'SETTINGS' && (
          <SettingsPanel
            language={language}
            onChangeLanguage={onChangeLanguage}
            theme={theme}
            onChangeTheme={onChangeTheme}
            accentColor={accentColor}
            onChangeAccent={onChangeAccent}
            enableVoice={enableVoice}
            onToggleVoice={onToggleVoice}
            enableAnimations={enableAnimations}
            onToggleAnimations={onToggleAnimations}
            lang={language}
          />
        )}

        {activeTab === 'ABOUT' && (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 pb-2 pt-1 select-none space-y-4">
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-neutral-100 dark:bg-[#16161a] border border-neutral-200 dark:border-[#2a2a30] shadow-xs text-2xl">
                📱
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-neutral-800 dark:text-neutral-100">{isRtl ? 'ريموت أسامة للتحكم عن بعد' : 'Osama Remote Control'}</h4>
                <p className="text-[10px] text-neutral-400 font-mono">v1.0.0 • Mobile Release</p>
              </div>

              {/* Descriptions */}
              <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-[#16161a] border border-neutral-200/50 dark:border-[#2a2a30] text-left rtl:text-right space-y-2">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{isRtl ? 'عن التطبيق' : 'ABOUT APPLICATION'}</p>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {isRtl
                    ? 'تطبيق احترافي للتحكم في أجهزة التلفزيون الذكية، صُمم لمساعدة المستخدمين على التحكم في شاشاتهم باستخدام بروتوكولات الاتصال الرسمية والمعتمدة.'
                    : 'A professional Smart TV remote application designed to help users control their TVs using official supported communication methods.'}
                </p>
                <div className="border-t border-neutral-200/40 dark:border-[#2a2a30]/40 pt-2 flex flex-col space-y-1 text-[11px]">
                  <div>
                    <span className="font-bold text-neutral-400">{isRtl ? 'المصمم:' : 'Designer:'}</span>{' '}
                    <span className="text-neutral-700 dark:text-neutral-200 font-extrabold">{isRtl ? 'أسامة' : 'Osama'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-400">{isRtl ? 'البروتوكولات:' : 'Protocols:'}</span>{' '}
                    <span className="text-neutral-700 dark:text-neutral-200 font-extrabold">{isRtl ? 'رسمية معتمدة وآمنة' : 'Official, Secure & Certified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER TAB BAR (Sleek Bottom Navigation) */}
      <div className="h-16 border-t border-neutral-100 dark:border-[#2a2a30] bg-neutral-50/95 dark:bg-[#0a0a0c]/95 backdrop-blur-md flex items-center justify-around px-2 relative z-40 select-none">
        {/* Remote Tab */}
        <button
          onClick={() => handleTabChange('REMOTE')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === 'REMOTE' ? accentText + ' scale-105 font-bold' : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          <span className="text-lg">🎮</span>
          <span className="text-[9px] tracking-tight">{isRtl ? 'الريموت' : 'Remote'}</span>
        </button>

        {/* Touchpad Tab */}
        <button
          onClick={() => handleTabChange('TOUCHPAD')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === 'TOUCHPAD' ? accentText + ' scale-105 font-bold' : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          <span className="text-lg">🖱️</span>
          <span className="text-[9px] tracking-tight">{isRtl ? 'اللمس' : 'Touch'}</span>
        </button>

        {/* Keyboard Tab */}
        <button
          onClick={() => handleTabChange('KEYBOARD')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === 'KEYBOARD' ? accentText + ' scale-105 font-bold' : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          <span className="text-lg">⌨️</span>
          <span className="text-[9px] tracking-tight">{isRtl ? 'الكتابة' : 'Keyboard'}</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => handleTabChange('SETTINGS')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === 'SETTINGS' ? accentText + ' scale-105 font-bold' : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          <span className="text-lg">⚙️</span>
          <span className="text-[9px] tracking-tight">{isRtl ? 'الإعدادات' : 'Settings'}</span>
        </button>

        {/* About Tab */}
        <button
          onClick={() => handleTabChange('ABOUT')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all ${
            activeTab === 'ABOUT' ? accentText + ' scale-105 font-bold' : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          <span className="text-lg">👤</span>
          <span className="text-[9px] tracking-tight">{isRtl ? 'عني' : 'About'}</span>
        </button>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinExtraSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
        .animate-spin-extra-slow {
          animation: spinExtraSlow 40s linear infinite;
        }
        .paused {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
