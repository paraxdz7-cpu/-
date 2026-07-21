import { useEffect } from 'react';
import { speakWelcomeArabic } from '../utils/audio';
import { AccentColor } from '../types';
import { getAccentColorClass } from './PhoneFrame';

interface WelcomeScreenProps {
  onComplete: () => void;
  accentColor: AccentColor;
  enableVoice: boolean;
}

export default function WelcomeScreen({ onComplete, accentColor, enableVoice }: WelcomeScreenProps) {
  useEffect(() => {
    // Attempt to trigger the welcome voice on screen mount
    if (enableVoice) {
      // Small timeout to ensure user gesture / browser audio context is initialized
      const voiceTimeout = setTimeout(() => {
        speakWelcomeArabic();
      }, 500);
      return () => clearTimeout(voiceTimeout);
    }
  }, [enableVoice]);

  useEffect(() => {
    // Continue automatically after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const activeColor = getAccentColorClass(accentColor);

  return (
    <div className="flex-1 flex flex-col items-center justify-between bg-neutral-950 p-6 text-center select-none">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 z-0 pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Animated glowing radar wave representation */}
        <div className="relative mb-8 flex items-center justify-center">
          <div 
            className="absolute w-24 h-24 rounded-full opacity-25 animate-ping duration-1000" 
            style={{ backgroundColor: activeColor }}
          ></div>
          <div 
            className="absolute w-16 h-16 rounded-full opacity-40 animate-ping duration-1500" 
            style={{ backgroundColor: activeColor }}
          ></div>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{ 
              backgroundColor: activeColor,
              boxShadow: `0 0 20px ${activeColor}`
            }}
          >
            <svg className="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
        </div>

        {/* Welcome Text in elegant high-contrast display Arabic typography */}
        <div className="space-y-4 px-2 max-w-sm">
          <h1 
            className="text-2xl font-bold text-white tracking-wide leading-relaxed animate-fade-in"
            style={{
              fontFamily: '"Inter", "Cairo", sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            مرحبًا بك في تطبيق ريموت أسامة للتحكم عن بعد
          </h1>
          <p className="text-xs text-neutral-400 font-medium tracking-widest uppercase">
            OSAMA REMOTE CONTROL
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full text-center py-2 relative z-10">
        <p className="text-[10px] text-neutral-500 font-mono tracking-widest">
          DEVELOPED BY OSAMA • © 2026
        </p>
      </div>

      {/* Injection of inline utility animation css directly */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
