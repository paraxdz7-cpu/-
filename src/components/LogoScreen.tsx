import { getAccentColorClass } from './PhoneFrame';
import { AccentColor, ThemeMode } from '../types';

interface LogoScreenProps {
  onContinue: () => void;
  accentColor: AccentColor;
  theme: ThemeMode;
}

export default function LogoScreen({ onContinue, accentColor, theme }: LogoScreenProps) {
  const activeColor = getAccentColorClass(accentColor);
  
  // High quality generated avatar path we created
  const avatarPath = "/src/assets/images/osama_avatar_1784630993382.jpg";

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 text-center select-none relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>

      {/* Decorative light flare at the top */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-10 dark:opacity-20 pointer-events-none"
        style={{ backgroundColor: activeColor }}
      ></div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
        {/* Glowing circular ring & rotating avatar */}
        <div className="relative mb-10 group">
          {/* External ambient glow ring */}
          <div 
            className="absolute -inset-2.5 rounded-full blur-md opacity-70 animate-pulse duration-2000"
            style={{ 
              background: `linear-gradient(135deg, ${activeColor}, #38bdf8)`
            }}
          ></div>

          {/* Glowing rotating blue ring */}
          <div 
            className="absolute -inset-1.5 rounded-full border-2 border-dashed animate-spin-slow"
            style={{ 
              borderColor: activeColor,
              boxShadow: `0 0 15px ${activeColor}, inset 0 0 15px ${activeColor}`
            }}
          ></div>

          {/* Profile photo container */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-neutral-900 bg-neutral-800 shadow-2xl flex items-center justify-center">
            <img 
              src={avatarPath}
              alt="المصمم أسامة"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-spin-extra-slow"
            />
          </div>
          
          {/* Subtle overlay reflection */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <h2 
            className="text-3xl font-extrabold tracking-wide dark:text-white text-neutral-900"
            style={{ fontFamily: '"Inter", "Cairo", sans-serif' }}
          >
            المصمم أسامة
          </h2>
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            LEAD DESIGNER & CREATOR
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-xs mx-auto pb-4 relative z-10">
        <button
          onClick={onContinue}
          className="w-full py-3.5 rounded-2xl font-bold text-white text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          style={{
            background: `linear-gradient(135deg, ${activeColor}, ${activeColor}dd)`,
            boxShadow: `0 8px 24px -6px ${activeColor}`
          }}
        >
          <span>دخول التطبيق</span>
          <span className="text-xs opacity-80 font-mono">|</span>
          <span>Continue</span>
        </button>
      </div>

      {/* Embedded CSS Animations */}
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
      `}</style>
    </div>
  );
}
