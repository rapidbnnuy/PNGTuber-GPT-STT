import { TinyColor } from '@ctrl/tinycolor';

// --- Types ---
export interface ThemeVibe {
    id: string;
    name: string;
    description: string;
    type: 'clean' | 'tech' | 'soft' | 'bold' | 'industrial';

    // Tokens
    fontFamily: string;
    radiusBase: number; // in pixels

    // Core Colors (Hex)
    primary: string;
    secondary: string;
}

export type ThemeMode = 'light' | 'dark';

// --- Presets ---
export const THEME_VIBES: ThemeVibe[] = [
    {
        id: 'blue',
        name: 'Blue',
        description: 'Modern & Clean',
        type: 'clean',
        primary: '#3b82f6',
        secondary: '#a855f7',
        fontFamily: "'Inter', sans-serif",
        radiusBase: 12
    },
    {
        id: 'lavender',
        name: 'Lavender',
        description: 'Cyberpunk Tech',
        type: 'tech',
        primary: '#a855f7',
        secondary: '#ec4899',
        fontFamily: "'JetBrains Mono', monospace",
        radiusBase: 0
    },
    {
        id: 'green',
        name: 'Nature',
        description: 'Organic Soft',
        type: 'soft',
        primary: '#22c55e',
        secondary: '#06b6d4',
        fontFamily: "'Outfit', sans-serif",
        radiusBase: 16
    },
    {
        id: 'orange',
        name: 'Warm',
        description: 'Friendly & Bold',
        type: 'bold',
        primary: '#f97316',
        secondary: '#ef4444',
        fontFamily: "'DM Sans', sans-serif",
        radiusBase: 16
    },
    {
        id: 'bubblegum',
        name: 'Bubblegum',
        description: 'Cute & Bouncy',
        type: 'soft',
        primary: '#ec4899',
        secondary: '#8b5cf6',
        fontFamily: "'Nunito', sans-serif",
        radiusBase: 24
    },
    {
        id: 'red',
        name: 'Red',
        description: 'Industrial Alert',
        type: 'industrial',
        primary: '#dc2626',
        secondary: '#f59e0b',
        fontFamily: "'Chakra Petch', sans-serif",
        radiusBase: 4
    },
];

// --- Engine ---

export const generateTheme = (vibeId: string, mode: ThemeMode, showGradient: boolean): Record<string, string> => {
    const vibe = THEME_VIBES.find(v => v.id === vibeId) || THEME_VIBES[0];
    const isDark = mode === 'dark';

    // 1. Color Palette Calculation
    // We use slate colors as the neutral backbone
    // Slate 950 (#020617) <-> Slate 50 (#f8fafc)

    // Backgrounds
    const bgApp = isDark ? '#020617' : '#f8fafc';
    const bgSurface = isDark ? '#0f172a' : '#ffffff';
    const bgCard = isDark ? '#1e293b' : '#ffffff'; // Cards pop more in dark mode

    // Text - INCREASE CONTRAST
    const textMain = isDark ? '#ffffff' : '#0f172a'; // Pure white for dark mode
    const textMuted = isDark ? '#cbd5e1' : '#475569'; // Slate 300 vs Slate 600 (Much brighter for dark mode)

    // Primary manipulations
    const primary = new TinyColor(vibe.primary);
    // const secondary = new TinyColor(vibe.secondary);


    // 2. Token Generation
    const tokens: Record<string, string> = {
        // --- APP TOKENS (The Source of Truth) ---

        // Typography
        '--app-font-family': vibe.fontFamily,

        // Shape / Radii
        '--app-radius-base': `${vibe.radiusBase}px`,
        '--app-radius-sm': `${Math.max(2, vibe.radiusBase - 4)}px`,
        '--app-radius-lg': `${vibe.radiusBase + 4}px`,
        '--app-radius-xl': `${vibe.radiusBase + 12}px`, // For modals/large cards

        // Colors - Semantic
        '--app-background': bgApp,
        '--app-surface': bgSurface,
        '--app-card': bgCard,
        '--app-border': isDark ? '#334155' : '#e2e8f0', // Slate 700 vs Slate 200

        // Colors - Text
        '--app-text': textMain,
        '--app-text-muted': textMuted,

        // Colors - Brand
        '--app-primary': vibe.primary,
        '--app-primary-rgb': `${primary.toRgb().r}, ${primary.toRgb().g}, ${primary.toRgb().b}`,
        '--app-secondary': vibe.secondary,

        // --- IONIC COMPATIBILITY LAYER (The Bridge) ---

        // 1. Global Basics
        '--ion-font-family': 'var(--app-font-family)',
        '--ion-background-color': 'var(--app-background)',
        '--ion-text-color': 'var(--app-text)',

        // 2. Component Overrides (Deep Link)
        '--ion-item-background': 'transparent', // Crucial to prevent white blocks
        '--ion-card-background': 'var(--app-card)',
        '--ion-toolbar-background': 'var(--app-surface)',
        '--ion-tab-bar-background': 'var(--app-surface)',

        // 3. Shapes
        '--ion-border-radius': 'var(--app-radius-base)',

        // 4. Brand Colors (Ion uses specific steps)
        '--ion-color-primary': vibe.primary,
        '--ion-color-primary-rgb': `${primary.toRgb().r}, ${primary.toRgb().g}, ${primary.toRgb().b}`,
        '--ion-color-primary-contrast': '#ffffff',
        '--ion-color-primary-shade': primary.darken(10).toHexString(),
        '--ion-color-primary-tint': primary.lighten(10).toHexString(),

        '--ion-color-secondary': vibe.secondary,
        '--ion-color-secondary-contrast': '#ffffff',

        // 5. Status Colors (Standardized)
        '--ion-color-success': '#22c55e',
        '--ion-color-warning': '#eab308',
        '--ion-color-danger': '#ef4444',
        '--ion-color-medium': '#64748b',
        '--ion-color-light': '#f1f5f9',
        '--ion-color-dark': '#0f172a',
    };

    // 3. Gradient Logic
    if (showGradient) {
        const p = vibe.primary;
        const s = vibe.secondary;
        // Subtle ambient gradient
        if (isDark) {
            tokens['--custom-background-image'] = `linear-gradient(135deg, ${bgApp} 0%, ${p}15 50%, ${s}15 100%)`;
        } else {
            tokens['--custom-background-image'] = `linear-gradient(135deg, ${bgApp} 0%, ${bgApp} 40%, ${p}10 100%)`;
        }
    } else {
        tokens['--custom-background-image'] = 'none';
    }

    return tokens;
};
