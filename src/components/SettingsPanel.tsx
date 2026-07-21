import { AccentColor, Language, ThemeMode } from '../types';
import { getAccentBgClass, getAccentColorClass } from './PhoneFrame';
import { playClickSound } from '../utils/audio';

interface SettingsPanelProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  accentColor: AccentColor;
  onChangeAccent: (color: AccentColor) => void;
  enableVoice: boolean;
  onToggleVoice: () => void;
  enableAnimations: boolean;
  onToggleAnimations: () => void;
  lang: 'ar' | 'en';
}

const ACCENT_COLORS: { id: AccentColor; nameAr: string; nameEn: string; colorHex: string }[] = [
  { id: 'blue', nameAr: 'أزرق', nameEn: 'Blue', colorHex: '#3b82f6' },
  { id: 'red', nameAr: 'أحمر', nameEn: 'Red', colorHex: '#ef4444' },
  { id: 'green', nameAr: 'أخضر', nameEn: 'Green', colorHex: '#10b981' },
  { id: 'purple', nameAr: 'بنفسجي', nameEn: 'Purple', colorHex: '#8b5cf6' },
  { id: 'orange', nameAr: 'برتقالي', nameEn: 'Orange', colorHex: '#f97316' },
  { id: 'cyan', nameAr: 'سماوي', nameEn: 'Cyan', colorHex: '#06b6d4' },
  { id: 'pink', nameAr: 'وردي', nameEn: 'Pink', colorHex: '#ec4899' },
  { id: 'gold', nameAr: 'ذهبي', nameEn: 'Gold', colorHex: '#d97706' },
  { id: 'white', nameAr: 'أبيض', nameEn: 'White', colorHex: '#f3f4f6' },
  { id: 'black', nameAr: 'أسود', nameEn: 'Black', colorHex: '#1f2937' },
];

export default function SettingsPanel({
  language,
  onChangeLanguage,
  theme,
  onChangeTheme,
  accentColor,
  onChangeAccent,
  enableVoice,
  onToggleVoice,
  enableAnimations,
  onToggleAnimations,
  lang,
}: SettingsPanelProps) {
  const isRtl = lang === 'ar';
  const activeColorHex = getAccentColorClass(accentColor);

  const handleLanguageChange = (newLang: Language) => {
    playClickSound();
    onChangeLanguage(newLang);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    playClickSound();
    onChangeTheme(newTheme);
  };

  const handleAccentChange = (color: AccentColor) => {
    playClickSound();
    onChangeAccent(color);
  };

  const toggleVoice = () => {
    playClickSound();
    onToggleVoice();
  };

  const toggleAnimations = () => {
    playClickSound();
    onToggleAnimations();
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 pb-2 pt-1 select-none space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
      <div className="space-y-4">
        {/* Languages section */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">
            {isRtl ? 'اللغة / Language' : 'Language'}
          </label>
          <div className="flex bg-neutral-100 dark:bg-[#16161a] p-1 rounded-xl text-xs font-bold border dark:border-[#2a2a30]">
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                language === 'ar' ? 'bg-white dark:bg-[#232328] text-neutral-800 shadow-xs border dark:border-[#2a2a30]' : 'text-neutral-500'
              }`}
              style={language === 'ar' ? { color: theme === 'dark' ? activeColorHex : undefined } : undefined}
            >
              العربية (RTL)
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                language === 'en' ? 'bg-white dark:bg-[#232328] text-neutral-800 shadow-xs border dark:border-[#2a2a30]' : 'text-neutral-500'
              }`}
              style={language === 'en' ? { color: theme === 'dark' ? activeColorHex : undefined } : undefined}
            >
              English (LTR)
            </button>
          </div>
        </div>

        {/* Theme select */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">
            {isRtl ? 'المظهر / Theme' : 'Theme'}
          </label>
          <div className="flex bg-neutral-100 dark:bg-[#16161a] p-1 rounded-xl text-xs font-bold border dark:border-[#2a2a30]">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                theme === 'light' ? 'bg-white dark:bg-[#232328] text-neutral-800 shadow-xs border dark:border-[#2a2a30]' : 'text-neutral-500'
              }`}
            >
              ☀️ {isRtl ? 'وضع مضيء' : 'Light Mode'}
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-white dark:bg-[#232328] text-neutral-800 shadow-xs border dark:border-[#2a2a30]' : 'text-neutral-500'
              }`}
              style={theme === 'dark' ? { color: activeColorHex } : undefined}
            >
              🌙 {isRtl ? 'وضع مظلم' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Accent Colors Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">
            {isRtl ? 'لون التأثير / Accent Color' : 'Accent Color'}
          </label>
          <div className="grid grid-cols-5 gap-2.5 p-3.5 bg-neutral-100 dark:bg-[#16161a] rounded-2xl border border-neutral-200/50 dark:border-[#2a2a30]">
            {ACCENT_COLORS.map((col) => (
              <button
                key={col.id}
                onClick={() => handleAccentChange(col.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-transform hover:scale-110 active:scale-95 shadow-md`}
                style={{ backgroundColor: col.colorHex }}
                title={isRtl ? col.nameAr : col.nameEn}
              >
                {accentColor === col.id && (
                  <span className={`w-3.5 h-3.5 rounded-full ${col.id === 'white' ? 'bg-neutral-900' : 'bg-white'} animate-ping absolute`}></span>
                )}
                {accentColor === col.id && (
                  <span className={`w-2 h-2 rounded-full ${col.id === 'white' ? 'bg-neutral-900' : 'bg-white'} relative z-10`}></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Preferences */}
        <div className="space-y-3 pt-1">
          {/* Welcome Voice Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/60 dark:bg-[#16161a]/60 border border-neutral-200/30 dark:border-[#2a2a30]">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">
                {isRtl ? 'الصوت الترحيبي' : 'Welcome Voice'}
              </span>
              <span className="text-[9px] text-neutral-400">
                {isRtl ? 'تشغيل ترحيب أسامة الصوتي عند فتح التطبيق' : 'Play Arabic greeting on startup'}
              </span>
            </div>
            <button
              onClick={toggleVoice}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                enableVoice ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                  enableVoice ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/60 dark:bg-[#16161a]/60 border border-neutral-200/30 dark:border-[#2a2a30]">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">
                {isRtl ? 'المؤثرات الحركية' : 'Animations'}
              </span>
              <span className="text-[9px] text-neutral-400">
                {isRtl ? 'مؤثرات الدوران والوهج السلسة' : 'Enable glowing/rotating physics'}
              </span>
            </div>
            <button
              onClick={toggleAnimations}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                enableAnimations ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                  enableAnimations ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
