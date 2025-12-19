export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
}

export interface ThemePreset {
    id: string;
    name: string;
    primary: string; // Hex
    secondary: string; // Hex
}

export const THEME_PRESETS: ThemePreset[] = [
    { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#a855f7' },
    { id: 'purple', name: 'Cyberpunk', primary: '#a855f7', secondary: '#ec4899' },
    { id: 'green', name: 'Nature', primary: '#22c55e', secondary: '#06b6d4' },
    { id: 'orange', name: 'Warm', primary: '#f97316', secondary: '#ef4444' },
    { id: 'pink', name: 'Vaporwave', primary: '#ec4899', secondary: '#8b5cf6' },
];

export const getThemeVariables = (mode: 'light' | 'dark', colorId: string, showGradient: boolean) => {
    const preset = THEME_PRESETS.find(p => p.id === colorId) || THEME_PRESETS[0];

    // Base Colors
    const isDark = mode === 'dark';
    const bg = isDark ? '#020617' : '#f8fafc'; // Slate 950 vs Slate 50
    const surface = isDark ? '#0f172a' : '#ffffff'; // Slate 900 vs White
    const text = isDark ? '#f8fafc' : '#020617'; // Slate 50 vs Slate 950 (was Slate 900)


    // Gradients
    let backgroundValue = bg;
    if (showGradient) {
        if (isDark) {
            backgroundValue = `linear-gradient(to bottom right, ${bg} 0%, ${preset.primary}15 50%, ${preset.secondary}15 100%)`;
        } else {
            backgroundValue = `linear-gradient(to bottom right, #eff6ff 0%, ${preset.primary}15 50%, ${preset.secondary}15 100%)`;
        }
    }

    return {
        // App Basics
        '--ion-background-color': bg,
        '--ion-text-color': text,
        '--ion-item-background': surface,
        '--ion-card-background': isDark ? '#1e293b' : '#ffffff',
        '--ion-toolbar-background': isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',

        // Primary
        '--ion-color-primary': preset.primary,
        '--ion-color-primary-rgb': hexToRgb(preset.primary),
        '--ion-color-primary-contrast': '#ffffff',

        // Secondary
        '--ion-color-secondary': preset.secondary,

        // Custom background for gradient support on ion-content
        '--custom-main-background': backgroundValue,
    };
};

// Helper
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
}
