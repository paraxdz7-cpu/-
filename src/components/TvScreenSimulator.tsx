import { useState, useEffect } from 'react';
import { SavedTv, TvBrand } from '../types';

interface TvScreenSimulatorProps {
  connectedTv: SavedTv | null;
  lastAction: string | null;
  lastActionTimestamp: number;
  textBuffer: string;
}

interface TV_APP {
  name: string;
  color: string;
  icon: string;
}

const TV_APPS: TV_APP[] = [
  { name: 'Netflix', color: 'bg-red-600', icon: '🎬' },
  { name: 'YouTube', color: 'bg-rose-500', icon: '📺' },
  { name: 'Prime Video', color: 'bg-sky-500', icon: '🍿' },
  { name: 'Disney+', color: 'bg-indigo-600', icon: '✨' },
  { name: 'Spotify', color: 'bg-emerald-500', icon: '🎵' },
  { name: 'Settings', color: 'bg-neutral-600', icon: '⚙️' },
];

export default function TvScreenSimulator({
  connectedTv,
  lastAction,
  lastActionTimestamp,
  textBuffer,
}: TvScreenSimulatorProps) {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [volume, setVolume] = useState(25);
  const [showVolumeOverlay, setShowVolumeOverlay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(4);
  const [showChannelOverlay, setShowChannelOverlay] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(0); // For grid navigation
  const [playbackState, setPlaybackState] = useState<'IDLE' | 'PLAYING' | 'PAUSED' | 'STOPPED'>('IDLE');
  const [playbackOverlay, setPlaybackOverlay] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const isRtl = localStorage.getItem('osama_remote_preferences')?.includes('"language":"ar"') ?? true;

  // Respond to remote button commands
  useEffect(() => {
    if (!lastAction) return;

    // Handle Power
    if (lastAction === 'POWER') {
      setIsPowerOn((prev) => !prev);
      triggerToast(isPowerOn ? 'TV Powering Off...' : 'TV Powering On...');
      return;
    }

    // If TV is off, ignore other keys except Power
    if (!isPowerOn) return;

    // Handle Volume Up/Down
    if (lastAction === 'VOL_UP') {
      setVolume((v) => Math.min(100, v + 2));
      setIsMuted(false);
      setShowVolumeOverlay(true);
      return;
    }
    if (lastAction === 'VOL_DOWN') {
      setVolume((v) => Math.max(0, v - 2));
      setIsMuted(false);
      setShowVolumeOverlay(true);
      return;
    }

    // Mute
    if (lastAction === 'MUTE') {
      setIsMuted((prev) => !prev);
      setShowVolumeOverlay(true);
      return;
    }

    // Channel Up/Down
    if (lastAction === 'CH_UP') {
      setCurrentChannel((c) => (c % 99) + 1);
      setShowChannelOverlay(true);
      return;
    }
    if (lastAction === 'CH_DOWN') {
      setCurrentChannel((c) => (c === 1 ? 99 : c - 1));
      setShowChannelOverlay(true);
      return;
    }

    // D-Pad Navigation
    if (lastAction === 'RIGHT') {
      setCursorIndex((idx) => (idx + 1) % TV_APPS.length);
      return;
    }
    if (lastAction === 'LEFT') {
      setCursorIndex((idx) => (idx === 0 ? TV_APPS.length - 1 : idx - 1));
      return;
    }
    if (lastAction === 'UP') {
      setCursorIndex((idx) => (idx < 3 ? idx + 3 : idx - 3));
      return;
    }
    if (lastAction === 'DOWN') {
      setCursorIndex((idx) => (idx >= 3 ? idx - 3 : idx + 3));
      return;
    }

    // OK Selection click
    if (lastAction === 'OK' || lastAction === 'TAP') {
      const activeApp = TV_APPS[cursorIndex]?.name || 'App';
      triggerToast(`Launching ${activeApp}...`);
      if (activeApp === 'Netflix' || activeApp === 'YouTube') {
        setPlaybackState('PLAYING');
      }
      return;
    }

    // Media Keys
    if (lastAction === 'PLAY') {
      setPlaybackState('PLAYING');
      triggerPlaybackOverlay('▶ PLAY');
      return;
    }
    if (lastAction === 'PAUSE') {
      setPlaybackState('PAUSED');
      triggerPlaybackOverlay('❚❚ PAUSED');
      return;
    }
    if (lastAction === 'STOP') {
      setPlaybackState('STOPPED');
      triggerPlaybackOverlay('■ STOPPED');
      return;
    }
    if (lastAction === 'FAST_FORWARD') {
      triggerPlaybackOverlay('▶▶ FORWARD x2');
      return;
    }
    if (lastAction === 'REWIND') {
      triggerPlaybackOverlay('◀◀ REWIND x2');
      return;
    }

    // Voice Search
    if (lastAction === 'VOICE_SEARCH') {
      setVoiceActive(true);
      setTimeout(() => {
        setVoiceActive(false);
        triggerToast('Voice Search: "Latest action movies"');
      }, 4000);
      return;
    }

    // Home / Back / Menu / Settings
    if (lastAction === 'HOME') {
      setPlaybackState('IDLE');
      setCursorIndex(0);
      triggerToast('Returned Home Screen');
      return;
    }
    if (lastAction === 'BACK') {
      triggerToast('Back to previous menu');
      return;
    }
    if (lastAction === 'MENU' || lastAction === 'SETTINGS') {
      triggerToast('Opened TV Settings Dashboard');
      return;
    }
  }, [lastActionTimestamp]);

  // Timers to fade overlays
  useEffect(() => {
    if (showVolumeOverlay) {
      const timer = setTimeout(() => setShowVolumeOverlay(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showVolumeOverlay, volume, isMuted]);

  useEffect(() => {
    if (showChannelOverlay) {
      const timer = setTimeout(() => setShowChannelOverlay(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showChannelOverlay, currentChannel]);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    const timer = setTimeout(() => setFeedbackToast(null), 2500);
    return () => clearTimeout(timer);
  };

  const triggerPlaybackOverlay = (label: string) => {
    setPlaybackOverlay(label);
    const timer = setTimeout(() => setPlaybackOverlay(null), 1500);
    return () => clearTimeout(timer);
  };

  const activeTvBrandName: TvBrand = connectedTv ? connectedTv.brand : 'Samsung Smart TV';

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Outer TV Bezel */}
      <div className="relative w-full max-w-[500px] aspect-video bg-neutral-900 rounded-3xl p-3 shadow-2xl border-4 border-neutral-800">
        
        {/* Anti-glare Screen */}
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-500">
          
          {/* TV IS POWERED OFF */}
          {!isPowerOn ? (
            <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-50">
              {/* Standby red glowing dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
              <span className="text-[10px] text-neutral-800 font-bold tracking-widest mt-2 uppercase">STANDBY MODE</span>
            </div>
          ) : (
            /* TV IS ACTIVE */
            <div className="flex-1 flex flex-col justify-between p-6 relative bg-gradient-to-br from-neutral-900 to-neutral-950 text-white animate-fade-in select-none">
              
              {/* Ambient Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

              {/* TV TOP HEADER BAR */}
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black tracking-widest text-neutral-400 font-mono">
                    {activeTvBrandName.toUpperCase()}
                  </span>
                  <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-bold">
                    {connectedTv ? 'OFFICIAL CONNECTED' : 'DEMO CHANNEL'}
                  </span>
                </div>
                
                <span className="text-xs text-neutral-400 font-bold font-mono">
                  HDMI 1 • {currentChannel < 10 ? `0${currentChannel}` : currentChannel}
                </span>
              </div>

              {/* TV MIDDLE MAIN DISPLAY CANVAS */}
              <div className="flex-1 flex flex-col justify-center items-center relative py-2">
                
                {/* Voice Search Animated Ripple Overlay */}
                {voiceActive ? (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-4 rounded-xl z-40 animate-fade-in">
                    <div className="flex items-center space-x-1.5 h-12">
                      <div className="w-1.5 h-10 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-14 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                      <div className="w-1.5 h-8 bg-purple-500 rounded-full animate-bounce delay-300"></div>
                      <div className="w-1.5 h-12 bg-pink-500 rounded-full animate-bounce delay-400"></div>
                      <div className="w-1.5 h-6 bg-cyan-400 rounded-full animate-bounce delay-500"></div>
                    </div>
                    <p className="text-xs text-cyan-300 font-extrabold tracking-wider animate-pulse">LISTENING FOR VOICE KEYWORD...</p>
                  </div>
                ) : playbackState === 'PLAYING' ? (
                  /* Active video simulation */
                  <div className="absolute inset-0 rounded-xl overflow-hidden bg-black z-10 flex flex-col justify-between p-4">
                    <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md p-2 rounded-lg max-w-xs">
                      <span className="text-red-500 animate-pulse">●</span>
                      <span className="text-[10px] font-bold tracking-widest">STREAMING LIVE CONTENT</span>
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-sm font-extrabold tracking-wide text-neutral-200">Cinematic 4K Experience</p>
                      <p className="text-[10px] text-neutral-500">Provided by Developer Osama</p>
                    </div>

                    {/* Fake Seek Progress Bar */}
                    <div className="w-full flex items-center space-x-2.5">
                      <span className="text-[9px] text-neutral-400 font-mono">01:45</span>
                      <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full w-[45%]"></div>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-mono">03:20</span>
                    </div>
                  </div>
                ) : (
                  /* TV launcher hub dashboard */
                  <div className="w-full grid grid-cols-3 gap-3.5 px-6">
                    {TV_APPS.map((app, idx) => (
                      <div
                        key={app.name}
                        className={`p-3.5 rounded-2xl flex flex-col items-center justify-center space-y-2.5 border transition-all ${
                          cursorIndex === idx
                            ? 'bg-neutral-100 text-neutral-900 border-white shadow-lg scale-105 ring-4 ring-neutral-700'
                            : 'bg-neutral-900/60 text-white border-neutral-800'
                        }`}
                      >
                        <span className="text-2xl">{app.icon}</span>
                        <span className="text-[10px] font-black tracking-wide">{app.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Keyboard Text typing buffer display */}
                {textBuffer && (
                  <div className="absolute bottom-1 right-2 left-2 bg-neutral-950/90 border border-neutral-800 backdrop-blur-md p-2.5 rounded-xl flex items-center justify-between z-20 animate-fade-in">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-xs text-neutral-500 font-bold">🔍 Search:</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 truncate max-w-[200px]">{textBuffer}</span>
                    </div>
                    <span className="text-[9px] text-emerald-500 animate-pulse font-bold font-mono">TYPING...</span>
                  </div>
                )}
              </div>

              {/* OVERLAYS & HUD ALERTS */}
              
              {/* Volume Indicator Overlay */}
              {showVolumeOverlay && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/90 p-4 rounded-2xl border border-neutral-800 flex flex-col items-center space-y-3 z-30 shadow-2xl animate-fade-in w-14">
                  <span className="text-base">{isMuted ? '🔇' : '🔊'}</span>
                  <div className="h-20 w-2.5 bg-neutral-800 rounded-full overflow-hidden flex flex-col justify-end">
                    <div
                      className="w-full rounded-full transition-all"
                      style={{
                        height: `${isMuted ? 0 : volume}%`,
                        backgroundColor: '#3b82f6',
                      }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold font-mono">{isMuted ? 'MUTE' : volume}</span>
                </div>
              )}

              {/* Channel Overlay */}
              {showChannelOverlay && (
                <div className="absolute left-6 top-6 bg-blue-600 px-4 py-2.5 rounded-xl border border-blue-500 flex items-center space-x-2 z-30 shadow-lg animate-fade-in">
                  <span className="text-sm font-black font-mono">CH {currentChannel}</span>
                  <span className="text-xs opacity-80 font-bold">| {isRtl ? 'بث مباشر' : 'Live Broadcast'}</span>
                </div>
              )}

              {/* Playback status overlay */}
              {playbackOverlay && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/85 px-5 py-3 rounded-2xl border border-neutral-800 text-xs font-extrabold tracking-widest text-neutral-100 z-30 shadow-2xl animate-ping duration-1000">
                  {playbackOverlay}
                </div>
              )}

              {/* Feedback toast message */}
              {feedbackToast && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/95 border border-neutral-800 px-4 py-2 rounded-xl text-[10px] font-bold text-white tracking-wider shadow-lg z-30 animate-fade-in">
                  {feedbackToast}
                </div>
              )}

              {/* TV FOOTER BRANDING */}
              <div className="w-full flex justify-between items-center text-[9px] text-neutral-500 font-bold border-t border-neutral-900 pt-2 z-10">
                <span>OSAMA TV LABS</span>
                <span>SECURE PAIRING ACTIVE</span>
              </div>
            </div>
          )}
        </div>

        {/* TV Bottom Stand Legs */}
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-32 h-3.5 bg-neutral-800 rounded-b-xl border-t border-neutral-700 shadow-lg z-0"></div>
        <div className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 w-40 h-1 bg-neutral-950 rounded-full shadow-md"></div>
      </div>
    </div>
  );
}
