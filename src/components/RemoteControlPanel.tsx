import { useState } from 'react';
import { AccentColor, TvBrand } from '../types';
import { getAccentColorClass } from './PhoneFrame';
import { playClickSound } from '../utils/audio';

interface RemoteControlPanelProps {
  activeBrand: TvBrand | null;
  accentColor: AccentColor;
  onKeyClick: (key: string) => void;
  lang: 'ar' | 'en';
}

export default function RemoteControlPanel({
  activeBrand,
  accentColor,
  onKeyClick,
  lang,
}: RemoteControlPanelProps) {
  const [showNumPad, setShowNumPad] = useState(false);
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);

  const activeColor = getAccentColorClass(accentColor);

  const handleKeyPress = (keyName: string) => {
    setActivePressedKey(keyName);
    playClickSound();
    onKeyClick(keyName);
    setTimeout(() => {
      setActivePressedKey(null);
    }, 150);
  };

  const isRtl = lang === 'ar';

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 pb-2 pt-1 select-none space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
      {/* Upper Brand Badge and Screen Status */}
      <div className="flex items-center justify-between bg-neutral-100 dark:bg-[#16161a] p-2.5 rounded-xl border border-neutral-200/50 dark:border-[#2a2a30]">
        <div className="flex flex-col">
          <span className="text-[9px] text-neutral-400 dark:text-neutral-500 tracking-wider uppercase font-bold">
            {isRtl ? 'الشاشة الحالية' : 'ACTIVE TV'}
          </span>
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[140px]">
            {activeBrand ? activeBrand : (isRtl ? 'غير متصل' : 'Disconnected')}
          </span>
        </div>
        <button
          onClick={() => setShowNumPad(!showNumPad)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 border ${
            showNumPad
              ? 'bg-neutral-800 text-white dark:bg-[#00d4ff] dark:text-black border-neutral-700 dark:border-[#00d4ff]'
              : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-[#2a2a30] hover:dark:border-[#00d4ff]'
          }`}
        >
          <span>🔢</span>
          <span>{isRtl ? 'الأرقام' : 'Numbers'}</span>
        </button>
      </div>

      {/* Conditionally Show Number Pad or Main Controls */}
      {showNumPad ? (
        /* --- NUMBER PAD INTERFACE --- */
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto py-4 animate-fade-in">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className={`btn-glass-premium btn-glass-circular h-12 font-mono text-lg font-bold text-neutral-800 dark:text-white dark:glass-text-glow ${
                activePressedKey === num ? 'scale-95 bg-white/20' : ''
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress('BACKSPACE')}
            className="btn-glass-premium btn-glass-circular h-12 text-xs font-semibold text-neutral-600 dark:text-white dark:glass-text-glow"
          >
            {isRtl ? 'حذف' : 'Del'}
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className={`btn-glass-premium btn-glass-circular h-12 font-mono text-lg font-bold text-neutral-800 dark:text-white dark:glass-text-glow ${
              activePressedKey === '0' ? 'scale-95 bg-white/20' : ''
            }`}
          >
            0
          </button>
          <button
            onClick={() => handleKeyPress('ENTER')}
            className={`btn-glass-premium btn-glass-circular h-12 text-xs font-bold text-black shadow-md ${
              activePressedKey === 'ENTER' ? 'scale-95' : ''
            }`}
            style={{ backgroundColor: activeColor, boxShadow: `0 0 10px ${activeColor}55` }}
          >
            {isRtl ? 'إدخال' : 'Enter'}
          </button>
        </div>
      ) : (
        /* --- MAIN REMOTE CONTROLS --- */
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {/* Top Row: Power, Mute, Voice Search */}
          <div className="flex justify-between items-center px-4">
            {/* Power Button */}
            <button
              onClick={() => handleKeyPress('POWER')}
              className={`btn-glass-premium btn-glass-circular w-11 h-11 text-white shadow-md bg-red-500/80 hover:bg-red-500 border border-red-400/50 ${
                activePressedKey === 'POWER' ? 'scale-95 animate-pulse' : 'hover:scale-105'
              }`}
              title={isRtl ? "تشغيل/إيقاف" : "Power"}
            >
              <svg className="w-5.5 h-5.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 3v9" />
              </svg>
            </button>

            {/* Voice Search */}
            <button
              onClick={() => handleKeyPress('VOICE_SEARCH')}
              className={`btn-glass-premium btn-glass-circular w-12 h-12 text-white shadow-md ${
                activePressedKey === 'VOICE_SEARCH' ? 'scale-95' : 'hover:scale-105'
              }`}
              style={{
                background: `linear-gradient(135deg, ${activeColor}, ${activeColor}dd)`,
                boxShadow: `0 4px 12px ${activeColor}33`
              }}
              title={isRtl ? "بحث صوتی" : "Voice Search"}
            >
              <svg className="w-5.5 h-5.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </button>

            {/* Mute Button */}
            <button
              onClick={() => handleKeyPress('MUTE')}
              className={`btn-glass-premium btn-glass-circular w-11 h-11 text-neutral-700 dark:text-white dark:glass-text-glow ${
                activePressedKey === 'MUTE' ? 'scale-95' : ''
              }`}
              title={isRtl ? "كتم الصوت" : "Mute"}
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </button>
          </div>

          {/* Volume and Channel Panel */}
          <div className="flex justify-between items-center px-4 py-1">
            {/* Volume Control Lever */}
            <div className="flex flex-col items-center glass-dpad rounded-full p-1.5 w-12">
              <button
                onClick={() => handleKeyPress('VOL_UP')}
                className="btn-glass-premium w-9 h-10 text-neutral-700 dark:text-white dark:glass-text-glow rounded-t-full"
              >
                ＋
              </button>
              <span className="text-[9px] font-bold text-neutral-500 my-1 font-mono uppercase">
                {isRtl ? 'صوت' : 'Vol'}
              </span>
              <button
                onClick={() => handleKeyPress('VOL_DOWN')}
                className="btn-glass-premium w-9 h-10 text-neutral-700 dark:text-white dark:glass-text-glow rounded-b-full"
              >
                －
              </button>
            </div>

            {/* Middle Quick Navigation triggers (Home & Back) */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleKeyPress('HOME')}
                className={`btn-glass-premium btn-glass-circular w-11 h-11 text-neutral-700 dark:text-white dark:glass-text-glow ${
                  activePressedKey === 'HOME' ? 'scale-95' : ''
                }`}
                title={isRtl ? "الرئيسية" : "Home"}
              >
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <button
                onClick={() => handleKeyPress('BACK')}
                className={`btn-glass-premium btn-glass-circular w-11 h-11 text-neutral-700 dark:text-white dark:glass-text-glow ${
                  activePressedKey === 'BACK' ? 'scale-95' : ''
                }`}
                title={isRtl ? "رجوع" : "Back"}
              >
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>

            {/* Channel Control Lever */}
            <div className="flex flex-col items-center glass-dpad rounded-full p-1.5 w-12">
              <button
                onClick={() => handleKeyPress('CH_UP')}
                className="btn-glass-premium w-9 h-10 text-neutral-700 dark:text-white dark:glass-text-glow rounded-t-full"
              >
                ▲
              </button>
              <span className="text-[9px] font-bold text-neutral-500 my-1 font-mono uppercase">
                {isRtl ? 'قناة' : 'CH'}
              </span>
              <button
                onClick={() => handleKeyPress('CH_DOWN')}
                className="btn-glass-premium w-9 h-10 text-neutral-700 dark:text-white dark:glass-text-glow rounded-b-full"
              >
                ▼
              </button>
            </div>
          </div>

          {/* D-PAD (Tactile Directional Cross Button) */}
          <div className="flex justify-center py-2">
            <div className="relative w-44 h-44 rounded-full glass-dpad flex items-center justify-center p-2">
              <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-inner">
              {/* Up Button */}
              <button
                onClick={() => handleKeyPress('UP')}
                className={`absolute top-0 inset-x-0 mx-auto w-14 h-12 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 rounded-t-full transition-all ${
                  activePressedKey === 'UP' ? 'bg-white/20 scale-95' : ''
                }`}
                title="Up"
              >
                <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">▲</span>
              </button>

              {/* Down Button */}
              <button
                onClick={() => handleKeyPress('DOWN')}
                className={`absolute bottom-0 inset-x-0 mx-auto w-14 h-12 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 rounded-b-full transition-all ${
                  activePressedKey === 'DOWN' ? 'bg-white/20 scale-95' : ''
                }`}
                title="Down"
              >
                <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">▼</span>
              </button>

              {/* Left Button */}
              <button
                onClick={() => handleKeyPress('LEFT')}
                className={`absolute left-0 top-0 bottom-0 my-auto h-14 w-12 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 rounded-l-full transition-all ${
                  activePressedKey === 'LEFT' ? 'bg-white/20 scale-95' : ''
                }`}
                title="Left"
              >
                <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">◀</span>
              </button>

              {/* Right Button */}
              <button
                onClick={() => handleKeyPress('RIGHT')}
                className={`absolute right-0 top-0 bottom-0 my-auto h-14 w-12 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 rounded-r-full transition-all ${
                  activePressedKey === 'RIGHT' ? 'bg-white/20 scale-95' : ''
                }`}
                title="Right"
              >
                <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">▶</span>
              </button>
              </div>

              {/* Center OK Button */}
              <button
                onClick={() => handleKeyPress('OK')}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-sm text-black shadow-[0_4px_15px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transition-all border border-white/40"
                style={{
                  backgroundColor: activeColor,
                }}
              >
                OK
              </button>
            </div>
          </div>

          {/* Menu & Settings Auxiliary row */}
          <div className="flex justify-around items-center px-6">
            <button
              onClick={() => handleKeyPress('MENU')}
              className={`btn-glass-premium px-6 py-2.5 rounded-2xl text-xs font-bold ${
                activePressedKey === 'MENU' ? 'scale-95' : ''
              }`}
            >
              <span className="glass-text-glow text-white">{isRtl ? 'القائمة' : 'Menu'}</span>
            </button>
            <button
              onClick={() => handleKeyPress('SETTINGS')}
              className={`btn-glass-premium px-6 py-2.5 rounded-2xl text-xs font-bold ${
                activePressedKey === 'SETTINGS' ? 'scale-95' : ''
              }`}
            >
              <span className="glass-text-glow text-white">{isRtl ? 'الإعدادات' : 'Settings'}</span>
            </button>
          </div>

          {/* Media Playback row */}
          <div className="flex justify-between items-center px-4 glass-dpad p-3 rounded-3xl mx-2">
            {/* Rewind */}
            <button
              onClick={() => handleKeyPress('REWIND')}
              className={`btn-glass-premium btn-glass-circular w-10 h-10 text-white ${
                activePressedKey === 'REWIND' ? 'scale-95' : 'hover:scale-105'
              }`}
              title={isRtl ? "إرجاع" : "Rewind"}
            >
              <span className="glass-text-glow">◀◀</span>
            </button>

            {/* Play */}
            <button
              onClick={() => handleKeyPress('PLAY')}
              className={`btn-glass-premium btn-glass-circular w-12 h-12 text-white ${
                activePressedKey === 'PLAY' ? 'scale-95' : 'hover:scale-105'
              }`}
              title={isRtl ? "تشغيل" : "Play"}
            >
              <span className="glass-text-glow">▶</span>
            </button>

            {/* Pause */}
            <button
              onClick={() => handleKeyPress('PAUSE')}
              className={`btn-glass-premium btn-glass-circular w-12 h-12 text-white ${
                activePressedKey === 'PAUSE' ? 'scale-95' : 'hover:scale-105'
              }`}
              title={isRtl ? "إيقاف مؤقت" : "Pause"}
            >
              <span className="glass-text-glow">❚❚</span>
            </button>

            {/* Stop */}
            <button
              onClick={() => handleKeyPress('STOP')}
              className={`btn-glass-premium btn-glass-circular w-10 h-10 text-white ${
                activePressedKey === 'STOP' ? 'scale-95' : 'hover:scale-105'
              }`}
              title={isRtl ? "إيقاف" : "Stop"}
            >
              <span className="glass-text-glow">◼</span>
            </button>

            {/* Fast Forward */}
            <button
              onClick={() => handleKeyPress('FAST_FORWARD')}
              className={`btn-glass-premium btn-glass-circular w-10 h-10 text-white ${
                activePressedKey === 'FAST_FORWARD' ? 'scale-95' : 'hover:scale-105'
              }`}
              title={isRtl ? "تقديم سريع" : "Fast Forward"}
            >
              <span className="glass-text-glow">▶▶</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
