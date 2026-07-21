import React, { useState } from 'react';
import { AccentColor } from '../types';
import { getAccentBgClass, getAccentColorClass } from './PhoneFrame';
import { playClickSound } from '../utils/audio';

interface KeyboardInputPanelProps {
  accentColor: AccentColor;
  onSendText: (text: string) => void;
  lang: 'ar' | 'en';
}

export default function KeyboardInputPanel({
  accentColor,
  onSendText,
  lang,
}: KeyboardInputPanelProps) {
  const [inputText, setInputText] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([
    'العاب اطفال',
    'Action Movies 2026',
    'https://youtube.com',
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playClickSound();
    onSendText(inputText);

    // Save to history
    if (!inputHistory.includes(inputText)) {
      setInputHistory([inputText, ...inputHistory.slice(0, 4)]);
    }
    setInputText('');
  };

  const handleShortcutClick = (shortcut: string) => {
    playClickSound();
    setInputText(shortcut);
  };

  const isRtl = lang === 'ar';
  const activeColor = getAccentColorClass(accentColor);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 select-none relative">
      <div className="space-y-1 text-center py-1">
        <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
          {isRtl ? 'لوحة الإدخال النصي' : 'Keyboard Input'}
        </h3>
        <p className="text-[10px] text-neutral-400 max-w-xs mx-auto px-4 leading-normal">
          {isRtl
            ? 'اكتب هنا لإرسال النص مباشرة إلى حقل الكتابة النشط في التلفزيون الخاص بك.'
            : 'Type anything here to send text directly to the active input field on your Smart TV.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 my-2">
        {/* Styled Text Input Field */}
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRtl ? 'اكتب بحثًا، عنوان URL، أو كلمة مرور...' : 'Type search, URL, or wifi password...'}
            dir={isRtl ? 'rtl' : 'ltr'}
            className="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-[#16161a] border border-neutral-300 dark:border-[#2a2a30] text-sm focus:outline-hidden focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all dark:text-white"
          />
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`btn-glass-premium w-full py-3.5 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 ${
            !inputText.trim() ? 'opacity-40 cursor-not-allowed bg-neutral-300 dark:bg-neutral-800 text-neutral-500' : ''
          }`}
          style={inputText.trim() ? {
            background: `linear-gradient(135deg, ${activeColor}dd, ${activeColor}aa)`,
            boxShadow: `0 0 20px ${activeColor}aa`,
            borderColor: `${activeColor}55`,
            color: 'white',
          } : undefined}
        >
          <span className="glass-text-glow">🌐</span>
          <span className="glass-text-glow">{isRtl ? 'إرسال إلى التلفزيون' : 'Send to TV'}</span>
        </button>
      </form>

      {/* Shortcuts grid */}
      <div className="space-y-3 flex-1 flex flex-col justify-end">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-2">
            {isRtl ? 'اختصارات سريعة' : 'QUICK SEARCHES'}
          </span>
          <div className="flex flex-wrap gap-2">
            {['Netflix', 'YouTube', 'Quran', 'News'].map((shortcut) => (
              <button
                key={shortcut}
                onClick={() => handleShortcutClick(shortcut)}
                className="btn-glass-premium px-3 py-1.5 text-xs text-neutral-700 dark:text-white dark:glass-text-glow font-semibold"
              >
                {shortcut}
              </button>
            ))}
          </div>
        </div>

        {/* History section */}
        <div>
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-2">
            {isRtl ? 'السجل الأخير' : 'RECENT HISTORY'}
          </span>
          <div className="space-y-1.5 max-h-[110px] overflow-y-auto">
            {inputHistory.map((historyItem, idx) => (
              <div
                key={idx}
                onClick={() => handleShortcutClick(historyItem)}
                className="btn-glass-premium flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs text-neutral-700 dark:text-neutral-300 font-medium truncate transition-all mb-1.5"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-neutral-400 text-[10px]">🕒</span>
                  <span className="truncate">{historyItem}</span>
                </div>
                <span className="text-[10px] text-neutral-400">⏎</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
