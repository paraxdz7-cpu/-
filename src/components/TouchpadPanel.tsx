import React, { useState, useRef } from 'react';
import { AccentColor } from '../types';
import { getAccentColorClass } from './PhoneFrame';
import { playClickSound } from '../utils/audio';

interface TouchpadPanelProps {
  accentColor: AccentColor;
  onGesture: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'TAP') => void;
  lang: 'ar' | 'en';
}

export default function TouchpadPanel({
  accentColor,
  onGesture,
  lang,
}: TouchpadPanelProps) {
  const [touchCoords, setTouchCoords] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const startCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const activeColor = getAccentColorClass(accentColor);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    
    startCoords.current = { x: clientX, y: clientY };
    setTouchCoords({ x: relativeX, y: relativeY });
    setIsSwiping(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isSwiping || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const relativeY = Math.max(0, Math.min(rect.height, clientY - rect.top));
    setTouchCoords({ x: relativeX, y: relativeY });
  };

  const handleEnd = (clientX: number, clientY: number) => {
    if (!isSwiping) return;
    setIsSwiping(false);
    
    const deltaX = clientX - startCoords.current.x;
    const deltaY = clientY - startCoords.current.y;
    const threshold = 35; // Pixels needed to register swipe

    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      // Tap gesture
      playClickSound();
      onGesture('TAP');
    } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        onGesture('RIGHT');
      } else if (deltaX < -threshold) {
        onGesture('LEFT');
      }
    } else {
      if (deltaY > threshold) {
        onGesture('DOWN');
      } else if (deltaY < -threshold) {
        onGesture('UP');
      }
    }
    
    // Clear cursor position after transition
    setTimeout(() => {
      setTouchCoords(null);
    }, 200);
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX, touch.clientY);
  };

  // Mouse event handlers (Simulator testing)
  const onMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX, e.clientY);
  };

  const isRtl = lang === 'ar';

  return (
    <div className="flex-1 flex flex-col justify-between p-4 relative select-none">
      <div className="text-center space-y-1 py-1">
        <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
          {isRtl ? 'لوحة اللمس الذكية' : 'Smart Touchpad'}
        </h3>
        <p className="text-[10px] text-neutral-400 max-w-xs mx-auto px-4 leading-normal">
          {isRtl 
            ? 'اسحب إصبعك هنا لتحريك مؤشر الماوس للتلفزيون. اضغط نقرة واحدة للإدخال (OK).' 
            : 'Swipe here to navigate the TV cursor. Tap once to trigger click (OK).'}
        </p>
      </div>

      {/* Main Gesture Target Frame */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="flex-1 min-h-[300px] my-4 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-[#2a2a30] bg-neutral-100/40 dark:bg-[#16161a] relative overflow-hidden cursor-crosshair flex items-center justify-center select-none"
      >
        {/* Abstract radar concentric circles */}
        <div className="absolute w-44 h-44 rounded-full border border-neutral-300/30 dark:border-[#2a2a30] pointer-events-none"></div>
        <div className="absolute w-28 h-28 rounded-full border border-neutral-300/30 dark:border-[#2a2a30] pointer-events-none"></div>
        <div className="absolute w-12 h-12 rounded-full border border-neutral-300/30 dark:border-[#2a2a30] pointer-events-none flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-[#2a2a30]"></div>
        </div>

        {/* Animated gesture cursor dot */}
        {touchCoords && (
          <div
            className="absolute rounded-full pointer-events-none flex items-center justify-center transition-transform"
            style={{
              left: touchCoords.x,
              top: touchCoords.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Pulsing ring */}
            <div 
              className="absolute w-12 h-12 rounded-full opacity-30 animate-ping"
              style={{ backgroundColor: activeColor }}
            ></div>
            {/* Core dot */}
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg shadow-black/20"
              style={{ backgroundColor: activeColor }}
            ></div>
          </div>
        )}

        {/* Swipe prompt indicator text overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <svg className="w-5 h-5 text-neutral-400 animate-bounce mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
          </svg>
          <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
            {isRtl ? 'اسحب للتحرك' : 'SWIPE TO NAVIGATE'}
          </span>
        </div>
      </div>

      {/* Grid Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => { playClickSound(); onGesture('LEFT'); }}
          className="btn-glass-premium py-2 px-1 rounded-xl text-[10px] font-bold text-neutral-700 dark:text-white dark:glass-text-glow"
        >
          {isRtl ? '◀ يسار' : '◀ Left'}
        </button>
        <button
          onClick={() => { playClickSound(); onGesture('UP'); }}
          className="btn-glass-premium py-2 px-1 rounded-xl text-[10px] font-bold text-neutral-700 dark:text-white dark:glass-text-glow"
        >
          {isRtl ? '▲ أعلى' : '▲ Up'}
        </button>
        <button
          onClick={() => { playClickSound(); onGesture('DOWN'); }}
          className="btn-glass-premium py-2 px-1 rounded-xl text-[10px] font-bold text-neutral-700 dark:text-white dark:glass-text-glow"
        >
          {isRtl ? '▼ أسفل' : '▼ Down'}
        </button>
        <button
          onClick={() => { playClickSound(); onGesture('RIGHT'); }}
          className="btn-glass-premium py-2 px-1 rounded-xl text-[10px] font-bold text-neutral-700 dark:text-white dark:glass-text-glow"
        >
          {isRtl ? 'يمين ▶' : 'Right ▶'}
        </button>
      </div>
    </div>
  );
}
