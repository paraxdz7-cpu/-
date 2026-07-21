import React, { useState, useEffect } from 'react';
import { TvBrand, SavedTv, TvDevice } from '../types';
import { getAccentBgClass, getAccentColorClass } from './PhoneFrame';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';

interface TvSelectorModalProps {
  onClose: () => void;
  accentColor: string;
  onConnect: (tv: SavedTv) => void;
  savedTvs: SavedTv[];
  onSaveTv: (tv: SavedTv) => void;
  onDeleteTv: (id: string) => void;
  lang: 'ar' | 'en';
}

const TV_BRANDS: TvDevice[] = [
  { brand: 'Android TV', logo: '🤖', pairingMethod: 'PIN', defaultIpPrefix: '192.168.1.100' },
  { brand: 'Google TV', logo: '📺', pairingMethod: 'PIN', defaultIpPrefix: '192.168.1.102' },
  { brand: 'Samsung Smart TV', logo: '🪐', pairingMethod: 'PIN', defaultIpPrefix: '192.168.1.50' },
  { brand: 'LG webOS', logo: '🍒', pairingMethod: 'POPUP', defaultIpPrefix: '192.168.1.60' },
  { brand: 'Sony', logo: '🌟', pairingMethod: 'PIN', defaultIpPrefix: '192.168.1.40' },
  { brand: 'TCL', logo: '📍', pairingMethod: 'PIN', defaultIpPrefix: '192.168.1.88' },
  { brand: 'Philips', logo: '💡', pairingMethod: 'PIN', defaultIpPrefix: '192.168.1.75' },
  { brand: 'Hisense', logo: '🌊', pairingMethod: 'PIN', defaultIpPrefix: '192.168.1.92' },
  { brand: 'Roku TV', logo: '🟣', pairingMethod: 'ROKEN_AUTO', defaultIpPrefix: '192.168.1.33' } as any,
  { brand: 'Amazon Fire TV', logo: '🔥', pairingMethod: 'FIRE_PIN', defaultIpPrefix: '192.168.1.115' },
];

export default function TvSelectorModal({
  onClose,
  accentColor,
  onConnect,
  savedTvs,
  onSaveTv,
  onDeleteTv,
  lang,
}: TvSelectorModalProps) {
  const [activeTab, setActiveTab] = useState<'SCAN' | 'MANUAL' | 'SAVED'>('SCAN');
  const [selectedBrand, setSelectedBrand] = useState<TvDevice | null>(null);
  const [ipAddress, setIpAddress] = useState('');
  const [tvName, setTvName] = useState('');
  
  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTvs, setScannedTvs] = useState<SavedTv[]>([]);

  // Pairing State
  const [pairingTv, setPairingTv] = useState<SavedTv | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [pairingStatus, setPairingStatus] = useState<'IDLE' | 'PAIRING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const activeColorHex = getAccentColorClass(accentColor as any);
  const accentBg = getAccentBgClass(accentColor as any);
  const isRtl = lang === 'ar';

  // Trigger Network Scanning
  useEffect(() => {
    if (activeTab === 'SCAN') {
      setIsScanning(true);
      setScannedTvs([]);
      const timer = setTimeout(() => {
        setIsScanning(false);
        // Simulate finding 2 local TVs
        setScannedTvs([
          {
            id: 'scan-1',
            name: isRtl ? 'تلفزيون الصالة (Samsung)' : 'Living Room TV (Samsung)',
            brand: 'Samsung Smart TV',
            ipAddress: '192.168.1.50',
            isOnline: true,
          },
          {
            id: 'scan-2',
            name: isRtl ? 'شاشة غرفة النوم (LG)' : 'Bedroom Screen (LG)',
            brand: 'LG webOS',
            ipAddress: '192.168.1.60',
            isOnline: true,
          }
        ]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isRtl]);

  const handleBrandSelect = (brand: TvDevice) => {
    playClickSound();
    setSelectedBrand(brand);
    setIpAddress(brand.defaultIpPrefix);
    setTvName(`${brand.brand} ${isRtl ? 'تلفزيون' : 'Remote'}`);
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand || !ipAddress || !tvName) return;

    playClickSound();
    const newTv: SavedTv = {
      id: `manual-${Date.now()}`,
      name: tvName,
      brand: selectedBrand.brand,
      ipAddress,
      isOnline: true,
    };
    
    // Trigger pairing screen
    triggerPairing(newTv);
  };

  const triggerPairing = (tv: SavedTv) => {
    setPairingTv(tv);
    setPinCode('');
    setPairingStatus('IDLE');
  };

  const handleVerifyPairing = () => {
    if (!pairingTv) return;
    setPairingStatus('PAIRING');
    playClickSound();

    setTimeout(() => {
      // Find pairing method for the brand
      const brandConfig = TV_BRANDS.find(b => b.brand === pairingTv.brand);
      const isPopup = brandConfig?.pairingMethod === 'POPUP';
      
      // For PIN, verify simple dummy PIN code (any 4-digit works for simulator, but let's say '0000' or 4-digits)
      const isPinOk = !isPopup ? pinCode.length === 4 : true;

      if (isPinOk) {
        setPairingStatus('SUCCESS');
        playSuccessSound();
        setTimeout(() => {
          onSaveTv(pairingTv);
          onConnect(pairingTv);
          onClose();
        }, 1500);
      } else {
        setPairingStatus('ERROR');
        playErrorSound();
        setTimeout(() => setPairingStatus('IDLE'), 2000);
      }
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-100 flex flex-col bg-white dark:bg-[#0a0a0c] p-4 rounded-[41px] animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#2a2a30]">
        <h3 className="text-sm font-black dark:text-white text-neutral-900">
          {isRtl ? 'إدارة الاتصال بالشاشات' : 'Smart TV Connection'}
        </h3>
        <button
          onClick={() => { playClickSound(); onClose(); }}
          className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-[#16161a] border dark:border-[#2a2a30] flex items-center justify-center text-sm font-bold text-neutral-500 dark:text-neutral-400"
        >
          ✕
        </button>
      </div>

      {/* Pairing Overlay Screen */}
      {pairingTv && (
        <div className="absolute inset-0 z-110 bg-white dark:bg-neutral-950 p-6 flex flex-col justify-between rounded-[41px] animate-fade-in">
          <div className="space-y-4 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🔒
            </div>
            <h4 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
              {isRtl ? 'جاري الاتصال والاقتران الآمن' : 'Establishing Secure Connection'}
            </h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {pairingTv.name} ({pairingTv.ipAddress})
            </p>

            {/* Instruction Guide based on pairing method */}
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200/50 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 text-center leading-relaxed">
              {TV_BRANDS.find(b => b.brand === pairingTv.brand)?.pairingMethod === 'POPUP' ? (
                <span>{isRtl ? 'يرجى الضغط على "سماح" أو "موافق" باستخدام الريموت الأصلي للشاشة الآن.' : 'Please press "Allow" or "OK" on your TV screen using its original physical remote control now.'}</span>
              ) : TV_BRANDS.find(b => b.brand === pairingTv.brand)?.pairingMethod === 'ROKU_AUTO' ? (
                <span>{isRtl ? 'أجهزة Roku TV تتصل تلقائيًا عبر الشبكة المحلية (بروتوكول ECP الرسمي).' : 'Roku TV connects automatically over local network (Official ECP Protocol).'}</span>
              ) : (
                <span>{isRtl ? 'أدخل رمز PIN المكون من 4 أرقام الظاهر على شاشة التلفزيون الآن.' : 'Enter the 4-digit PIN code displayed on your TV screen now.'}</span>
              )}
            </div>

            {/* PIN INPUT IF NEEDED */}
            {TV_BRANDS.find(b => b.brand === pairingTv.brand)?.pairingMethod !== 'POPUP' && (
              <div className="max-w-[150px] mx-auto py-2">
                <input
                  type="text"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="w-full text-center tracking-widest text-lg font-bold font-mono px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:outline-hidden dark:text-white"
                />
              </div>
            )}

            {/* STATUS DISPLAY */}
            {pairingStatus === 'PAIRING' && (
              <p className="text-xs text-amber-500 animate-pulse font-bold">{isRtl ? 'جاري التحقق من التشفير...' : 'Verifying encryption...'}</p>
            )}
            {pairingStatus === 'SUCCESS' && (
              <p className="text-xs text-emerald-500 font-bold">{isRtl ? 'تم التوصيل والاقتران بنجاح! 🎉' : 'Paired & connected successfully! 🎉'}</p>
            )}
            {pairingStatus === 'ERROR' && (
              <p className="text-xs text-red-500 font-bold">{isRtl ? 'رمز PIN غير صالح، يرجى المحاولة مجددًا.' : 'Incorrect PIN code, please retry.'}</p>
            )}
          </div>

          <div className="space-y-2 pb-2">
            <button
              onClick={handleVerifyPairing}
              disabled={pairingStatus === 'PAIRING' || (TV_BRANDS.find(b => b.brand === pairingTv.brand)?.pairingMethod !== 'POPUP' && pinCode.length < 4)}
              className={`btn-glass-premium w-full py-3 rounded-xl text-xs font-bold text-white shadow-md disabled:opacity-50`}
              style={{ background: `linear-gradient(135deg, ${activeColorHex}dd, ${activeColorHex}aa)` }}
            >
              <span className="glass-text-glow">{isRtl ? 'تأكيد الاقتران' : 'Confirm Pairing'}</span>
            </button>
            <button
              onClick={() => { playClickSound(); setPairingTv(null); }}
              className="btn-glass-premium w-full py-2.5 rounded-xl text-xs font-bold text-neutral-500 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-neutral-100 dark:bg-[#16161a] p-1 my-3 select-none text-xs font-bold border dark:border-[#2a2a30] rounded-xl">
        <button
          onClick={() => { playClickSound(); setActiveTab('SCAN'); }}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'SCAN' ? 'bg-white dark:bg-[#232328] dark:text-white shadow-xs' : 'text-neutral-500'
          }`}
          style={activeTab === 'SCAN' ? { color: activeColorHex } : undefined}
        >
          🔍 {isRtl ? 'مسح الشبكة' : 'Scan Network'}
        </button>
        <button
          onClick={() => { playClickSound(); setActiveTab('MANUAL'); }}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'MANUAL' ? 'bg-white dark:bg-[#232328] dark:text-white shadow-xs' : 'text-neutral-500'
          }`}
          style={activeTab === 'MANUAL' ? { color: activeColorHex } : undefined}
        >
          ➕ {isRtl ? 'يدوي' : 'Manual'}
        </button>
        <button
          onClick={() => { playClickSound(); setActiveTab('SAVED'); }}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'SAVED' ? 'bg-white dark:bg-[#232328] dark:text-white shadow-xs' : 'text-neutral-500'
          }`}
          style={activeTab === 'SAVED' ? { color: activeColorHex } : undefined}
        >
          💾 {isRtl ? 'المحفوظة' : 'Saved'}
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto pb-4">
        {activeTab === 'SCAN' && (
          <div className="space-y-4 py-2">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div 
                  className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: `${activeColorHex} rounded-t-transparent` }}
                ></div>
                <p className="text-xs text-neutral-500 animate-pulse text-center">
                  {isRtl ? 'جاري البحث عن الشاشات في شبكتك المحلية...' : 'Scanning for Smart TVs on your local network...'}
                </p>
              </div>
            ) : scannedTvs.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 block">
                  {isRtl ? 'الشاشات المكتشفة تلقائيًا' : 'DISCOVERED SMART TVs'}
                </span>
                {scannedTvs.map((tv) => (
                  <div
                    key={tv.id}
                    onClick={() => { playClickSound(); triggerPairing(tv); }}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#16161a] border border-neutral-200/50 dark:border-[#2a2a30] hover:border-neutral-300 dark:hover:border-[#00d4ff]/60 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">📡</span>
                      <div>
                        <h4 className="text-xs font-bold dark:text-white text-neutral-800">{tv.name}</h4>
                        <p className="text-[10px] text-neutral-500 font-mono">{tv.ipAddress} • {tv.brand}</p>
                      </div>
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-full text-[9px] font-extrabold text-white"
                      style={{ backgroundColor: activeColorHex }}
                    >
                      {isRtl ? 'اقتران' : 'Pair'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-xs">{isRtl ? 'لم يتم العثور على شاشات تلقائيًا.' : 'No TVs found. Try manual connection.'}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'MANUAL' && (
          <div className="space-y-4 py-2">
            {!selectedBrand ? (
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 block">
                  {isRtl ? 'اختر الشركة المصنعة للتلفزيون' : 'SELECT TV BRAND'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {TV_BRANDS.map((dev) => (
                    <button
                      key={dev.brand}
                      onClick={() => handleBrandSelect(dev)}
                      className="p-3 rounded-2xl border border-neutral-200/60 dark:border-[#2a2a30] hover:border-neutral-300 dark:hover:border-[#00d4ff]/60 bg-neutral-50/50 dark:bg-[#16161a] flex items-center space-x-2 text-left hover:scale-[1.01] transition-all"
                    >
                      <span className="text-lg">{dev.logo}</span>
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate">{dev.brand}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualAddSubmit} className="space-y-3.5 animate-fade-in">
                <div className="flex justify-between items-center bg-neutral-100 dark:bg-[#16161a] p-2.5 rounded-xl mb-2 border dark:border-[#2a2a30]">
                  <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">{selectedBrand.brand} {selectedBrand.logo}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedBrand(null)}
                    className="text-xs text-neutral-500 underline font-bold"
                  >
                    {isRtl ? 'تغيير' : 'Change'}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{isRtl ? 'اسم التلفزيون' : 'TV NAME'}</label>
                  <input
                    type="text"
                    required
                    value={tvName}
                    onChange={(e) => setTvName(e.target.value)}
                    placeholder="e.g. Living Room Roku"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-[#16161a] border border-neutral-300 dark:border-[#2a2a30] text-xs text-neutral-800 dark:text-white focus:outline-hidden focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{isRtl ? 'عنوان IP للرقم التعريفي' : 'IP ADDRESS'}</label>
                  <input
                    type="text"
                    required
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.XX"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-[#16161a] border border-neutral-300 dark:border-[#2a2a30] text-xs text-neutral-800 dark:text-white font-mono focus:outline-hidden focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-md"
                  style={{ backgroundColor: activeColorHex }}
                >
                  {isRtl ? 'متابعة الاتصال الآمن' : 'Proceed with Secure Connect'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'SAVED' && (
          <div className="space-y-2 py-2">
            {savedTvs.length > 0 ? (
              savedTvs.map((tv) => (
                <div
                  key={tv.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#16161a] border border-neutral-200/50 dark:border-[#2a2a30]"
                >
                  <div 
                    onClick={() => { playClickSound(); onConnect(tv); onClose(); }}
                    className="flex-1 flex items-center space-x-3 cursor-pointer"
                  >
                    <span className="text-xl">🖥️</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">{tv.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-mono">{tv.ipAddress} • {tv.brand}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { playClickSound(); onDeleteTv(tv.id); }}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors text-xs"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    🗑️
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-xs">{isRtl ? 'لا توجد شاشات محفوظة حاليًا.' : 'No saved Smart TVs found.'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
