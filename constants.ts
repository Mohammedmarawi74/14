
import { Slide, ColorTheme } from './types';

export const DEFAULT_ACCENT_COLOR = '#00ffd1';
export const DEFAULT_SECONDARY_COLOR = '#0a0c14';

export interface PresetLogo {
  name: string;
  url: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  { name: 'سايان',  url: '/logo-1.png' },
  { name: 'نيفي',   url: '/logo-2.png' },
  { name: 'ثنائي',  url: '/logo-3.png' },
  { name: 'أبيض',  url: '/logo-4.png' },
];


// ── Color Themes ────────────────────────────────────────────────────────────
export const COLOR_THEMES: ColorTheme[] = [
  { name: 'المستثمر', accent: '#00ffd1', secondary: '#121625' },
  { name: 'فخامة',   accent: '#bf953f', secondary: '#000000' },
  { name: 'النمو',   accent: '#A4C639', secondary: '#062006' },
  { name: 'الثقة',   accent: '#38bdf8', secondary: '#072a40' },
  { name: 'الطاقة',  accent: '#e11d48', secondary: '#31040e' },
  { name: 'الرؤية',  accent: '#8b5cf6', secondary: '#230b4d' },
  { name: 'رسمي',   accent: '#94a3b8', secondary: '#0f172a' },
  { name: 'حداثة',  accent: '#f97316', secondary: '#2b1404' },
];

// ── Initial State ───────────────────────────────────────────────────────────
export const INITIAL_SLIDES: Slide[] = [
  {
    id: '1',
    title: 'ثلاثة مبادئ أساسية لتقنية المعلومات',
    description: 'الأسس الرئيسية لبناء منتجات رقمية قابلة للتطوير وآمنة وموثوقة.',
    numberText: '03',
    brandName: 'TehHub',
    accentColor: DEFAULT_ACCENT_COLOR,
    secondaryColor: DEFAULT_SECONDARY_COLOR,
    showGrid: true,
    customCss: '',
    logoUrl: undefined,
  },
];

export const MAX_SLIDES = 10;
