export type Language = 'en' | 'ar';
export type ThemeMode = 'light' | 'dark';

export type AccentColor = 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'purple' 
  | 'orange' 
  | 'cyan' 
  | 'pink' 
  | 'gold' 
  | 'white' 
  | 'black';

export interface UserPreferences {
  language: Language;
  theme: ThemeMode;
  accentColor: AccentColor;
  enableWelcomeVoice: boolean;
  enableAnimations: boolean;
  savedTvs: SavedTv[];
}

export type TvBrand = 
  | 'Android TV'
  | 'Google TV'
  | 'Samsung Smart TV'
  | 'LG webOS'
  | 'Sony'
  | 'TCL'
  | 'Philips'
  | 'Hisense'
  | 'Roku TV'
  | 'Amazon Fire TV';

export interface SavedTv {
  id: string;
  name: string;
  brand: TvBrand;
  ipAddress: string;
  isOnline: boolean;
}

export interface TvDevice {
  brand: TvBrand;
  logo: string;
  pairingMethod: 'PIN' | 'POPUP' | 'ROKU_AUTO' | 'FIRE_PIN';
  defaultIpPrefix: string;
}

export type AppScreen = 'WELCOME' | 'LOGO' | 'MAIN';
export type ActiveTab = 'REMOTE' | 'TOUCHPAD' | 'KEYBOARD' | 'SETTINGS' | 'ABOUT' | 'DEVICES';
