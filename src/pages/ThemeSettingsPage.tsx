import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonLabel,
    IonItem,
    IonToggle,
    IonIcon
} from '@ionic/react';
import { moonOutline, sunnyOutline, colorPaletteOutline } from 'ionicons/icons';
import { useAppContext } from '../context/AppContext';
import { THEME_VIBES } from '../theme/ThemeEngine';

export function ThemeSettingsPage() {
    const {
        themeMode, setThemeMode,
        themeColor, setThemeColor,
        showGradient, setShowGradient
    } = useAppContext();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Theme Settings</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                {/* --- Mode Selection --- */}
                <div className="mb-8 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pl-1 text-muted">Appearance</h3>
                    <div className="p-1 rounded-xl flex bg-surface border border-border">
                        <button
                            onClick={() => setThemeMode('light')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all`}
                            style={{
                                backgroundColor: themeMode === 'light' ? 'var(--app-text)' : 'transparent',
                                color: themeMode === 'light' ? 'var(--app-background)' : 'var(--app-text-muted)',
                                opacity: themeMode === 'light' ? 1 : 0.6
                            }}
                        >
                            <IonIcon icon={sunnyOutline} />
                            Light
                        </button>
                        <button
                            onClick={() => setThemeMode('dark')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all`}
                            style={{
                                backgroundColor: themeMode === 'dark' ? 'var(--app-text)' : 'transparent',
                                color: themeMode === 'dark' ? 'var(--app-background)' : 'var(--app-text-muted)',
                                opacity: themeMode === 'dark' ? 1 : 0.6
                            }}
                        >
                            <IonIcon icon={moonOutline} />
                            Dark
                        </button>
                    </div>
                </div>

                {/* --- Vibe Themes (Rich Preview) --- */}
                <div className="mb-8 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pl-1 text-muted">Theme Vibes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {THEME_VIBES.map(preset => {
                            const isActive = themeColor === preset.id;
                            return (
                                <div
                                    key={preset.id}
                                    onClick={() => setThemeColor(preset.id)}
                                    className={`cursor-pointer relative overflow-hidden p-0 border-2 transition-all duration-300 group`}
                                    style={{
                                        fontFamily: preset.fontFamily,
                                        borderRadius: `${preset.radiusBase}px`,
                                        backgroundColor: isActive ? 'var(--app-surface)' : 'rgba(var(--ion-color-step-950, 0,0,0), 0.05)',
                                        borderColor: isActive ? preset.primary : 'transparent',
                                        boxShadow: isActive ? `0 4px 20px -4px ${preset.primary}40` : 'none'
                                    }}
                                >
                                    {/* Preview Header */}
                                    <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: isActive ? `${preset.primary}20` : 'transparent', backgroundColor: isActive ? `${preset.primary}10` : 'transparent' }}>
                                        <span className="font-bold text-sm" style={{ color: isActive ? preset.primary : 'var(--app-text)' }}>{preset.name}</span>
                                        {isActive && <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: preset.primary }}></div>}
                                    </div>

                                    {/* Preview Content */}
                                    <div className="p-4">
                                        <div className="text-xs opacity-70 mb-2 uppercase tracking-wide" style={{ color: 'var(--app-text)' }}>{preset.description}</div>
                                        <div className="flex gap-2 mb-3">
                                            <div className="h-2 w-16 rounded-full opacity-20" style={{ backgroundColor: preset.primary }}></div>
                                            <div className="h-2 w-8 rounded-full opacity-20" style={{ backgroundColor: preset.secondary }}></div>
                                        </div>
                                        <button className="text-xs px-3 py-1.5 font-medium transition-colors"
                                            style={{
                                                backgroundColor: preset.primary,
                                                color: '#fff',
                                                borderRadius: `${preset.radiusBase}px`
                                            }}>
                                            Select
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- Effects --- */}
                <div className="mb-6 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pl-1 text-muted">Effects</h3>
                    <div className="rounded-xl overflow-hidden border bg-surface border-border">
                        <IonItem lines="none" style={{ '--background': 'transparent' }}>
                            <IonIcon slot="start" icon={colorPaletteOutline} className="text-muted" />
                            <IonLabel>
                                <h2 className="font-medium text-text">Vibrant Gradients</h2>
                                <p className="text-xs mt-1 text-muted">Add colorful background gradients based on your theme.</p>
                            </IonLabel>
                            <IonToggle
                                checked={showGradient}
                                onIonChange={e => setShowGradient(e.detail.checked)}
                            />
                        </IonItem>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
}
