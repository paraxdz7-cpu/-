import React, { useState, useEffect } from 'react';
import { AccentColor, ThemeMode } from '../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  accentColor: AccentColor;
  theme: ThemeMode;
  connectedTvName?: string;
  isConnecting?: boolean;
}

export const getAccentColorClass = (color: AccentColor): string => {
  switch (color) {
    case 'blue': return '#3b82f6';
    case 'red': return '#ef4444';
    case 'green': return '#10b981';
    case 'purple': return '#8b5cf6';
    case 'orange': return '#f97316';
    case 'cyan': return '#00d4ff';
    case 'pink': return '#ec4899';
    case 'gold': return '#d97706';
    case 'white': return '#f9fafb';
    case 'black': return '#111827';
    default: return '#3b82f6';
  }
};

export const getAccentGlowClass = (color: AccentColor): string => {
  switch (color) {
    case 'blue': return 'shadow-[0_0_15px_rgba(59,130,246,0.5)]';
    case 'red': return 'shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    case 'green': return 'shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    case 'purple': return 'shadow-[0_0_15px_rgba(139,92,246,0.5)]';
    case 'orange': return 'shadow-[0_0_15px_rgba(249,115,22,0.5)]';
    case 'cyan': return 'shadow-[0_0_20px_rgba(0,212,255,0.7)]';
    case 'pink': return 'shadow-[0_0_15px_rgba(236,72,153,0.5)]';
    case 'gold': return 'shadow-[0_0_15px_rgba(217,119,6,0.5)]';
    case 'white': return 'shadow-[0_0_15px_rgba(249,250,251,0.3)]';
    case 'black': return 'shadow-[0_0_15px_rgba(17,24,39,0.5)]';
    default: return 'shadow-[0_0_15px_rgba(59,130,246,0.5)]';
  }
};

export const getAccentTextClass = (color: AccentColor): string => {
  switch (color) {
    case 'blue': return 'text-blue-500';
    case 'red': return 'text-red-500';
    case 'green': return 'text-green-500';
    case 'purple': return 'text-purple-500';
    case 'orange': return 'text-orange-500';
    case 'cyan': return 'text-[#00d4ff]';
    case 'pink': return 'text-pink-500';
    case 'gold': return 'text-amber-500';
    case 'white': return 'text-gray-200';
    case 'black': return 'text-gray-900';
    default: return 'text-blue-500';
  }
};

export const getAccentBgClass = (color: AccentColor): string => {
  switch (color) {
    case 'blue': return 'bg-blue-500 hover:bg-blue-600';
    case 'red': return 'bg-red-500 hover:bg-red-600';
    case 'green': return 'bg-green-500 hover:bg-green-600';
    case 'purple': return 'bg-purple-500 hover:bg-purple-600';
    case 'orange': return 'bg-orange-500 hover:bg-orange-600';
    case 'cyan': return 'bg-[#00d4ff] hover:bg-[#00e1ff] text-black font-extrabold';
    case 'pink': return 'bg-pink-500 hover:bg-pink-600';
    case 'gold': return 'bg-amber-600 hover:bg-amber-700';
    case 'white': return 'bg-gray-100 hover:bg-gray-200 text-gray-900';
    case 'black': return 'bg-gray-900 hover:bg-gray-800 text-white';
    default: return 'bg-blue-500 hover:bg-blue-600';
  }
};

export default function PhoneFrame({
  children,
  accentColor,
  theme,
  connectedTvName,
  isConnecting,
}: PhoneFrameProps) {
  const [deviceType, setDeviceType] = useState<'iOS' | 'Android'>('iOS');
  const [time, setTime] = useState('12:00 PM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const activeAccentHex = getAccentColorClass(accentColor);
  const glowShadow = getAccentGlowClass(accentColor);

  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-6 select-none max-w-full">
      {/* Device frame selector */}
      <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-full mb-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setDeviceType('iOS')}
          className={`px-4 py-1 text-xs font-semibold rounded-full transition-all ${
            deviceType === 'iOS'
              ? 'bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
           iPhone (iOS)
        </button>
        <button
          onClick={() => setDeviceType('Android')}
          className={`px-4 py-1 text-xs font-semibold rounded-full transition-all ${
            deviceType === 'Android'
              ? 'bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          🤖 Galaxy (Android)
        </button>
      </div>

      {/* Main Smartphone Shell */}
      <div
        id="phone-frame-container"
        className={`relative w-[365px] h-[780px] rounded-[50px] border-8 border-neutral-800 dark:border-neutral-700 bg-neutral-900 transition-all duration-300 ${glowShadow}`}
        style={{
          outline: `2px solid ${activeAccentHex}44`,
        }}
      >
        {/* Antennas and physical button slots */}
        <div className="absolute top-28 -left-2.5 w-1 h-8 bg-neutral-800 dark:bg-neutral-600 rounded-r"></div>
        <div className="absolute top-40 -left-2.5 w-1 h-12 bg-neutral-800 dark:bg-neutral-600 rounded-r"></div>
        <div className="absolute top-56 -left-2.5 w-1 h-12 bg-neutral-800 dark:bg-neutral-600 rounded-r"></div>
        <div className="absolute top-44 -right-2.5 w-1 h-16 bg-neutral-800 dark:bg-neutral-600 rounded-l"></div>

        {/* Dynamic Inner Screen Wrapper */}
        <div
          className={`relative w-full h-full rounded-[41px] overflow-hidden flex flex-col transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#0a0a0c] text-neutral-100' : 'bg-neutral-50 text-neutral-900'
          }`}
        >
          {/* Status Bar */}
          <div className="h-11 w-full flex justify-between items-center px-6 relative z-50 pt-3 select-none text-[11px] font-semibold">
            {/* Time */}
            <span className="tracking-tight text-neutral-600 dark:text-neutral-300">
              {time}
            </span>

            {/* Dynamic Island / Android Punch Hole */}
            {deviceType === 'iOS' ? (
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-2 h-6 rounded-full bg-black flex items-center justify-center transition-all duration-300 px-3 ${
                  isConnecting || connectedTvName ? 'w-44' : 'w-24'
                }`}
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-1.5 text-[9px] text-amber-400 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Pairing TV...</span>
                  </div>
                ) : connectedTvName ? (
                  <div className="flex items-center justify-center space-x-1.5 text-[9px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="truncate max-w-[120px]">{connectedTvName}</span>
                  </div>
                ) : (
                  <div className="flex space-x-1.5 items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700"></span>
                    <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute left-1/2 -translate-x-1/2 top-3 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-neutral-900"></span>
              </div>
            )}

            {/* Icons (Signal, Wifi, Battery) */}
            <div className="flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-300">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c3.9 3.89 10.21 3.89 14.1 0l1.38-1.79C21.06 16.07 21.8 14.12 21.8 12c0-4.97-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
              </svg>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
                <div className="h-full w-[80%] bg-current rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {children}
          </div>

          {/* Screen Bottom bar / Home Indicator */}
          <div className="h-5 w-full flex items-center justify-center relative z-50">
            {deviceType === 'iOS' ? (
              <div className="w-32 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 mb-1"></div>
            ) : (
              <div className="flex space-x-8 items-center justify-center text-xs text-neutral-400 mb-1 font-bold">
                <span>◀</span>
                <span>●</span>
                <span>■</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
